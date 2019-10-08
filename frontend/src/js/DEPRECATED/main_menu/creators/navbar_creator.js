import Navbar from '../../../templates/main_menu/navbar.pug';
import {getCookie} from "../../cookie/cookie.js";


export function NavbarCreator() {
    const userId = getCookie("id");
    return Navbar({
        userId
    });
}