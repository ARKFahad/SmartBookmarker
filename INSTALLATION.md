# Installation Guide for Smart Bookmarker

## Quick Start

### Step 1: Prepare the Extension
1. Make sure all files are in the correct directory structure:
   ```
   smart-bookmarker/
   ├── manifest.json
   ├── popup.html
   ├── popup.css
   ├── popup.js
   ├── background.js
   ├── content.js
   ├── icons/
   │   ├── icon.svg
   │   └── convert.html
   └── README.md
   ```

### Step 2: Create Icons (Optional but Recommended)
1. Open `icons/convert.html` in your web browser
2. Right-click on each icon size and save as PNG:
   - Save 16x16 as `icon16.png`
   - Save 48x48 as `icon48.png`
   - Save 128x128 as `icon128.png`
3. Place the PNG files in the `icons/` folder

### Step 3: Load Extension in Chrome
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked"
5. Select the `smart-bookmarker` folder
6. The extension should appear in your extensions list

### Step 4: Pin the Extension
1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Smart Bookmarker" in the list
3. Click the pin icon next to it
4. The extension icon will now appear in your toolbar

## Testing the Extension

### Test Bookmarking
1. Navigate to any website (e.g., `https://www.google.com`)
2. Click the Smart Bookmarker extension icon
3. You should see the current page information filled in
4. Add some tags (e.g., "search, tools")
5. Select a category
6. Add optional notes
7. Click "Save Bookmark"

### Test Dashboard
1. Click the extension icon again
2. Click "Dashboard" button
3. You should see your saved bookmark
4. Try the search and filter features
5. Click on the bookmark to view details

### Test Domain Grouping
1. Bookmark multiple pages from the same website
2. Go to the Dashboard
3. You should see them grouped under the domain name
4. Click on the domain group to expand and see individual pages

## Troubleshooting

### Extension Not Loading
- Make sure all files are present and in the correct locations
- Check that `manifest.json` is valid JSON
- Try reloading the extension in `chrome://extensions/`

### Icons Not Showing
- If you don't have PNG icons, the extension will use a default icon
- Create PNG icons using the `icons/convert.html` file
- Make sure icon files are named correctly: `icon16.png`, `icon48.png`, `icon128.png`

### Permissions Issues
- The extension requires permissions for bookmarks, storage, activeTab, and tabs
- These are standard permissions for bookmark extensions
- No external data is collected or transmitted

### Bookmark Not Saving
- Check the browser console for errors (F12 → Console)
- Make sure you're on a valid webpage (not chrome:// pages)
- Try refreshing the page and trying again

## Features to Test

### ✅ Basic Bookmarking
- [ ] Click extension icon on any webpage
- [ ] See current page information auto-filled
- [ ] Add tags and category
- [ ] Save bookmark successfully

### ✅ Dashboard Navigation
- [ ] Click "Dashboard" button
- [ ] See saved bookmarks
- [ ] Use search functionality
- [ ] Use tag and category filters
- [ ] Use sorting options

### ✅ Domain Grouping
- [ ] Bookmark multiple pages from same site
- [ ] See them grouped in dashboard
- [ ] Expand domain groups
- [ ] Click individual bookmarks

### ✅ Bookmark Management
- [ ] Click on bookmark to view details
- [ ] Open bookmark in new tab
- [ ] Delete bookmark
- [ ] See bookmark metadata

## Advanced Features

### Content Script Features
The extension includes a content script that can:
- Extract page descriptions from meta tags
- Auto-detect page categories
- Suggest relevant tags based on content
- Get favicon information

### Background Features
The background script handles:
- Extension installation setup
- Storage management
- Message passing between components
- Context menu integration

## Development Notes

### File Structure
- `manifest.json`: Extension configuration and permissions
- `popup.html/css/js`: Main user interface
- `background.js`: Service worker for background tasks
- `content.js`: Script that runs on web pages
- `icons/`: Extension icons in various sizes

### Storage
- Bookmarks are stored locally using Chrome's storage API
- Data persists between browser sessions
- No external servers or data collection

### Permissions
- `bookmarks`: Access to Chrome's bookmark system
- `storage`: Local data storage
- `activeTab`: Access current tab information
- `tabs`: Create new tabs for opening bookmarks

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all files are in the correct locations
3. Try reloading the extension
4. Check that you're using a compatible Chrome version (88+)

For more detailed information, see the main `README.md` file. 