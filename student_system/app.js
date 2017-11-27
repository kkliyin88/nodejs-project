/**
 * Created by Administrator on 2017/11/24 0024.
 */
//����
var express=require("express")
var app=new express()
var mongo= require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var dburl = 'mongodb://localhost:27017/student';


app.set('view engine','ejs');//����ģ������
app.use(express.static('public'));//���þ�̬����ger�й�
//配置中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
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
            db.close();
        })
    })
})


app.get("/add", function(req,res){
    res.render("add")

})

app.post("/doadd", function(req,res){
    console.log(req.body);//{ name: 'zhangsan ', age: '34', tel: '123', sex: '1' }
    //将数据存到数据库
    mongo.connect(dburl,function(err,db){
        if(err){
            console.log(err);
            console.log("fail to connect mongodb");
            return;
        }
        db.collection("user").insertOne(req.body,function(err){
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
    var name=req.body.name;
    var age=req.body.age;
    var id=req.body.id;
    var tel=req.body.tel;
    var sex=req.body.sex;
    var id=req.body._id
    console.log(req.body);
    mongo.connect(dburl,function(err,db) {
        if (err) {
            console.log(err);
            console.log("fail to connect mongodb");
            return;
        }

        db.collection("user").updateOne({"_id":new ObjectId(id)},{name,age,tel,sex},function(err){
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
//dele
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

        })

    })
})

app.listen(3000);