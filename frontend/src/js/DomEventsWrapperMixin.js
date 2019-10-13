import Bus from './event_bus.js'

// registerEventsChain это цепочка preparer -> listener in Fasade -> callback
// userEvent - пользовательское событие из файла events.js на которое подписан метод фасада
// preparer - собирает информацию из элемента для передачи в фасад
// callback - функция элемента, которая вызовется из фасада после действий с моделью
// callback должен кидать event-ы слушателям в глобальную шину


export const DomEventsWrapperMixin  = {
    registerEventsChain(id = 'application', JsEvent = 'click', userEvent, callback, preparer = null) {
        if (!this.events) {
            this.events = new Map;
        }
        if (!this.events.get(id)) {
            this.events.set(id, {
                _JsEvent: JsEvent,
                _handler: function (ev) {
                    ev.preventDefault();
                    const data = {};
                    if (preparer) {
                        data.fromElem = preparer();
                    }
                    data.callback = callback;
                    Bus.emit(userEvent, data); }
            });
        }
    },

// registerCallback случай, когда действие пользователя не меняет модель(тоже что и предыдущая, но без фасада)
// callback должен кидать event-ы слушателям в глобальную шину

    registerCallback(id = 'application', JsEvent = 'click', callback) {
        if (!this.events) {
            this.events = new Map;
        }
        if (!this.events.get(id)) {
            this.events.set(id, {
                _JsEvent: JsEvent,
                _handler: function (ev) {
                    ev.preventDefault();
                    callback(); }
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
                console.log(targetElem);
                targetElem.addEventListener(ev._JsEvent, ev._handler);
            }
        });
    }

}