const asynchandler = (requesthandler) =>{
    (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asynchandler}

// const asynchandler = () =>{}
// const asynchandler = (fn) =>{()=>{}} // function me ek aur function pass kr diya
// const asynchandler = (fn) =>{async()=>{}}

    // const asynchandler=(fn)=>async(req,res,next)=>{
    //     try {
    //         await fn(res,req,next)
    //     } catch (error) {
    //         res.status(error.code || 500).json({
    //             success:false,
    //             message:error.message
    //         })
            
    //     }
    // }
