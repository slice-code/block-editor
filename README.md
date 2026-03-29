# Block Editor - Newsletter Content Management System

A Ghost-like block-based content editor built with **Editor.js** for creating rich newsletter content with metadata management, SEO tools, and publication scheduling.

<p align="center">
  <a href="https://ko-fi.com/gugusdarmayanto">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Support me on Ko-fi" />
  </a>
</p>

![Editor Preview](https://via.placeholder.com/800x400?text=Block+Editor+Preview)

## ✨ Features

### 📝 Rich Text Editing
- **Block-Based Architecture**: Each content element is an independent block
- **Slash Menu**: Type `/` to access all available blocks
- **Drag & Drop**: Reorder content blocks effortlessly
- **Inline Toolbar**: Format text without leaving your flow

### 🧱 Available Block Types

| Block | Description | Usage |
|-------|-------------|-------|
| **Header** | H1-H6 headings with Tailwind styling | Type `/header` or select from menu |
| **Paragraph** | Default text blocks | Start typing or press Enter |
| **List** | Ordered/Unordered lists (up to 4 levels) | Type `/list` or use `-` / `1.` |
| **Image** | Upload images with captions | Type `/image` or drag & drop |
| **Code Block** | Syntax-highlighted code | Type `/code` |
| **Quote** | Styled blockquotes | Type `/quote` |
| **Divider** | Horizontal rule separator | Type `/divider` |
| **YouTube** | Embed YouTube videos | Type `/youtube` + URL |
| **CodePen** | Embed CodePen snippets | Type `/codepen` + URL |

### 📊 Metadata Sidebar

The right sidebar provides comprehensive content management:

#### **Status Section**
- **Status**: Draft / Published / Scheduled
- **Author**: Content author name
- **Category**: Topic categorization (Technology, Business, Lifestyle, Tutorial, News)

#### **SEO Section**
- **Meta Description**: Search engine description
- **Tags**: Comma-separated keywords
- **Slug**: URL-friendly identifier

#### **Email Section**
- **Email Subject**: Newsletter subject line
- **Preview Text**: Inbox preview snippet

#### **Featured Image**
- **Upload**: Drag & drop or click to upload
- **Alt Text**: Accessibility description
- **Live Preview**: Instant image preview

#### **Publish Settings**
- **Date Picker**: Visual calendar selector
- **Time Picker**: 24-hour format with intervals
- **Scheduling**: Plan future publications

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js 14+ (optional, for development server)

### Installation

1. **Clone or download** this repository
   ```bash
   cd ui-maker
   ```

2. **Start the development server** (optional)
   ```bash
   node index.js
   ```

3. **Open in browser**
   ```
   http://localhost:3001
   ```

> **Note**: Editor.js and all block tools are dynamically loaded by `editor-element/editor.js`. No need to include additional script tags.

---

## 📖 Editor Usage Guide

### Quick Start Example

The editor is initialized in `main.js`. Here's how it works:

```javascript
// main.js - Editor Initialization
class App {
  constructor(_app) {
    (async ()=>{
      // Import DOM helper
      const {el} = await import('./el.js');
      this.app = el(_app);
      this.el = el;
      
      // Initialize the editor
      await this.init();
    })()
  }
  
  async init() {
    const {editor} = await import('./editor-element/editor.js?v='+version);
    
    const editorInstance = await editor({
      el: this.el,                    // DOM helper function (required)
      onClose: () => {
        console.log('Editor closed')
      },
      onSave: (data) => {
        console.log('Saved data:', data);
        // Handle save logic here (e.g., send to server)
      },
      type: 'newsletter',             // Editor type
      categories: [                   // Category options
        { value: 'technology', text: 'Technology' },
        { value: 'business', text: 'Business' },
        { value: 'lifestyle', text: 'Lifestyle' }
      ],
      storage: {
        type: 'indexedDB'             // Storage type
      },
      enableDraft: true,              // Enable draft feature
      initialData: null               // Load existing data
    });
    
    this.app.child(editorInstance).get();
  }
}

export default App;
```

### Configuration Parameters Explained

#### **1. `el` - DOM Element Reference**
```javascript
el: this.el
```
- **Purpose**: Reference to the DOM helper library instance
- **Required**: Yes
- **Type**: Object (from `el.js` library)
- **Usage**: Used for creating and manipulating DOM elements

**Example:**
```javascript
// In your app initialization
class App {
  constructor(_app) {
    (async ()=>{
      const {el} = await import('./el.js'); 
      this.app = el(_app);  // Wrap container with el helper
      this.el = el;         // Pass el function to editor
      await this.init();
    })()
  }
}
```

#### **2. `onClose` - Close Event Callback**
```javascript
onClose: () => {
  console.log('Editor closed')
}
```
- **Purpose**: Triggered when user clicks the "Close" button
- **Required**: No (optional)
- **Type**: Function
- **Use Cases**:
  - Cleanup operations
  - Show confirmation dialog
  - Navigate away from editor
  - Reset application state

**Advanced Example:**
```javascript
onClose: async () => {
  const hasUnsavedChanges = checkUnsavedChanges();
  if (hasUnsavedChanges) {
    const confirm = window.confirm('You have unsaved changes. Close anyway?');
    if (!confirm) return;
  }
  
  // Perform cleanup
  await clearCache();
  window.location.href = '/dashboard';
}
```

#### **3. `onSave` - Save Event Callback**
```javascript
onSave: (data) => {
  console.log('Saved data:', data);
  // Handle save logic here (e.g., send to server)
}
```
- **Purpose**: Triggered when user clicks "Save" or presses Ctrl/Cmd+S
- **Required**: No (optional, but recommended)
- **Type**: Function
- **Parameter**: `data` - Complete newsletter object with content and metadata

**Complete Save Implementation:**
```javascript
onSave: async (data) => {
  try {
    // Show loading indicator
    showLoadingSpinner();
    
    // Send to your backend API
    const response = await fetch('/api/newsletters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Save failed');
    
    const result = await response.json();
    
    // Success feedback
    showNotification('Newsletter saved successfully!', 'success');
    
    // Store ID for future updates
    window.currentNewsletterId = result.id;
    
  } catch (error) {
    console.error('Error saving newsletter:', error);
    showNotification('Failed to save newsletter', 'error');
  } finally {
    hideLoadingSpinner();
  }
}
```

#### **4. `categories` - Category Options**
```javascript
categories: [
  { value: 'technology', text: 'Technology' },
  { value: 'business', text: 'Business' },
  { value: 'lifestyle', text: 'Lifestyle' },
  { value: 'tutorial', text: 'Tutorial' },
  { value: 'news', text: 'News' }
]
```
- **Purpose**: Defines available categories in the sidebar dropdown
- **Required**: No (defaults to Technology, Business, Lifestyle, Tutorial, News)
- **Type**: Array of objects
- **Structure**: Each object has `value` (stored) and `text` (displayed)

**Custom Categories Example:**
```javascript
categories: [
  { value: '', text: 'Select category...' },  // Default option
  { value: 'ai-ml', text: 'AI & Machine Learning' },
  { value: 'web-dev', text: 'Web Development' },
  { value: 'mobile-dev', text: 'Mobile Development' },
  { value: 'devops', text: 'DevOps & Cloud' },
  { value: 'security', text: 'Cybersecurity' },
  { value: 'data-science', text: 'Data Science' }
]
```

---

### Complete Application Example

Here's the actual implementation from `main.js`:

```javascript
// main.js
class App {
  constructor(_app) {
    (async ()=>{
      const {el} = await import('./el.js');
      this.app = el(_app);
      this.el = el;
      this.enableDraft = false; // Set to true to enable draft checking
      await this.init();
    })()
  }
  
  async init() {
    const {editor} = await import('./editor-element/editor.js?v='+version);
    
    const editorInstance = await editor({
      el: this.el,
      
      // Close handler
      onClose: () => {
        console.log('Editor closed');
      },
      
      // Save handler with API integration
      onSave: async (data) => {
        // Send to your backend
        await fetch('/api/newsletters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      },
      
      // Editor type
      type: 'newsletter',
      
      // Custom categories
      categories: [
        { value: 'technology', text: 'Technology' },
        { value: 'business', text: 'Business' },
        { value: 'lifestyle', text: 'Lifestyle' }
      ],
      
      // Storage configuration
      storage: {
        type: 'indexedDB',
        apiEndpoint: null
      },
      
      // Enable draft feature
      enableDraft: this.enableDraft,
      
      // Initial data (for recovery or editing)
      initialData: null
    });
    
    this.app.child(editorInstance).get();
  }
}

export default App;

// Usage in HTML:
// <script type="module">
//   const { default: App } = await import('./main.js');
//   new App(document.getElementById('app'));
// </script>
```

---

### Saved Data Structure

When the user saves, the `onSave` callback receives this complete data structure:

```javascript
{
  // === METADATA ===
  title: "My Newsletter Title",
  status: "draft",              // draft | published | scheduled
  author: "John Doe",
  category: "technology",       // From categories array
  
  // === SEO ===
  metaDescription: "A compelling description for search engines...",
  tags: "tech, javascript, tutorial",
  slug: "my-newsletter-slug",
  
  // === EMAIL ===
  emailSubject: "Check out this amazing newsletter!",
  previewText: "Brief preview shown in email inbox...",
  
  // === FEATURED IMAGE ===
  featuredImage: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // Base64 or URL
  featuredImageAlt: "Description for accessibility",
  
  // === PUBLISHING ===
  publishDate: "2024-01-15",    // YYYY-MM-DD format
  publishTime: "14:30",         // HH:MM format
  
  // === CONTENT ===
  content: {
    time: 1709856234567,
    blocks: [
      {
        type: "header",
        data: {
          text: "Introduction",
          level: 2
        }
      },
      {
        type: "paragraph",
        data: {
          text: "Welcome to my newsletter..."
        }
      },
      {
        type: "image",
        data: {
          url: "https://example.com/image.jpg",
          caption: "Image description",
          withBorder: false,
          withBackground: false,
          stretched: true
        }
      }
      // ... more blocks
    ],
    version: "2.28.0"
  }
}
```

---

### Common Usage Patterns

#### **Pattern 1: Basic Blog Editor**
```javascript
const editorInstance = await editor({
  el: this.el,
  onSave: (data) => {
    // Simple console logging for development
    console.log('Blog post data:', data);
  }
  // Using default categories
});
```

#### **Pattern 2: Multi-Author CMS**
```javascript
const editorInstance = await editor({
  el: this.el,
  onClose: () => {
    // Return to article list
    window.location.href = '/articles';
  },
  onSave: async (data) => {
    // Include author from session
    const session = await getSession();
    const postData = {
      ...data,
      authorId: session.userId,
      authorName: session.userName
    };
    
    await fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },
  categories: [
    { value: 'opinion', text: 'Opinion' },
    { value: 'news', text: 'News' },
    { value: 'review', text: 'Review' }
  ]
});
```

#### **Pattern 3: Email Marketing Platform**
```javascript
const editorInstance = await editor({
  el: this.el,
  onSave: async (data) => {
    // Validate email-specific fields
    if (!data.emailSubject || !data.previewText) {
      alert('Email subject and preview text are required!');
      return;
    }
    
    // Send to email service provider
    await fetch('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        campaignType: 'newsletter',
        audience: 'all-subscribers'
      })
    });
  },
  categories: [
    { value: 'promo', text: 'Promotional' },
    { value: 'update', text: 'Product Update' },
    { value: 'digest', text: 'Weekly Digest' }
  ]
});
```

#### **Pattern 4: Scheduled Content System**
```javascript
const editorInstance = await editor({
  el: this.el,
  onSave: async (data) => {
    // Validate scheduled posts
    if (data.status === 'scheduled') {
      if (!data.publishDate || !data.publishTime) {
        alert('Please set publish date and time for scheduled posts!');
        return;
      }
      
      const publishDateTime = new Date(`${data.publishDate}T${data.publishTime}`);
      const now = new Date();
      
      if (publishDateTime <= now) {
        alert('Scheduled date must be in the future!');
        return;
      }
    }
    
    // Save with scheduling info
    await saveWithSchedule(data);
  }
});
```

---

### Alternative: Direct File Access

Simply open `index.html` in your browser (no server needed):
```bash
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

---

## 📖 Usage Guide

### Creating Content

#### **1. Start Writing**
- Click on the title area and enter your newsletter title
- Start typing in the main content area to create paragraphs

#### **2. Add Blocks**
There are multiple ways to add blocks:

**Method A: Slash Command**
1. Type `/` on a new line
2. Select desired block from menu
3. Configure block settings

**Method B: Plus Button**
1. Hover over any block
2. Click the `+` button that appears
3. Choose block type

**Method C: Keyboard Shortcuts**
- `Enter`: Create new paragraph below
- `Backspace` (empty line): Delete block
- `Ctrl/Cmd + S`: Save content

#### **3. Using Specific Blocks**

##### **Header Block**
```
1. Type `/header`
2. Select heading level (H1-H6)
3. Enter your heading text
```
Each level has predefined Tailwind classes:
- H1: `text-4xl font-bold`
- H2: `text-3xl font-semibold`
- H3: `text-2xl font-medium`
- etc.

##### **Image Block**
```
1. Type `/image` or drag & drop image
2. Click to upload or paste image URL
3. Add caption text (optional)
4. Use settings to toggle:
   - Border
   - Background
   - Stretched width
```

##### **List Block**
```
1. Type `/list`
2. Choose ordered or unordered
3. Enter list items
4. Press Tab to nest items (up to 4 levels)
5. Press Shift+Tab to un-nest
```

##### **Code Block**
```
1. Type `/code`
2. Select programming language
3. Paste your code
4. Syntax highlighting applies automatically
```

##### **YouTube Embed**
```
1. Type `/youtube`
2. Paste YouTube URL
3. Video preview loads automatically
```

##### **Block Quote**
```
1. Type `/quote`
2. Enter quoted text
3. Add citation (optional)
```

### Managing Metadata

#### **Setting Publication Status**
1. Open sidebar (always visible on right)
2. Under **Status**, select:
   - **Draft**: Work in progress
   - **Published**: Ready to publish
   - **Scheduled**: Set date/time for auto-publish

#### **Adding Categories**
1. Click **Category** dropdown
2. Select appropriate category:
   - Technology
   - Business
   - Lifestyle
   - Tutorial
   - News

#### **SEO Optimization**
1. **Meta Description**: Write 150-160 character summary
2. **Tags**: Add relevant keywords (comma-separated)
3. **Slug**: Create URL-friendly title (e.g., `my-newsletter-title`)

#### **Email Configuration**
1. **Email Subject**: Compelling subject line
2. **Preview Text**: Teaser text shown in email inbox

#### **Featured Image**
1. Click upload area or drag image
2. Add alt text for accessibility
3. Image previews in sidebar

#### **Schedule Publication**
1. Click date field → select from calendar
2. Click time field → choose time (30-min intervals)
3. Set status to "Scheduled"

### Saving Content

**Manual Save:**
1. Click **Save** button (top-right of sidebar)
2. Data logged to console (integrate with your backend)

**Keyboard Shortcut:**
```
Ctrl+S (Windows/Linux)
Cmd+S (Mac)
```

**Saved Data Structure:**
```javascript
{
  title: "Newsletter Title",
  status: "draft",
  author: "John Doe",
  category: "technology",
  metaDescription: "SEO description...",
  tags: "tech, news, tutorial",
  slug: "newsletter-slug",
  emailSubject: "Email subject line",
  previewText: "Inbox preview text",
  featuredImage: "data:image/...",
  featuredImageAlt: "Image description",
  publishDate: "2024-01-15",
  publishTime: "14:30",
  content: {
    // Editor.js block data
    blocks: [...],
    time: 1234567890
  }
}
```

---

## 🏗️ Architecture

### Project Structure

```
ui-maker/
├── index.html              # Entry point
├── main.js                 # Application initializer
├── el.js                   # Custom DOM helper library
├── index.js                # Node.js dev server
├── tailwind.js             # Tailwind CSS (bundled)
│
└── editor-element/         # Editor module
    ├── editor.js           # Main editor component (loads Editor.js dynamically)
    ├── README.md           # Editor usage guide
    └── lib/                # Block tools & dependencies
        ├── editorjs.umd.min.js      # Editor.js core (loaded dynamically)
        ├── editorjs-list.umd.min.js # List block
        ├── custom-header.js         # H1-H6 with Tailwind
        ├── simple-image.js          # Image upload tool
        ├── code-block.js            # Code syntax highlighting
        ├── youtube-embed.js         # YouTube embeds
        ├── block-quote.js           # Quote blocks
        ├── divider.js               # Horizontal dividers
        ├── codepen-embed.js         # CodePen integration
        ├── datepicker.js            # Date picker component
        ├── timepicker.js            # Time picker component
        └── ... (other tools)
```

> **Important**: Editor.js and block tools are dynamically loaded by `editor-element/editor.js`. No need to include them in HTML.

### Core Components

#### **1. el.js - DOM Helper Library**
A jQuery-like utility for chainable DOM manipulation:

```javascript
// Create element
el('div')
  .class('p-4 bg-white')
  .text('Hello World')
  .get()

// With children
el('div').child([
  el('h1').text('Title'),
  el('p').text('Content')
]).get()

// Event handling
el('button')
  .text('Click me')
  .on('click', () => alert('Clicked!'))
  .get()
```

**Key Methods:**
- `el(tag)` - Create element
- `.class(className)` - Add CSS classes
- `.css({property: value})` - Inline styles
- `.child([...])` - Add child elements
- `.on(event, handler)` - Event listener
- `.link(object, key)` - Reactive data binding
- `.attr(name, value)` - HTML attributes

#### **2. editor-element/editor.js - Editor Configuration**
Configures Editor.js with custom tools and sidebar. All dependencies are loaded dynamically:

```javascript
const editor = async ({el, onClose, onSave, categories, storage, enableDraft, initialData}) => {
  // Dynamically load all dependencies
  await Promise.all([
    import('./lib/editorjs.umd.min.js'),
    import('./lib/custom-header.js'),
    // ... other tools
  ]);

  // Initialize Editor.js
  const ej = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: { class: CustomHeader },
      list: { class: EditorjsList },
      // ... more tools
    }
  });
};
```

#### **3. Custom Tools Pattern**
Each tool in `editor-element/` follows this structure:

```javascript
class MyCustomTool {
  static get toolbox() {
    return {
      title: 'My Tool',
      icon: '<svg>...</svg>'
    };
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.data = data || {};
  }

