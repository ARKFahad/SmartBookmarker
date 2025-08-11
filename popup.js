// Global variables
let currentTab = null;
let bookmarks = [];
let allTags = new Set();
let customCategories = new Set(['work', 'personal', 'shopping', 'research', 'finance', 'entertainment', 'other']);

// DOM elements
const bookmarkForm = document.getElementById('bookmarkForm');
const dashboard = document.getElementById('dashboard');
const dashboardBtn = document.getElementById('dashboardBtn');
const backBtn = document.getElementById('backBtn');
const saveBookmarkBtn = document.getElementById('saveBookmark');
const bookmarksList = document.getElementById('bookmarksList');
const searchInput = document.getElementById('searchInput');
const sortBySelect = document.getElementById('sortBy');
const tagFilterSelect = document.getElementById('tagFilter');
const categoryFilterSelect = document.getElementById('categoryFilter');
const bookmarkModal = document.getElementById('bookmarkModal');
const closeModalBtn = document.getElementById('closeModal');

// New DOM elements for category management and import/export
const addCategoryBtn = document.getElementById('addCategoryBtn');
const newCategoryInput = document.getElementById('newCategory');
const dashboardImportBtn = document.getElementById('dashboardImportBtn');
const dashboardExportBtn = document.getElementById('dashboardExportBtn');
const importModal = document.getElementById('importModal');
const exportModal = document.getElementById('exportModal');
const closeImportModalBtn = document.getElementById('closeImportModal');
const closeExportModalBtn = document.getElementById('closeExportModal');
const importFileInput = document.getElementById('importFile');
const importFormatSelect = document.getElementById('importFormat');
const exportFormatSelect = document.getElementById('exportFormat');
const modalImportBtn = document.getElementById('modalImportBtn');
const modalExportBtn = document.getElementById('modalExportBtn');
const cancelImportBtn = document.getElementById('cancelImportBtn');
const cancelExportBtn = document.getElementById('cancelExportBtn');

// Initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
    await loadBookmarks();
    await loadCustomCategories();
    await getCurrentTab();
    updateCurrentPageInfo();
    setupEventListeners();
    updateTagFilter();
    updateCategoryDropdowns();
    
    // If we couldn't get the current tab, try again after a short delay
    if (!currentTab) {
        setTimeout(async () => {
            await getCurrentTab();
            updateCurrentPageInfo();
        }, 500);
    }
});

// Event listeners setup
function setupEventListeners() {
    dashboardBtn.addEventListener('click', showDashboard);
    backBtn.addEventListener('click', showBookmarkForm);
    saveBookmarkBtn.addEventListener('click', saveBookmark);
    searchInput.addEventListener('input', filterBookmarks);
    sortBySelect.addEventListener('change', filterBookmarks);
    tagFilterSelect.addEventListener('change', filterBookmarks);
    categoryFilterSelect.addEventListener('change', filterBookmarks);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Refresh page information button
    const refreshPageInfoBtn = document.getElementById('refreshPageInfo');
    if (refreshPageInfoBtn) {
        refreshPageInfoBtn.addEventListener('click', async () => {
            await getCurrentTab();
            updateCurrentPageInfo();
        });
    }
    
    // Category management
    addCategoryBtn.addEventListener('click', addCustomCategory);
    newCategoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomCategory();
        }
    });
    
    // Import/Export
    dashboardImportBtn.addEventListener('click', showImportModal);
    dashboardExportBtn.addEventListener('click', showExportModal);
    closeImportModalBtn.addEventListener('click', closeImportModal);
    closeExportModalBtn.addEventListener('click', closeExportModal);
    modalImportBtn.addEventListener('click', importBookmarks);
    modalExportBtn.addEventListener('click', exportBookmarks);
    cancelImportBtn.addEventListener('click', closeImportModal);
    cancelExportBtn.addEventListener('click', closeExportModal);
    
    // Test storage button
    const testStorageBtn = document.getElementById('testStorageBtn');
    if (testStorageBtn) {
        testStorageBtn.addEventListener('click', async () => {
            const success = await testStorage();
            if (success) {
                alert('Storage test passed! Check console for details.');
            } else {
                alert('Storage test failed! Check console for details.');
            }
        });
    }
    
    // Simple test storage button
    const simpleTestBtn = document.getElementById('simpleTestBtn');
    if (simpleTestBtn) {
        simpleTestBtn.addEventListener('click', async () => {
            const success = await simpleStorageTest();
            if (success) {
                alert('Simple storage test passed! Check console for details.');
            } else {
                alert('Simple storage test failed! Check console for details.');
            }
        });
    }
    
    // Check permissions button
    const checkPermissionsBtn = document.getElementById('checkPermissionsBtn');
    if (checkPermissionsBtn) {
        checkPermissionsBtn.addEventListener('click', async () => {
            const success = await checkPermissions();
            if (success) {
                alert('All permissions check passed! Check console for details.');
            } else {
                alert('Some permissions check failed! Check console for details.');
            }
        });
    }
    
    // Reset storage button
    const resetStorageBtn = document.getElementById('resetStorageBtn');
    if (resetStorageBtn) {
        resetStorageBtn.addEventListener('click', resetStorage);
    }
    
    // Close modals when clicking outside
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) {
            closeImportModal();
        }
    });
    
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            closeExportModal();
        }
    });
}

