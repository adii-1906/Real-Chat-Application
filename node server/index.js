const io = require("socket.io")(8080, {
    cors: { origin: "*" }, // Allow all origins for development
});

const users = {}; // Store users by socket ID

io.on("connection", socket => {
    // New user joins
    socket.on("new-user-joined", username => {
        if (!username) username = "Anonymous"; // Fallback for empty names
        // console.log("New User Joined:", username);
        users[socket.id] = username;
        socket.broadcast.emit("user-joined", username); // Broadcast to others
    });

    // Send messages
    socket.on("send", message => {
        if (message.trim()) {
            socket.broadcast.emit("receive", {
                message: message,
                username: users[socket.id] || "Unknown",
            });
        }
    });

    // User disconnects
    socket.on("disconnect", () => {
        const username = users[socket.id];
        if (username) {
            socket.broadcast.emit("user-left", username); // Notify others
            delete users[socket.id]; // Remove user
        }
    });
});