  render() {
    // Return DOM element
    return document.createElement('div');
  }

  save(blockContent) {
    // Return data object
    return { /* data */ };
  }
}

window.MyCustomTool = MyCustomTool;
export { MyCustomTool };
```

---

## 🎨 Customization

### Adding New Block Types

1. **Create tool file** in `editor-element/`:
   ```javascript
   // editor-element/my-tool.js
   class MyTool {
     static get toolbox() { /* ... */ }
     render() { /* ... */ }
     save() { /* ... */ }
   }
   window.MyTool = MyTool;
   export { MyTool };
   ```

2. **Import in editor.js**:
   ```javascript
   await import('./editor-element/my-tool.js');
   const MyTool = window.MyTool;
   ```

3. **Register in Editor.js config**:
   ```javascript
   tools: {
     myTool: {
       class: MyTool,
       inlineToolbar: true
     }
   }
   ```

See [`editor-element/README.md`](editor-element/README.md) for detailed guide.

### Customizing Categories

Edit `main.js`:
```javascript
categories: [
  { value: 'technology', text: 'Technology' },
  { value: 'business', text: 'Business' },
  // Add your categories
]
```

### Styling

The editor uses **Tailwind CSS** via CDN. Customize by:

1. **Modify existing classes** in `editor.js`
2. **Add custom CSS** in `index.html`
3. **Override Editor.js styles**:
   ```css
   .ce-block__content {
     max-width: 650px;
   }
   ```

### Changing Theme Colors

Edit Tailwind config or add custom CSS:
```css
:root {
  --primary-color: #3b82f6;
  --background-color: #f3f4f6;
}
```

---

## 🔧 Development

### Running in Development

```bash
# Start server
node index.js

