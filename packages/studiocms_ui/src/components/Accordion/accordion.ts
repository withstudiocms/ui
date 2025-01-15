const accordions = document.querySelectorAll<HTMLDivElement>('.sui-accordion');

for (const accordion of accordions) {
  const items = accordion.querySelectorAll<HTMLDivElement>('.sui-accordion-item');

  for (const item of items) {
    const content = accordion.querySelector<HTMLDivElement>('.sui-accordion-details');
    if (!content) continue;
    const contentBoundingBox = content.getBoundingClientRect();

    if (content.classList.contains('initial')) {
      content.classList.remove('initial');
      content.classList.add('active');
    }

    item.addEventListener('click', () => {
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        content.style.maxHeight = `${contentBoundingBox.height}px`;
      } else {
        content.style.maxHeight = `0`;
      } 
    });
  }
}