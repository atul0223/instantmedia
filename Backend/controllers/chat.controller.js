import mongoose from "mongoose";
import Chat from "../modles/chat.model.js";
import User from "../modles/user.model.js";
import Message from "../modles/message.model.js";
import cloudinayUpload from "../utils/cloudinary.js";
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
      }
      ,
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
          
          
          pic:1,
          "users._id": 1,
          "users.username": 1,
          "users.email": 1,
          "users.profilePic": 1,
          "groupAdmin._id": 1,
          "groupAdmin.username": 1,
          "groupAdmin.email": 1,
          "groupAdmin.profilePic": 1,
          "latestMessage.chat": 1,
          "latestMessage.content": 1,
          "latestMessage.sender.username": 1,
          "latestMessage.sender.profilePic": 1,
          "latestMessage.sender._id": 1,
        },
      },
    ]);
    const result =chats.reduce((acc, item, index) => {
  acc[index] = item;
  return acc;
}, {});
    return res.status(200).json(result)
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
const createGroupChat = async (req, res) => {
  try {

    const pic = req.files?.groupPic?.[0]?.path;
    const users = JSON.parse(req.body.users); // ✅ parse array

    if (!users || !req.body.name) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    if (users.length < 2) {
      return res.status(400).send("More than 2 users are required to form a group chat");
    }

    const groupPic = await cloudinayUpload(pic);
    users.push(req.user._id); // ✅ add current user

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
      pic: groupPic?.secure_url || "",
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "username profilePic")
      .populate("groupAdmin", "username _id");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Group creation error:", error);
    res.status(400).send({ message: error.message });
  }
};
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
    const deleteGroupChat = async (req, res) => {
      const { chatId } = req.body;
      const user = req.user;

      try {
        const chat = await Chat.findById(chatId);
        if(chat.chatName==="sender"){
               return res.status(401).json({ message: "Not a GroupChat" });
        }
        if (!chatId) {
          return res.status(402).json({ message: "fields required !!" });
        }

        if (!(user._id.toString() === chat.groupAdmin.toString())) {
          return res.status(401).json({ message: "not authorized for action" });
        }

        await Chat.deleteOne({ _id: chatId });
        return res.status(200).json({ message: "Group chat deleted successfully" });
      } catch (error) {
        return res.status(500).json(error);
      }
    };
   
    const changeGroupPic = async(req,res)=>{
      const { chatId } = req.body;
      const user = req.user;
      const pic = req.files?.groupPic?.[0]?.path;

      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          return res.status(404).json({ message: "Chat not found" });
        }

        if (!(user._id.toString() == chat.groupAdmin.toString())) {
          return res.status(401).json({ message: "not authorized for action" });
        }

        const groupPic = await cloudinayUpload(pic);

        chat.pic = groupPic.secure_url || "";
        await chat.save({ validateBeforeSave: false });

        return res.status(200).json({ message: "Group picture updated successfully" ,pic:groupPic.secure_url});
      } catch (error) {
        return res.status(500).json(error);
      }
    }
const exitGroup = async (req, res) => {
  const { chatId } = req.body;
  const user = req.user;

  if (!chatId) {
    return res.status(400).json({ message: "Please provide chatId" });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  if (!chat.users.includes(user._id)) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Remove user from group
  chat.users.pull(user._id);

  // If the exiting user is the group admin, reassign admin to another member
  if (String(user._id) === String(chat.groupAdmin)) {
    if (chat.users.length > 0) {
      chat.groupAdmin = chat.users[0]; // Assign to first remaining user
    } else {
      chat.groupAdmin = null; // No users left
    }
  }

  await chat.save({ validateBeforeSave: true });

  return res.status(200).json({ message: "Exited group successfully", chat });
};
export { fetchChats, accessChat ,createGroupChat ,renameGroup,removeFromGroup ,addToGroup, deleteGroupChat  ,changeGroupPic ,exitGroup};
