/*
 * Copyright (c) 2010 Arc90 Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Readability(doc, options) {
    if (!doc || !doc.documentElement) {
        throw new Error("First argument to Readability constructor should be a document object.");
    }
    
    this._doc = doc;
    
    this.parse = function() {
        // Get the main content
        let article = this._getArticleContent();
        
        // Get the title
        let title = this._getArticleTitle();
        
        return {
            title: title,
            content: article.innerHTML,
            textContent: article.textContent,
            length: article.textContent.length,
            excerpt: this._getExcerpt(article),
            byline: this._getByline()
        };
    };
    
    this._getArticleContent = function() {
        // Create container for article
        let article = this._doc.createElement('div');
        
        // Try to find main content containers first
        let mainContent = this._doc.querySelector('main, [role="main"], article, .article, .post, .content');
        if (mainContent) {
            article.innerHTML = mainContent.innerHTML;
            return this._cleanupContent(article);
        }
        
        // If no main content found, look for article-like content
        let possibleContent = this._doc.querySelectorAll('p, .post-content, article, [itemprop="articleBody"]');
        for (let element of possibleContent) {
            if (element.textContent.length > 150) { // Arbitrary length to filter out short snippets
                article.appendChild(element.cloneNode(true));
            }
        }
        
        return this._cleanupContent(article);
    };
    
    this._getArticleTitle = function() {
        // Try to find the article title
        let titleElement = this._doc.querySelector('h1, .article-title, .post-title');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        return this._doc.title || '';
    };
    
    this._getByline = function() {
        // Try to find author information
        let bylineElement = this._doc.querySelector('.byline, .author, [rel="author"]');
        return bylineElement ? bylineElement.textContent.trim() : '';
    };
    
    this._getExcerpt = function(article) {
        let firstParagraph = article.querySelector('p');
        return firstParagraph ? firstParagraph.textContent.trim() : '';
    };
    
    this._cleanupContent = function(container) {
        // Remove unwanted elements
        let unwanted = container.querySelectorAll(
            'script, style, link, nav, header, footer, .ad, .advertisement, .social-share, .comments'
        );
        unwanted.forEach(elem => elem.remove());
        
        // Clean up remaining content
        let elements = container.getElementsByTagName('*');
        for (let element of elements) {
            // Remove empty elements
            if (!element.textContent.trim() && !element.querySelector('img')) {
                element.remove();
                continue;
            }
            
            // Remove most attributes except for essential ones
            let attributes = element.attributes;
            for (let i = attributes.length - 1; i >= 0; i--) {
                let attr = attributes[i];
                if (!['src', 'href', 'alt'].includes(attr.name)) {
                    element.removeAttribute(attr.name);
                }
            }
        }
        
        return container;
    };
}

if (typeof module === 'object') {
    module.exports = Readability;
} 