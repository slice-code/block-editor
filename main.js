class App {
  constructor(_app) {
    (async ()=>{
      const {el} = await import('./el.js'); 
      this.app = el(_app);
      this.el = el;
      this.pendingRecovery = null;
      this.draftStorageReady = false;
      // Config: enable/disable draft feature
      this.enableDraft = false; // Set to false to disable draft checking
      await this.init();
    })()
  }
  
  // ============================================
  // DRAFT STORAGE HELPERS (accessible before editor loads)
  // ============================================
  async initDraftStorage() {
    const DB_NAME = 'NewsletterEditor';
    const DB_VERSION = 1;
    const STORE_NAME = 'drafts';
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => {
        console.warn('IndexedDB error');
        resolve(null);
      };
      
      request.onsuccess = (event) => {
        this.draftStorageReady = true;
        resolve(event.target.result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }
  
  async getAllDrafts(db) {
    if (!db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['drafts'], 'readonly');
      const store = transaction.objectStore('drafts');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const drafts = request.result.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        resolve(drafts);
      };
      request.onerror = () => reject([]);
    });
  }
  
  async init() {
    // ============================================
    // PHASE 1.4: DRAFT RECOVERY
    // ============================================
    
    // Only check for drafts if feature is enabled
    if (this.enableDraft) {
      // Check for drafts in IndexedDB first
      const db = await this.initDraftStorage();
    
    if (db) {
      try {
        const drafts = await this.getAllDrafts(db);
        
        if (drafts.length > 0) {
          // Get the most recent draft
          const latestDraft = drafts[0];
          console.log('📋 Found draft:', latestDraft.id, '- blocks:', latestDraft.content?.blocks?.length || 0);
          
          const lastSaved = new Date(latestDraft.updatedAt);
          const now = new Date();
          const hoursDiff = (now - lastSaved) / (1000 * 60 * 60);
          
          // Only prompt if draft is less than 24 hours old
          if (hoursDiff < 24) {
            const shouldRecover = confirm(
              `Found saved draft: "${latestDraft.metadata?.title || 'Untitled'}"\nLast saved: ${lastSaved.toLocaleString()}\n\nClick OK to recover this draft.\nClick Cancel to start a new one.`
            );
            
            if (shouldRecover) {
              // Load existing draft
              this.pendingRecovery = {
                content: latestDraft.content,
                ...latestDraft.metadata,
                _draftId: latestDraft.id
              };
              console.log('✅ Will recover draft:', latestDraft.id);
            } else {
              // User wants to start fresh - clear old draft ID
              console.log('🆕 Starting new draft');
              localStorage.removeItem('current_draft_id');
              this.pendingRecovery = null;
            }
          }
        }
      } catch (error) {
        console.error('Error checking IndexedDB drafts:', error);
      }
      db.close();
    } // end if db
    
    // Fallback: Check old localStorage autosave
    if (!this.pendingRecovery) {
      const autosave = localStorage.getItem('newsletter_autosave');
      
      if (autosave) {
        try {
          const savedData = JSON.parse(autosave);
          
          // Validate data before recovery
          if (savedData?.data?.content?.blocks) {
            // Filter out invalid blocks
            savedData.data.content.blocks = savedData.data.content.blocks.filter(block => {
              return block && block.type && block.data;
            });
            
            const lastSaved = new Date(savedData.lastSaved);
            const now = new Date();
            const hoursDiff = (now - lastSaved) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
              const shouldRecover = confirm(
                `Found unsaved work from ${lastSaved.toLocaleString()}\n\nRecover draft?`
              );
              
              if (shouldRecover) {
                this.pendingRecovery = savedData.data;
              } else {
                localStorage.removeItem('newsletter_autosave');
              }
            }
          } else {
            console.warn('Invalid autosave data, removing...');
            localStorage.removeItem('newsletter_autosave');
          }
        } catch (error) {
          console.error('Error parsing autosave:', error);
          localStorage.removeItem('newsletter_autosave');
        }
      }
    }
    } // end if enableDraft
    
    const {editor} = await import('./editor-element/editor.js?v='+version);
    const editorInstance = await editor({
      el:this.el, 
      onClose: () => {
        console.log('Editor closed')
      },
      onSave: (data) => {
        console.log('Saved data:', data);
        // Handle save logic here (e.g., send to server)
      },
      // Editor type: 'newsletter' (default), 'blog', 'email'
      type: 'newsletter',
      categories: [
        { value: 'technology', text: 'Technology' },
        { value: 'business', text: 'Business' },
        { value: 'lifestyle', text: 'Lifestyle' },
        { value: 'tutorial', text: 'Tutorial' },
        { value: 'news', text: 'News' }
      ],
      // Draft storage options
      storage: {
        type: 'indexedDB', // 'indexedDB' | 'localStorage' | 'api'
        apiEndpoint: null // URL for custom API (if type is 'api')
      },
      // Enable/disable draft feature (autosave, recovery)
      enableDraft: this.enableDraft, // Use class config
      // Pass recovery data directly to editor
      initialData: this.pendingRecovery || null
    });
    this.app.child(editorInstance).get();
    
    // Clear pending recovery after passing to editor
    if (this.pendingRecovery) {
      delete this.pendingRecovery;
    }
  }
  
  async recoverDraft(data) {
    // Wait for editor to be fully ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      console.log('Dispatching recover-draft event with data:', data);
      
      // Dispatch custom event to load data
      window.dispatchEvent(new CustomEvent('recover-draft', {
        detail: data
      }));
      
      console.log('Draft recovery event dispatched');
    } catch (error) {
      console.error('Error recovering draft:', error);
    }
  }
}

export default App;
