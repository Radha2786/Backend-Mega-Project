import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validBeforeSave: false })

        return { accessToken, refreshToken }
    } catch {
        throw new ApiError(500, "something went wrong while generating access and refreshtoken");
    }

}

const registerUser = asyncHandler(async (req, res, next) => {

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const { fullName, email, username, password } = req.body;
    console.log("email: ", email);
    if (
        [fullName, email, username, password].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // checking if email is valid or not 
    if (email.match(validRegex) == null) {
        console.log("matching email");
        throw new ApiError(400, "Invalid email");
    }
    // we have to check both whether email exist or username exist
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    console.log("printing req.files", req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath);
    // same we can do for cover image but if we are not passing cover image then it will be undefined (cloudinary will give us undefined)

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log(coverImageLocalPath)

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    console.log(avatar, coverImage)

    if (!avatar) {
        console.log("enter above inside if")
        return new ApiError(400, "avatar file is required");
    }

    console.log("enter above")

    try {
        console.log("enter in try blocl")
        const user = await User.create({
            username: username.toLowerCase(),
            email,
            fullName,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || ""
        })
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if (!createdUser) {
            throw new ApiError(500, "something went wrong while registering the user")
        }
        console.log("********", user);
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )
    } catch (error) {
        console.log("error creating user", error.message);
    }
    // checking if user is successfully created or not

    console.log("created user", createdUser);


})

const loginUser = asyncHandler(async (req, res) => {

    //data--> req body
    // username or email
    // find the user
    // password check
    // generate access and refresh token
    // send cookie 
    const { username, email, password } = req.body;

    if (!username || !email) {
        throw new ApiError("username or email is required");
    }
    const user = User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    // check password is crct or not 
    // isPassword correct ek custom method hai to ye user k paas available hoga

    const isPasswordvalid = await user.isPasswordCorrect(password)
    if (!isPasswordvalid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const Options={
        httpOnly: true,
        secure: true
    }
    // means cookie ko koi bhi modify nahi kar skta frontend m ab ye sirf server side se hi modify hoga 

    return res.status(200).cookie("accessToken", accessToken,Options).cookie("refreshToken", refreshToken, Options).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser , accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})


const logoutUser = asyncHandler( async(req,res)=>{
// ab logout hone k liye humare paas user ka access hona chahiye..hence we are creating middleware
// 1. user k andar ka refresh token undefined krna hoga
// 2. cookies m se remove krna hoga
await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken : undefined
        }
    },
        {
            new: true
        }
)

const Options = {
    httpOnly: true,
    secure:true
}
return res.status(200).clearCookie("accessToken", Options).clearCookie("refreshToken", Options).json(new ApiResponse(200, {}, "User Logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}