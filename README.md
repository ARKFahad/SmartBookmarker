# Smart Bookmarker Chrome Extension

A smart and intuitive Chrome extension that transforms chaotic bookmarking into a categorized, searchable, and visually-organized experience.

## Features

### 🎯 **Smart Bookmarking**
- One-click bookmarking from any webpage
- Automatic domain detection and grouping
- Intelligent categorization and tagging system

### 🏷️ **Advanced Tagging System**
- Add multiple tags to each bookmark
- Auto-suggest tags based on page content
- Filter and search bookmarks by tags
- Tag-based organization for quick retrieval

### 📂 **Personalized Category Management**
- Add custom categories for personalized organization
- Categories are saved and available for future use
- Dynamic category dropdowns that update automatically
- Persistent storage of user-defined categories

### 📊 **Smart Dashboard**
- Centralized dashboard for all your bookmarks
- Domain-based grouping (multiple pages from same site grouped together)
- Expandable domain groups to see individual pages
- Multiple sorting options: by date, domain, category, or title

### 🔍 **Powerful Search & Filtering**
- Real-time search across titles, URLs, tags, and notes
- Filter by tags and categories
- Multiple sorting options for different organizational needs

### 📤 **Import & Export Functionality**
- Export bookmarks in multiple formats: JSON, CSV, HTML
- Import bookmarks from JSON, CSV, and HTML files
- Auto-detection of file format during import
- Backup and restore your bookmark collection

### 📱 **Modern UI/UX**
- Clean, modern interface with gradient design
- Responsive layout that works on different screen sizes
- Intuitive navigation between bookmark form and dashboard
- Modal dialogs for detailed bookmark information

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download/Clone the Extension**
   ```bash
   git clone <repository-url>
   cd smart-bookmarker
   ```

2. **Open Chrome Extensions Page**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Smart Bookmarker" and click the pin icon
   - The extension icon will now appear in your toolbar

### Method 2: Install from Chrome Web Store (When Available)
- Search for "Smart Bookmarker" in the Chrome Web Store
- Click "Add to Chrome"
- Follow the installation prompts

## Usage

### Adding Bookmarks
1. Navigate to any webpage you want to bookmark
2. Click the Smart Bookmarker extension icon in your toolbar
3. The current page information will be automatically filled
4. Add tags (comma-separated) for better organization
5. Select a category from the dropdown or add a new custom category
6. Add optional notes about the bookmark
7. Click "Save Bookmark"

### Adding Custom Categories
1. In the bookmark form, scroll to the "Add New Category" section
2. Enter your desired category name in the input field
3. Click "Add" or press Enter
4. The new category will be saved and available for future use
5. Categories are automatically added to both the form and filter dropdowns

### Managing Bookmarks
1. Click the extension icon and then click "Dashboard"
2. Browse your bookmarks organized by domain
3. Use the search bar to find specific bookmarks
4. Use filters to narrow down by tags or categories
5. Click on any bookmark to view details or open it

### Importing Bookmarks
1. In the dashboard, click the "Import" button
2. Select your bookmark file (JSON, CSV, or HTML format)
3. Choose the format or let it auto-detect
4. Click "Import" to add the bookmarks to your collection
5. Existing bookmarks will be replaced with the imported ones

### Exporting Bookmarks
1. In the dashboard, click the "Export" button
2. Choose your preferred format: JSON, CSV, or HTML
3. Click "Export" to download your bookmarks
4. The file will be saved to your default download location

### Domain Grouping
- Multiple bookmarks from the same website are automatically grouped
- Click on a domain group to expand and see individual pages
- Single bookmarks from a domain are directly clickable

## File Structure

```
smart-bookmarker/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Styling for the popup
├── popup.js              # Main JavaScript functionality
├── background.js          # Background service worker
├── content.js            # Content script for page interaction
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Features in Detail

### Personalized Category Management
- **Custom Categories**: Add your own categories beyond the default ones
- **Persistent Storage**: Categories are saved and available across sessions
- **Dynamic Updates**: Category dropdowns update automatically when new categories are added
- **User-Friendly**: Simple input field with validation and feedback

### Import/Export System
- **Multiple Formats**: Support for JSON, CSV, and HTML formats
- **Auto-Detection**: Automatically detects file format during import
- **Flexible Export**: Choose your preferred format for export
- **Data Integrity**: Maintains all bookmark metadata during import/export

### Bookmark Merging
The extension intelligently groups multiple pages from the same domain under a single entry. For example, if you bookmark multiple product pages from `example.com`, they'll appear as one group with a count showing how many pages you've saved from that site.

### Tagging System
- **Auto-suggestions**: The extension analyzes page content to suggest relevant tags
- **Manual tagging**: Add your own tags separated by commas
- **Tag filtering**: Filter bookmarks by specific tags
- **Tag management**: All tags are automatically tracked and available for filtering

### Dashboard Organization
- **Sort by Date**: See your most recent bookmarks first
- **Sort by Domain**: Group bookmarks by website
- **Sort by Category**: Organize by predefined categories
- **Sort by Title**: Alphabetical organization

### Search Capabilities
- Search across bookmark titles, URLs, tags, and notes
- Real-time filtering as you type
- Combined with tag and category filters for precise results

## Supported File Formats

### Import Formats
- **JSON**: Full bookmark data with all metadata
- **CSV**: Simple format with columns for title, URL, tags, category, notes, date
- **HTML**: Basic bookmark export format compatible with browser bookmarks

### Export Formats
- **JSON**: Complete bookmark data for backup and transfer
- **CSV**: Spreadsheet-friendly format for analysis
- **HTML**: Standard bookmark format for browser compatibility

## Technical Details

### Permissions Used
- `bookmarks`: Access to Chrome's bookmark system
- `storage`: Save bookmark data locally
- `activeTab`: Access current tab information
- `tabs`: Create new tabs for opening bookmarks

### Data Storage
- All bookmark data is stored locally using Chrome's storage API
- Custom categories are persisted across sessions
- No external servers or data collection
- Your bookmarks remain private and secure

### Browser Compatibility
- Chrome 88+ (Manifest V3)
- Chromium-based browsers (Edge, Brave, etc.)

## Development

### Prerequisites
- Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development
1. Clone the repository
2. Make your changes
3. Go to `chrome://extensions/`
4. Click "Reload" on the extension
5. Test your changes

### Debugging
- Use Chrome DevTools to debug the popup
- Check the background script in the Extensions page
- View console logs for debugging information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have feature requests:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

---

**Smart Bookmarker** - Transform your bookmarking experience with intelligent organization and powerful search capabilities. 