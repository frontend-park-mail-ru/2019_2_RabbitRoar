const globalRouterEvent = 'goTo';

// Router
export const ROUTER_EVENT = {
    ROUTE_TO: globalRouterEvent,
    SESSION_END: 'listenUnAutorise',
}


// NavbarE
export const NAVBAR_EVENT = {
CLICK_EXIT: 'clickExit',
CLICK_PROFILE: 'clickProfile',
CLICK_MAIN_MENU: 'clickMainMenu',
GET_AUTORISE: 'getAutorise',
ROUTE_TO: globalRouterEvent,
}

// AutorisationE
export const AUTORISATION_EVENT = {
USER_LOGIN: 'userLogin',
ROUTE_TO: globalRouterEvent,
}


export const USER_VALIDATE = {
    LOGIN_OK: 'userValidateLogin',
    EXIT_OK: 'userValidateExit',
}