let homeStoryPictureShifter;

export default async function decorate(block) {
  if (!homeStoryPictureShifter) {
    homeStoryPictureShifter = () => {
      document.querySelectorAll('.home-story .picture')
        .forEach(((picture, index) => {
          const height = window.innerHeight;
          const { top } = picture.getBoundingClientRect();
          const narrow = window.innerWidth < 768;
          let trans;
          if (narrow && index % 2) {
            trans = 1 / 12;
          } else {
            trans = narrow ? 1 / 17 : 1 / 12;
          }
          if (top > -100 < height) {
            picture.style.transform = `translateY(${top * trans}px)`;
          }
        }));
    };
    window.addEventListener('scroll', homeStoryPictureShifter);
    // 1st home-story
    block.classList.add('first');
  }
  const pictureL = block.firstElementChild.children.item(0);
  const content = block.firstElementChild.children.item(1);
  const pictureR = block.firstElementChild.children.item(2);
  if (pictureL) {
    pictureL.classList.add('picture', 'left');
  }
  if (content) {
    content.classList.add('content');
  }
  if (pictureR) {
    pictureR.classList.add('picture', 'right');
  }
  // swap right picture with content
  if (pictureR && content) {
    block.firstElementChild.insertBefore(pictureR, content);
  }
}
