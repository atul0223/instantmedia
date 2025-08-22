import mongoose from "mongoose";
import Chat from "../modles/chat.model.js";
import User from "../modles/user.model.js";
const fetchChats = async (req, res) => {
  const user = req.user;
  
  try {
    const chats = await Chat.aggregate([
      {
        $match: {
          users: { $elemMatch: { $eq: user._id } },
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "groupAdmin",
          foreignField: "_id",
          as: "groupAdmin",
        },
      },
      {
        $unwind: {
          path: "$groupAdmin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "latestMessage",
          foreignField: "_id",
          as: "latestMessage",
        },
      },
      {
        $unwind: {
          path: "$latestMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.sender",
          foreignField: "_id",
          as: "latestMessage.sender",
        },
      },
      {
        $unwind: {
          path: "$latestMessage.sender",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          chatName:1,
          "users._id": 1,
          "users.username": 1,
          "users.email": 1,
          "users.profilePic": 1,
          "groupAdmin._id": 1,
          "groupAdmin.username": 1,
          "groupAdmin.email": 1,
          "groupAdmin.profilePic": 1,
          latestMessage: 1,
        },
      },
    ]);
    return res.status(200).json({chats:chats})
  } catch (error) {
  
  
    return res.status(500).json({message:"internal server error",error })
    
  }
};
const accessChat = async (req, res) => {
  const { userId1 } = req.body;

  const userId = new mongoose.Types.ObjectId(userId1);
  if (!userId1) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate(
      "users",
      "-passwordSchema -profilePrivate -blockedUsers -verificationEmailToken -otp -trustDevice -trustedDevices -refreshToken -isVerified"
    )
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-passwordSchema -profilePrivate -blockedUsers -verificationEmailToken -otp -trustDevice -trustedDevices -refreshToken -isVerified"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};
const createGroupChat =async(req,res)=>{
    if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
      const {users} = req.body
    if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);
     try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "username email fullName profilePic")
      .populate("groupAdmin", "username");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
    }
    const renameGroup = async(req,res)=>{
       try {
         const {chatId ,newName} =req.body;
         const user =req.user;
         const chat =await Chat.findById(chatId)
         if (!newName ||!chatId) {
           return res.status(402).json({message:"fields required !!"})
         }
      
         
         if (!(user._id.toString() ==chat.groupAdmin.toString())) {
           return res.status(401).json({messsage:"not authorized for action"})
         }
         chat.chatName=newName;
         await chat.save({validateBeforeSave:false})
         return res.status(200).json({message:"Successfuly updated name"})
       } catch (error) {
         return res.status(500).json(error)
       }
    }
    const removeFromGroup =async(req,res)=>{
      const {chatId ,userId} =req.body;
        const user =req.user;
       try {
         const chat =await Chat.findById(chatId)
         if (!userId ||!chatId) {
           return res.status(402).json({message:"fields required !!"})
         }
      
         
         if (!(user._id.toString() ==chat.groupAdmin.toString())) {
           return res.status(401).json({messsage:"not authorized for action"})
         }
        await Chat.updateOne({ _id: chatId }, { $pull: { users: userId } });
         return res.status(200).json({message:"removed user"})
       } catch (error) {
        return res.status(500).json(error)
       }
    }
    const addToGroup =async(req,res)=>{
      const {chatId ,userId} =req.body;
        const user =req.user;
        const userObjectId = new mongoose.Types.ObjectId(userId);

       try {
         const chat =await Chat.findById(chatId)
         if (!userId ||!chatId) {
           return res.status(402).json({message:"fields required !!"})
         }
      
         
         if (!(user._id.toString() ==chat.groupAdmin.toString())) {
           return res.status(401).json({messsage:"not authorized for action"})
         }
       const result = await Chat.updateOne(
  { _id: chatId },
  { $addToSet: { users: userObjectId } }
);

if (result.modifiedCount === 0) {
  return res.status(400).json({ message: "User not added. Possibly already in group or invalid ID." });
}

         return res.status(200).json({message:"added user"})
       } catch (error) {
        return res.status(500).json(error)
       }
    }
export { fetchChats, accessChat ,createGroupChat ,renameGroup,removeFromGroup ,addToGroup};
