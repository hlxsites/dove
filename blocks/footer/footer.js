import { decorateIcons, readBlockConfig } from '../../scripts/scripts.js';

function decorateScrollToTop(footer) {
  const scrollToTop = footer.querySelector('div:nth-child(1) div:nth-child(5) p:nth-child(2)');
  if (!scrollToTop) {
    return;
  }
  scrollToTop.addEventListener('click', () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
  // When the user scrolls down 20px from the top of the document, show the button
  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTop.style.display = 'block';
    } else {
      scrollToTop.style.display = 'none';
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const language = window.location.pathname.split('/')[1];
  const footerPathDefault = language.length > 0 ? `/${language}/footer` : '/footer';
  const footerPath = cfg.footer || footerPathDefault;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  footer.querySelectorAll('li a').forEach((a) => {
    if (a.href && a.href.length > 8 && !a.href.includes(window.document.location.host)) {
      a.setAttribute('target', '_blank');
      if (!a.querySelector('picture')) {
        a.innerHTML += '<span class="icon icon-external-link"></span>';
      }
    }
  });

  decorateScrollToTop(footer);
  await decorateIcons(footer);
  block.append(footer);
}
