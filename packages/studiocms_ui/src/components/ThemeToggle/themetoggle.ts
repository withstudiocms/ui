import { ThemeHelper } from '../../utils/ThemeHelper.js';

const themeToggle = document.getElementById('sui-theme-toggle');
const themeHelper = new ThemeHelper();

themeHelper.registerToggle(themeToggle);
