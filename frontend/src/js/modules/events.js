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

export const SERVICE_WORKER_CMD = "swCmd";


export const CHANGE_TAB = "changeTab";

export const REGISTRATION = "registration";

export const QUESTION_CHANGE = "questionChange";

export const ROOM_CHANGE = "roomChange";

export const OFFLINE_GAME_END = "offlineGameEnd";

export const WEBSOCKET_CONNECTION = "websocketConnection";
export const WEBSOCKET_CLOSE = "websocketClose";

export const QUESTION_PANEL_UPDATE = "questPanelUpdate";
export const USERS_PANEL_UPDATE = "usersPanelUpdate";
export const QUESTION_WAS_CHOSEN = "questionWasChosen";
export const CRASH_EVENT = "crashEvent";

export const TIMER_STOPPED = "timerStopped";
export const TIMER_INTERRUPTION = "timerInterruption";

export const FORM_CHANGED = "formChanged";

export const PACK_FOR_EDIT_WAS_CHOSEN = "packEditing";