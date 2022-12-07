import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

// function collapseAllNavSections(sections) {
//   sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
//     section.setAttribute('aria-expanded', 'false');
//   });
// }

/**
 * collapses all open sibling
 *
 * @param {Element} element current element
 */

function collapseAllSiblings(element) {
  for (let i = 0; i < element.parentElement.children.length; i += 1) {
    const child = element.parentElement.children[i];
    child.setAttribute('aria-expanded', 'false');
  }
}

function collapseAllChildren(element) {
  for (let i = 0; i < element.children.length; i += 1) {
    const child = element.children[i];
    child.setAttribute('aria-expanded', 'false');
    collapseAllChildren(child);
  }
}

function addSearchForm(searchDialog) {
  const searchContents = document.createElement('div');
  searchDialog.append(searchContents);
  searchContents.classList.add('search-contents');
  searchContents.innerHTML = `<form>
            <div class="search-dialog-body">            
                <label>Bonjour, que recherchez-vous?</label>
                <button class="search-mag"></button>
                <input placeholder="Tapez quelque chose ici">                
                <button class="clear-search"></button>
                <button class="search">Recherche</button>
            </div>
        </form>`;
  const searchInput = searchContents.querySelector('.search-dialog-body input');
  searchContents.querySelector('.clear-search')
    .addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      searchContents.querySelector('.clear-search')
        .setAttribute('style', '');
    });
  searchContents.querySelector('.search-mag')
    .addEventListener('click', () => {
      searchInput.focus();
    });
  searchInput.addEventListener('keyup', () => {
    if (searchInput.value.length > 0) {
      searchContents.querySelector('.clear-search')
        .setAttribute('style', 'visibility: visible');
    } else {
      searchContents.querySelector('.clear-search')
        .setAttribute('style', '');
    }
  });
}

function closeNavigationDropdown(navSections) {
  navSections.querySelectorAll('li[aria-expanded="true"]').forEach((elem) => {
    elem.setAttribute('aria-expanded', 'false');
    collapseAllChildren(navSections);
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const language = window.location.pathname.split('/')[1];
  const navPathDefault = language.length > 0 ? `/${language}/nav` : '/nav';
  const navPath = cfg.nav || navPathDefault;
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][1];
    if (navSections) {
      const closeB = document.createElement('button');
      closeB.classList.add('close-menu');
      const closeSpan = document.createElement('span');
      closeB.addEventListener('click', () => {
        if (window.getComputedStyle(closeSpan).display === 'none') {
          closeNavigationDropdown(navSections);
        } else {
          let currentLi = '';
          let len = 0;

          navSections.querySelectorAll('li[aria-expanded="true"]').forEach((elem) => {
            let l = 0;
            let par = elem;
            while (par && par !== navSections) {
              par = par.parentElement;
              l += 1;
            }
            if (l > len) {
              currentLi = elem;
              len = l;
            }
          });
          if (currentLi) {
            currentLi.setAttribute('aria-expanded', 'false');
          }
        }
      });
      closeSpan.append(document.createTextNode('Retour'));
      closeB.append(closeSpan);
      navSections.append(closeB);
      navSections.querySelectorAll(':scope ul').forEach((elem) => {
        elem.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      navSections.querySelectorAll('ul > li').forEach((liElement) => {
        if (liElement.querySelector('ul')) liElement.classList.add('nav-drop');
        liElement.addEventListener('click', (e) => {
          e.stopPropagation();
          const expanded = liElement.getAttribute('aria-expanded') === 'true';
          // collapseAllNavSections(navSections);
          collapseAllSiblings(liElement);
          collapseAllChildren(liElement);
          liElement.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
      const firstUl = navSections.querySelector('ul li:nth-child(1) ul');
      const searchLi = document.createElement('li');
      searchLi.classList.add('nav-drop');
      firstUl.prepend(searchLi);
      addSearchForm(searchLi);
      searchLi.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
    const searchDialog = document.createElement('div');
    searchDialog.classList.add('search-dialog');
    searchDialog.classList.add('search-dialog-hidden');
    const navTools = [...nav.children][2];
    navTools.append(searchDialog);
    navTools.querySelector('p').addEventListener('click', () => {
      closeNavigationDropdown(navSections);
      searchDialog.classList.remove('search-dialog-hidden');
    });
    searchDialog.innerHTML = `
        <div class="search-dialog-header">
            <button class="close-search"></button>
        </div>`;
    searchDialog.querySelector('.close-search').addEventListener('click', () => {
      searchDialog.classList.add('search-dialog-hidden');
    });
    addSearchForm(searchDialog);

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div><span>Menu</span>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (!expanded) {
        collapseAllChildren(navSections);
      }
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    decorateIcons(nav);
    block.append(nav);
  }
}
