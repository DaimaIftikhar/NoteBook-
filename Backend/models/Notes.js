const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Define as ObjectId
        ref: "User", // Reference to User model (if applicable)
        required: true,
    },
}, { timestamps: true });

const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;
