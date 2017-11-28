/**
 * Created by Administrator on 2017/11/24 0024.
 */
//����
var express=require("express")
var app=new express()
//var mongo= require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
//var dburl = 'mongodb://localhost:27017/student';
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/public',express.static('public'));//解决上传完成图片不显示问题 或者也可以保存数据库的时候截取
var multiparty = require('multiparty');
var DB=require("./module/db.js")
 //上传图像使用,使用此模块客户端form必须设置为enctype="multipart/form-data"属性
//配置中间件，上传图像不再使用body-parser
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
//�

console.log(DB.find);
app.get('/',function(req,res){

    DB.find("user",{},function(err,data){
        res.render('index',{
            list:data
        })
    })
})

app.get("/add", function(req,res){
    res.render("add")
})

app.post('/doadd',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir='public/upload';
    form.parse(req, function(err, fields, files) {
          var  name =fields.name[0]
          var age=fields.age[0]
          var  sex=fields.sex[0]
          var  tel=fields.tel[0]
          var pic=files.pic[0].path
    //将数据存到数据库
        DB.insert("user",{name,age,sex,tel,pic},function(err) {
            if(err){
                console.log("数据插入失败");
                return;
            }
            res.redirect('/');
        })
    })
})

//修改学生资料信息
app.get("/edit", function(req,res){
   // 获取id
   // 连接数据库
    var id=(req.query.id);
    DB.find("user",{"_id":new ObjectId(id)},function(err,data){
        console.log(data);
        res.render('edit',{
            list:data[0]
        })
    })
})
//
app.post("/doedit", function(req,res){

    var form = new multiparty.Form();
    form.uploadDir='public/upload';
    form.parse(req, function(err, fields, files) {
        var  name =fields.name[0]
        var age=fields.age[0]
        var sex=fields.sex
        var tel=fields.tel[0]
        var pic=files.pic[0].path
        var id=fields._id[0]
        var originalFilename=files.pic[0].originalFilename
        if(originalFilename.length>0){
            var obj={name,age,sex,tel,pic};
        }else{
           var obj={name,age,sex,tel};
        }
        console.log(obj);
        DB.update("user",{"_id":new ObjectId(id)},obj,function(err){
            if(err){
                console.log("修改数据失败");}
            else{
                console.log("修改数据succed");
                res.redirect("/");
            }
        })
    })
})

//////dele
app.get("/dele", function(req,res){

    var id=(req.query.id);
    DB.remove("user",{"_id":new ObjectId(id)},function (err) {
        if(err){
            console.log(err);
            console.log("信息删除失败");
        }
        else {
            console.log("数据删除成功");
            res.redirect("/");
        }
    })

})

app.listen(3000);