var mongoose = require('mongoose');  // it connects nodejs and mongodb
var bcrypt = require('bcrypt-nodejs'); // it is library that hashes passwords etc
var Schema = mongoose.Schema;
// The user schema attributes / characteristics / fields
var UserSchema = new Schema({
  email:{type:String ,unique:true,lowercase:true},
  password: String,
  profile: {
    name:{type:String,default:''},
    picture:{type:String,default:''}
  },
  address:String,
  history:[{
    date:Date,
    paid:{type:Number, default:0}
  }]
});

//Hash the password before we even save it to the database
//pre is mongoose method which is available for all schemas. It contains actions for what is to be done prior to storing it in db
UserSchema.pre('save',function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    //10 is the no of rounds of salt
    //salt is the output of genSalt
    //genSalt is methos of bcrypt library to generate salt
    bcrypt.genSalt(10,function(err,salt){
      if(err) return next(err);
      //call method to generate hash
      bcrypt.hash(user.password,salt,null,function(err,hash){
        if(err) return next(err);
        user.password = hash;
        next();
      });
    });
});

//compare password in the database and the one entered  by user
// comparePassword is a user defined method on schema . To declare it use 'methods' first
UserSchema.methods.comparePassword = function(password){
  //here function parameter 'password' is the passowrd that user types in
  return bcrypt.compareSync(password,this.password);
}

//this is done so that other files like server.js etc can use this schema
module.exports = mongoose.model('User',UserSchema); // first parameter is user second is schema name
