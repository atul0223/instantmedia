//check if the chat belongs to same person;
import Message from "../modles/message.model.js"
import User from "../modles/user.model.js";
import Chat from "../modles/chat.model.js";
import mongoose from "mongoose";

const getMessages =async(req,res)=>{
    const {chatId} =req.params;
  
    
    if (!chatId) {
         return res.status(400).json({message:"please provide chatId "})
    }
      try {
    const messages = await Message.find({ chat: new mongoose.Types.ObjectId(chatId ) })
      .populate("sender", "username profilePic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}
const sendMessage =async(req,res)=>{

    const {chatId ,content} =req.body;
    if (!chatId || !content) {
        return res.status(400).json({message:"please provide chatId or content"})
    }
var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  
    let message = await Message.create(newMessage);
message = await message.populate([
  { path: "sender", select: "username profilePic" },
  { path: "chat" },
]);
message = await User.populate(message, {
  path: "chat.users",
  select: "username profilePic email",
});

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  
}

export {getMessages,sendMessage}