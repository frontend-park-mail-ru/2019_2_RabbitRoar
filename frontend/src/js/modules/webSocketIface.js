
class WebSocketIface {
    constructor() {
    }

    connect() {
        this.socket = new WebSocket("wss://svoyak.fun/game/ws");

        this.socket.onopen = function (e) {
            console.log("[open] Соединение установлено");
        };

        this.socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                console.log(`[close] Соединение прервано, код=${event.code} причина=${event.reason}`);
            }
        };

        this.socket.onerror = function (error) {
            console.log(`[error] ${error}`);
            console.log(error);
        };


        this.socket.onmessage = function (event) {
            if (this.handlersMap) {
                for (const [type, handler] of this.handlersMap) {
                    if (event.data.type === type) {
                        handler(event.data.value);
                    }
                }
            }
        };
    }


    disconnect() {
        this.socket.close(1000, "Бан");
    }


    addHandler(type, handler) {
        if (!this.handlersMap) {
            this.handlersMap = new Map;
        }

        this.handlersMap.set(type, handler);
    }

    clearHandlers() {
        this.handlersMap.clear();
    }
}

export default new WebSocketIface();