import express from "express";
import { editProfile, followOrUnfollow, getProfile,searchUsers, getSuggestedUsers, login, logout, register, getalluser, checkuser, readAllNotifications ,getNotifications} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/checkuser').get(checkuser);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').put(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.get("/search",isAuthenticated, searchUsers);
router.get("/allusers",isAuthenticated, getalluser);   
router.put('/read-all/notifications', isAuthenticated, readAllNotifications);
router.get('/notifications', isAuthenticated, getNotifications);
export default router;