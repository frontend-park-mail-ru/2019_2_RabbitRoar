import '../css/style.scss';
import {createMainMenu} from './main_menu/main_menu.js';

export let autorised = true;

document.cookie = "autorised=true";

createMainMenu();
