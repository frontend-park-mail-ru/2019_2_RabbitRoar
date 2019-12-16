import "../css/style.scss";
import WebSocketIface from "./webSocketIface.js";


const replaceTwoCssClasses = (elem, classOne, classTwo) => {
    if (elem.classList.contains(classOne)) {
        elem.classList.remove(classOne);
    }
    if (!elem.classList.contains(classTwo)) {
        elem.classList.add(classTwo);
    }
};

const tryRestart = (event) => {
    if (!event.wasClean) {
        setTimeout(WebSocketIface.connect(), 2000);
    }
}

document.getElementById("send-message").onclick = () => {
    event.preventDefault();
    let outgoingMessage = document.getElementById("user-text").value;
    const errorElement = document.getElementById("empty-message");
    if (outgoingMessage === "") {
        replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
        return;
    }
    replaceTwoCssClasses(errorElement, "error-visible", "error-annotation");
    document.getElementById("user-text").value = "";
    const body = JSON.stringify({
        "type": "message",
        "user": "Anon",
        "text": outgoingMessage,
    });
    WebSocketIface.sentMessage(body);
};

document.getElementById("user-text").focus();
WebSocketIface.connect();
WebSocketIface.addCloseHandler(tryRestart);
