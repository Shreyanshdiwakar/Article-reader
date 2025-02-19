# Article Reader Chrome Extension

A Chrome extension that provides a clean, distraction-free reading experience by transforming article pages into a reader-friendly format.

## Features

- **Reader Mode**: Transforms cluttered web pages into clean, readable articles.
- **Archive Checker**: Checks if an article is available on Archive.org.
- **JavaScript Toggle**: Option to disable JavaScript on the page.
- **Dark Mode**: Comfortable reading experience with a dark theme.
- **Clean Interface**: Removes ads, popups, and other distracting elements.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Shreyanshdiwakar/Article-reader.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the extension directory.

## Usage

1. Click the extension icon in your Chrome toolbar.
2. Choose from the available options:
   - **Enable Reader Mode**: Reformats the page for easy reading.
   - **Check Archive.org**: Looks for an archived version of the article.
   - **Disable JavaScript**: Removes JavaScript to bypass paywalls or distractions.

## Files Structure

```
article-reader/
├── manifest.json      # Extension configuration
├── popup.html         # User interface HTML file
├── popup.js           # Handles UI interactions
├── content.js         # Processes the webpage for readability
├── readability.js     # Mozilla's Readability library for parsing articles
├── background.js      # Background scripts for managing extension actions
```

## How It Works

- **manifest.json**: Defines extension permissions and scripts.
- **popup.html & popup.js**: Manages the extension's popup UI.
- **content.js**: Injected into pages to clean up and extract content.
- **readability.js**: Uses Mozilla's Readability API to format articles.
- **background.js**: Handles background tasks, such as checking archives.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on Mozilla's Readability.js.
- Inspired by reader mode implementations in various browsers.

## Contact

Project Link: [https://github.com/Shreyanshdiwakar/Article-reader](https://github.com/Shreyanshdiwakar/Article-reader)

