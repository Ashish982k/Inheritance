import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant']
        },
        content: String,
        text: String,
        disease: String,
        confidence: Number,
        predictions: [{
            disease: String,
            confidence: Number
        }],
        precautions: mongoose.Schema.Types.Mixed,
        historyReport: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now }
    }]
});

const chatModel = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
export default chatModel;