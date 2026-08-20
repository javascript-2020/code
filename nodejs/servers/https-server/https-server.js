


/*

//https-server.js:d

20-07-25


*/


        var fs            = require('fs');
        var path          = require('path');
        
        var keys          = require('libs/keys.js');
        var argv          = require('libs/argv.js');
        var getmime       = require('libs/getmime.js');
        var {key,cert}    = require('libs/server-cert.js');
        var resolve       = require('libs/resolve.js');
        
        var host          = argv('h','host','127.0.0.1');
        var port          = argv('p','port',3002);
        var dir           = argv('d','dir','.');
        
        var cwd           = process.cwd();
        var docroot       = path.resolve(cwd,dir);
        docroot          += '/';

        
        if(!fs.existsSync(docroot) || !fs.statSync(docroot).isDirectory()){
                                                                                console.error(`Error: ${docroot} is not a valid directory.`);
              process.exit(1);
        }
        

  //:
  
  
        var server        = require('https').createServer({key,cert},request);
        server.on('error',err=>{
                                                                                console.log(err.message)
        });
        server.listen({host,port});
                                                                                console.log('    serving :',docroot);
                                                                                console.log(`  listening : https://${host}:${port}`);
  //:
  
  
        function request(req,res){
          
              var url   = transform(req.url);
              
              var {abs,error}   = resolve(url,docroot);
              if(error){
                    badrequest(req,res);
                    return;
              }

              if(cors(req,res,abs)){
                    return;
              }
              

              if(!fs.existsSync(abs)){
                    notfound(req,res,abs);
                    return;
              }
              
              var stat    = fs.statSync(abs);
              if(!stat.isFile()){
                    badrequest(req,res,abs);
                    return;
              }
                                                                                console.log(req.method,req.url,'=>',abs,':','200 ok');
              var mime      = getmime(abs);
              var stream    = fs.createReadStream(abs);
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
              
        }//request
        

        function transform(url){
          
              switch(url){
                
                case '/'    : url   = '/index.html';        break;
                
              }//switch
              
              return url;
              
        }//transform
        
        
  //:
  
  
        cors.headers   = function(res){
        
              res.setHeader('access-control-allow-origin','*');
              res.setHeader('access-control-allow-headers','content-type');
              
        }//header
        
        
        function cors(req,res,abs){
        
              cors.headers(res);
              
              if(req.method!=='OPTIONS'){
                    return;
              }
                                                                                console.log(req.method,req.url,'=>',abs,':','200 ok');
              res.writeHead(200);
              res.end();
              
              return true;
              
        }//cors
        
        
        function notfound(req,res,abs){
                                                                                console.log(req.method,req.url,'=>',abs,':','404 not found');
              res.writeHead(404);
              res.end(`${req.url} not found`);
              
        }//notfound
        
        
        function badrequest(req,res,abs){
                                                                                console.log(req.method,req.url,'=>',abs,':','400 bad request');
              res.writeHead(400);
              res.end(`${req.url} bad request`);
              
        }//badrequest
        
        
        
        
        
        
        
        