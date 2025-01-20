class ProgressHelper {
  private bar: HTMLDivElement;
  private progress: HTMLElement;

  private value: number;
  private max: number;

  constructor(id: string) {
    this.bar = document.getElementById(id) as HTMLDivElement;
    this.progress = this.bar.firstElementChild as HTMLElement;

    this.value = this.getValue();
    this.max = this.getMax();
  }

  getValue() {
    return parseInt(this.bar.dataset.value as string, 10);
  }

  setValue(value: number) {
    const max = parseInt(this.bar.dataset.max as string, 10);
    const percent = Math.round((value / max) * 100);
    this.progress.style.width = `${percent}%`;
  }

  getMax() {
    return parseInt(this.bar.dataset.max as string, 10);
  }

  setMax(value: number) {
    this.bar.dataset.max = value.toString();
  }

  getPercentage() {
    return Math.round((this.value / this.max) * 100);
  }
}

export { ProgressHelper };
