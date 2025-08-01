// Global variables
let currentTab = null;
let bookmarks = [];
let allTags = new Set();

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

// Initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
    await loadBookmarks();
    await getCurrentTab();
    updateCurrentPageInfo();
    setupEventListeners();
    updateTagFilter();
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
}

// Get current tab information
async function getCurrentTab() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tab;
    } catch (error) {
        console.error('Error getting current tab:', error);
    }
}

// Update current page information in the form
function updateCurrentPageInfo() {
    if (!currentTab) return;
    
    const pageTitle = document.getElementById('pageTitle');
    const pageUrl = document.getElementById('pageUrl');
    
    pageTitle.textContent = currentTab.title || 'Untitled';
    pageUrl.textContent = currentTab.url || '';
}

// Save bookmark functionality
async function saveBookmark() {
    if (!currentTab) {
        alert('Unable to get current page information');
        return;
    }

    const tags = document.getElementById('tags').value.trim();
    const category = document.getElementById('category').value;
    const notes = document.getElementById('notes').value.trim();

    const bookmark = {
        id: generateId(),
        title: currentTab.title,
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

// Save bookmarks to storage
async function saveBookmarksToStorage() {
    try {
        await chrome.storage.local.set({
            bookmarks: bookmarks,
            allTags: Array.from(allTags)
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

// Close modal when clicking outside
bookmarkModal.addEventListener('click', (e) => {
    if (e.target === bookmarkModal) {
        closeModal();
    }
}); 