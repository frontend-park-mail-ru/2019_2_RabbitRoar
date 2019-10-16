import Bus from './event_bus.js'



export const DomEventsWrapperMixin = {
    registerHandler(id = 'application', JsEvent = 'click', callback) {
        if (!this.events) {
            this.events = new Map;
        }
        if (!this.events.get(id)) {
            this.events.set(id, {
                _JsEvent: JsEvent,
                _handler: function (ev) {
                    ev.preventDefault();
                    callback(ev);
                }
            });
        }
    },

    registerClassHandler(cssClass = 'application', JsEvent = 'click', callback) {
        if (!this.classEvents) {
            this.classEvents = new Map;
        }
        if (!this.classEvents.get(cssClass)) {
            this.classEvents.set(cssClass, {
                _JsEvent: JsEvent,
                _handler: function (ev) {
                    ev.preventDefault();
                    callback(ev);
                }
            });
        }
    },


    deleteAll() {
        this.events.clear();
    },

    delete(id) {
        this.events.delete(id);
    },

    disableAll() {
        if (this.events !== undefined) {
            this.events.forEach(function (ev, id) {
                const targetElem = document.getElementById(id);
                if (targetElem) {
                    targetElem.removeEventListener(ev.JsEvent, ev._handler);
                }
            });
        }

        if (this.classEvents !== undefined) {
            this.classEvents.forEach(function (ev, cssClass) {
                const targetElems = document.querySelectorAll(cssClass);
                if (targetElems) {
                    targetElems.forEach(function (elem) {
                        elem.removeEventListener(ev._JsEvent, ev._handler);
                    });
                }
            });
        }
    },

    enableAll() {
        if (this.events !== undefined) {
            this.events.forEach(function (ev, id) {
                const targetElem = document.getElementById(id);
                if (targetElem) {
                    targetElem.addEventListener(ev._JsEvent, ev._handler);
                }
            });
        }

        if (this.classEvents !== undefined) {
            this.classEvents.forEach(function (ev, cssClass) {
                const targetElems = document.querySelectorAll(cssClass);
                if (targetElems) {
                    targetElems.forEach(function (elem) {
                        elem.addEventListener(ev._JsEvent, ev._handler);
                    });
                }
            });
        }
    }

}