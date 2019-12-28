import "../css/style.scss";
import WebSocketIface from "./webSocketIface.js";

const tryRestart = (event) => {
    if (!event.wasClean) {
        setTimeout(WebSocketIface.connect(), 2000);
    }
}

const processEnter = (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("send-message").click();
    }
}

const input = document.getElementById("user-text");
input.addEventListener("keyup", processEnter);


document.getElementById("send-message").onclick = (event) => {
    event.preventDefault();
    let outgoingMessage = document.getElementById("user-text").value;
    if (outgoingMessage === "") {
        return;
    }
    document.getElementById("user-text").value = "";
    const body = JSON.stringify({
        "type": "message",
        "user": "Anon",
        "text": outgoingMessage,
    });
    WebSocketIface.sentMessage(body);
};

function updateScroll() {
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}

setInterval(updateScroll, 1000);

document.getElementById("user-text").focus();
WebSocketIface.connect();
WebSocketIface.addCloseHandler(tryRestart);
window.scrollTo(0, document.body.scrollHeight);
