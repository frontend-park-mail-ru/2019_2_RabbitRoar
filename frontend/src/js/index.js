import '../css/style.scss';
import {createMainMenu} from './main_menu/main_menu.js';

alert("restart");
export let autorised = true;

document.cookie = "autorised=true";

createMainMenu();
