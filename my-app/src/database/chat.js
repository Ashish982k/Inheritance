import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [{
        text: String,
        disease: String,
        confidence: Number,
        createdAt : { type: Date, default: Date.now }
    }] 
});

const chatModel = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
export default chatModel;