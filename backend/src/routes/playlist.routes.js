import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { addProblemToPlaylist, createPlayList, deletePlayList, getPlayAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";

const playlistRouter = express.Router();

playlistRouter.get("/:playlistId" , authMiddleware , getPlayListDetails)
playlistRouter.post("/create-playlist" ,authMiddleware ,  createPlayList)
playlistRouter.get("/" , authMiddleware , getPlayAllListDetails)
playlistRouter.post('/:playlistId/add-problem' , authMiddleware , addProblemToPlaylist)
playlistRouter.delete("/:playlistId" , authMiddleware , deletePlayList)
playlistRouter.delete("/:playlistId/remove-problem" , authMiddleware , removeProblemFromPlaylist)

export default playlistRouter;