const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const Filter = require("bad-words");
const {
  createMessage,
  createLocation,
  createUser,
} = require("./models/createObject");
const {getUserListByRoom, addUser, removeUser} = require("./data/userList");

const PORT = 3000;
const filter = new Filter();

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("../app/views/dashboard");
});
app.get("/join-room", (req, res) => {
  res.render("../app/views/room");
});

io.on("connection", (socket) => {
  socket.on("sendRoom", (roomObj) => {
    socket.join(roomObj.room);

    // Welcome
    socket.emit("welcome", `Welcome ${roomObj.nickname} to ${roomObj.room} room!!`);
    socket.broadcast.to(roomObj.room).emit("welcomeEveryone", `Hi everyone, welcome a new friend, ${roomObj.nickname} to ${roomObj.room} room!!`);
  
    // Users
    addUser({...roomObj, id: socket.id});
    io.to(roomObj.room).emit("receivedUserList", getUserListByRoom(roomObj.room));

    // Message
    socket.on("sendMSG", (msg, callback) => {
      if (filter.isProfane(msg)) {
        return callback(`${msg} không hợp lệ vì có lời không phù hợp`);
      }
      socket.emit("receivedMSG", createMessage(createUser(roomObj), msg));
      socket.broadcast.to(roomObj.room).emit("receivedMSGEveryone", createMessage(createUser(roomObj), msg));
    });
  
    // Location
    socket.on("sendLocation", (location) => {
      socket.emit("receivedLocation", createLocation(
        createUser(roomObj),
        `https://www.google.com/maps/?q=${location.latitude},${location.longitude}`
      ));
      socket.broadcast.to(roomObj.room).emit(
        "receivedLocationEveryOne",
        createLocation(
          createUser(roomObj),
          `https://www.google.com/maps/?q=${location.latitude},${location.longitude}`
        )
      );
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected");
      removeUser(socket.id);
      io.to(roomObj.room).emit("receivedUserListUpdate", getUserListByRoom(roomObj.room), `${roomObj.nickname} just left the ${roomObj.room} room.`);
    });
  });
});

server.listen(process.env.PORT || PORT, () => {
  console.log(
    `Server is working on http://localhost:${process.env.PORT || PORT}`
  );
});
