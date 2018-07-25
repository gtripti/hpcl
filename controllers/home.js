module.exports = function(async, Dept, _, Users, Message, FriendResult){
    return{
        SetRouting: function(router){
            router.get('/home', this.homePage);
            router.post('/home', this.postHomePage);
            
            router.get('/logout', this.logout);
        },
                 
         homePage: function(req,res){
             async.parallel([
                 function(callback){
                     Dept.find({}, (err, result) => {
                         callback(err, result);
                     })
                 },
                 
                 function(callback){
                    Dept.aggregate([{
                       $group: {
                           _id: "$region"
                       } 
                    }],(err,newResult) => {
                        callback(err, newResult);
                    });    
                 },
                 
                 function(callback){
                    Users.findOne({'username': req.user.username}).populate('request.userId').exec((err, result) => {
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
                 const res1 = results[0];
                 const res2 = results[1];
                 const res3 = results[2];
                 const res4 = results[3];
                 
                 const dataChunk = [];
                 const chunkSize = 3;
                 for (let i = 0; i < res1.length; i += chunkSize ){
                     dataChunk.push(res1.slice(i, i + chunkSize));
                 }
                 
                 
                 const regionSort = _.sortBy(res2, '_id');
                 
                 res.render('home', {title: 'Chat - Home', user: req.user , chunks: dataChunk, region: regionSort, data: res3, chat: res4});
             })
             
             
         },
        
        postHomePage: function(req,res){
            async.parallel([
               
                function(callback){
                    Dept.update({
                       '_id': req.body.id,
                        'members.username': {$ne: req.user.username}
                    }, {
                        $push: {members: {
                            username: req.user.username,
                            ads: req.user.ads
                        }}
                    }, (err,count) => {
                        console.log(count);
                        callback(err,count);
                    });
                }
                
            ], (err,results) => {
                res.redirect('/home');
            });
            
            FriendResult.PostRequest(req, res, '/home');
        },
        
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
                res.redirect('/');
            });
        }
    }
}































