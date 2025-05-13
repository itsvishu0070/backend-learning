import { Router } from "express";
import { loginuser ,
     registeruser ,
     logoutuser,
     refreshaccesstoken,
     changecurrentpassword, 
     getcurrentuser, 
     updateaccountdetails, 
     updateavatar,
     updatecoverimage,
     get_user_channel_profile,
     get_watch_history } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";


import {upload} from "../middlewares/multer.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },
        {
            name:"coverimage",
            maxcount:1
        }

    ]),
    registeruser)

router.route("/login").post(loginuser)   

//secured routes
router.route("/logout").post(verifyjwt , logoutuser)
router.route("/refresh-token").post(refreshaccesstoken)
router.route("/change-password").post(verifyjwt , changecurrentpassword)
router.route("/current-user").get(verifyjwt,getcurrentuser)
router.route("/update-account").patch(verifyjwt,updateaccountdetails)
router.route("/avatar").patch(verifyjwt,upload.single("avatar"),updateavatar)
router.route("/cover-image").patch(verifyjwt,upload.single("coverimage"),updatecoverimage)
router.route("/c/:username").get(verifyjwt,get_user_channel_profile)
router.route("/history").get(verifyjwt,get_watch_history)

export default router 