document.addEventListener('DOMContentLoaded', function() {
    // Get button elements
    const readerModeBtn = document.getElementById('readerMode');
    const archiveBtn = document.getElementById('checkArchive');
    const disableJSBtn = document.getElementById('disableJS');
    const statusDiv = document.getElementById('status');

    // Reader Mode button
    readerModeBtn.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // First, inject the scripts
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['readability.js', 'content.js']
            });

            // Then send the message
            chrome.tabs.sendMessage(tab.id, { command: "reader" }, (response) => {
                if (chrome.runtime.lastError) {
                    statusDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
                    return;
                }
                statusDiv.textContent = response?.success ? 'Reader mode enabled' : 'Failed to enable reader mode';
            });
        } catch (error) {
            statusDiv.textContent = 'Error: ' + error.message;
            console.error('Error:', error);
        }
    });

    // Archive.org button
    archiveBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const url = encodeURIComponent(tabs[0].url);
            chrome.tabs.create({
                url: `https://web.archive.org/web/*/${url}`
            });
        });
    });

    // Disable JavaScript button
    disableJSBtn.addEventListener('click', async () => {
        try {
            // First, request the contentSettings permission
            const granted = await chrome.permissions.request({
                permissions: ['contentSettings']
            });
            
            if (!granted) {
                statusDiv.textContent = 'Permission denied. Cannot toggle JavaScript.';
                return;
            }

            statusDiv.textContent = 'Toggling JavaScript...';
            
            // Get the current tab
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            // Get current JavaScript setting for the tab
            const url = new URL(tab.url);
            const setting = await chrome.contentSettings.javascript.get({
                primaryUrl: url.href
            });
            
            // Toggle the setting
            const newSetting = setting.setting === 'allow' ? 'block' : 'allow';
            
            await chrome.contentSettings.javascript.set({
                primaryPattern: `*://${url.hostname}/*`,
                setting: newSetting
            });

            // Update button text and status
            disableJSBtn.textContent = newSetting === 'allow' ? 'Disable JavaScript' : 'Enable JavaScript';
            statusDiv.textContent = `JavaScript ${newSetting === 'allow' ? 'enabled' : 'disabled'} for ${url.hostname}`;
            
            // Reload the tab
            await chrome.tabs.reload(tab.id);
            
        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Listen for status updates
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'updateStatus') {
            statusDiv.textContent = message.status;
        }
    });
}); 