
const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

// Define MongoDB schema for message
const messageSchema = new Schema ({
    sender: String,
    content: String,
    Timestamp : {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model("Message", messageSchema)

module.exports = Message
// Path: model/message.js