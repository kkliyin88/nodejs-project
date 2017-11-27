/**
 * Created by Administrator on 2017/11/24 0024.
 */
//����
var express=require("express")
var app=new express()
var mongo= require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var dburl = 'mongodb://localhost:27017/student';
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/public',express.static('public'));//解决上传完成图片不显示问题 或者也可以保存数据库的时候截取
var multiparty = require('multiparty');

 //上传图像使用,使用此模块客户端form必须设置为enctype="multipart/form-data"属性

//配置中间件，上传图像不再使用body-parser
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
//����·��
app.get('/',function(req,res){
    mongo.connect(dburl,function(err,db){
        if(err){
            console.log(err);
            console.log("fail to connect mongodb");
            return;
        }
        var result=db.collection("user").find()
            result.toArray(function(error,data){
            console.log("获取数据成功");
            res.render('index',{
                list:data
            });

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
        mongo.connect(dburl,function(err,db){
            if(err){
                console.log(err);
                console.log("fail to connect mongodb");
                return;
            }
            db.collection("user").insertOne({name,age,sex,tel,pic},function(err){
               if(err) {
                   console.log(err+"学员添加失败");
                   return;
               }else{
                   res.redirect('/');  //跳转到首页
               }
            })
            db.close();

        })
    })
})

//修改学生资料信息
app.get("/edit", function(req,res){
   // 获取id
   // 连接数据库
    mongo.connect(dburl,function(err,db){
        if(err){
            console.log(err);
            console.log("fail to connect mongodb");
            return;
        }
        var id=(req.query.id);
       // var result=db.collection('user').find({"_id":/req.query.id/});   /*查询自动生成的_id*/
        var result=db.collection('user').find({"_id":new ObjectId(id)});   /*查询自动生成的_id*/

        result.toArray(function(err,data){
            res.render('edit',{
                list:data[0]
            });

        })
        db.close();
    })
})

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
            var obj={name,age,sex,tel,pic}
        }else{
           var obj={name,age,sex,tel}
        }
        console.log(obj);
        mongo.connect(dburl,function(err,db) {
            if (err) {
                console.log(err);
                console.log("fail to connect mongodb");
                return;
            }
            db.collection("user").updateOne({"_id":new ObjectId(id)},{ $set:obj},function(err){
                if(err){
                    console.log("修改数据失败");}
                 else{
                    console.log("修改数据succed");
                    res.redirect("/");
                }
             })
            db.close();
        })
    })
})

////dele
app.get("/dele", function(req,res){
    // 获取id
    // 连接数据库
    mongo.connect(dburl,function(err,db){
        if(err){
            console.log(err);
            console.log("fail to connect mongodb");
            return;
        }
        var id=(req.query.id);
        // var result=db.collection('user').find({"_id":/req.query.id/});   /*查询自动生成的_id*/
        db.collection('user').remove({"_id":new ObjectId(id)},function(err){
            if(err){
                console.log(err);
                console.log("信息删除失败");
            }
            else{
                console.log("数据删除成功");
                res.redirect("/")
            }
            db.close();
        })

    })
})

app.listen(3000);