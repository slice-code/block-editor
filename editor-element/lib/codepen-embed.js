/**
 * Custom CodePen Embed Block Tool for Editor.js
 * Supports CodePen pen embedding with preview
 */
class CodePenEmbed {
  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'CodePen',
      icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10l9 5 9-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15v4" stroke="currentColor" stroke-width="2"/></svg>'
    };
  }

  static get sanitize() {
    return {
      penId: {},
      userId: {},
      url: {},
      theme: {},
      caption: {
        br: true
      }
    };
  }

  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      penId: data.penId || '',
      userId: data.userId || '',
      url: data.url || '',
      theme: data.theme || 'dark',
      caption: data.caption || ''
    };
    
    this._isDestroyed = false;
    
    // Theme options
    this.themes = [
      { name: 'dark', label: 'Dark' },
      { name: 'light', label: 'Light' }
    ];
  }

  render() {
    // Main wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('codepen-embed-wrapper');
    this.wrapper.style.margin = '16px 0';
    this.wrapper.style.borderRadius = '8px';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.background = '#1e1e1e';
    
    if (!this.readOnly) {
      // Input container
      const inputContainer = document.createElement('div');
      inputContainer.style.padding = '16px';
      inputContainer.style.background = '#2d2d2d';
      inputContainer.style.display = 'flex';
      inputContainer.style.gap = '8px';
      inputContainer.style.alignItems = 'center';
      inputContainer.style.flexWrap = 'wrap';
      
      // CodePen icon
      const cpIcon = document.createElement('div');
      cpIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.144 13.067v-2.134L16.55 12zm1.715 1.135a.607.607 0 01-.207.206l-7.5 5a.61.61 0 01-.304.092.61.61 0 01-.304-.092l-7.5-5a.607.607 0 01-.207-.206.608.608 0 01-.1-.337V8.132a.608.608 0 01.1-.337.607.607 0 01.207-.206l7.5-5a.61.61 0 01.304-.092.61.61 0 01.304.092l7.5 5a.607.607 0 01.207.206.608.608 0 01.1.337v5.736a.608.608 0 01-.1.337zM12 10.866L9.898 12 12 13.134 14.102 12zm-1.144-1.151v-2.2l-3.447 2.298 1.544 1.03zm4.591.098l1.544-1.03-3.447-2.298v2.2zm-6.943 2.374l-1.544 1.03 3.447 2.298v-2.2zm5.296 2.374v2.2l3.447-2.298-1.544-1.03z" fill="#1e1e1e"/></svg>';
      cpIcon.style.background = '#ffd93d';
      cpIcon.style.borderRadius = '4px';
      cpIcon.style.padding = '4px';
      inputContainer.appendChild(cpIcon);
      
      // URL input
      this.urlInput = document.createElement('input');
      this.urlInput.type = 'text';
      this.urlInput.placeholder = 'Paste CodePen URL...';
      this.urlInput.value = this.data.url;
      this.urlInput.style.flex = '1';
      this.urlInput.style.minWidth = '200px';
      this.urlInput.style.padding = '8px 12px';
      this.urlInput.style.border = 'none';
      this.urlInput.style.borderRadius = '4px';
      this.urlInput.style.fontSize = '14px';
      this.urlInput.style.background = '#3d3d3d';
      this.urlInput.style.color = '#d4d4d4';
      this.urlInput.style.outline = 'none';
      
      // Theme selector
      this.themeSelect = document.createElement('select');
      this.themeSelect.style.padding = '8px 12px';
      this.themeSelect.style.border = 'none';
      this.themeSelect.style.borderRadius = '4px';
      this.themeSelect.style.fontSize = '14px';
      this.themeSelect.style.background = '#3d3d3d';
      this.themeSelect.style.color = '#d4d4d4';
      this.themeSelect.style.cursor = 'pointer';
      this.themeSelect.style.outline = 'none';
      
      this.themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.name;
        option.textContent = theme.label;
        if (theme.name === this.data.theme) {
          option.selected = true;
        }
        this.themeSelect.appendChild(option);
      });
      
      // Apply button
      this.applyBtn = document.createElement('button');
      this.applyBtn.textContent = 'Embed';
      this.applyBtn.style.padding = '8px 16px';
      this.applyBtn.style.border = 'none';
      this.applyBtn.style.borderRadius = '4px';
      this.applyBtn.style.fontSize = '14px';
      this.applyBtn.style.background = '#ffd93d';
      this.applyBtn.style.color = '#1e1e1e';
      this.applyBtn.style.cursor = 'pointer';
      this.applyBtn.style.fontWeight = '500';
      
      this.applyBtn.addEventListener('click', () => {
        this._handleUrlInput();
      });
      
      this.urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this._handleUrlInput();
        }
      });
      
      this.themeSelect.addEventListener('change', (e) => {
        this.data.theme = e.target.value;
        if (this.data.penId) {
          this._updateIframe();
        }
      });
      
      inputContainer.appendChild(this.urlInput);
      inputContainer.appendChild(this.themeSelect);
      inputContainer.appendChild(this.applyBtn);
      this.wrapper.appendChild(inputContainer);
    }
    
    // Preview container
    this.previewContainer = document.createElement('div');
    this.previewContainer.style.position = 'relative';
    this.previewContainer.style.width = '100%';
    this.previewContainer.style.height = '400px';
    this.previewContainer.style.background = '#000';
    this.previewContainer.style.display = 'none';
    
    // Iframe for CodePen
    this.iframe = document.createElement('iframe');
    this.iframe.style.position = 'absolute';
    this.iframe.style.top = '0';
    this.iframe.style.left = '0';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.iframe.setAttribute('scrolling', 'no');
    this.iframe.setAttribute('allowfullscreen', 'true');
    
    this.previewContainer.appendChild(this.iframe);
    this.wrapper.appendChild(this.previewContainer);
    
    // Caption input
    if (!this.readOnly) {
      this.captionInput = document.createElement('div');
      this.captionInput.contentEditable = 'true';
      this.captionInput.innerHTML = this.data.caption;
      this.captionInput.style.padding = '12px 16px';
      this.captionInput.style.color = '#9ca3af';
      this.captionInput.style.fontSize = '14px';
      this.captionInput.style.fontStyle = 'italic';
      this.captionInput.style.outline = 'none';
      this.captionInput.style.background = '#1e1e1e';
      this.captionInput.setAttribute('data-placeholder', 'Add caption (optional)');
      
      // Placeholder styles
      const placeholderStyle = document.createElement('style');
      placeholderStyle.textContent = `
        .codepen-embed-wrapper [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
      `;
      this.wrapper.appendChild(placeholderStyle);
      this.wrapper.appendChild(this.captionInput);
    } else if (this.data.caption) {
      const captionDiv = document.createElement('div');
      captionDiv.textContent = this.data.caption;
      captionDiv.style.padding = '12px 16px';
      captionDiv.style.color = '#9ca3af';
      captionDiv.style.fontSize = '14px';
      captionDiv.style.fontStyle = 'italic';
      captionDiv.style.textAlign = 'center';
      this.wrapper.appendChild(captionDiv);
    }
    
    // Show preview if penId exists
    if (this.data.penId && this.data.userId) {
      this._showPreview(this.data.userId, this.data.penId);
    }
    
    return this.wrapper;
  }

  /**
   * Handle URL input and extract pen info
   */
  _handleUrlInput() {
    const url = this.urlInput.value.trim();
    if (!url) return;
    
    const { userId, penId } = this._extractPenInfo(url);
    if (userId && penId) {
      this.data.url = url;
      this.data.userId = userId;
      this.data.penId = penId;
      this._showPreview(userId, penId);
    } else {
      // Show error feedback
      this.urlInput.style.border = '1px solid #ef4444';
      setTimeout(() => {
        this.urlInput.style.border = 'none';
      }, 2000);
    }
  }

  /**
   * Extract CodePen user ID and pen ID from various URL formats
   */
  _extractPenInfo(url) {
    if (!url) return { userId: null, penId: null };
    
    // Patterns for different CodePen URL formats
    const patterns = [
      // Standard URL: codepen.io/USER/pen/PEN_ID
      /codepen\.io\/([a-zA-Z0-9_-]+)\/pen\/([a-zA-Z0-9]+)/,
      // Full URL with details: codepen.io/USER/details/PEN_ID
      /codepen\.io\/([a-zA-Z0-9_-]+)\/details\/([a-zA-Z0-9]+)/,
      // Full URL with full page: codepen.io/USER/full/PEN_ID
      /codepen\.io\/([a-zA-Z0-9_-]+)\/full\/([a-zA-Z0-9]+)/,
      // Embed URL: codepen.io/USER/embed/PEN_ID
      /codepen\.io\/([a-zA-Z0-9_-]+)\/embed\/([a-zA-Z0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[2]) {
        return { userId: match[1], penId: match[2] };
      }
    }
    
    return { userId: null, penId: null };
  }

  /**
   * Show CodePen preview
   */
  _showPreview(userId, penId) {
    if (!userId || !penId) return;
    
    this._updateIframe();
    this.previewContainer.style.display = 'block';
    
    // Hide input container after successful embed
    const inputContainer = this.wrapper.querySelector('div');
    if (inputContainer && !this.readOnly) {
      inputContainer.style.display = 'none';
    }
  }

  /**
   * Update iframe src
   */
  _updateIframe() {
    const theme = this.data.theme === 'light' ? 'theme-id=light' : 'theme-id=dark';
    this.iframe.src = `https://codepen.io/${this.data.userId}/embed/${this.data.penId}?height=400&default-tab=result&${theme}&editable=true`;
  }

  save() {
    return {
      penId: this.data.penId,
      userId: this.data.userId,
      url: this.data.url,
      theme: this.themeSelect ? this.themeSelect.value : this.data.theme,
      caption: this.captionInput ? this.captionInput.innerHTML : this.data.caption
    };
  }

  /**
   * Clean up when block is destroyed
   */
  destroy() {
    this._isDestroyed = true;
    // Remove iframe to stop any running code
    if (this.iframe) {
      this.iframe.src = '';
    }
  }

  static get pasteConfig() {
    return {
      patterns: {
        codepen: /https?:\/\/(?:www\.)?codepen\.io\/([a-zA-Z0-9_-]+)\/(?:pen|embed|full|details)\/([a-zA-Z0-9]+)/
      }
    };
  }

  onPaste(event) {
    if (event.type === 'pattern') {
      const url = event.detail.data;
      const { userId, penId } = this._extractPenInfo(url);
      if (userId && penId) {
        this.data.url = url;
        this.data.userId = userId;
        this.data.penId = penId;
        if (this.urlInput) {
          this.urlInput.value = url;
        }
        this._showPreview(userId, penId);
      }
    }
  }
}

// Expose to window for Editor.js
window.CodePenEmbed = CodePenEmbed;

// Export for ES modules
export { CodePenEmbed };
