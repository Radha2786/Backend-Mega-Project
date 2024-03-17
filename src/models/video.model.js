import mongoose ,{Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile:{
        type:String, // cloudinary url
        required:true
    },
    thumbnail:{
        type:String, // cloudinary url
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        required:true 
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
},{
    timestamps:true
})

videoSchema.plugin(mongooseAggregatePaginate)  // plugin krna padta hai taaki aggregation query use kar sake

export default Video = mongoose.model("Video", videoSchema)