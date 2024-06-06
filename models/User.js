const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const access_token_secret='hasham'
const access_token_expiry='1d'
const refresh_token_secret='flight'
const refresh_token_expiry='10d'

const userSchema = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  email: {type:String, required:true},
  password: {type:String, required:[true, "Password is required"]},
  refreshToken: {type:String}
});

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password , 10)
  next()
},{timestamps: true})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id: this._id,
    username: this.username,
    password: this.password
  },
  // process.env.access_token_secret
  access_token_secret,{
    expiresIn: access_token_expiry //process.env.access_token_expiry
  }
)
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id: this._id
  },
  //process.env.refresh_token_secret
  refresh_token_secret,{
    expiresIn: refresh_token_expiry //process.env.access_token_expiry
  }
)
}

module.exports = mongoose.model('User',userSchema);