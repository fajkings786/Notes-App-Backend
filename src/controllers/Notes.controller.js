import Notes from "../models/Notes.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @name="/api/notes/create"
 * @description="this is the function which is use to create the notes"
 * @access="public"
 */

const CreateNote = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  if (!title || !content) {
    throw new ApiError(422, "Please fill all the fields");
  }

  const userId = req.user._id;
  const note = await Notes.create({
    user: userId,
    title,
    content,
    status,
    isPinned: status === "processing" ? true : false,
  });
  if (!note) {
    throw new ApiError(500, "Internel server error");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "The note has created successfully", note));
});

/**
 * @name="/api/notes/all"
 * @description="this is the function use for reading purpose"
 * @access="public"
 */

const ReadNote = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const findNote = await Notes.find({ user: userId });
  if (!findNote || findNote.length === 0) {
    throw new ApiError(404, "The Note not found please first create");
  }
  return res.status(200).json(new ApiResponse(200, findNote));
});

/**
 * @name="/api/notes/edit/:note"
 * @description="this is the function use for editing the notes"
 * @access="public"
 */

const EditNote = asyncHandler(async (req, res) => {
  const note = req.params.note;
  const findNote = await Notes.findOne({ _id: note });
  const userId = req.user._id;
  if (!findNote) {
    throw new ApiError(404, "The Note is not found");
  }
  if (findNote.user.toString() != userId) {
    throw new ApiError(403, "this is not your note please edit your note ");
  }
  const update = await Notes.findByIdAndUpdate(
    findNote._id,
    {
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      isPinned: req.body.status === "processing" ? true : false,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!update) {
    throw new ApiError(500, "Internal server error please contact us");
  }
  return res.status(200).json(new ApiResponse(200, "User has updated", update));
});

/**
 * @name="/api/notes/delete/:note"
 * @description="this is the function used for delete the note"
 * @access="public"
 */

const DeleteNote = asyncHandler(async (req, res) => {
  const note = req.params.note;
  const findNote = await Notes.findOne({ _id: note });
  if (!findNote) {
    throw new ApiError(404, "The Note is not found");
  }
  const userId = req.user._id;
  if (findNote.user.toString() != userId) {
    throw new ApiError(403, "this is not your note please delete your note ");
  }
  const del = await Notes.findByIdAndDelete(findNote._id);
  if (!del) {
    throw new ApiError(500, "Internal error please contact our support team");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "The Note has deleted successfully"));
});

export default { CreateNote, ReadNote, EditNote, DeleteNote };
