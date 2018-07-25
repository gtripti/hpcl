const path = require('path');
const fs = require('fs');

module.exports = function(async, Users, Message, formidable, FriendResult){
    return{
        SetRouting: function(router){
            router.get('/settings/profile', this.getProfilePage);
            router.post('/userupload', this.userUpload);
            router.post('/settings/profile', this.postProfilePage);
            
            router.get('/profile/:name', this.overviewPage);
            router.post('/profile/:name',this.overviewPostPage);
        },
        
        getProfilePage: function(req, res){
            
            async.parallel([ 
                function(callback){
                    Users.findOne({'username': req.user.username})
                        .populate('request.userId')
                        .exec((err, result) => {
                        callback(err, result);
                    })
                },
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i");
                    Message.aggregate([
                        {$match: {$or:[{'senderName': nameRegex},{'receiverName':nameRegex}]}},
                        {$sort: {createdAt: -1}},
                       {$group:{"_id":{
                                    "last_message_between":{
                                        $cond:[
                                            {
                                                $gt:[
                                                    {$substr: ["$senderName", 0, 1]},
                                                    {$substr: ["$receiverName", 0, 1]}]
                                            },
                                            {$concat:["$senderName"," and ","$receiverName"]},
                                            {$concat:["$receiverName", " and ","$senderName"]}
                                        ]
                                    }
                                }, "body": {$first: "$$ROOT"}}
                        } 
                        ],function(err, newResult){
                            //console.log(newResult);
                            callback(err, newResult);
                    }
                ) /*end aggregate*/   
                }
                
                /*function(callback){
                    Group.find({})
                        .populate('sender')
                        .exec((err, result) => {
                            callback(err, result);
                    });
                }*/
                
            ], (err, results) => {
                const result1 = results[0];
                const result2 = results[1];
                //const result3 = results[2];
                
                //console.log(result1);
                
                res.render('user/profile', {title:'HPCL - Profile', user : req.user ,data: result1, chat: result2/*, groupMsg: result3*/}); 
                
            });
        },
        
        postProfilePage: function(req, res){
            FriendResult.PostRequest(req, res, 'settings/profile');
            
            async.waterfall([
               function(callback){
                   Users.findOne({'_id': req.user._id}, (err, result) => {
                       callback(err,result);
                   })
               },
                
                function(result, callback){
                    if(req.body.upload === null || req.body.upload === ''){
                       Users.update({
                        '_id': req.user._id},
                    {
                        username: req.body.username,
                        fullname: req.body.fullname,
                        email: req.body.email,
                        mantra: req.body.mantra,
                        gender: req.body.gender,
                        region: req.body.region,
                        dept: req.body.dept,
                        userImage: result.userImage
                    },
                    {
                        upsert: true// if any field is not in any doc then adds in doc
                    }, (err, result) => {
                       
                       console.log(result); res.redirect('/settings/profile');
                    })
                    }else if(req.body.upload !== null || req.body.upload !== ''){
                        Users.update({'_id': req.user._id},
                        {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            email: req.body.email,
                            mantra: req.body.mantra,
                            gender: req.body.gender,
                            region: req.body.region,
                            dept: req.body.dept,
                            userImage: req.body.upload
                        },
                        {
                            upsert: true// if any field is not in any doc then adds in doc
                        }, (err, result) => {
                       
                        console.log(result); res.redirect('/settings/profile');
                        })
                    }
                }
            ]);
        },
        
        userUpload: function(req, res){
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            
            form.on('file', (field, file) => { 
                fs.rename(file.path, path.join(form.uploadDir, file.name),(err) => {
                    if(err) throw err;
                    console.log('File renamed successfully');
                })
            });
            
            form.on('error', (err) => {
                console.log(err);
            });
            
            form.on('end', () => {
                console.log('File upload is successful');
            });
            
            form.parse(req);
        },
        
        overviewPage: function(req, res){
            async.parallel([ 
                function(callback){
                    Users.findOne({'username': req.params.name})
                        .populate('request.userId')
                        .exec((err, result) => {
                        callback(err, result);
                    })
                },
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i");
                    Message.aggregate([
                        {$match: {$or:[{'senderName': nameRegex},{'receiverName':nameRegex}]}},
                        {$sort: {createdAt: -1}},
                       {$group:{"_id":{
                                    "last_message_between":{
                                        $cond:[
                                            {
                                                $gt:[
                                                    {$substr: ["$senderName", 0, 1]},
                                                    {$substr: ["$receiverName", 0, 1]}]
                                            },
                                            {$concat:["$senderName"," and ","$receiverName"]},
                                            {$concat:["$receiverName", " and ","$senderName"]}
                                        ]
                                    }
                                }, "body": {$first: "$$ROOT"}}
                        } 
                        ],function(err, newResult){
                            const arr = [
                            {path: 'body.sender', model: 'User'},
                            {path: 'body.receiver', model: 'User'}
                        ];
                        
                        Message.populate(newResult, arr, (err, newResult1) => {
                            //console.log(newResult1[0].body.sender);
                           callback(err, newResult1); 
                        });
                    }
                ) /*end aggregate*/   
                }
            ], (err, results) => {
                const result1 = results[0];
                const result2 = results[1];
                
                res.render('user/overview', {title:'HPCL - Overview', user : req.user ,data: result1, chat: result2/*, groupMsg: result3*/}); 
                
            });
        } ,
        
        overviewPostPage: function(req, res){
            FriendResult.PostRequest(req, res, '/profile/'+req.params.name);
        }
    }
}



