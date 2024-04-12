import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        lowercase:true,
        trim:true,
        index:true // for searching
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true, 
        index:true
    },
    avatar:{
        type:String,  // cloudinary url
        required:true, 
    },
    coverImage:{
        type: String, // cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true, 'Password is required'],
    },
    refreshToken:{
        type:String
    }


}, {timestamps:true});

// bcrypt is used to hash password 
userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password, 10) // 10 is round here
        next();
    }
    return next();
   
})
// phla argument pre hook m ki kispar kaam karana hai and second call back(we are not using arrow function bcz arrow fn m this ka access ni hota)

// checking provided password is valid or not 
// .methods ek object hota hai to hum .methods par . karke apne khudke custom methods bna skte hain 
userSchema.methods.isPasswordCorrect = async function(password){
    return bcrypt.compare(password,this.password)
}

// jwt is a bearer token (means jo bhi usko bear karega hum usko shi maan lenge
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User", userSchema);

