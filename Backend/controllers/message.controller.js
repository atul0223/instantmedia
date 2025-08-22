//check if the chat belongs to same person;
import Message from "../modles/message.model.js"
const getMessages =async(req,res)=>{
    const {chatId} =req.params;
    if (!chatId) {
         return res.status(400).json({message:"please provide chatId "})
    }
      try {
    const messages = await Message.find({ chat: chatId })
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

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

export {getMessages,sendMessage}