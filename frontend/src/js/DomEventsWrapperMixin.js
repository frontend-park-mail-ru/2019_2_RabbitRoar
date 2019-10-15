import Bus from './event_bus.js'



export const DomEventsWrapperMixin  = {
    registerHandler(id = 'application', JsEvent = 'click', callback) {
        if (!this.events) {
            this.events = new Map;
        }
        if (!this.events.get(id)) {
            this.events.set(id, {
                _JsEvent: JsEvent,
                _handler: function (ev) {
                    ev.preventDefault();
                    callback();
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
        this.events.forEach(function (ev, id) {
            const targetElem = document.getElementById(id);
            if (targetElem) {
                targetElem.removeEventListener(ev.JsEvent, ev._handler);
            }
        });
    },

    enableAll() {
        this.events.forEach(function (ev, id) {
            const targetElem = document.getElementById(id);
            if (targetElem) {
                targetElem.addEventListener(ev._JsEvent, ev._handler);
            }
        });
    }

}