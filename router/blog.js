const {Router} = require('express');
const Blog = require('../model/blog')
const multer = require('multer')
const path = require('path')
const Comment = require('../model/comment');
const multerS3 = require('multer-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} = require('@aws-sdk/client-s3');

const s3client = new S3Client({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY,
        secretAccessKey:process.env.ACCESS_SECRET
    }
})

const BUCKET_NAME = process.env.BUCKET_NAME; 

const router = Router();

const storage = multerS3({
    s3: s3client,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, `uploads/${fileName}`);
    } 
});

const upload = multer({storage : storage})

router.get('/addblog' ,  async (req  , res) => {
    
    return res.render('addblog' , {
        user : req.user 
    })
})


router.route('/:id')
    .get(async (req, res) => {

        const blog = await Blog.findById(req.params.id).populate("createby");
        const comment = await Comment.find({ blogid: req.params.id }).populate("createby")
        console.log(blog);
        
        return res.render('userblog', {
            user: req.user,
            blog,
            comment,
  
        })
    }).delete(async(req , res) => {
        const { id } = req.params;
        console.log(id);
        
        const blog = await Blog.findById(id); 
        console.log(blog);
        
        if(!blog){
            return res.status(404).send("Blog not found")
        } 
 
        await Blog.deleteOne({_id:id})

        return res.status(200).send("blog deleted")
    }) 

router.post('/addblog' , upload.single("coverphoto") ,async (req  , res) => {
    
    console.log(req.body);
    const { title , body  } = req.body
    console.log('processing addblog');
    if (!req.file) {
        return res.status(400).send("Cover photo is required");
    }

    const coverPhotoUrl = req.file.location; 
    
    const blog = await Blog.create({title , body , createby:req.user._id ,coverphoto:coverPhotoUrl})

    return res.redirect(`/blog/${blog._id}`)
})
  
router.post('/comment/:blogid'  ,async (req  , res) => {
    const comment = await Comment.create(
        {
            content : req.body.content,
            name : req.body.name,
            blogid : req.params.blogid,
            createby    : req.user._id,

        }
    )

    return res.redirect(`/blog/${req.params.blogid}`)
})



module.exports = router