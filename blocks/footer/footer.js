import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

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
  await decorateIcons(footer);
  block.append(footer);
}
