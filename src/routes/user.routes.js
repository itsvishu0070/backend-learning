import { Router } from "express";
import { loginuser , registeruser , logoutuser, refreshaccesstoken } from "../controllers/user.controller.js";
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

export default router 