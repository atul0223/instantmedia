import Router from "express";
import verifyUser from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { fetchChats ,accessChat ,createGroupChat,renameGroup,removeFromGroup ,addToGroup, deleteGroupChat, exitGroup, changeGroupPic} from "../controllers/chat.controller.js";
import { getMessages ,sendMessage} from "../controllers/message.controller.js";
const router = Router();

 router.route("/").get(verifyUser,fetchChats)
 router.route("/accessChat").post(verifyUser,accessChat);
 router.route("/creategroup").post(verifyUser,upload.fields([
    {
      name: "groupPic",
      maxCount: 1,
    },
  ]),createGroupChat)
 router.route("/renameGroup").put(verifyUser,renameGroup)
 router.route("/removefromgroup").put(verifyUser,removeFromGroup)
 router.route("/addtogroup").put(verifyUser,addToGroup)
 router.route("/:chatId/getMessages").get(verifyUser,getMessages)
 router.route("/sendmessage").post(verifyUser,sendMessage)
router.route("/exitgroup").put(verifyUser,exitGroup)
router.route("/changegrouppic").put(verifyUser,upload.fields([
    {
      name: "groupPic",
      maxCount: 1,
    },
  ]),changeGroupPic)
  router.route
 router.route("/deletegroup").put(verifyUser,deleteGroupChat)
export default router