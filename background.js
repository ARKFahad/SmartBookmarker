// Background service worker for Smart Bookmarker extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Smart Bookmarker extension installed');
    
    try {
        // Initialize storage with default values
        const result = await chrome.storage.local.get(['bookmarks', 'allTags', 'customCategories']);
        const defaultCategories = ['work', 'personal', 'shopping', 'research', 'finance', 'entertainment', 'other'];
        
        const storageData = {
            bookmarks: result.bookmarks || [],
            allTags: result.allTags || [],
            customCategories: result.customCategories || defaultCategories
        };
        
        await chrome.storage.local.set(storageData);
        console.log('Storage initialized successfully:', storageData);
        
        // Create context menu for quick bookmarking
        try {
            chrome.contextMenus.create({
                id: 'smartBookmark',
                title: 'Add to Smart Bookmarker',
                contexts: ['page', 'link']
            });
            console.log('Context menu created successfully');
        } catch (contextError) {
            console.warn('Context menu creation failed:', contextError);
        }
        
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getCurrentTab':
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                sendResponse({ tab: tabs[0] });
            });
            return true; // Keep message channel open for async response
            
        case 'saveBookmark':
            handleSaveBookmark(request.bookmark, sendResponse);
            return true;
            
        case 'getBookmarks':
            chrome.storage.local.get(['bookmarks'], (result) => {
                sendResponse({ bookmarks: result.bookmarks || [] });
            });
            return true;
            
        case 'deleteBookmark':
            handleDeleteBookmark(request.bookmarkId, sendResponse);
            return true;
            
        default:
            sendResponse({ error: 'Unknown action' });
    }
});

// Handle bookmark saving
async function handleSaveBookmark(bookmark, sendResponse) {
    try {
        const result = await chrome.storage.local.get(['bookmarks', 'allTags']);
        const bookmarks = result.bookmarks || [];
        const allTags = result.allTags || [];
        
        // Add new bookmark
        bookmarks.push(bookmark);
        
        // Update tags
        bookmark.tags.forEach(tag => {
            if (!allTags.includes(tag)) {
                allTags.push(tag);
            }
        });
        
        // Save to storage
        await chrome.storage.local.set({
            bookmarks: bookmarks,
            allTags: allTags
        });
        
        sendResponse({ success: true });
    } catch (error) {
        console.error('Error saving bookmark:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Handle bookmark deletion
async function handleDeleteBookmark(bookmarkId, sendResponse) {
    try {
        const result = await chrome.storage.local.get(['bookmarks', 'allTags']);
        let bookmarks = result.bookmarks || [];
        let allTags = result.allTags || [];
        
        // Remove bookmark
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
        
        // Rebuild tags list
        const newTags = new Set();
        bookmarks.forEach(bookmark => {
            bookmark.tags.forEach(tag => newTags.add(tag));
        });
        allTags = Array.from(newTags);
        
        // Save to storage
        await chrome.storage.local.set({
            bookmarks: bookmarks,
            allTags: allTags
        });
        
        sendResponse({ success: true });
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'smartBookmark') {
        // Open popup with pre-filled data
        chrome.action.openPopup();
    }
}); 