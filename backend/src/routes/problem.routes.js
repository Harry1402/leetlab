import express from 'express';
import { authMiddleware, checkAdmin } from '../middlewares/auth.middlewares.js';
import {createProblem,getAllProblems,getAllProblemsSolvedByUser,getProblemsById,updateProblem,deleteProblem} from '../controllers/problem.controllers.js'
const problemRoutes =express.Router();

problemRoutes.post("/create-problem",authMiddleware,checkAdmin,createProblem)
problemRoutes.get("/get-all-problems",authMiddleware,getAllProblems)
problemRoutes.post("/get-all-problems/:id",authMiddleware,getProblemsById)
problemRoutes.put("/update-problem/:id",authMiddleware,checkAdmin,updateProblem)
problemRoutes.delete("/delete-problem/:id",authMiddleware,checkAdmin,deleteProblem)
problemRoutes.put("/get-solved-problems",authMiddleware,getAllProblemsSolvedByUser)

export default problemRoutes;