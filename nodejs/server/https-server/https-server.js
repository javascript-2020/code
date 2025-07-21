


/*

//https-server.js:d

20-07-25


*/

      
      var fs            = require('fs');
      
      var keys          = require('keys.js');
      keys.keypressed   = keypressed;
      var {key,cert}    = require('server-cert.js');
      var getmime       = require('getmime.js');
      var argv          = require('argv.js');

      var root          = __dirname+'/';
      
      var host          = argv('h','host','127.0.0.1');
      var port          = argv('p','port',3002);
      var url           = argv('url','');
      var dir           = argv('d','dir',root);
      var list          =[{url,dir}];
      
      require('https').createServer({key,cert},request).listen({host,port});
      console.log(`listening https://localhost:${port}`);
      
      
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
            
            var n   = list.length;
            for(var j=0;j<n;j++){
            
                  var o   = list[j];
                  if(url.startsWith(o.url)){
                        abs   = o.dir+url.slice(o.url.length);
                        break;
                  }
                  
            }//for
                                                                                console.log(abs);
            if(!fs.existsSync(abs)){
                  notfound(req,res);
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
      
      
      function cmd(req,res){
      
            if(req.headers.mode==='add'){
                  var url   = req.headers.url;
                  var dir   = req.headers.dir;
                  list.push({url,dir});
            }
            
      }//cmd
      
      
      function keypressed(key){
      
            console.log('keypressed',key);
            
      }//keypressed




      
