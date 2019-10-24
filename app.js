const express = require('express');

const cookieParser = require('cookie-parser');

const cookieSession = require('cookie-session');

const fs = require('fs');

const util = require('util');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
  extended:true
});
const url = require('url');
let app = new express();
app.use(cookieSession({
    name: 'session',
    keys: ['sdasdasksjdasdlkadlad'],

    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

app.use(cookieParser());

app.use(bodyParser.json());


app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, SESSION');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  });

app.get('/', function (req, res, next) {
    console.log(req.headers);
    const origin = req.headers.origin;
    if (req.cookies && req.cookies.name) {
        res.cookie("name",'zhangsan',{maxAge: 900000, httpOnly: true});
        res.send({cookie: req.cookies.name});
    } else {
        res.cookie("name",'zhangsan',{maxAge: 900000, httpOnly: true});
        res.send({cool: 123});
    }
})

app.get('/cookie', function (req, res, next) {
    console.log(req.cookies);
    res.cookie("name",'lisi',{maxAge: 900000, httpOnly: true});
    res.send({cookie: req.cookies.name})
})

app.get('/download', function (req, res, next) {
  console.log(req.cookies);
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

app.get('/getDownload', function (req, res, next) {
    const name = 'file.txt';
    const path = './' + name;
    const size = fs.statSync(path).size;
    const f = fs.createReadStream(path);
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + name,
      'Content-Length': size
    });
    f.pipe(res);
})

app.get('/cors', function (req, res, next) {
  res.redirect(302, 'http://localhost:4200/assets/log.html');
})

app.post('/upload', urlencodedParser, function(req, res, next) {
  const data = req.body.output;
  const file = './output/' + getNowFormatDate() + '.html';
  fs.writeFile(file, data, function(err, data) {
    console.log(arguments);
  })
  res.send({ok: true});
})

// jsonp

app.get('/jsonp', function(req, res, next) {
  const params = url.parse(req.url, true);
  const str = Object.keys(params.query).reduce((total, curr) => {
	  console.log(total);
	  if (curr !=='callback') {
		 return total+= params.query[curr]; 
	  } else {
		  return total;
	  }
  } , '');
  const data = {[str]: 'jifeng', 'company': 'taobao'};
  if (params.query && params.query.callback) {
	  console.log(str);
    const responseData = params.query.callback + `(${JSON.stringify(data)})`;
    res.end(responseData);
  } else {
    res.end(JSON.stringify(data));
  }
})

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate.toString();
}


const server = app.listen(8081, function () {
 
    const host = server.address().address
    const port = server.address().port
   
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
   
  })