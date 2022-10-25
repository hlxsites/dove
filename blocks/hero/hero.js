/**
 * Decorates the hero, collapses hidden text and registers "view more" handle
 * @param {Element} block The hero block element
 */

export default async function decorate(block) {
  const heroMore = block.querySelector('div.hero-more');
  if (heroMore) {
    heroMore.classList.add('hidden');
    const heroButton = block.querySelector('button.read-more');
    heroButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (heroMore.classList.contains('hidden')) {
        heroMore.classList.remove('hidden');
        heroButton.textContent = heroButton.dataset.less;
      } else {
        heroMore.classList.add('hidden');
        heroButton.textContent = heroButton.dataset.more;
      }
    });
  }
}
