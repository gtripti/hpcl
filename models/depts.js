const mongoose = require('mongoose');

const deptNames = mongoose.Schema({
    name: {type:String, default:''},
    image: {type: String, default:'default.png'},
    members:[{
        username:{type: String, default:''},
        ads:{type: String, default: ''}
    }] 
});

module.exports = mongoose.model('Dept',deptNames);