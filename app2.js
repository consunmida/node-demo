const express = require('express');

const cookieParser = require('cookie-parser');

const cookieSession = require('cookie-session');

const fs = require('fs');

const util = require('util');

const app = new express();
app.use(cookieSession({
    name: 'session',
    keys: ['sdasdasksjdasdlkadlad'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

app.use(cookieParser());

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type, SESSION');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  });

app.get('/', function (req, res, next) {
    // Update views
    console.log(req.headers);
    const origin = req.headers.origin;
    if (req.cookies && req.cookies.name) {
        res.cookie("name",'zhangsan',{maxAge: 0, httpOnly: true});
        res.send({cookie: req.cookies.name});
    } else {
        res.cookie("name",'zhangsan',{maxAge: 900000, httpOnly: true});
        res.send({cool: 123});
    }
    // Write response
})

app.get('/cookie', function (req, res, next) {
    // Update views
    console.log(req.cookies.name);
    // Write response
    res.send({cookie: req.cookies.name})
})

app.get('/download', function (req, res, next) {
    const name = 'file.txt';
    const path = './' + name;
    const size = fs.statSync(path).size;
    const f = fs.createReadStream(path);
    res.writeHead(200, {
      'Content-Type': 'application/force-download',
      'Content-Disposition': 'attachment; filename=' + name,
      'Content-Length': size
    });
    f.pipe(res);
})

app.get('/cors', function (req, res, next) {
  res.redirect(302, 'http://localhost:8088/log.html');
})




const server = app.listen(8082, function () {
 
    const host = server.address().address
    const port = server.address().port
   
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
   
  })