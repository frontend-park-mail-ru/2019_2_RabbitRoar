import WebSocketIface from "./webSocketIface.js";
import "../css/style.scss";

const doneConnection = () => {
    console.log("In done connection handler.");
}

const replaceTwoCssClasses = (elem, classOne, classTwo) => {
    if (elem.classList.contains(classOne)) {
        elem.classList.remove(classOne);
    }
    if (!elem.classList.contains(classTwo)) {
        elem.classList.add(classTwo);
    }
};

document.getElementById("send-message").onclick = () => {
    event.preventDefault();
    let outgoingMessage = document.getElementById("user-text").value;


    const errorElement = document.getElementById("empty-message");
    if (outgoingMessage === "") {
        replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
        return;
    } else {
        replaceTwoCssClasses(errorElement, "error-visible", "error-annotation");
    }
    document.getElementById("user-text").value = "";
    const body = JSON.stringify({
        "type": "message",
        "username": "somebody",
        "text": outgoingMessage,
    });
    WebSocketIface.sentMessage(body);
};

WebSocketIface.connect();
WebSocketIface.addOpenHandler(doneConnection);

//WebSocketIface.addMessageHandler("message", createHandler);
