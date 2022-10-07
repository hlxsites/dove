/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

function transformBreadcrumb(document) {
  document.querySelectorAll('.breadcrumb').forEach((breadcrumb) => {
    const items = breadcrumb.querySelector('ol');
    const cells = [
      ['Breadcrumb'],
      [items],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    breadcrumb.replaceWith(table);
  });
}

function transformDynamicQuote(document) {
  document.querySelectorAll('.dynamicquote').forEach((quote) => {
    const items = Array.from(quote.querySelectorAll('.cmp-dynamic-quote')).map((q) => q.textContent);
    const cells = [
      ['Dynamic Quote'],
    ];
    items.forEach((item) => cells.push([item]));
    const table = WebImporter.DOMUtils.createTable(cells, document);
    quote.replaceWith(table);
  });
}

function transformProductCard(document) {
  document.querySelectorAll('.cmp-product-listing .list-card-item').forEach((card) => {
    const cardImage = card.querySelector('.card-item--image > a');
    const content = card.querySelector('.card-item--details');

    const cells = [
      ['Product Card'],
      [cardImage, content],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    card.replaceWith(table);
  });
}

function transformPageList(document) {
  document.querySelectorAll('.pagelist').forEach((pageList) => {
    // Get all page links
    const pages = Array.from(pageList.querySelectorAll('ul > li')).map((li) => li.querySelector('a').href);
    const list = document.createElement('ul');
    pages.forEach((page) => {
      const li = document.createElement('li');
      li.textContent = page;
      list.appendChild(li);
    });

    const cells = [
      ['Page List'],
      [list],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    pageList.replaceWith(table);
  });
}

function transformHomeStory(document) {
  Array.from(document.querySelectorAll('.component-homestory')).map((e) => e.parentNode).filter((value, index, self) => self.indexOf(value) === index).forEach((homeStory) => {
    const imageLeft = homeStory.querySelector('.circular-image-left picture');
    const imageRight = homeStory.querySelector('.circular-image-right picture');
    const content = homeStory.querySelector('.cmp-teaser__content');

    const cells = [
      ['Home Story'],
      [imageLeft, content, imageRight],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    homeStory.replaceWith(table);
  });
}

function transformSeparator(document) {
  document.querySelectorAll('.separator').forEach((separator) => {
    separator.replaceWith(document.createElement('hr'));
  });
}

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    const meta = {};

    // find the <title> element
    const title = document.querySelector('title');
    if (title) {
      meta.Title = title.innerHTML.replace(/[\n\t]/gm, '').split('|')[0].trim();
    }

    // find the <meta property="og:description"> element
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      meta.Description = desc.content;
    }

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(document.body, [
      'header',
      'footer',
      'iframe', // Adobe Syncing iFrame
      '.cmp-teaser-read_more_link', // Teaser Read More Button
      '.pagelist .c-pagination', // Pagination of PageList component
    ]);

    document.body.append(WebImporter.Blocks.getMetadataBlock(document, meta));

    // Section after hero block
    document.querySelectorAll('.cmp-teaser-top-image').forEach((e) => e.append(document.createElement('hr')));

    // Convert all blocks
    [
      transformBreadcrumb,
      transformDynamicQuote,
      transformProductCard,
      transformPageList,
      transformHomeStory,
      transformSeparator,
    ].forEach((f) => f.call(null, document));

    return document.body;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''),
};