# Open browser
http://localhost:3001
```

### Build for Production

1. **Minify JavaScript** (optional):
   ```bash
   npx terser main.js -o main.min.js
   ```

2. **Use local Tailwind** instead of CDN:
   ```bash
   npm install tailwindcss
   npx tailwindcss -o tailwind.min.css --minify
   ```

3. **Update index.html**:
   ```html
   <link rel="stylesheet" href="./tailwind.min.css">
   <script src="./main.min.js"></script>
   ```

### Debugging

**Console Logs:**
- Editor changes: `console.log('Content changed:', event)`
- Save operations: `console.log('Saved data:', data)`
- Tool readiness: `console.log('Editor.js is ready!')`

**Browser DevTools:**
1. Open DevTools (F12)
2. Go to Console tab
3. Interact with editor to see logs

---

## 📚 API Reference

### Editor.js Instance

Access the Editor.js instance:
```javascript
const editor = connection.ej;

// Get content
const data = await editor.save();

// Insert block
editor.blocks.insert('paragraph', {
  text: 'New content'
});

// Clear editor
editor.blocks.clear();
```

### Data Format

**Output (from `editor.save()`):**
```javascript
{
  blocks: [
    {
      type: "header",
      data: {
        text: "My Title",
        level: 2
      }
    },
    {
      type: "paragraph",
      data: {
        text: "Content here..."
      }
    }
  ],
  time: 1234567890
}
```

**Loading Existing Content:**
```javascript
const ej = new EditorJS({
  holder: 'editorjs',
  data: {
    blocks: [...] // Your saved data
  }
});
```

### Callbacks

**onSave** (in `main.js`):
```javascript
onSave: (data) => {
  // Send to your backend
  fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

**onClose**:
```javascript
onClose: () => {
  // Handle editor close (cleanup, confirm, etc.)
  console.log('Editor closed');
}
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Slash menu not appearing**
- **Solution**: Ensure cursor is in empty block, try refreshing page

**Issue: Images not uploading**
- **Solution**: Check file size, ensure blob URLs are supported

**Issue: Drag & drop not working**
- **Solution**: Verify `drag-drop.min.js` is loaded, check console errors

**Issue: Sidebar not showing**
- **Solution**: Check browser console for errors, ensure `el.js` loaded

**Issue: Save not capturing data**
- **Solution**: Check `onSave` callback implementation, verify data structure

### Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 80+ | ✅ Full |
| Firefox | 75+ | ✅ Full |
| Safari | 13+ | ✅ Full |
| Edge | 80+ | ✅ Full |
| IE 11 | - | ❌ Not Supported |

---

## 📝 Examples

### Basic Blog Post

```
Title: "Getting Started with JavaScript"
Category: Tutorial
Status: Published

Content:
- Header (H1): "Getting Started with JavaScript"
- Paragraph: Introduction
- Image: JavaScript logo
- Header (H2): "Variables"
- Paragraph: Explanation
- Code Block: Variable examples
- Header (H2): "Functions"
- List: Function types
- Quote: Best practice
- Divider
- Paragraph: Conclusion
```

### Newsletter with Schedule

```
Title: "Weekly Tech Roundup"
Category: News
Status: Scheduled
Publish Date: Next Monday
Publish Time: 09:00
Email Subject: "This Week in Tech"
Featured Image: Tech collage

Content:
- Header: "Top Stories This Week"
- Paragraph: Intro
- List: Top stories
- Header: "Product Launches"
- Paragraph + Images
- Header: "Coming Soon"
- Paragraph: Events preview
```

---

## 🤝 Contributing

To contribute new features:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Coding Standards

- Use ES6+ syntax
- Follow existing patterns in `el.js`
- Document custom tools per `editor-element/README.md`
- Test across modern browsers

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- [Editor.js](https://editorjs.io/) - Block-style editor framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) - Icon library

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review `editor-element/README.md` for tool creation
3. Examine console logs for errors
4. Study example implementations in code

---

**Built with ❤️ using Vanilla JavaScript**
