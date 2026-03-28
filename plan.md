# Editor Enhancement Plan

Comprehensive implementation plan for adding new features to the UI Maker Block Editor.

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Proposed Features](#proposed-features)
4. [Implementation Phases](#implementation-phases)
5. [Technical Specifications](#technical-specifications)
6. [File Structure Changes](#file-structure-changes)
7. [Testing Strategy](#testing-strategy)
8. [Timeline & Effort Estimation](#timeline--effort-estimation)

---

## Executive Summary

### Project Overview
**Project Name:** UI Maker Block Editor Enhancement  
**Goal:** Transform existing Ghost-like block editor into a production-ready content management system  
**Target Users:** Content creators, newsletter publishers, marketing teams  

### Current Strengths
✅ Solid foundation with Editor.js integration  
✅ Clean architecture using el.js DOM helper  
✅ Modular custom tools (9 block types)  
✅ Metadata sidebar with reactive data binding  
✅ Drag-and-drop reordering  
✅ Date/time picker integration  

### Key Areas for Improvement
⚠️ **Missing Core Features:** Undo/redo buttons, auto-save, word count  
⚠️ **Limited Block Types:** No CTA, table, embed, or gallery blocks  
⚠️ **No Export Options:** Can only save as JSON  
⚠️ **Limited Styling:** No text color, highlighting, or font size control  
⚠️ **No Templates:** Cannot save/reuse layouts  
⚠️ **Email-Specific:** Missing preview and spam checking  

---

## Current State Analysis

### Architecture Review

```
┌─────────────────────────────────────────┐
│           index.html                    │
│  - Loads Tailwind CSS (CDN)            │
│  - Imports Editor.js core              │
│  - Initializes App class               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            main.js                      │
│  - App class                           │
│  - Injects el() library                │
│  - Configures editor callbacks         │
│  - Defines categories                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          editor.js                      │
│  - Loads all dependencies              │
│  - Creates sidebar UI                  │
│  - Initializes Editor.js instance      │
│  - Handles save logic                  │
│  - Manages data binding                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         el.js                           │
│  - DOM manipulation library            │
│  - Chainable methods                   │
│  - Reactive data binding (.link())     │
│  - Event handling                      │
└─────────────────────────────────────────┘
```

### Existing Block Tools
| Tool | File | Status |
|------|------|--------|
| Custom Header | `editor-element/custom-header.js` | ✅ Working |
| List (nested) | `editor-element/editorjs-list.umd.min.js` | ✅ Working |
| Simple Image | `editor-element/simple-image.js` | ✅ Working |
| Code Block | `editor-element/code-block.js` | ✅ Working |
| YouTube Embed | `editor-element/youtube-embed.js` | ✅ Working |
| Block Quote | `editor-element/block-quote.js` | ✅ Working |
| Divider | `editor-element/divider.js` | ✅ Working |
| CodePen Embed | `editor-element/codepen-embed.js` | ✅ Working |
| Drag-Drop | `editor-element/drag-drop.min.js` | ✅ Working |

### Existing Sidebar Sections
- ✅ Status (Draft/Published/Scheduled)
- ✅ Author & Category
- ✅ SEO (Meta description, tags, slug)
- ✅ Email (Subject, preview text)
- ✅ Featured Image (Upload + alt text)
- ✅ Publish Settings (Date + time pickers)

### Identified Gaps
1. **No visual undo/redo** - Only keyboard shortcuts
2. **No auto-save** - Risk of data loss
3. **No content metrics** - Word count, reading time
4. **Limited blocks** - No CTA, tables, galleries
5. **No templates** - Cannot reuse layouts
6. **No export formats** - JSON only
7. **No email preview** - Can't see email rendering
8. **Limited inline formatting** - No text color or highlight

---

## Proposed Features

### Priority Matrix

```
Impact
  ↑
  │  Phase 1         Phase 2
  │  ┌─────────┐     ┌──────────┐
  │  │ Auto-save│    │ CTA Block│
  │  │Word Count│    │Table Block│
  │  │Undo/Redo │    │Templates │
  │  └─────────┘     └──────────┘
  │
  │  Phase 3         Future
  │  ┌──────────┐    ┌──────────┐
  │  │Embed Block│   │Collaboration│
  │  │Versioning │   │AI Writing  │
  │  │SEO Checker│   │Analytics  │
  │  └──────────┘    └──────────┘
  │
  └────────────────────────────→ Effort
```

### Feature Categories

#### A. UX Enhancements (Phase 1)
1. Undo/Redo Visual Buttons
2. Auto-Save System
3. Word Count & Reading Time
4. Draft Recovery

#### B. New Block Types (Phase 2)
5. Call-to-Action (CTA) Block
6. Responsive Table Block
7. Multi-Service Embed Block
8. Image Gallery Block
9. Button Block
10. Accordion/Collapsible Block

#### C. Advanced Features (Phase 3)
11. Template System
12. Multiple Export Formats
13. Email Preview
14. SEO Score Checker
15. Version History

#### D. Styling Enhancements (Phase 1-2)
16. Text Color Picker
17. Background Highlight
18. Font Size Control

---

## Implementation Phases

### Phase 1: Quick Wins (Week 1-2)
**Goal:** Fix critical UX issues with minimal effort

#### Task 1.1: Undo/Redo Buttons
**File:** `editor.js`  
**Effort:** 2 hours  
**Priority:** ⭐⭐⭐ Critical

**Implementation Steps:**
1. Add toolbar container above editor
2. Create undo/redo buttons with icons
3. Bind to Editor.js undo/redo methods
4. Add keyboard shortcut listeners (Ctrl+Z, Ctrl+Shift+Z)
5. Disable buttons when history empty

**Code Location:**
```javascript
// editor.js - Add before editorContainer
const editorToolbar = el('div')
  .class('flex items-center gap-2 p-2 border-b bg-white')
  .child([
    el('button')
      .html('<i class="fas fa-undo"></i>')
      .class('px-3 py-1 hover:bg-gray-100 rounded')
      .on('click', () => connection.ej.undo()),
    el('button')
      .html('<i class="fas fa-redo"></i>')
      .class('px-3 py-1 hover:bg-gray-100 rounded')
      .on('click', () => connection.ej.redo())
  ]);
```

---

#### Task 1.2: Auto-Save System
**File:** `editor.js`  
**Effort:** 3 hours  
**Priority:** ⭐⭐⭐ Critical

**Implementation Steps:**
1. Create auto-save interval (30 seconds)
2. Save to localStorage with timestamp
3. Show "Auto-saved at [time]" indicator
4. Clear interval on editor close
5. Add manual save still triggers onSave callback

**Data Structure:**
```javascript
{
  lastSaved: "2024-01-15T10:30:00Z",
  data: {
    title: "...",
    status: "...",
    content: {...}
  }
}
```

**Code Location:**
```javascript
// editor.js - In .load() callback
let autoSaveInterval;

.load(() => {
  const ej = new EditorJS({...});
  connection.ej = ej;
  
  // Auto-save every 30 seconds
  autoSaveInterval = setInterval(async () => {
    await performAutoSave();
  }, 30000);
});

// Cleanup
const closeButton = el('button')
  .on('click', () => {
    clearInterval(autoSaveInterval);
    if (onClose) onClose();
  });

async function performAutoSave() {
  try {
    const content = await connection.ej.save();
    const autosaveData = {
      lastSaved: new Date().toISOString(),
      data: {
        ...editorData,
        content: content
      }
    };
    
    localStorage.setItem('autosave', JSON.stringify(autosaveData));
    showAutoSaveIndicator();
  } catch (error) {
    console.error('Auto-save failed:', error);
  }
}
```

---

#### Task 1.3: Word Count & Reading Time
**File:** `editor.js`  
**Effort:** 1.5 hours  
**Priority:** ⭐⭐ High

**Implementation Steps:**
1. Add counter div in sidebar (bottom)
2. Use loopFunc to update every second
3. Calculate words from all text blocks
4. Estimate reading time (200 wpm average)
5. Display: "150 words • 1 min read"

**Code Location:**
```javascript
// editor.js - Add to sidebarContent
const wordCountDisplay = el('div')
  .class('text-xs text-gray-500 mt-4 pt-4 border-t')
  .loopFunc(async (el) => {
    try {
      const content = await connection.ej.save();
      
      // Extract all text from blocks
      const allText = content.blocks
        .map(block => {
          if (block.data.text) return block.data.text;
          if (block.data.caption) return block.data.caption;
          return '';
        })
        .join(' ');
      
      // Count words
      const words = allText.trim().split(/\s+/).filter(w => w.length > 0).length;
      const readTime = Math.ceil(words / 200); // 200 words per minute
      
      el.text(`${words} words • ${readTime} min read`);
    } catch (error) {
      el.text('');
    }
  }, 1000);

// Add to sidebar
sidebarContent.child([
  // ... existing sections
  wordCountDisplay
]);
```

---

#### Task 1.4: Draft Recovery
**File:** `main.js`  
**Effort:** 2 hours  
**Priority:** ⭐⭐ High

**Implementation Steps:**
1. Check localStorage on app init
2. If autosave exists, prompt user
3. Load recovered data if confirmed
4. Clear autosave after successful load

**Code Location:**
```javascript
// main.js - Before initializing editor
async init() {
  // Check for autosaved draft
  const autosave = localStorage.getItem('autosave');
  
  if (autosave) {
    const savedData = JSON.parse(autosave);
    const lastSaved = new Date(savedData.lastSaved);
    const shouldRecover = confirm(
      `Found unsaved work from ${lastSaved.toLocaleString()}.\n\nRecover draft?`
    );
    
    if (shouldRecover) {
      // Store recovery data temporarily
      this.pendingRecovery = savedData.data;
    } else {
      localStorage.removeItem('autosave');
    }
  }
  
  const editorInstance = await editor({
    el: this.el,
    onClose: () => {
      console.log('Editor closed');
    },
    onSave: (data) => {
      console.log('Saved data:', data);
      // Clear autosave on manual save
      localStorage.removeItem('autosave');
    },
    categories: [...]
  });
  
  this.app.child(editorInstance).get();
  
  // Trigger recovery if pending
  if (this.pendingRecovery) {
    this.recoverDraft(this.pendingRecovery);
    delete this.pendingRecovery;
  }
}

async recoverDraft(data) {
  // Wait for editor to be ready
  setTimeout(async () => {
    // Load content into editor
    if (connection.ej) {
      await connection.ej.render(data.content);
    }
    
    // Restore sidebar data
    Object.assign(editorData, data);
  }, 500);
}
```

---

### Phase 2: Core Features (Week 3-4)
**Goal:** Add powerful block types and template system

#### Task 2.1: CTA (Call-to-Action) Block
**File:** `editor-element/cta-block.js` (NEW)  
**Effort:** 6 hours  
**Priority:** ⭐⭐⭐ Must-Have

**Features:**
- Customizable background color
- Title and body text
- CTA button with URL
- Alignment options (left/center/right)
- Icon selection (optional)

**Toolbox Info:**
```javascript
static get toolbox() {
  return {
    title: 'CTA',
    icon: '<svg width="20" height="20"><rect x="2" y="2" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="2" fill="currentColor"/><path d="M6 14l2-2 4 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
  };
}
```

**Render Method:**
```javascript
render() {
  this.wrapper = document.createElement('div');
  this.wrapper.classList.add('cta-block');
  this.wrapper.style.cssText = `
    background: ${this.data.backgroundColor || '#3b82f6'};
    color: ${this.data.textColor || '#ffffff'};
    padding: 24px;
    border-radius: 8px;
    text-align: ${this.data.alignment || 'center'};
  `;
  
  // Title
  this.titleElement = document.createElement('h3');
  this.titleElement.innerHTML = this.data.title || '';
  this.titleElement.contentEditable = !this.readOnly;
  this.titleElement.style.cssText = 'font-size: 20px; margin-bottom: 8px; outline: none;';
  
  // Body text
  this.bodyElement = document.createElement('p');
  this.bodyElement.innerHTML = this.data.text || '';
  this.bodyElement.contentEditable = !this.readOnly;
  this.bodyElement.style.cssText = 'margin-bottom: 16px; outline: none;';
  
  // Button
  this.buttonElement = document.createElement('a');
  this.buttonElement.href = this.data.buttonUrl || '#';
  this.buttonElement.innerHTML = this.data.buttonText || 'Click Here';
  this.buttonElement.target = '_blank';
  this.buttonElement.style.cssText = `
    display: inline-block;
    padding: 10px 20px;
    background: ${this.data.textColor || '#ffffff'};
    color: ${this.data.backgroundColor || '#3b82f6'};
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
  `;
  
  this.wrapper.appendChild(this.titleElement);
  this.wrapper.appendChild(this.bodyElement);
  this.wrapper.appendChild(this.buttonElement);
  
  return this.wrapper;
}
```

**Settings:**
```javascript
renderSettings() {
  return [
    {
      icon: '<span>🎨</span>',
      label: 'Background Color',
      onActivate: () => this.pickColor()
    },
    {
      icon: '<span>⬅</span>',
      label: 'Align Left',
      isActive: this.data.alignment === 'left',
      onActivate: () => this.setAlignment('left')
    },
    {
      icon: '<span>↕</span>',
      label: 'Align Center',
      isActive: this.data.alignment === 'center',
      onActivate: () => this.setAlignment('center')
    },
    {
      icon: '<span>➡</span>',
      label: 'Align Right',
      isActive: this.data.alignment === 'right',
      onActivate: () => this.setAlignment('right')
    }
  ];
}
```

**Integration:**
```javascript
// editor.js - Line 16-17
await import('./editor-element/cta-block.js');
const CTABlock = window.CTABlock;

// editor.js - Line 306-338 (tools config)
tools: {
  // ... existing tools
  cta: {
    class: CTABlock,
    inlineToolbar: false
  }
}
```

---

#### Task 2.2: Table Block
**File:** `editor-element/table-block.js` (NEW)  
**Effort:** 8 hours  
**Priority:** ⭐⭐⭐ Must-Have

**Features:**
- Dynamic rows/columns
- Header row toggle
- Add/remove rows & columns
- Cell merging (future)
- Sortable columns (future)

**Data Structure:**
```javascript
{
  withHeader: true,
  rows: 3,
  columns: 3,
  content: [
    ['Header 1', 'Header 2', 'Header 3'],
    ['Cell A1', 'Cell A2', 'Cell A3'],
    ['Cell B1', 'Cell B2', 'Cell B3']
  ]
}
```

---

#### Task 2.3: Embed Block
**File:** `editor-element/embed-block.js` (NEW)  
**Effort:** 10 hours  
**Priority:** ⭐⭐ High

**Supported Services:**
- Twitter/X
- Instagram
- TikTok
- Spotify
- SoundCloud
- Vimeo
- Google Maps

**Detection Logic:**
```javascript
detectService(url) {
  const patterns = {
    twitter: /twitter\.com|x\.com/,
    instagram: /instagram\.com/,
    tiktok: /tiktok\.com/,
    spotify: /open\.spotify\.com/,
    soundcloud: /soundcloud\.com/,
    vimeo: /vimeo\.com/,
    youtube: /youtube\.com|youtu\.be/
  };
  
  for (const [service, pattern] of Object.entries(patterns)) {
    if (pattern.test(url)) return service;
  }
  return null;
}
```

---

#### Task 2.4: Template System
**File:** `editor.js` + `templates-modal.js` (NEW)  
**Effort:** 5 hours  
**Priority:** ⭐⭐ High

**Features:**
- Save current layout as template
- Load template (replaces content)
- Template categories
- Search templates
- Delete templates

**UI Components:**
```javascript
// Template save button
const saveTemplateBtn = el('button')
  .text('Save as Template')
  .class('px-3 py-2 bg-blue-600 text-white rounded text-sm')
  .on('click', async () => {
    const content = await connection.ej.save();
    const templateName = prompt('Enter template name:');
    
    if (templateName) {
      const templates = JSON.parse(localStorage.getItem('templates') || '{}');
      templates[templateName] = {
        name: templateName,
        createdAt: Date.now(),
        content: content,
        metadata: {
          hasImage: content.blocks.some(b => b.type === 'image'),
          hasCTA: content.blocks.some(b => b.type === 'cta'),
          blockCount: content.blocks.length
        }
      };
      
      localStorage.setItem('templates', JSON.stringify(templates));
      alert('Template saved!');
    }
  });

// Load template button
const loadTemplateBtn = el('button')
  .text('Load Template')
  .class('px-3 py-2 bg-gray-200 text-gray-800 rounded text-sm')
  .on('click', () => {
    openTemplateModal();
  });
```

---

#### Task 2.5: Text Color Picker
**File:** `editor-element/text-color-tool.js` (NEW)  
**Effort:** 3 hours  
**Priority:** ⭐ Medium

**Inline Toolbar Integration:**
```javascript
// Add to Editor.js inlineToolbar config
tools: {
  paragraph: {
    class: Paragraph,
    inlineToolbar: ['bold', 'italic', 'link', 'color', 'highlight']
  }
}

// Create inline tool
class TextColorTool {
  static get toolbox() {
    return {
      title: 'Text Color',
      icon: '<span style="color: red;">A</span>'
    };
  }
  
  render() {
    this.button = document.createElement('button');
    this.button.innerHTML = this.toolbox.icon;
    this.button.addEventListener('click', () => {
      const color = this.showColorPicker();
      document.execCommand('foreColor', false, color);
    });
    return this.button;
  }
}
```

---

### Phase 3: Advanced Features (Week 5-6)
**Goal:** Professional-grade features for power users

#### Task 3.1: Email Preview
**File:** `email-preview-modal.js` (NEW)  
**Effort:** 8 hours  
**Priority:** ⭐⭐⭐ Critical for Newsletter Use Case

**Features:**
- Desktop/mobile view toggle
- Inbox preview (subject + sender)
- Render HTML email
- Check image loading
- Test dark mode appearance

**Mock Data:**
```javascript
const previewData = {
  from: 'Newsletter <hello@example.com>',
  subject: editorData.emailSubject,
  previewText: editorData.previewText,
  date: new Date().toLocaleString(),
  content: await convertToHTML(editorData.content)
};
```

---

#### Task 3.2: Multiple Export Formats
**File:** `export-utils.js` (NEW)  
**Effort:** 6 hours  
**Priority:** ⭐⭐ High

**Formats:**
1. **JSON** (default)
2. **HTML** - Full email HTML
3. **Markdown** - For blogs
4. **PDF** - Via html2pdf library

**Export Function:**
```javascript
async function exportContent(format) {
  const content = await connection.ej.save();
  const fullData = { ...editorData, content };
  
  switch (format) {
    case 'json':
      return JSON.stringify(fullData, null, 2);
    
    case 'html':
      return await convertToHTML(fullData);
    
    case 'markdown':
      return await convertToMarkdown(fullData);
    
    case 'pdf':
      const html = await convertToHTML(fullData);
      return await generatePDF(html);
  }
}
```

---

#### Task 3.3: SEO Score Checker
**File:** `seo-analyzer.js` (NEW)  
**Effort:** 7 hours  
**Priority:** ⭐⭐ High

**Scoring Criteria:**
```javascript
function calculateSEOScore(data) {
  let score = 0;
  const checks = {
    hasTitle: data.title ? 10 : 0,
    hasMetaDescription: data.metaDescription?.length >= 50 ? 10 : 0,
    hasSlug: data.slug ? 10 : 0,
    hasFeaturedImage: data.featuredImage ? 10 : 0,
    hasHeadings: checkHeadings(data.content) ? 15 : 0,
    hasImages: checkImages(data.content) ? 15 : 0,
    hasLinks: checkLinks(data.content) ? 10 : 0,
    wordCount: data.content.blocks.length >= 5 ? 10 : 0,
    hasCategory: data.category ? 10 : 0
  };
  
  score = Object.values(checks).reduce((a, b) => a + b, 0);
  
  return {
    score,
    maxScore: 100,
    checks,
    recommendations: generateRecommendations(checks)
  };
}
```

---

#### Task 3.4: Version History
**File:** `version-manager.js` (NEW)  
**Effort:** 10 hours  
**Priority:** ⭐ Medium

**Features:**
- Auto-save versions every 5 minutes
- Manual version creation
- Version notes
- Compare versions
- Rollback to any version

**Data Structure:**
```javascript
{
  versions: [
    {
      id: "v1",
      timestamp: Date.now(),
      note: "Initial draft",
      content: {...},
      author: "John Doe"
    },
    {
      id: "v2",
      timestamp: Date.now(),
      note: "Added images",
      content: {...}
    }
  ],
  currentVersion: "v2"
}
```

---

## Technical Specifications

### Dependencies to Add

#### CDN Links (index.html)
```html
<!-- Add to <head> section -->

<!-- For PDF export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<!-- For syntax highlighting (if enhancing code blocks) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>

<!-- For icons (alternative to Font Awesome) -->
<link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.css">
```

### New File Structure

```
ui-maker/
├── editor-element/
│   ├── cta-block.js              NEW
│   ├── table-block.js            NEW
│   ├── embed-block.js            NEW
│   ├── button-block.js           NEW
│   ├── gallery-block.js          NEW
│   ├── accordion-block.js        NEW
│   ├── text-color-tool.js        NEW
│   └── ...existing tools...
│
├── components/                    NEW FOLDER
│   ├── templates-modal.js        NEW
│   ├── email-preview-modal.js    NEW
│   ├── export-modal.js           NEW
│   ├── version-history-modal.js  NEW
│   └── seo-panel.js              NEW
│
├── utils/                         NEW FOLDER
│   ├── auto-save.js              NEW
│   ├── export-utils.js           NEW
│   ├── seo-analyzer.js           NEW
│   ├── template-manager.js       NEW
│   └── version-manager.js        NEW
│
├── styles/                        NEW FOLDER
│   ├── blocks.css                NEW
│   ├── modals.css                NEW
│   └── components.css            NEW
│
├── editor.js                     MODIFIED
├── main.js                       MODIFIED
└── index.html                    MODIFIED
```

### Data Flow Diagrams

#### Auto-Save Flow
```
User Types
    ↓
Wait 30 seconds
    ↓
connection.ej.save()
    ↓
Combine with editorData
    ↓
localStorage.setItem('autosave')
    ↓
Show "Auto-saved at 10:30 AM"
    ↓
Clear on manual save
```

#### Template System Flow
```
User clicks "Save as Template"
    ↓
Prompt for template name
    ↓
Get current content (ej.save())
    ↓
Create template object
    ↓
Save to localStorage
    ↓
Confirm success

User clicks "Load Template"
    ↓
Open modal with template list
    ↓
User selects template
    ↓
Confirm overwrite warning
    ↓
connection.ej.render(template.content)
    ↓
Restore metadata to sidebar
```

---

## File Structure Changes

### Modified Files

#### 1. `index.html`
**Changes:**
- Add new CDN links for PDF generation
- Add Prism CSS for code highlighting
- Maybe add custom CSS file

**Before:**
```html
<head>
  <link rel="stylesheet" href="...font-awesome...">
  <script src="./tailwind.js"></script>
  <script src="./editorjs.umd.min.js"></script>
</head>
```

**After:**
```html
<head>
  <link rel="stylesheet" href="...font-awesome...">
  <link rel="stylesheet" href="./styles/blocks.css">
  <link rel="stylesheet" href="./styles/modals.css">
  <script src="./tailwind.js"></script>
  <script src="./editorjs.umd.min.js"></script>
  <script src="...html2pdf..."></script>
  <script src="...prism..."></script>
</head>
```

---

#### 2. `editor.js`
**Changes:**
- Import new utilities
- Add toolbar with undo/redo
- Add auto-save logic
- Add word count display
- Add template buttons
- Register new block types

**Key Modifications:**

```javascript
// ADD at top - Import new tools
const { datepicker } = await import('./editor-element/datepicker.js');
const { timepicker } = await import('./editor-element/timepicker.js');
const { performAutoSave, clearAutoSave } = await import('./utils/auto-save.js');
const { calculateSEOScore } = await import('./utils/seo-analyzer.js');

// ADD - Import new block tools
await Promise.all([
  import('./editorjs.umd.min.js'),
  import('./editor-element/editorjs-list.umd.min.js'),
  import('./editor-element/cta-block.js'),      // NEW
  import('./editor-element/table-block.js'),     // NEW
  import('./editor-element/embed-block.js'),     // NEW
  // ... existing imports
]);

// ADD - Get window references
const CTABlock = window.CTABlock;                // NEW
const TableBlock = window.TableBlock;            // NEW
const EmbedBlock = window.EmbedBlock;            // NEW

// ADD - Toolbar before editor
const editorToolbar = createEditorToolbar();

// MODIFY - Save button to include export options
const saveButton = el('button')
  .text('Save ▼')
  .on('click', () => {
    openExportOptions();
  });

// ADD - Template buttons in sidebar
const templateSection = el('div').child([
  saveTemplateBtn,
  loadTemplateBtn
]);

// ADD - Word count at bottom
const wordCountDisplay = createWordCount();

// MODIFY - Editor.js tools config
tools: {
  header: { class: CustomHeader },
  cta: { class: CTABlock },      // NEW
  table: { class: TableBlock },  // NEW
  embed: { class: EmbedBlock },  // NEW
  // ... existing tools
}
```

---

#### 3. `main.js`
**Changes:**
- Add draft recovery logic
- Handle template loading
- Add export handlers

```javascript
// ADD - Recovery check in init()
async init() {
  const autosave = localStorage.getItem('autosave');
  if (autosave) {
    const savedData = JSON.parse(autosave);
    const shouldRecover = confirm(`Recover draft from ${new Date(savedData.lastSaved).toLocaleString()}?`);
    if (shouldRecover) {
      this.pendingRecovery = savedData.data;
    }
  }
  
  // ... rest of init
}

// ADD - Recovery method
async recoverDraft(data) {
  setTimeout(async () => {
    if (connection.ej) {
      await connection.ej.render(data.content);
      Object.assign(editorData, data);
    }
  }, 500);
}
```

---

### New Files to Create

#### 1. `editor-element/cta-block.js`
```javascript
/**
 * Call-to-Action Block for Editor.js
 * Customizable CTA with button
 */
class CTABlock {
  static get toolbox() {
    return {
      title: 'CTA',
      icon: '<svg><!-- SVG path --></svg>'
    };
  }
  
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      title: data.title || 'Special Offer!',
      text: data.text || 'Limited time deal...',
      buttonText: data.buttonText || 'Learn More',
      buttonUrl: data.buttonUrl || '#',
      backgroundColor: data.backgroundColor || '#3b82f6',
      textColor: data.textColor || '#ffffff',
      alignment: data.alignment || 'center'
    };
  }
  
  render() {
    // Implementation as shown earlier
  }
  
  save() {
    return this.data;
  }
  
  renderSettings() {
    // Color picker, alignment options
  }
}

window.CTABlock = CTABlock;
export { CTABlock };
```

---

#### 2. `utils/auto-save.js`
```javascript
/**
 * Auto-Save Utility
 * Automatically saves content every 30 seconds
 */

let autoSaveInterval = null;
let lastAutoSave = null;

export async function startAutoSave(connection, editorData) {
  if (autoSaveInterval) return;
  
  autoSaveInterval = setInterval(async () => {
    try {
      const content = await connection.ej.save();
      const autosaveData = {
        lastSaved: new Date().toISOString(),
        data: {
          ...editorData,
          content: content
        }
      };
      
      localStorage.setItem('autosave', JSON.stringify(autosaveData));
      lastAutoSave = new Date();
      
      // Dispatch event for UI update
      window.dispatchEvent(new CustomEvent('autosave-complete', { 
        detail: { time: lastAutoSave }
      }));
      
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, 30000);
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}

export function getLastAutoSave() {
  return lastAutoSave;
}

export function getAutosaveData() {
  const data = localStorage.getItem('autosave');
  return data ? JSON.parse(data) : null;
}

export function clearAutosave() {
  localStorage.removeItem('autosave');
  lastAutoSave = null;
}
```

---

#### 3. `components/templates-modal.js`
```javascript
/**
 * Template Management Modal
 * Save and load content templates
 */

export function openTemplateModal() {
  const templates = JSON.parse(localStorage.getItem('templates') || '{}');
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">Load Template</h2>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="p-4 overflow-y-auto max-h-[60vh]">
        ${Object.keys(templates).length === 0 
          ? '<p class="text-gray-500 text-center py-8">No templates saved yet.</p>'
          : `
            <div class="grid gap-4">
              ${Object.entries(templates).map(([name, template]) => `
                <div class="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                     onclick="loadTemplate('${name}')">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold text-lg">${name}</h3>
                      <p class="text-sm text-gray-500">
                        ${new Date(template.createdAt).toLocaleDateString()}
                        • ${template.content.blocks.length} blocks
                      </p>
                    </div>
                    <button 
                      onclick="event.stopPropagation(); deleteTemplate('${name}')"
                      class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `
        }
      </div>
      
      <div class="p-4 border-t flex justify-end gap-2">
        <button onclick="this.closest('.fixed').remove()" 
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

window.loadTemplate = async (name) => {
  const templates = JSON.parse(localStorage.getItem('templates') || '{}');
  if (!templates[name]) return;
  
  const confirmed = confirm('This will replace your current content. Continue?');
  if (!confirmed) return;
  
  // Load template into editor
  if (connection.ej) {
    await connection.ej.render(templates[name].content);
  }
  
  // Restore metadata
  Object.assign(editorData, templates[name].data);
  
  document.querySelector('.fixed').remove();
};

window.deleteTemplate = (name) => {
  const confirmed = confirm(`Delete template "${name}"?`);
  if (!confirmed) return;
  
  const templates = JSON.parse(localStorage.getItem('templates') || '{}');
  delete templates[name];
  localStorage.setItem('templates', JSON.stringify(templates));
  
  // Refresh modal
  document.querySelector('.fixed').remove();
  openTemplateModal();
};
```

---

## Testing Strategy

### Unit Tests

#### Test Auto-Save
```javascript
describe('Auto-Save', () => {
  it('should save to localStorage every 30 seconds', async () => {
    jest.useFakeTimers();
    startAutoSave(mockConnection, mockEditorData);
    
    jest.advanceTimersByTime(30000);
    
    const saved = localStorage.getItem('autosave');
    expect(saved).toBeDefined();
    expect(JSON.parse(saved).lastSaved).toBeDefined();
  });
  
  it('should clear on manual save', () => {
    startAutoSave(mockConnection, mockEditorData);
    manualSave();
    
    expect(localStorage.getItem('autosave')).toBeNull();
  });
});
```

#### Test Draft Recovery
```javascript
describe('Draft Recovery', () => {
  beforeEach(() => {
    localStorage.setItem('autosave', JSON.stringify({
      lastSaved: new Date().toISOString(),
      data: { title: 'Test', content: {...} }
    }));
  });
  
  it('should prompt user on startup', () => {
    const app = new App();
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Recover draft'));
  });
  
  it('should load content if confirmed', async () => {
    window.confirm.mockReturnValue(true);
    const app = new App();
    await app.init();
    
    expect(connection.ej.render).toHaveBeenCalledWith(expect.any(Object));
  });
});
```

### Integration Tests

#### Test CTA Block
```javascript
describe('CTA Block', () => {
  it('should render with default values', () => {
    const block = new CTABlock({ data: {}, api: mockApi });
    const element = block.render();
    
    expect(element.querySelector('h3').innerHTML).toBe('Special Offer!');
    expect(element.querySelector('a').innerHTML).toBe('Learn More');
  });
  
  it('should apply custom colors', () => {
    const block = new CTABlock({
      data: {
        backgroundColor: '#ff0000',
        textColor: '#ffffff'
      },
      api: mockApi
    });
    
    const element = block.render();
    expect(element.style.background).toBe('rgb(255, 0, 0)');
  });
  
  it('should save all data fields', () => {
    const block = new CTABlock({ data: testData, api: mockApi });
    const saved = block.save();
    
    expect(saved).toEqual(testData);
  });
});
```

### Manual Testing Checklist

#### Phase 1 Features
- [ ] Undo/Redo buttons visible and functional
- [ ] Auto-save triggers every 30 seconds
- [ ] "Auto-saved at..." indicator updates
- [ ] Word count displays correctly
- [ ] Reading time calculates accurately
- [ ] Draft recovery prompts on reload
- [ ] Recovered content loads properly

#### Phase 2 Features
- [ ] CTA block inserts from slash menu
- [ ] CTA settings (color, alignment) work
- [ ] Table block allows row/column addition
- [ ] Embed block detects services correctly
- [ ] Templates save successfully
- [ ] Templates load and replace content
- [ ] Text color applies to selected text

#### Phase 3 Features
- [ ] Email preview shows accurate rendering
- [ ] Mobile/desktop preview toggle works
- [ ] Export to HTML generates valid email HTML
- [ ] Export to Markdown formats correctly
- [ ] SEO score calculates accurately
- [ ] Version history tracks changes
- [ ] Rollback restores previous content

---

## Timeline & Effort Estimation

### Phase 1: Quick Wins (Week 1-2)
**Total Hours:** 8.5 hours  
**Duration:** 1-2 weeks (part-time)

| Task | Hours | Priority | Dependencies |
|------|-------|----------|--------------|
| 1.1 Undo/Redo Buttons | 2 | ⭐⭐⭐ Critical | None |
| 1.2 Auto-Save System | 3 | ⭐⭐⭐ Critical | None |
| 1.3 Word Count | 1.5 | ⭐⭐ High | None |
| 1.4 Draft Recovery | 2 | ⭐⭐ High | Auto-Save |

**Milestone:** Basic UX issues resolved, no data loss risk

---

### Phase 2: Core Features (Week 3-4)
**Total Hours:** 32 hours  
**Duration:** 2-3 weeks (part-time)

| Task | Hours | Priority | Dependencies |
|------|-------|----------|--------------|
| 2.1 CTA Block | 6 | ⭐⭐⭐ Must-Have | None |
| 2.2 Table Block | 8 | ⭐⭐⭐ Must-Have | None |
| 2.3 Embed Block | 10 | ⭐⭐ High | None |
| 2.4 Template System | 5 | ⭐⭐ High | None |
| 2.5 Text Color Picker | 3 | ⭐ Medium | None |

**Milestone:** Powerful content creation tools available

---

### Phase 3: Advanced Features (Week 5-6)
**Total Hours:** 31 hours  
**Duration:** 3-4 weeks (part-time)

| Task | Hours | Priority | Dependencies |
|------|-------|----------|--------------|
| 3.1 Email Preview | 8 | ⭐⭐⭐ Critical | None |
| 3.2 Export Formats | 6 | ⭐⭐ High | Email Preview |
| 3.3 SEO Score Checker | 7 | ⭐⭐ High | None |
| 3.4 Version History | 10 | ⭐ Medium | Auto-Save |

**Milestone:** Production-ready professional editor

---

### Total Project Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 12 major features |
| **Total Hours** | 71.5 hours |
| **Total Weeks** | 6-9 weeks (part-time) |
| **New Files** | ~15 files |
| **Modified Files** | 3 core files |
| **New Dependencies** | 2-3 CDN libraries |

---

## Risk Assessment

### Technical Risks

#### High Risk
1. **Editor.js Compatibility** - New tools might conflict with existing tools
   - **Mitigation:** Test each tool individually before integration
   
2. **localStorage Limits** - 5-10MB limit might not be enough for large templates
   - **Mitigation:** Implement IndexedDB for larger storage needs

#### Medium Risk
3. **Performance Impact** - Auto-save every 30s might cause lag
   - **Mitigation:** Debounce save operations, optimize content serialization
   
4. **Browser Compatibility** - Some APIs might not work in older browsers
   - **Mitigation:** Polyfills, feature detection, graceful degradation

#### Low Risk
5. **CSS Conflicts** - New styles might conflict with existing Tailwind classes
   - **Mitigation:** Use specific selectors, CSS modules approach

---

## Success Metrics

### Quantitative Metrics
- ✅ **Zero data loss incidents** (auto-save working)
- ✅ **< 100ms** input lag during typing
- ✅ **< 2 seconds** template load time
- ✅ **95%+** successful email renders
- ✅ **Support 50+ templates** without performance degradation

### Qualitative Metrics
- ✅ Users can recover work after browser crash
- ✅ Content creators have diverse block options
- ✅ Email marketers can preview before sending
- ✅ Teams can reuse successful templates
- ✅ SEO optimization is automated and actionable

---

## Next Steps

### Immediate Actions (This Week)
1. **Review and approve this plan**
2. **Set up development environment**
   - Install necessary IDE extensions
   - Configure linting/formatting
3. **Start Phase 1, Task 1.1** (Undo/Redo Buttons)
4. **Create GitHub project board** for task tracking

### Short-term (Next 2 Weeks)
1. Complete all Phase 1 tasks
2. Test thoroughly across browsers
3. Document user-facing changes
4. Update README.md with new features

### Long-term (Next 2 Months)
1. Complete all three phases
2. Conduct user testing sessions
3. Gather feedback and iterate
4. Consider additional features based on user needs

---

## Appendix A: Code Snippets Reference

### Common Patterns

#### Creating Inline Toolbar Tools
```javascript
class InlineTool {
  static get toolbox() {
    return {
      title: 'Tool Name',
      icon: '<svg>...</svg>'
    };
  }
  
  constructor({ api }) {
    this.api = api;
  }
  
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = this.toolbox.icon;
    this.button.addEventListener('click', () => {
      // Apply formatting
      document.execCommand('bold', false, null);
    });
    return this.button;
  }
  
  surround(range) {
    // Handle text selection
  }
  
  checkState() {
    // Return true if tool is active at current selection
    return document.queryCommandState('bold');
  }
}
```

#### Creating Block Tools with Settings
```javascript
class BlockTool {
  static get toolbox() { /* ... */ }
  
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = data;
  }
  
  render() {
    // Create and return DOM element
  }
  
  save(blockContent) {
    // Extract and return data
    return this.data;
  }
  
  renderSettings() {
    return [
      {
        icon: '<svg>...</svg>',
        label: 'Setting Name',
        onActivate: () => this.changeSetting(),
        isActive: this.data.settingValue
      }
    ];
  }
}
```

---

## Appendix B: Useful Resources

### Editor.js Documentation
- Official Docs: https://editorjs.io/
- API Reference: https://editorjs.io/api
- Tool Creation: https://editorjs.io/creating-a-block-tool

### Libraries & Tools
- **html2pdf.js**: https://github.com/eKoopmans/html2pdf.js
- **Prism JS**: https://prismjs.com/
- **Lucide Icons**: https://lucide.dev/

### Inspiration
- **Ghost CMS**: https://ghost.org/
- **Notion**: https://www.notion.so/
- **Carrd**: https://carrd.co/

---

**Document Version:** 1.0  
**Last Updated:** March 22, 2026  
**Author:** AI Assistant  
**Status:** Ready for Implementation
