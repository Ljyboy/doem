var express = require('express');
var router = express.Router();
var pool = require('../DB/optPool');
var UserSql = require('../DB/UserSql');


var optPool = new pool();
//获得连接池
var connectionPool = optPool.getPool();

/* GET home page. */
router.get('/login', function (req, res, next) {
    res.render('login');
});


router.post('/loginQuery', function (req, res, next) {
    //获取表单post提交的有户名和密码
    var uname = req.body.username;
    var pwd = req.body.pwd;

    //根据获得到用户名密码查询数据库
    connectionPool.getConnection(function (err, conn) {
        conn.query(UserSql.loginQuery, [uname, pwd], function (err, rs) {
            if (err) {
                console.log('login error-' + err);
                res.end("登陆失败");
            } else {
                if (rs != null && rs != '') {
                    //res.send("登陆验证成功");
                    res.redirect('queryAllUser');
                } else {
                    res.render('login');
                    return;
                }
            }

        });
        conn.release();
    });
    connectionPool.getConnection(function(err,conn){
        
    })

});


//查询出所有的用户信息
router.get('/queryAllUser', function (req, res, next) {
    connectionPool.getConnection(function(err,conn){
        conn.query(UserSql.queryAllUser,function(err,rs){
            if(err){
                console.log('login error -' +err);
                res.send('获取所有用户信息失败');
            }else{
                //查询出用户数据
                if(rs!=null && rs!=''){
                    for(var i=0;i<rs.length;i++){
                        console.log(rs[i].uid);
                        console.log(rs[i].username);
                        console.log(rs[i].password);
                    }
                    res.render('test', {users:rs});
                    //res.render('showAllInfo', {users:rs});
                }else{
                    res.render('showAllInfo',{count:0});
                }
            }
        });
        conn.release();
    });
    
});

//删除
router.get('/deleteUserById', function (req, res, next) {
   var uid= req.query.uid;
   console.log(uid);
   connectionPool.getConnection(function (err, conn) {
    conn.query(UserSql.deleteUserByID, uid, function (err, rows) {
        if (err) {
            console.log('delete user error-' + err);
            res.end("删除用户失败");
        } else {
            res.redirect('queryAllUser');
            return ;
        }

    });
    conn.release();
});
   
});
//查询单个用户
router.get('/toUpdate', function (req, res, next) {
    var uid= req.query.uid;
    console.log(uid);
    connectionPool.getConnection(function (err, conn) {
     conn.query(UserSql.toUpdate,uid, function (err, rs) {
        if (err) {
            console.log('toUpdate user error-' + err);
            res.end("查询用户失败");
        } else {
            res.render('xiugai',{datas:rs});
        }

    });
     conn.release();
    });
    
});
//修改用户
router.post('/updateUserByID', function (req, res, next) {
    var uid= req.body.uid;
    var username= req.body.username;
    var password= req.body.password;
    console.log(uid);
    connectionPool.getConnection(function (err, conn) {
     conn.query(UserSql.updateUserByID,[username,password,uid], function (err, rs) {
        if (err) {
            console.log('Update user error-' + err);
            res.end("修改用户失败");
        } else {
            res.redirect('queryAllUser');
            return ;
        }

    });
           
    conn.release();
    });
    
});

//注册用户
router.get('/register', function (req, res, next) {
    res.render('register');
});
router.post('/insertUser', function(req,res,next){
    var uname=req.body.username;
    var upwd = req.body.pwd;
    connectionPool.getConnection(function(err,conn){
        conn.query(UserSql.insertUser,[uname,upwd],function(err,rs){
            if(err){
                console.log('insert user error-' + err);
                res.send("插入用户失败");
            }else{
                if(rs!=null && rs!=''){
                    res.redirect('queryAllUser');
                }else{
                    res.render('register',{insertErr:'注册用户失败'})
                }
            }
        })
    })
})

router.post('/checkUserName', function (req, res, next) {
    var uname=req.body.username;
    connectionPool.getConnection(function(err,conn){
        conn.query(UserSql.checkUserName,uname,function(err,rs){
            if(err){
                console.log('qurey user error-' + err);
                res.send("注册用户失败");
            }else{
                if(rs[0].count==0){
                    res.send("ture")
                }else{
                    res.send("flase")
                }
            }
        })
    })

});
module.exports = router;
