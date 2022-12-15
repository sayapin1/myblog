const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postsId: {
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
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", postSchema);