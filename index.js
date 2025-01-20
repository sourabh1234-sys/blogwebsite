require('dotenv').config();
const express = require('express');
const path = require("path");
const ejs = require('ejs');
const userroute = require('./router/user');
const blogroute = require('./router/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkauthenticationcookie } = require('./middleware/authentication');
const Blog = require('./model/blog');
const staticrouter = require('./router/staticroute')

const app = express();
const PORT =  3000;

 
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((error) => {
        console.error("DB Connection Error: ", error);
    });


app.set("view engine", 'ejs');
app.set("views", path.resolve("views"));
app.use(express.static('views'))
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkauthenticationcookie('token'));



app.use('/' , staticrouter)
app.use('/user', userroute);
app.use('/blog', blogroute);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
