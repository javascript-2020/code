


/*

//https-server.js:d

20-07-25


*/


        var fs            = require('fs');
        var path          = require('path');
        
        var keys          = require('keys.js');
        var argv          = require('argv.js');
        var getmime       = require('getmime.js');
        var {key,cert}    = require('server-cert.js');
        var resolve       = require('resolve.js');
        
        var docroot       = __dirname+'/';
        
        var host          = argv('h','host','127.0.0.1');
        var port          = argv('p','port',3002);
        
        
        var server        = require('https').createServer({key,cert},request);
        server.on('error',err=>{
                                                                                  console.log(err.message)
        });
        server.listen({host,port});
                                                                                  console.log(`listening https://${host}:${port}`);
                                                                                  
                                                                                  
        function request(req,res){
                                                                                  console.log(req.method,req.url);
              if(cors(req,res)){
                    return;
              }
              
              var {abs,error}   = resolve(req.url,docroot);
              if(error){
                    badrequest(req,res);
                    return;
              }
                                                                                  console.log(abs);
              if(!fs.existsSync(abs)){
                    notfound(req,res);
                    return;
              }
              
              var stat    = fs.statSync(abs);
              if(!stat.isFile()){
                    badrequest(req,res);
                    return;
              }
              
              var mime      = getmime(abs);
              var stream    = fs.createReadStream(abs);
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
              
        }//request
        
        
        cors.headers   = function(res){
        
              res.setHeader('access-control-allow-origin','*');
              res.setHeader('access-control-allow-headers','content-type');
              
        }//header
        
        
        function cors(req,res){
        
              cors.headers(res);
              
              if(req.method!=='OPTIONS'){
                    return;
              }
              
              res.writeHead(200);
              res.end();
              
              return true;
              
        }//cors
        
        
        
        
        function notfound(req,res){
        
              res.writeHead(404);
              res.end(`${req.url} not found`);
              
        }//notfound
        
        
        function badrequest(req,res){
        
              res.writeHead(400);
              res.end(`${req.url} bad request`);
              
        }//badrequest
        
        
        
        
        
        
        
        