
const path = require('path');
const fs = require('fs');

module.exports = function(formidable, Dept){
    return{
        SetRouting: function(router){
            router.get('/dashboard', this.adminPage);
            
            router.post('/uploadFile', this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
        },
        
        adminPage: function(req, res){
            res.render('admin/dashboard');
        },
        
        adminPostPage: function(req,res){
            const newDept = new Dept();
            newDept.name = req.body.dept;
            newDept.image = req.body.upload;
            newDept.save((err) => {
                res.render('admin/dashboard');
            });
        },
        
        uploadFile: function(req, res){
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            
            form.on('file', (field, file) =>{
                fs.rename(file.path, path.join(form.uploadDir, file.name),(err) => {
                    if(err) throw err;
                    console.log('File renamed successfully');
                })
            });
            
            form.on('errror',(err) => {
                console.log(err);
            });
            
            form.on('end', () => {
                console.log('File upload is successful');
            });
            
            form.parse(req);
        }
        
    }
} 