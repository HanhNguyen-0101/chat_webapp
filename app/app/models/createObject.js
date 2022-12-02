const moment = require('moment');
const gravatar = require('gravatar');

const createMessage = (user, msg) => {
    return {
        ...user,
        msg,
        date: moment().format('DD MMM yyyy hh:mm a')
    }
}

const createLocation = (roomObj, location) => {
    return {
        ...roomObj,
        location,
        date: moment().format('DD MMM yyyy hh:mm a')
    }
}

const createUser = (roomObj) => {
    return {
        id: roomObj.id,
        room: roomObj.room,
        nickname: roomObj.nickname,
        avatar: `https://i.pravatar.cc/150?u=${roomObj.nickname}`
    }
}

module.exports = {
    createMessage,
    createLocation,
    createUser
}