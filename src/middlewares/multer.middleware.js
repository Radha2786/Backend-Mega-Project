import multer from "multer";

// here we are using disk storage (not memory storage kyuki agr files badi hui to memory jyada bharegi consumption jyada hoga which is bad)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("printing file---",file);
      cb(null, "./public/temp")// saari files public folder k andar rakhenge
    },
    // koi error nahi hai that's why first parameter is null
    filename: function (req, file, cb) {

      cb(null, file.originalname) // hum original name se save kra rhe hain
    }
  })
  
  export const upload = multer({ 
    storage, 
  })