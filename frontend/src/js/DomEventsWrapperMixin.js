import Bus from "./event_bus.js";



export const DomEventsWrapperMixin = {
    registerHandler(id = "application", JsEvent = "click", callback) {
        if (!this.events) {
            this.events = new Map();
        }

        let idHandlers;

        if (!this.events.get(id)) {
            idHandlers = new Map();
        } else {
            idHandlers = this.classEvents.get(id);
        }

        idHandlers.set(JsEvent, function (ev) {
            ev.preventDefault();
            callback(ev);
        });
        this.events.set(id, idHandlers);
    },

    registerClassHandler(cssClass = "application", JsEvent = "click", callback) {
        if (!this.classEvents) {
            this.classEvents = new Map();
        }

        let idHandlers;

        if (!this.classEvents.get(cssClass)) {
            idHandlers = new Map();
        } else {
            idHandlers = this.classEvents.get(cssClass);
        }

        idHandlers.set(JsEvent, function (ev) {
            ev.preventDefault();
            callback(ev);
        });
        this.classEvents.set(cssClass, idHandlers);
    },


    deleteAll() {
        this.events.clear();
    },

    delete(id) {
        this.events.delete(id);
    },

    disableAll() {
        if (this.events !== undefined) {
            this.events.forEach(function (idHandler, id) {
                idHandler.forEach(function (handler, ev) {
                    const targetElem = document.getElementById(id);
                    if (targetElem) {
                        targetElem.removeEventListener(ev, handler);
                    }
                });
            });
        }


        if (this.classEvents !== undefined) {
            this.classEvents.forEach(function (idHandler, cssClass) {
                idHandler.forEach(function (handler, ev) {
                    const targetElems = document.querySelectorAll(cssClass);
                    if (targetElems) {
                        targetElems.forEach(function (elem) {
                            elem.removeEventListener(ev, handler);
                        });
                    }
                });
            });
        }

    },

    enableAll() {
        if (this.events !== undefined) {
            this.events.forEach(function (idHandler, id) {
                idHandler.forEach(function (handler, ev) {
                    const targetElem = document.getElementById(id);
                    if (targetElem) {
                        targetElem.addEventListener(ev, handler);
                    }
                });
            });
        }

        if (this.classEvents !== undefined) {
            this.classEvents.forEach(function (idHandler, cssClass) {
                idHandler.forEach(function (handler, ev) {
                    const targetElems = document.querySelectorAll(cssClass);
                    if (targetElems) {
                        targetElems.forEach(function (elem) {
                            elem.addEventListener(ev, handler);
                        });
                    }
                });
            });
        }
    }

};