document.addEventListener("DOMContentLoaded", function () {

    const chatButton = document.getElementById("chat-button");
    const chatPopup = document.getElementById("chat-popup");
    const closeChat = document.getElementById("close-chat");

    if (!chatButton) {
        console.error("Chat button not found");
        return;
    }

    if (!chatPopup) {
        console.error("Chat popup not found");
        return;
    }

    chatButton.addEventListener("click", function () {
        if (chatPopup.style.display === "block") {
            chatPopup.style.display = "none";
        } else {
            chatPopup.style.display = "block";
        }
    });

    if (closeChat) {
        closeChat.addEventListener("click", function () {
            chatPopup.style.display = "none";
        });
    }

});