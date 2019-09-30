import {NavbarCreator} from '../main_menu/creators/navbar_creator.js'
import Profile from '../../templates/profile/profile.pug';

import {setNavbarListeners} from '../main_menu/events/navbar_click.js';
import {setProfileListeners} from './profile_click.js';

import {getCookie} from "../cookie/cookie.js";
import {ajax} from '../requests/ajax.js';


export function createProfile() {
    application.innerHTML = '';
    application.innerHTML += NavbarCreator();

    const id = getCookie("id");
    ajax(
        'GET',
        'http://localhost:3000/user',
        {id},
        function (status, response) {
            if (status === 200) {
                const profile = JSON.parse(response);
                application.innerHTML += Profile({
                    profile
                });
                setProfileListeners();
                setNavbarListeners();
            } else {
                const {error} = JSON.parse(response);
                alert(error);
            }
        }
    );

}