// Get current tab information
async function getCurrentTab() {
    try {
        console.log('Attempting to get current tab...');
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('Retrieved tab:', tab);
        
        if (tab && tab.url && tab.url.startsWith('http')) {
            currentTab = tab;
            console.log('Current tab set successfully:', currentTab);
        } else {
            console.warn('Current tab is not a valid HTTP page:', tab);
            currentTab = null;
        }
    } catch (error) {
        console.error('Error getting current tab:', error);
        currentTab = null;
    }
}

// Update current page information in the form
function updateCurrentPageInfo() {
    if (!currentTab) {
        const pageTitle = document.getElementById('pageTitle');
        const pageUrl = document.getElementById('pageUrl');
        pageTitle.textContent = 'Unable to get page information';
        pageUrl.textContent = 'Please refresh the extension or navigate to a valid webpage';
        return;
    }
    
    const pageTitle = document.getElementById('pageTitle');
    const pageUrl = document.getElementById('pageUrl');
    
    pageTitle.textContent = currentTab.title || 'Untitled';
    pageUrl.textContent = currentTab.url || '';
}

// Save bookmark functionality
async function saveBookmark() {
    if (!currentTab || !currentTab.url || !currentTab.url.startsWith('http')) {
        alert('Unable to get current page information. Please make sure you are on a valid webpage and refresh the extension.');
        return;
    }

    const tags = document.getElementById('tags').value.trim();
    const category = document.getElementById('category').value;
    const notes = document.getElementById('notes').value.trim();

    const bookmark = {
        id: generateId(),
        title: currentTab.title || 'Untitled',
        url: currentTab.url,
        domain: extractDomain(currentTab.url),
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        category: category,
        notes: notes,
        dateAdded: new Date().toISOString(),
        favicon: currentTab.favIconUrl || null
    };

    // Add to bookmarks array
    bookmarks.push(bookmark);
    
    // Update tags set
    bookmark.tags.forEach(tag => allTags.add(tag));
    
    // Save to storage
    await saveBookmarksToStorage();
    
    // Clear form
    clearForm();
    
    // Show success message
    showSuccessMessage('Bookmark saved successfully!');
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Extract domain from URL
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (error) {
        return 'unknown';
    }
}

// Clear form fields
function clearForm() {
    document.getElementById('tags').value = '';
    document.getElementById('category').value = '';
    document.getElementById('notes').value = '';
}

// Show success message
function showSuccessMessage(message) {
    const saveBtn = document.getElementById('saveBookmark');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = message;
    saveBtn.style.background = '#28a745';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
}

// Load bookmarks from storage
async function loadBookmarks() {
    try {
        const result = await chrome.storage.local.get(['bookmarks', 'allTags']);
        bookmarks = result.bookmarks || [];
        allTags = new Set(result.allTags || []);
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        bookmarks = [];
        allTags = new Set();
    }
}

