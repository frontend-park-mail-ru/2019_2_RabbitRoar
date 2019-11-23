import "../css/style.scss";
import WebSocketIface from "./webSocketIface.js";

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

// const drawMessage = (objMessage) => {
//     const username = objMessage.user;
//     const text = objMessage.text;

//     console.log(username + ": " + text);

//     let messageElem = document.createElement("div");
//     messageElem.className += " " + "message-in-chat";
//     messageElem.textContent = username + ": " + text;
//     document.getElementById("messages").appendChild(messageElem);
// };

const processMessage = (event) => {
    const objMessage = JSON.parse(event.data);
    this.drawMessage(objMessage);
    console.log(objMessage);
}


// document.getElementById("user-text").addEventListener("keyup", function (event) {
//     if (event.keyCode === 13) {
//         event.preventDefault();
//         document.getElementById("send-message").click();
//     }
// });


document.getElementById("send-message").onclick = () => {
    event.preventDefault();
    let outgoingMessage = document.getElementById("user-text").value;
    const errorElement = document.getElementById("empty-message");
    console.log(outgoingMessage);
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

    // let messageElem = document.createElement("div");
    // messageElem.className += " " + "message-in-chat";
    // messageElem.textContent = "Anon" + ": " + outgoingMessage;
    // document.getElementById("messages").appendChild(messageElem);

    WebSocketIface.sentMessage(body);
};

document.getElementById("user-text").focus();
WebSocketIface.connect();
WebSocketIface.addOpenHandler(doneConnection);
WebSocketIface.addMessageHandler("message", processMessage);

//WebSocketIface.addMessageHandler("message", createHandler);
