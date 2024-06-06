// var person = if(age<18) ?? "too young":"too old"

//sync vs async
// async => call back => promises => async/await

function func1(){
    setTimeout(() => {
        console.log("Function 1");
    },1000);
}
function func2(){
    setTimeout(() => {
        console.log("Function 2");
    },1000);
}
function func3(){
    setTimeout(() => {
        console.log("Function 3");
    },1000);
}

func1();
func2();
func3();

function func1(callback){
    setTimeout(() => {
        console.log("Function 1");
        callback();
    },1000);
}
function func2(callback){
    setTimeout(() => {
        console.log("Function 2");
        callback();
    },1000);
}
function func3(callback){
    setTimeout(() => {
        console.log("Function 3");
        callback();
    },1000);
}
//func1(callback)
//callback hell
func1(() => {
    func2(() => {
        func3(() => {
        })
    })
})

function func1(){
    return new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log("Function 1");
    },1000);
});
}
function func2(){
    return new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log("Function 2");
    },1000);
    });
}
function func3(){
    return new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log("Function 3");
    },1000);
});
}
func1().then(value => {return func2();}).then(value => {return func3();})

function func1(){
    return new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log("Function 1");
    },1000);
});
}
function func2(){
    return new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log("Function 2");
    },1000);
    });
}
function func3(){
    return new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log("Function 3");
    },1000);
});
}
async function allfunc(){
    const func1 = await func1();
    console.log(func1);

    const func2 = await func2();
    console.log(func2);

    const func3 = await func3();
    console.log(func3);
}

allfunc();

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    "username": {type:String, required:true},
    "email": {type:String, required:true},
    "password": {type:String, required:true},
    "RefreshToken": String,
},{timestamps:true})

UserSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password);
    next();
})

UserSchema.methods.isPasswordCorrect( async function (password){
    return await bcrypt.compare(password,this.password);
})

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this.id,
        "username": this.username,
        "password": this.password,
    },
        process.env.access_token_secret,{
            expiresIn: process.env.accesstokenexpiry,
        })
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id,
    },
        process.env.refresh_token_secret,{
            expiresIn: process.env.refreshtokenexpiry,
        })
}

module.exports = mongoose.model("user",UserSchema);

const express = require('express');
const userRouter = express.Router();
const {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser} = require(controllers/routes/user.controller.js);

userRouter.route('/register').get((req,res) => {
    res.render('register')
});
userRouter.route('/register').post(registerUser);

module.exports = userRouter;

const express = require('express');
const app = express();
const path = require('path');
const userRouter = express.Router();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine' ,'views');
app.use(express.static,path.join(__dirname, 'public'));

app.use('/users', userRouter);

app.get('/',(req,res) => {
    res.render('index')
    });

module.exports = app;

const app = require('/app.js');
const { create } = require('./models/User');
app.listen(port, () => {
    });

await mongoose.connect("YourConnectionString")

const verifyJWT = asyncHandler(async( (req,res,next) => {
    const token = req.cookies?.accesstoken || req.header("Authorization"?.replace("Bearer ",""));
    if(!token){
        throw new error(400)
    }
    const decodedtoken = jwt.verify(token,process.env.access_token_secret);
    const user = User.findById(decodedtoken?._id).select("-password -refreshtoken")
    req.user = user;
    next();
}))

module.exports = verifyJWT;

const asyncHandler = fn => (req,res,next) => {
    Promise.resolve(fn(req,res,next)).catch(next)
}

module.exports = asyncHandler

const registerUser = asyncHandler(async(req,res) => {
    const {username, email, password} = req.body;
    const user = User.findOne({
    $or: [{username},{email}]
})
    const user = await User.create({username,email,password})
    const createduser = await User.findById(user._id).select("-password -refreshtoken")
    res.redirect('/')
})

