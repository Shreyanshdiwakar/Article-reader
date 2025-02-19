// Store tab settings
let tabSettings = new Map();

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkArchive') {
        handleArchiveCheck(message.url);
    }
    return true;
});

// Handle Archive.org check
async function handleArchiveCheck(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            chrome.tabs.create({ url });
        }
    } catch (error) {
        console.error('Error checking archive:', error);
    }
}

// Clean up tab settings when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    tabSettings.delete(tabId);
});

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Paywall extension installed successfully');
}); 