document.addEventListener('DOMContentLoaded', function() {
    const readerModeBtn = document.getElementById('readerMode');
    const archiveBtn = document.getElementById('checkArchive');
    const disableJSBtn = document.getElementById('disableJS');
    const statusDiv = document.getElementById('status');

    readerModeBtn.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['readability.js', 'content.js']
            });

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

    archiveBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const url = encodeURIComponent(tabs[0].url);
            chrome.tabs.create({
                url: `https://web.archive.org/web/*/${url}`
            });
        });
    });

    disableJSBtn.addEventListener('click', async () => {
        try {
            statusDiv.textContent = 'Toggling JavaScript...';
            
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            const url = new URL(tab.url);
            const setting = await chrome.contentSettings.javascript.get({
                primaryUrl: url.href
            });
            
            const newSetting = setting.setting === 'allow' ? 'block' : 'allow';
            
            await chrome.contentSettings.javascript.set({
                primaryPattern: `*://${url.hostname}/*`,
                setting: newSetting
            });

            disableJSBtn.textContent = newSetting === 'allow' ? 'Disable JavaScript' : 'Enable JavaScript';
            statusDiv.textContent = `JavaScript ${newSetting === 'allow' ? 'enabled' : 'disabled'} for ${url.hostname}`;
            
            await chrome.tabs.reload(tab.id);
            
        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = `Error: ${error.message}`;
        }
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'updateStatus') {
            statusDiv.textContent = message.status;
        }
    });
});