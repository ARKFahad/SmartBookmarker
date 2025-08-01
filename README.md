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

### 📊 **Smart Dashboard**
- Centralized dashboard for all your bookmarks
- Domain-based grouping (multiple pages from same site grouped together)
- Expandable domain groups to see individual pages
- Multiple sorting options: by date, domain, category, or title

### 🔍 **Powerful Search & Filtering**
- Real-time search across titles, URLs, tags, and notes
- Filter by tags and categories
- Multiple sorting options for different organizational needs

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
5. Select a category from the dropdown
6. Add optional notes about the bookmark
7. Click "Save Bookmark"

### Managing Bookmarks
1. Click the extension icon and then click "Dashboard"
2. Browse your bookmarks organized by domain
3. Use the search bar to find specific bookmarks
4. Use filters to narrow down by tags or categories
5. Click on any bookmark to view details or open it

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

## Technical Details

### Permissions Used
- `bookmarks`: Access to Chrome's bookmark system
- `storage`: Save bookmark data locally
- `activeTab`: Access current tab information
- `tabs`: Create new tabs for opening bookmarks

### Data Storage
- All bookmark data is stored locally using Chrome's storage API
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