const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    commentsId: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postsId: {
        type: Number,
        required: true,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Comments", commentsSchema);