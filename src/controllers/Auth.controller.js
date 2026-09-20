import User from "../models/User.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/**
 * @name="/api/auth/register"
 * @description="this is the function for register the User"
 * @access="public"
 */

const Register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(422, "Please fill all the fields");
  }
  if (username.length < 3) {
    throw new ApiError(
      422,
      "Please fill proper username length. It should at least 3 characters long  "
    );
  }
  if (email.length < 6) {
    throw new ApiError(
      422,
      "Please check the length of of email.It should be always more than 6 charctors"
    );
  }
  if (password.length < 8) {
    throw new ApiError(422, "Password must be 8 characters long");
  }
  const isExisted = await User.findOne({ email });
  if (isExisted) {
    throw new ApiError(409, "This email is already exist");
  }

  const create = await User.create({
    username,
    email,
    password,
  });

  const accessToken = await create.generateAccessToken();
  const refreshToken = await create.generateRefreshToken();

  create.refreshToken = refreshToken;

  await create.save({ validateBeforeSave: false });

  const unselectPassword = await User.findById(create._id).select(
    "-password -refreshToken"
  );
  if (!create) {
    throw new ApiError(500, "Internel server error");
  }
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3600000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res.status(201).json(
    new ApiResponse(201, "User has registered", {
      user: unselectPassword,
      accessToken,
    })
  );
});

/**
 * @name="/api/auth/login"
 * @description="this is the function use for login process"
 * @access="public"
 */

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(422, "Please fill all the fields ");
  }
  if (email.length < 6) {
    throw new ApiError(
      422,
      "Please check the length of of email.It should be always more than 6 charctors"
    );
  }
  if (password.length < 8) {
    throw new ApiError(422, "Password must be 8 characters long");
  }
  const isExists = await User.findOne({ email }).select("+password");
  if (!isExists) {
    throw new ApiError(409, "Please first create account");
  }
  const comparePassword = await isExists.passwordCompare(password);
  if (!comparePassword) {
    throw new ApiError(401, "Invalid Email or password ");
  }

  const accessToken = await isExists.generateAccessToken();
  const refreshToken = await isExists.generateRefreshToken();
  isExists.refreshToken = refreshToken;
  if (!isExists) {
    throw new ApiError(500, "Internel server error");
  }
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3600000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "User is login successfully"));
});

export default { Register, Login };
