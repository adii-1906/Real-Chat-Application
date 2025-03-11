const socket = io("http://localhost:8080"); // Connect to server

// Get HTML elements
const form = document.getElementById("send-container");
const msgInp = document.getElementById("msginp");
const msgCon = document.querySelector(".container");
const messageSound = new Audio("ting.mp3");

// Append messages to the container
const append = (message, position) => {
    const msgElement = document.createElement("div");
    msgElement.innerText = message;
    msgElement.classList.add("message");
    msgElement.classList.add(position); // Correctly add position (left or right)
    msgCon.append(msgElement);
    if (position === "left") {
        messageSound.play();
    }
};

// Prompt for user name and notify server
const username = prompt("Enter your name to join") || "Anonymous"; // Default to Anonymous
socket.emit("new-user-joined", username);

// Listen for "user-joined" event
socket.on("user-joined", name => {
    append(`${name} joined the chat`, "right"); // Display joined message
});

// Form submission to send messages
form.addEventListener("submit", e => {
    e.preventDefault(); // Prevent form reload
    const message = msgInp.value.trim(); // Prevent sending empty messages
    if (message) {
        append(`You: ${message}`, "right");
        socket.emit("send", message); // Emit message to server
        msgInp.value = ""; // Clear input field
    }
});

// Listen for incoming messages
socket.on("receive", data => {
    append(`${data.username}: ${data.message}`, "left");
});

// Add a listener for users leaving (optional enhancement)
socket.on("user-left", name => {
    append(`${name} left the chat`, "right");
});
