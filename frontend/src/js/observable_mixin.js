export const ObservableMixin = {
    on(event, callback) {
        if (!this.listeners) {
            this.listeners = {};
        }
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(callback);
    },

    off(event, callback) {
        this.listeners[event] = this.listeners[event]
            .filter(function (listener) {
                return listener !== callback;
            });
    },

    emit (event, data){
        this.listeners[event].forEach(function (listener) {
            listener(data);
        });
    }
}