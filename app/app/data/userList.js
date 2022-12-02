const { createUser } = require("../models/createObject");

const userList = [];

const addUser = (user) => {
    (userList || []).push(createUser(user));
}

const removeUser = (id) => {
    const index = (userList || []).findIndex(i => i.id === id);
    if (index !== -1) {
        userList.splice(index, 1);
    }
}

const getUserListByRoom = (room) => {
    return userList.filter(i => i.room === room);
}

module.exports = {
    addUser,
    getUserListByRoom,
    removeUser
};