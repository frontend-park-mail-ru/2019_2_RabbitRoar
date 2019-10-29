const globalRouterEvent = "goTo";

// Router
export const ROUTER_EVENT = {
    ROUTE_TO: globalRouterEvent,
    SESSION_END: "listenUnAutorise",
};


// NavbarE
export const NAVBAR_EVENT = {
    CLICK_EXIT: "clickExit",
    CLICK_PROFILE: "clickProfile",
    CLICK_MAIN_MENU: "clickMainMenu",
    GET_AUTORISE: "getAutorise",
    ROUTE_TO: globalRouterEvent,
};

// AutorisationE
export const AUTORISATION_EVENT = {
    USER_LOGIN: "userLogin",
    ROUTE_TO: globalRouterEvent,
};

// ProfileE
export const PROFILE_UPDATE = "profileUpdate";

export const PACK_WORKER_MESSAGE = "packWorker";
export const PACK_WORKER_COMMAND = "packWorkerCmd";

export const SERVISE_WORKER_MESSAGE = "swMessage";


export const CHANGE_TAB = "changeTab";

export const REGISTRATION = "registration";

export const QUESTION_CHANGE = "questionChange";

export const QUESTION_PANEL_UPDATE = "questPanelUpdate";

export const TIME_LINE_UPDATE = "timeLineUpdate";