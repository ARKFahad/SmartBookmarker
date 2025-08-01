# Testing Guide for Smart Bookmarker Extension

## New Features to Test

### 1. Personalized Category Management

**Test Steps:**
1. Open the extension popup
2. Scroll down to the "Add New Category" section
3. Enter a new category name (e.g., "Testing")
4. Click "Add" or press Enter
5. Verify the category appears in both the form dropdown and filter dropdown
6. Try adding the same category again - should show "Category already exists!" error
7. Try adding an empty category - should show "Please enter a valid category name" error

**Expected Results:**
- New categories are saved and persist across sessions
- Categories appear in both dropdowns immediately
- Duplicate categories are prevented
- Empty categories are rejected

### 2. Import Functionality

**Test Steps:**
1. Go to the Dashboard
2. Click "Import" button
3. Select one of the test files:
   - `test-bookmarks.json` (JSON format)
   - `test-bookmarks.csv` (CSV format)
   - `test-bookmarks.html` (HTML format)
4. Choose the appropriate format or leave as "Auto-detect"
5. Click "Import"
6. Verify the bookmarks appear in the dashboard

**Expected Results:**
- All three file formats should import successfully
- Imported bookmarks should appear in the dashboard
- Tags should be properly parsed and available for filtering
- Categories should be preserved

### 3. Export Functionality

**Test Steps:**
1. Add some bookmarks to the extension
2. Go to the Dashboard
3. Click "Export" button
4. Choose different formats: JSON, CSV, HTML
5. Click "Export" for each format
6. Verify the downloaded files contain the correct data

**Expected Results:**
- All three export formats should work
- Downloaded files should contain all bookmark data
- File names should be appropriate (bookmarks.json, bookmarks.csv, bookmarks.html)

### 4. Integration Testing

**Test Steps:**
1. Add custom categories
2. Add bookmarks with custom categories
3. Export bookmarks
4. Clear all bookmarks
5. Import the exported file
6. Verify custom categories and bookmarks are restored

**Expected Results:**
- Custom categories should be preserved during export/import
- All bookmark data should be maintained
- Tags and categories should work correctly after import

## Test Files

The following test files are provided:
- `test-bookmarks.json` - JSON format with 3 sample bookmarks
- `test-bookmarks.csv` - CSV format with the same 3 bookmarks
- `test-bookmarks.html` - HTML format with the same 3 bookmarks

## Troubleshooting

If tests fail:
1. Check the browser console for JavaScript errors
2. Verify all file IDs are unique (no duplicate IDs in HTML)
3. Ensure the extension is reloaded after making changes
4. Check that Chrome storage permissions are working correctly

## Notes

- The extension stores data locally using Chrome's storage API
- Custom categories are saved alongside bookmarks
- Import/export functionality works entirely client-side
- All file formats are parsed and generated in the browser 