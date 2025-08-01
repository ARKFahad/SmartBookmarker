// Content script for Smart Bookmarker extension
// This script runs on web pages and can interact with the page content

console.log('Smart Bookmarker content script loaded');

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getPageInfo':
            const pageInfo = {
                title: document.title,
                url: window.location.href,
                description: getPageDescription(),
                favicon: getFavicon()
            };
            sendResponse(pageInfo);
            break;
            
        case 'extractText':
            const text = extractPageText();
            sendResponse({ text: text });
            break;
            
        default:
            sendResponse({ error: 'Unknown action' });
    }
});

// Get page description from meta tags
function getPageDescription() {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        return metaDescription.getAttribute('content');
    }
    
    // Fallback: get first paragraph text
    const firstParagraph = document.querySelector('p');
    if (firstParagraph) {
        return firstParagraph.textContent.substring(0, 200) + '...';
    }
    
    return '';
}

// Get favicon URL
function getFavicon() {
    const favicon = document.querySelector('link[rel="icon"]') || 
                   document.querySelector('link[rel="shortcut icon"]');
    
    if (favicon) {
        return favicon.href;
    }
    
    // Fallback to default favicon location
    return window.location.origin + '/favicon.ico';
}

// Extract main text content from the page
function extractPageText() {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, header, footer');
    scripts.forEach(script => script.remove());
    
    // Get text content from main content areas
    const mainContent = document.querySelector('main, article, .content, .main, #content, #main');
    if (mainContent) {
        return mainContent.textContent.trim().substring(0, 500) + '...';
    }
    
    // Fallback to body text
    return document.body.textContent.trim().substring(0, 500) + '...';
}

// Auto-detect page category based on content
function detectPageCategory() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const content = document.body.textContent.toLowerCase();
    
    // Shopping sites
    if (url.includes('amazon') || url.includes('ebay') || url.includes('etsy') || 
        url.includes('shop') || url.includes('store') || url.includes('buy')) {
        return 'shopping';
    }
    
    // Social media
    if (url.includes('facebook') || url.includes('twitter') || url.includes('instagram') || 
        url.includes('linkedin') || url.includes('youtube')) {
        return 'social';
    }
    
    // News sites
    if (url.includes('news') || url.includes('bbc') || url.includes('cnn') || 
        url.includes('reuters') || url.includes('nytimes')) {
        return 'news';
    }
    
    // Work/Professional
    if (url.includes('github') || url.includes('stackoverflow') || url.includes('linkedin') || 
        content.includes('work') || content.includes('job') || content.includes('career')) {
        return 'work';
    }
    
    // Entertainment
    if (url.includes('netflix') || url.includes('spotify') || url.includes('youtube') || 
        content.includes('movie') || content.includes('music') || content.includes('game')) {
        return 'entertainment';
    }
    
    // Finance
    if (url.includes('bank') || url.includes('finance') || url.includes('money') || 
        content.includes('investment') || content.includes('stock') || content.includes('banking')) {
        return 'finance';
    }
    
    return 'other';
}

// Auto-suggest tags based on page content
function suggestTags() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const content = document.body.textContent.toLowerCase();
    const suggestions = new Set();
    
    // URL-based suggestions
    if (url.includes('tutorial')) suggestions.add('tutorial');
    if (url.includes('guide')) suggestions.add('guide');
    if (url.includes('documentation')) suggestions.add('documentation');
    if (url.includes('api')) suggestions.add('api');
    if (url.includes('blog')) suggestions.add('blog');
    if (url.includes('article')) suggestions.add('article');
    
    // Content-based suggestions
    if (content.includes('javascript') || content.includes('js')) suggestions.add('javascript');
    if (content.includes('python')) suggestions.add('python');
    if (content.includes('react')) suggestions.add('react');
    if (content.includes('vue')) suggestions.add('vue');
    if (content.includes('angular')) suggestions.add('angular');
    if (content.includes('node')) suggestions.add('nodejs');
    if (content.includes('css')) suggestions.add('css');
    if (content.includes('html')) suggestions.add('html');
    
    // Topic-based suggestions
    if (content.includes('design') || content.includes('ui') || content.includes('ux')) suggestions.add('design');
    if (content.includes('security')) suggestions.add('security');
    if (content.includes('performance')) suggestions.add('performance');
    if (content.includes('testing')) suggestions.add('testing');
    if (content.includes('deployment')) suggestions.add('deployment');
    
    return Array.from(suggestions);
}

// Send page information to popup when requested
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageData') {
        const pageData = {
            title: document.title,
            url: window.location.href,
            description: getPageDescription(),
            favicon: getFavicon(),
            category: detectPageCategory(),
            suggestedTags: suggestTags()
        };
        sendResponse(pageData);
    }
}); 