// Load custom categories from storage
async function loadCustomCategories() {
    try {
        const result = await chrome.storage.local.get(['customCategories']);
        if (result.customCategories && result.customCategories.length > 0) {
            customCategories = new Set(result.customCategories);
        } else {
            // Initialize with default categories if none exist
            const defaultCategories = ['work', 'personal', 'shopping', 'research', 'finance', 'entertainment', 'other'];
            customCategories = new Set(defaultCategories);
            // Save default categories to storage
            await chrome.storage.local.set({ customCategories: defaultCategories });
        }
    } catch (error) {
        console.error('Error loading custom categories:', error);
        // Fallback to default categories
        const defaultCategories = ['work', 'personal', 'shopping', 'research', 'finance', 'entertainment', 'other'];
        customCategories = new Set(defaultCategories);
    }
}

// Save bookmarks to storage
async function saveBookmarksToStorage() {
    try {
        await chrome.storage.local.set({
            bookmarks: bookmarks,
            allTags: Array.from(allTags),
            customCategories: Array.from(customCategories)
        });
    } catch (error) {
        console.error('Error saving bookmarks:', error);
    }
}

// Show dashboard
function showDashboard() {
    bookmarkForm.classList.add('hidden');
    dashboard.classList.remove('hidden');
    renderBookmarks();
}

// Show bookmark form
function showBookmarkForm() {
    dashboard.classList.add('hidden');
    bookmarkForm.classList.remove('hidden');
}

// Render bookmarks in dashboard
function renderBookmarks() {
    const filteredBookmarks = getFilteredBookmarks();
    const groupedBookmarks = groupBookmarksByDomain(filteredBookmarks);
    
    bookmarksList.innerHTML = '';
    
    if (groupedBookmarks.length === 0) {
        bookmarksList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No bookmarks found</div>';
        return;
    }
    
    groupedBookmarks.forEach(group => {
        const groupElement = createBookmarkGroup(group);
        bookmarksList.appendChild(groupElement);
    });
}

// Get filtered bookmarks based on search and filters
function getFilteredBookmarks() {
    let filtered = [...bookmarks];
    
    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(bookmark => 
            bookmark.title.toLowerCase().includes(searchTerm) ||
            bookmark.url.toLowerCase().includes(searchTerm) ||
            bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            bookmark.notes.toLowerCase().includes(searchTerm)
        );
    }
    
    // Tag filter
    const selectedTag = tagFilterSelect.value;
    if (selectedTag) {
        filtered = filtered.filter(bookmark => 
            bookmark.tags.includes(selectedTag)
        );
    }
    
    // Category filter
    const selectedCategory = categoryFilterSelect.value;
    if (selectedCategory) {
        filtered = filtered.filter(bookmark => 
            bookmark.category === selectedCategory
        );
    }
    
    // Sort
    const sortBy = sortBySelect.value;
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            case 'domain':
                return a.domain.localeCompare(b.domain);
            case 'category':
                return (a.category || '').localeCompare(b.category || '');
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
    
    return filtered;
}

// Group bookmarks by domain
function groupBookmarksByDomain(bookmarks) {
    const groups = {};
    
    bookmarks.forEach(bookmark => {
        if (!groups[bookmark.domain]) {
            groups[bookmark.domain] = {
                domain: bookmark.domain,
                bookmarks: []
            };
        }
        groups[bookmark.domain].bookmarks.push(bookmark);
    });
    
    return Object.values(groups);
}

// Create bookmark group element
function createBookmarkGroup(group) {
    const groupElement = document.createElement('div');
    groupElement.className = 'domain-group';
    
    const isSingleBookmark = group.bookmarks.length === 1;
    const firstBookmark = group.bookmarks[0];
    
    groupElement.innerHTML = `
        <div class="domain-header">
            <div class="domain-name">${group.domain}</div>
            <div class="bookmark-count">${group.bookmarks.length}</div>
        </div>
        ${isSingleBookmark ? '' : '<div class="domain-bookmarks"></div>'}
    `;
    
    if (isSingleBookmark) {
        // Single bookmark - make the whole group clickable
        groupElement.addEventListener('click', () => showBookmarkDetails(firstBookmark));
    } else {
        // Multiple bookmarks - show expandable list
        const bookmarksContainer = groupElement.querySelector('.domain-bookmarks');
        const header = groupElement.querySelector('.domain-header');
        
        header.addEventListener('click', () => {
            bookmarksContainer.classList.toggle('show');
        });
        
        group.bookmarks.forEach(bookmark => {
            const bookmarkElement = createBookmarkElement(bookmark);
            bookmarksContainer.appendChild(bookmarkElement);
        });
    }
    
    return groupElement;
}

