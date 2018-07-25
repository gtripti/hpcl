
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userScheme = mongoose.Schema({
    username: {type: String},
    fullname: {type: String, default: ''},
    email: {type: String},
    password: {type: String},
    role: {type: String, default:''},
    ads: {type: String, unique: true},
    userImage: {type: String, default:'default.png'},
    /*sentRequest:[{
        username: {type: String, default: ''}
    }],
    
    request: [{
        userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: {type: String, default: ''}
    }],
    
    friendList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        friendName: {type:String, default: ''}
    }],
    
    totalRequest: {type: Number, default: 0},*/
    gender:{type: String, default: ''},
    region: {type: String, default: ''},
    dept: {type: String, default: ''},
    mantra:{type: String, default: ''}
    
});

//encrypt password
userScheme.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//Decrypt
userScheme.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userScheme);






