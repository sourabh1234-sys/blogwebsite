const express = require('express');
const Blog = require('../model/blog');


const router = express.Router();

router.get('/signin', (req, res) => {
    return res.render("signin")
})
router.get('/signup', (req, res) => {
    return res.render("signup");
})

router.get('/', async (req, res) => {
    const allblog = await Blog.find({}); 

    console.log(req.user.id);  
    console.log(req.user);  
    return res.render('home', {
        user: req.user,
        blogs: allblog, 
    }); 
});

router.get("/error", (req, res) => {
    return res.render('errorpage')
})


router.get('/setting', async (req, res) => {

    return res.render('setting',
        {
            user: req.user
        }
    )
})



module.exports = router