// Create individual bookmark element
function createBookmarkElement(bookmark) {
    const element = document.createElement('div');
    element.className = 'domain-bookmark';
    
    element.innerHTML = `
        <div class="domain-bookmark-title">${bookmark.title}</div>
        <div class="domain-bookmark-url">${bookmark.url}</div>
    `;
    
    element.addEventListener('click', () => showBookmarkDetails(bookmark));
    
    return element;
}

// Show bookmark details modal
function showBookmarkDetails(bookmark) {
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = bookmark.title;
    
    modalContent.innerHTML = `
        <div class="bookmark-detail">
            <h4>URL</h4>
            <p>${bookmark.url}</p>
        </div>
        <div class="bookmark-detail">
            <h4>Category</h4>
            <p>${bookmark.category || 'None'}</p>
        </div>
        <div class="bookmark-detail">
            <h4>Tags</h4>
            <p>${bookmark.tags.length > 0 ? bookmark.tags.join(', ') : 'None'}</p>
        </div>
        <div class="bookmark-detail">
            <h4>Notes</h4>
            <p>${bookmark.notes || 'No notes'}</p>
        </div>
        <div class="bookmark-detail">
            <h4>Date Added</h4>
            <p>${new Date(bookmark.dateAdded).toLocaleDateString()}</p>
        </div>
        <div class="bookmark-actions">
            <button class="action-btn open-btn" onclick="openBookmark('${bookmark.url}')">Open</button>
            <button class="action-btn delete-btn" onclick="deleteBookmark('${bookmark.id}')">Delete</button>
        </div>
    `;
    
    bookmarkModal.classList.remove('hidden');
}

// Open bookmark in new tab
function openBookmark(url) {
    chrome.tabs.create({ url: url });
    closeModal();
}

// Delete bookmark
async function deleteBookmark(bookmarkId) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
        await saveBookmarksToStorage();
        renderBookmarks();
        closeModal();
    }
}

// Close modal
function closeModal() {
    bookmarkModal.classList.add('hidden');
}

// Filter bookmarks
function filterBookmarks() {
    renderBookmarks();
}

// Update tag filter dropdown
function updateTagFilter() {
    const tagFilter = document.getElementById('tagFilter');
    const currentValue = tagFilter.value;
    
    tagFilter.innerHTML = '<option value="">All tags</option>';
    
    Array.from(allTags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
    
    tagFilter.value = currentValue;
}

// Update category dropdowns
function updateCategoryDropdowns() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categorySelect = document.getElementById('category');
    const currentFilterValue = categoryFilter.value;
    const currentSelectValue = categorySelect.value;

    // Update filter dropdown
    categoryFilter.innerHTML = '<option value="">All categories</option>';
    Array.from(customCategories).sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    categoryFilter.value = currentFilterValue;

    // Update form dropdown
    categorySelect.innerHTML = '<option value="">Select category</option>';
    Array.from(customCategories).sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    categorySelect.value = currentSelectValue;
}

// Add custom category
async function addCustomCategory() {
    const newCategory = newCategoryInput.value.trim();
    if (newCategory && !customCategories.has(newCategory)) {
        customCategories.add(newCategory);
        // Save immediately to storage
        await saveBookmarksToStorage();
        updateCategoryDropdowns();
        newCategoryInput.value = '';
        showSuccessMessage('Category added successfully!');
    } else if (customCategories.has(newCategory)) {
        alert('Category already exists!');
    } else {
        alert('Please enter a valid category name.');
    }
}

// Show import modal
function showImportModal() {
    importModal.classList.remove('hidden');
}

// Close import modal
function closeImportModal() {
    importModal.classList.add('hidden');
}

// Show export modal
function showExportModal() {
    exportModal.classList.remove('hidden');
}

// Close export modal
function closeExportModal() {
    exportModal.classList.add('hidden');
}

