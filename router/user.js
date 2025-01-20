const { Router } = require('express');
const User = require('../model/user');
const Blog = require('../model/blog');
const Comment = require('../model/comment');
const router = Router();


router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body
    try {
        await User.create({ name, email, password });
        const token = await User.matchpass(email, password)
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send("Internal Server Error");
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body
        const token = await User.matchpass(email, password)

        return res.cookie('token', token).redirect('/');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.render('signin', {
            error: "incorrted user",
        })
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})

router.get('/userprofile', async (req, res) => {
    const blogs = await Blog.find({ createby: req.user._id }).populate("createby");
    const comment = await Comment.find({ createby: req.user._id }).populate("createby")
    console.log(blogs);

    return res.render('userprofile', {
        user: req.user,
        blogs,
        comment
    })
})


module.exports = router;