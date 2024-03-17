// const asyncHandler = (requestHandler)=>{
//     return (req,res,next) =>{
//         Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
//     }
// }

// export {asyncHandler}

// another method is also there of try and catch

const asyncHandler = (fn)=> async(req,res,next)=>{
try{
 await fn(req,res,next)
} catch{
    res.status(err.code || 500).json({
        success:false,
        message: err.message
    })
}
}

