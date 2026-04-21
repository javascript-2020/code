


/*

//https-server.js:d

20-07-25


*/


      var fs            = require('fs');
      
      var keys          = require('keys.js');
      var {key,cert}    = require('server-cert.js');
      var getmime       = require('getmime.js');
      var argv          = require('argv.js');
      
      var root          = __dirname+'/';
      
      var host          = argv('h','host','127.0.0.1');
      var port          = argv('p','port',3002);
      
      var server        = require('https').createServer({key,cert},request);
      server.listen({host,port});
                                                                                console.log(`listening https://${host}:${port}`);
                                                                                
                                                                                
      function request(req,res){
                                                                                console.log(req.method,req.url);
            var url   = req.url.slice(1);
            if(url==''){
                  var result    = cmd(req,res);
                  if(result===false){
                        return;
                  }
            }
            
            var abs   = root+url;
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
            
            var mime    = getmime(abs);
            var buf     = fs.readFileSync(abs);
            res.writeHead(200,{'content-type':mime});
            res.end(buf);
            
      }//request
      
      
      function notfound(req,res){
      
            res.writeHead(404);
            res.end(`${req.url} not found`);
            
      }//notfound
      
      
      function badrequest(req,res){
      
            res.writeHead(400);
            res.end(`${req.url} bad request`);
            
      }//badrequest
      
      
      function cmd(req,res){
      
            if(req.headers.mode==='add'){
                  var url   = req.headers.url;
                  var dir   = req.headers.dir;
                  list.push({url,dir});
            }
            
      }//cmd
      
      
      
      
      
      
      
      