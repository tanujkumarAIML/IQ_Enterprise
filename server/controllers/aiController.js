"use strict";
const { generateText, chatWithAI } = require("../services/geminiService");
const Chat = require("../models/Chat");

exports.aiQuery = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt required." });
    const response = await generateText(prompt);
    res.json({ success: true, response });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.chatWithAssistant = async (req, res) => {
  try {
    const { message, chatId, type = "general" } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message required." });

    let chat;
    if (chatId) chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, type, title: message.slice(0, 50), messages: [] });
    }

    const response = await chatWithAI(message, chat.messages, type);
    const finalResponse =
    typeof response === "string"
    ? response
    : JSON.stringify(response, null, 2);

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({
      role: "assistant",
      content: finalResponse,
    });

    if (chat.messages.length > 100) chat.messages = chat.messages.slice(-100);
    await chat.save();

    res.json({
      success: true,
      response: finalResponse,
      chatId: chat._id,
    });

  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id, isActive: true })
      .sort({ updatedAt: -1 }).limit(20).select("title type updatedAt messages");
    res.json({ success: true, chats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });
    res.json({ success: true, chat });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: "Chat deleted." });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
