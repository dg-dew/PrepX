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

});/* ============================================================
   ECHO CHATBOT WIDGET — BEHAVIOR
   Link this at the bottom of dashboard.html (before </body>):
   <script src="chatbot-widget.js"></script>
   ============================================================ */

(function () {
  const CHATBOT_URL = "https://echo-chatbot-psi.vercel.app/";

  document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("echo-chat-toggle");
    const closeBtn = document.getElementById("echo-chat-close");
    const panel = document.getElementById("echo-chat-panel");
    const loadingDiv = document.getElementById("echo-chat-loading");

    if (!toggleBtn || !panel) return; // widget HTML not found on this page

    let iframeLoaded = false;

    function openChat() {
      panel.classList.add("open");
      if (!iframeLoaded) {
        const iframe = document.createElement("iframe");
        iframe.id = "echo-chat-iframe";
        iframe.src = CHATBOT_URL;
        iframe.title = "Echo Chatbot";
        iframe.allow = "clipboard-write";
        loadingDiv.replaceWith(iframe);
        iframeLoaded = true;
      }
    }

    function closeChat() {
      panel.classList.remove("open");
    }

    toggleBtn.addEventListener("click", () => {
      if (panel.classList.contains("open")) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeBtn.addEventListener("click", closeChat);
  });
})();