// Import bookmarks
async function importBookmarks() {
    const file = importFileInput.files[0];
    if (!file) {
        alert('Please select a file to import.');
        return;
    }

    const format = importFormatSelect.value;
    let importedBookmarks = [];

    try {
        const text = await file.text();
        
        if (format === 'json' || (format === 'auto' && file.name.endsWith('.json'))) {
            importedBookmarks = JSON.parse(text);
        } else if (format === 'csv' || (format === 'auto' && file.name.endsWith('.csv'))) {
            importedBookmarks = parseCSV(text);
        } else if (format === 'html' || (format === 'auto' && file.name.endsWith('.html'))) {
            importedBookmarks = parseHTML(text);
        } else {
            alert('Unsupported import format.');
            return;
        }
    } catch (error) {
        alert('Error importing bookmarks: ' + error.message);
        return;
    }

    if (importedBookmarks && Array.isArray(importedBookmarks)) {
        const confirmed = confirm(`Are you sure you want to import ${importedBookmarks.length} bookmarks? This will overwrite existing bookmarks.`);
        if (confirmed) {
            bookmarks = importedBookmarks;
            allTags = new Set(); // Clear existing tags
            importedBookmarks.forEach(bookmark => {
                if (bookmark.tags) {
                    bookmark.tags.forEach(tag => allTags.add(tag));
                }
            });
            await saveBookmarksToStorage();
            renderBookmarks();
            alert('Bookmarks imported successfully!');
        }
    } else {
        alert('Invalid import file format or content.');
    }
    closeImportModal();
}

// Parse CSV content
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const bookmarks = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length >= 2) {
            const bookmark = {
                id: generateId(),
                title: values[0] || 'Untitled',
                url: values[1] || '',
                domain: extractDomain(values[1] || ''),
                tags: values[2] ? values[2].split(';').map(tag => tag.trim()).filter(tag => tag) : [],
                category: values[3] || '',
                notes: values[4] || '',
                dateAdded: new Date().toISOString(),
                favicon: null
            };
            bookmarks.push(bookmark);
        }
    }
    
    return bookmarks;
}

// Parse HTML content (basic bookmark export format)
function parseHTML(htmlText) {
    const bookmarks = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const links = doc.querySelectorAll('a');
    
    links.forEach(link => {
        const bookmark = {
            id: generateId(),
            title: link.textContent.trim() || 'Untitled',
            url: link.href || '',
            domain: extractDomain(link.href || ''),
            tags: [],
            category: '',
            notes: '',
            dateAdded: new Date().toISOString(),
            favicon: null
        };
        bookmarks.push(bookmark);
    });
    
    return bookmarks;
}

