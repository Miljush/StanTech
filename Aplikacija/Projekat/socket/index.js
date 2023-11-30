/*const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5173","https://api.novu.co/v1"],
  },
});

let activeUsers = [];
io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  // Slanje poruka
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    console.log(activeUsers);
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to:", receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });
  socket.on("digest-workflow-example",(data)=>{
    console.log(data);
  })
  socket.emit("milosi","kurcina");
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    //console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});*/
