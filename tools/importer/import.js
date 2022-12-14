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

function mapVariantsToStyles(classList, maps) {
  const styles = [];
  maps.forEach((map) => {
    if (classList.contains(map[0])) {
      styles.push(map[1]);
    }
  });
  return styles;
}

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
    // Should be auto-blocked, since it is the same on every page
    quote.remove();
  });
}

function transformProductCard(document) {
  document.querySelectorAll('.cmp-product-listing .list-card-item').forEach((card) => {
    const sku = card.querySelector('.card-item--image > a').dataset.productSku;

    const cells = [
      ['Product Card'],
      [sku],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    card.replaceWith(table);
  });
}

function transformPageList(document) {
  document.querySelectorAll('.pagelist, .page-list-sidebar').forEach((pageList) => {
    const styles = mapVariantsToStyles(pageList.classList, [['pagelist-pink', 'pink'], ['blue', 'blue'], ['multiple-related-articles-circles', 'circle'], ['page-list-with-twisted-bg', 'circle'], ['cmp-pagelist-homrpage-fr', 'max'], ['page-list-sidebar', 'sidebar'], ['pagelist-topic', 'topic'], ['pagelist-flipcard', 'flipcard']]);
    const pages = Array.from(pageList.querySelectorAll('ul.cmp-list > li')).map((li) => {
      let path = li.querySelector('a').href;
      if (path.endsWith('.html')) {
        path = path.substring(0, path.length - 5);
      }
      return path;
    });

    const cells = [
      [`Page List (${styles.join(', ')})`],
    ];

    const header = pageList.querySelector('.pagelist-header');
    if (header && header.textContent.trim() !== '') {
      // Remove filters
      header.querySelector('.select-filter')?.remove();
      cells.push([header.textContent]);
    }

    const list = document.createElement('ul');
    pages.forEach((page) => {
      const li = document.createElement('li');
      li.textContent = page;
      list.appendChild(li);
    });
    cells.push([list]);

    const table = WebImporter.DOMUtils.createTable(cells, document);
    pageList.replaceWith(table);
  });
}

function transformHomeStory(document) {
  // This is a teaser component, but easier to edit as dedicated block
  Array.from(document.querySelectorAll('.component-homestory')).map((e) => e.parentNode).filter((value, index, self) => self.indexOf(value) === index).forEach((homeStory) => {
    const style = homeStory.parentNode.classList.contains('stories-variant2') ? 'variant2' : 'variant1';
    const imageLeft = homeStory.querySelector('.circular-image-left picture');
    const imageRight = homeStory.querySelector('.circular-image-right picture');
    const content = homeStory.querySelector('.cmp-teaser__content');

    const cells = [
      [`Home Story (${style})`],
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

function transformButton(document) {
  document.querySelectorAll('.button').forEach((button) => {
    const styles = mapVariantsToStyles(button.classList, [['btn-blue', 'blue'], ['type-a', 'type A']]);
    const cells = [
      [`Button (${styles.join(', ')})`],
      [button.firstElementChild],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    button.replaceWith(table);
  });
}

function transformTextTicker(document) {
  document.querySelectorAll('.text.text-ticker').forEach((ticker) => {
    const cells = [
      ['Text Ticker'],
      [ticker.firstElementChild],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    ticker.replaceWith(table);
  });
}

function transformEmbed(document) {
  document.querySelectorAll('.embed').forEach((embed) => {
    const styles = mapVariantsToStyles(embed.classList, [['cmp-embed-video-left', 'video left'], ['cmp-embed-video-center', 'center']]);
    const content = embed.querySelector('.cmp-embed-video__content');
    const videoImg = embed.querySelector('.cmp-embed-video__image picture');
    const videoLink = embed.querySelector('.cmp-embed-video__player').getAttribute('data-src');
    const left = document.createElement('div');
    left.append(videoImg);
    left.append(videoLink);

    const cells = [
      [`Embed (${styles.join(', ')})`],
      [left, content],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    embed.replaceWith(table);
  });
}

function transformSocialShare(document) {
  document.querySelectorAll('.socialShareUL').forEach((socialShare) => {
    const title = socialShare.querySelector('.socialShareUL-heading-title').textContent;
    const platforms = Object.values(JSON.parse(socialShare.querySelector('.cmp-integration--socialsharing').dataset.cmpDataLayer))[0].socialSharingPlatforms;
    const platformList = document.createElement('ul');
    platforms.forEach((platform) => {
      const li = document.createElement('li');
      li.textContent = platform;
      platformList.appendChild(li);
    });

    const cells = [
      ['Social Share'],
      [title],
      [platformList],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    socialShare.replaceWith(table);
  });
}

function transformTags(document) {
  document.querySelectorAll('.tags').forEach((tags) => {
    const cells = [
      ['Tags'],
    ];

    if (!tags.classList.contains('tags-no-title')) {
      cells.push(tags.querySelector('.cmp-tags__heading'));
    }

    // Title only if tags-no-title
    const tagList = tags.querySelector('ul');

    // Skip empty tags
    if (!tagList) return;

    cells.push([tagList]);

    const table = WebImporter.DOMUtils.createTable(cells, document);
    tags.replaceWith(table);
  });
}

function transformTeaser(document) {
  document.querySelectorAll('.teaser').forEach((teaser) => {
    // Skip hero teaser
    if (teaser.classList.contains('cmp-teaser-top-image')) return;

    const styles = mapVariantsToStyles(teaser.classList, [['cmp-teaser-big-image-circle', 'circle'], ['cmp-teaser-top-image-circle', 'circle'], ['teaser-featured-category-v2', 'category'], ['cmp-teaser-left-image-curve', 'curve']]);
    const image = teaser.querySelector('.cmp-teaser__image picture');
    const content = teaser.querySelector('.cmp-teaser__content');

    let contentRow = image ? [content, image] : [content];
    if (teaser.classList.contains('cmp-teaser-left-image')) {
      contentRow = contentRow.reverse();
    }

    const cells = [
      [`Teaser (${styles.join(', ')})`],
      contentRow,
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    teaser.replaceWith(table);
  });
}

function transformQuickPoll(document) {
  document.querySelectorAll('.quickpoll').forEach((quickPoll) => {
    const title = quickPoll.querySelector('.cmp-question__header');
    const options = Array.from(quickPoll.querySelectorAll('.cmp-question__answer .cmp-question__answer-item')).map((item) => item.textContent);
    const optionList = document.createElement('ul');
    options.forEach((option) => {
      const li = document.createElement('li');
      li.textContent = option;
      optionList.appendChild(li);
    });

    const cells = [
      ['Quick Poll'],
      [title],
      [optionList],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    quickPoll.replaceWith(table);
  });
}

// Transform all image urls
function makeProxySrcs(document) {
  const host = 'https://www.dove.com';
  document.querySelectorAll('img').forEach((img) => {
    if (img.src.startsWith('/')) {
      // make absolute
      const cu = new URL(host);
      img.src = `${cu.origin}${img.src}`;
    }
    try {
      const u = new URL(img.src);
      u.searchParams.append('host', u.origin);
      img.src = `http://localhost:3001${u.pathname}${u.search}`;
    } catch (error) {
      console.warn(`Unable to make proxy src for ${img.src}: ${error.message}`);
    }
  });
}

function makeAbsoluteLinks(main) {
  main.querySelectorAll('a').forEach((a) => {
    if (a.href.startsWith('/')) {
      const ori = a.href;
      const u = new URL(a.href, 'https://main--dove--hlxsites.hlx.page/');

      // Remove .html extension
      if (u.pathname.endsWith('.html')) {
        u.pathname = u.pathname.slice(0, -5);
      }

      a.href = u.toString();

      if (a.textContent === ori) {
        a.textContent = a.href;
      }
    }
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
      '#onetrust-consent-sdk',
      'body > iframe', // Adobe Syncing iFrame
      '.cmp-teaser-read_more_link', // Teaser Read More Button
      '.pagelist .c-pagination', // Pagination of PageList component,
      '#_atssh', // AddThis Frame
      '.hide-desktop', // Remove everything that should not be displayed on desktop site
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
      transformButton,
      transformTextTicker,
      transformEmbed,
      transformTeaser,
      transformSocialShare,
      transformTags,
      transformQuickPoll,

      makeProxySrcs,
      makeAbsoluteLinks,
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
