let tabSettings = new Map();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkArchive') {
        handleArchiveCheck(message.url);
    }
    return true;
});

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

chrome.tabs.onRemoved.addListener((tabId) => {
    tabSettings.delete(tabId);
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('Paywall extension installed successfully');
});