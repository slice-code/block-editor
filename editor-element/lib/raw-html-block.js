/**
 * Raw HTML Block Tool for Editor.js
 * Allows users to enter raw HTML content and preview it inside the editor.
 */

class RawHtmlBlock {
  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Raw HTML',
      icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 7L3 12L8 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 7L21 12L16 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 4H11V20H13V4Z" fill="currentColor"/></svg>'
    };
  }

  static get sanitize() {
    return {
      html: true
    };
  }

  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      html: data.html || ''
    };

    this.wrapper = null;
    this.textarea = null;
    this.preview = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-raw-html-block');
    this.wrapper.style.padding = '12px';
    this.wrapper.style.border = '1px solid #e5e7eb';
    this.wrapper.style.borderRadius = '8px';
    this.wrapper.style.background = '#fafafa';
    this.wrapper.style.margin = '8px 0';

    if (this.readOnly) {
      const preview = document.createElement('div');
      preview.innerHTML = this.data.html || '';
      this.wrapper.appendChild(preview);
      return this.wrapper;
    }

    const label = document.createElement('div');
    label.textContent = 'Raw HTML';
    label.style.fontSize = '13px';
    label.style.fontWeight = '600';
    label.style.marginBottom = '8px';
    this.wrapper.appendChild(label);

    this.textarea = document.createElement('textarea');
    this.textarea.value = this.data.html;
    this.textarea.placeholder = '<div>Your raw HTML here</div>';
    this.textarea.style.width = '100%';
    this.textarea.style.minHeight = '120px';
    this.textarea.style.padding = '10px';
    this.textarea.style.border = '1px solid #d1d5db';
    this.textarea.style.borderRadius = '6px';
    this.textarea.style.fontFamily = 'monospace';
    this.textarea.style.fontSize = '13px';
    this.textarea.style.color = '#111827';
    this.textarea.style.background = '#ffffff';
    this.textarea.style.resize = 'vertical';

    this.textarea.addEventListener('input', () => {
      this.data.html = this.textarea.value;
      if (this.preview) {
        this.preview.innerHTML = this.data.html;
      }
    });

    this.wrapper.appendChild(this.textarea);

    this.preview = document.createElement('div');
    this.preview.style.marginTop = '12px';
    this.preview.style.padding = '12px';
    this.preview.style.border = '1px solid #e5e7eb';
    this.preview.style.borderRadius = '6px';
    this.preview.style.background = '#ffffff';
    this.preview.innerHTML = this.data.html || '<em>Preview will appear here</em>';

    this.wrapper.appendChild(this.preview);

    return this.wrapper;
  }

  save() {
    return {
      html: this.data.html || ''
    };
  }
}

window.RawHtmlBlock = RawHtmlBlock;
export { RawHtmlBlock };