// Export bookmarks
async function exportBookmarks() {
    const format = exportFormatSelect.value;
    let data = '';
    let filename = '';
    let mimeType = '';

    if (format === 'json') {
        data = JSON.stringify(bookmarks, null, 2);
        filename = 'bookmarks.json';
        mimeType = 'application/json';
    } else if (format === 'csv') {
        data = generateCSV();
        filename = 'bookmarks.csv';
        mimeType = 'text/csv';
    } else if (format === 'html') {
        data = generateHTML();
        filename = 'bookmarks.html';
        mimeType = 'text/html';
    } else {
        alert('Unsupported export format.');
        return;
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeExportModal();
}

// Generate CSV content
function generateCSV() {
    const headers = ['Title', 'URL', 'Tags', 'Category', 'Notes', 'Date Added'];
    const rows = [headers.join(',')];
    
    bookmarks.forEach(bookmark => {
        const row = [
            `"${bookmark.title || ''}"`,
            `"${bookmark.url || ''}"`,
            `"${(bookmark.tags || []).join(';')}"`,
            `"${bookmark.category || ''}"`,
            `"${bookmark.notes || ''}"`,
            `"${bookmark.dateAdded || ''}"`
        ];
        rows.push(row.join(','));
    });
    
    return rows.join('\n');
}

// Generate HTML content
function generateHTML() {
    const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="0" LAST_MODIFIED="0">Bookmarks</H3>
    <DL><p>`;
    
    bookmarks.forEach(bookmark => {
        const date = new Date(bookmark.dateAdded).getTime() / 1000;
        html += `\n        <DT><A HREF="${bookmark.url}" ADD_DATE="${date}">${bookmark.title}</A>`;
    });
    
    html += `\n    </DL><p>
</DL><p>`;
    
    return html;
}

// Close modal when clicking outside
bookmarkModal.addEventListener('click', (e) => {
    if (e.target === bookmarkModal) {
        closeModal();
    }
}); 

// Simple storage test for basic functionality
async function simpleStorageTest() {
    try {
        console.log('Running simple storage test...');
        
        // Test 1: Basic get/set
        await chrome.storage.local.set({ simpleTest: 'hello' });
        const result = await chrome.storage.local.get(['simpleTest']);
        
        if (result.simpleTest === 'hello') {
            console.log('✅ Basic storage test passed');
            await chrome.storage.local.remove(['simpleTest']);
            return true;
        } else {
            console.log('❌ Basic storage test failed:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Simple storage test failed:', error);
        return false;
    }
}

// Test storage functionality
async function testStorage() {
    try {
        console.log('Testing storage functionality...');
        
        // First, test if we can access storage at all
        console.log('Testing storage access...');
        const testAccess = await chrome.storage.local.get(['test']);
        console.log('Storage access test result:', testAccess);
        
        // Test saving
        console.log('Testing data saving...');
        const testData = {
            bookmarks: [{ id: 'test', title: 'Test', url: 'https://test.com' }],
            allTags: ['test'],
            customCategories: ['test-category']
        };
        
        await chrome.storage.local.set(testData);
        console.log('Test data saved successfully');
        
        // Test loading
        console.log('Testing data loading...');
        const result = await chrome.storage.local.get(['bookmarks', 'allTags', 'customCategories']);
        console.log('Test data loaded:', result);
        
        // Verify the data was saved correctly
        if (result.bookmarks && result.allTags && result.customCategories) {
            console.log('All test data verified successfully');
        } else {
            console.warn('Some test data missing:', result);
        }
        
        // Clean up test data
        console.log('Cleaning up test data...');
        await chrome.storage.local.remove(['bookmarks', 'allTags', 'customCategories']);
        console.log('Test data cleaned up');
        
        return true;
    } catch (error) {
        console.error('Storage test failed with error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Check if it's a permissions issue
        if (error.message && error.message.includes('permission')) {
            console.error('This appears to be a permissions issue');
        }
        
        // Check if it's a storage quota issue
        if (error.message && error.message.includes('quota')) {
            console.error('This appears to be a storage quota issue');
        }
        
        return false;
    }
}

// Check extension permissions
async function checkPermissions() {
    try {
        console.log('Checking extension permissions...');
        
        // Check if we can access storage
        const storageTest = await chrome.storage.local.get(['permissionTest']);
        console.log('✅ Storage permission: OK');
        
        // Check if we can access tabs
        const tabsTest = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('✅ Tabs permission: OK');
        
        // Check if we can access bookmarks
        const bookmarksTest = await chrome.bookmarks.getTree();
        console.log('✅ Bookmarks permission: OK');
        
        return true;
    } catch (error) {
        console.error('❌ Permission check failed:', error);
        return false;
    }
}

// Reset storage to default values
async function resetStorage() {
    try {
        if (confirm('This will reset all bookmarks, tags, and custom categories to default values. Are you sure?')) {
            console.log('Resetting storage to default values...');
            
            const defaultCategories = ['work', 'personal', 'shopping', 'research', 'finance', 'entertainment', 'other'];
            const resetData = {
                bookmarks: [],
                allTags: [],
                customCategories: defaultCategories
            };
            
            await chrome.storage.local.set(resetData);
            
            // Update local variables
            bookmarks = [];
            allTags = new Set();
            customCategories = new Set(defaultCategories);
            
            // Update UI
            updateTagFilter();
            updateCategoryDropdowns();
            renderBookmarks();
            
            alert('Storage reset successfully!');
            console.log('Storage reset completed');
        }
    } catch (error) {
        console.error('Error resetting storage:', error);
        alert('Error resetting storage: ' + error.message);
    }
}

// Add test function to window for debugging
window.testStorage = testStorage;
window.simpleStorageTest = simpleStorageTest;
window.checkPermissions = checkPermissions;
window.resetStorage = resetStorage; 