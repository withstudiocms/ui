const bars = document.querySelectorAll<HTMLDivElement>('.sui-progress');

for (const bar of bars) {
  const value = bar.dataset.value;
  const max = bar.dataset.max;

  const progress = bar.firstElementChild as HTMLElement;

  if (value && max) {
    const percent = Math.round((parseInt(value, 10) / parseInt(max, 10)) * 100);
    progress.style.width = `${percent}%`;
  }
}
