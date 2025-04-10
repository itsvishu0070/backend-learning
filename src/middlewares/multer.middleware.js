import multer from "multer";

// we are using disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {

    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // the lines which are given above are for giving name to files
    
    cb(null, file.originalname)
    
     
}
  })
  
 export  const upload = multer({
     storage: storage }) 