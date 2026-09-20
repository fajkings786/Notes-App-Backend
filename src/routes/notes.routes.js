import express from "express";
import NotesController from "../controllers/Notes.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const NotesRouter = express.Router();

/**
 * @name="/api/notes/create"
 */
NotesRouter.post("/create", authenticate, NotesController.CreateNote);

/**
 * @name="/api/notes/all"
 */

NotesRouter.get("/all", authenticate, NotesController.ReadNote);

/**
 * @name="/api/notes/edit/:note"
 */

NotesRouter.put("/edit/:note",authenticate,NotesController.EditNote);

/**
 * @name="/api/notes/delete/:note"
 */

NotesRouter.delete("/delete/:note",authenticate,NotesController.DeleteNote)

export default NotesRouter;
