// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);

    if (request.command === "reader") {
        try {
            // Create a new document
            const documentClone = document.cloneNode(true);
            const reader = new Readability(documentClone);
            const article = reader.parse();

            if (article) {
                document.body.innerHTML = `
                    <style>
                        body {
                            font-family: system-ui, -apple-system, sans-serif;
                            line-height: 1.6;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            background: #1a1a1a;
                            color: #e0e0e0;
                        }
                        img { max-width: 100%; height: auto; }
                        h1, h2, h3 { color: #fff; }
                        a { color: #66b3ff; }
                        blockquote {
                            border-left: 3px solid #404040;
                            margin: 1.5em 0;
                            padding-left: 1em;
                            font-style: italic;
                        }
                    </style>
                    <h1>${article.title}</h1>
                    ${article.byline ? `<p><em>${article.byline}</em></p>` : ''}
                    ${article.content}
                `;
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: 'Could not parse article' });
            }
        } catch (error) {
            console.error('Reader mode error:', error);
            sendResponse({ success: false, error: error.message });
        }
        return true; // Keep the message channel open
    }
});

console.log('Content script loaded'); 