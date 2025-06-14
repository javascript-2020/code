


/*

https-file-server:d

25-04-25


*/
                                                                                console.clear();
                                                                                console.log('https-file-server');
                                                                                console.log();
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
        var auth          = argv('auth')||'matt-123';
        var dir           = argv('d','dir')||'';
        var port          = argv('p','port')||3000;
        
        var path          = require('path');
        var fs            = require('fs');
        var {O_CREAT}     = fs.constants;
                                                                                if(0){
                                                                                  var test   = process.argv[2];
                                                                                  console.log('test :',test);
                                                                                  resolve(test);
                                                                                  
                                                                                  process.exit();
                                                                                }
        var getmime       = require('getmime.js');
        var keys          = require('keys.js');
        
        var key           = fs.readFileSync('key.pem');
        var cert          = fs.readFileSync('cert.pem');
        
        var abs           = path.resolve(__dirname,dir);
        if(!abs.endsWith('/')){
              abs  += '/';
        }
        
        require('https').createServer({key,cert},request).listen(port,'localhost');
                                                                                console.log(`listening https://localhost:${port}/`);
                                                                                console.log();
                                                                                console.log('serving :',abs);
                                                                                console.log();
                                                                                console.log('===');
                                                                                console.log();
  //:
  
  
        function request(req,res){
                                                                                console.log(req.method,req.url);
              if(cors(req,res))return;
              
              if(auth){
                    if(req.headers.auth!==auth){
                          unauthorised(req,res);
                          return;
                    }
              }
              
              var fn    = resolve.req(req);
              if(fn===false){
                    badreq(req,res,'invalid url');
                    return;
              }
              
              var mode      = req.headers.mode;
                                                                                console.log(mode,fn);
              var handled   = true;
              switch(mode){
              
                case 'mkfile'     : mkfile(req,res,fn);         break;
                case 'rmdir'      : rmdir(req,res,fn);          break;
                case 'mkdir'      : mkdir(req,res,fn);          break;
                case 'readdir'    : readdir(req,res,fn);        break;
                case 'load'       : load(req,res,fn);           break;
                case 'save'       : save(req,res,fn);           break;
                
                default           : handled   = false;
                
              }//switch
              
              if(handled){
                    return;
              }
              
              unknown(req,res,mode);
              
        }//request
        
        
        resolve.df    = false;

        
        resolve.req   = function(req){
        
              var url       = req.url;
              url           = url.slice(1);
              var result    = resolve(url);
              return result;
              
        }//req
        
        
        function resolve(url,docroot=dir){
                                                                                resolve.df && console.log('=== resolve ===');
                                                                                resolve.df && console.log('url :',url);
                                                                                resolve.df && console.log('docroot :',docroot);
              url         = decodeURI(url);
                                                                                resolve.df && console.log('url :',url);
              var p2      = path.resolve(docroot);
                                                                                resolve.df && console.log('p2 :',p2);
              var file    = path.resolve(docroot,url);
                                                                                resolve.df && console.log('file :',file);
              var s       = file.substring(0,p2.length);
                                                                                resolve.df && console.log('s :',s);
              var p1      = path.resolve(s);
                                                                                resolve.df && console.log('p1 :',p1);
              if(p1!==p2){
                                                                                resolve.df && console.log('fail');
                    return false;
              }
                                                                                resolve.df && console.log('ok',file);
              return file;

        }//resolve
        
        
        function cors(req,res){
        
              if(req.method!=='OPTIONS'){
                    return;
              }

              cors.headers(res);              
              res.end();
              
              return true;
              
        }//cors
        
        
        cors.headers   = function(res){
        
              res.setHeader('access-control-allow-origin','*');
              res.setHeader('access-control-allow-headers','auth, mode');
        
        }//header
        
        
        function notfound(req,res){
        
              cors.headers(res);
              res.writeHead(404);
              res.end(req.url+' not found');
              
        }//notfound
        
        
        function unauthorised(req,res){
        
              cors.headers(res);
              res.writeHead(401);
              res.end('unauthorised');
              
        }//unauthorised
  
        
        function badreq(req,res){
        
              cors.headers(res);
              res.writeHead(400);
              res.end(reason);
              
        }//badreq
        
        
        function unknown(req,res,mode){
        
              cors.headers(res);
              res.writeHead(400);
              res.end(`unknown mode : ${mode}`);
        
        }//unknown
        
        
  //:
  
        
        function mkfile(req,res,fn){
        
              var err;
              try{
              
                    var file    = fs.openSync(fn,O_CREAT);
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              fs.closeSync(file);
              
              cors.headers(res);
              res.end('ok');
              
        }//mkdir
        
        
        function rmdir(req,res,fn){
        
              var err;
              try{
              
                    fs.rmSync(fn,{recursive:true,force:true});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              cors.headers(res);
              res.end('ok');
              
        }//rmdir
        
        
        function mkdir(req,res,fn){
        
              var err;
              try{
              
                    fs.mkdirSync(fn,{recursive:true});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              cors.headers(res);
              res.writeHead(200);
              res.end('ok');
                  
        }//mkdir

        
        function readdir(req,res,fn){
        
              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              
              var dirs    = [];
              var files   = [];
              
              var list    = fs.readdirSync(fn,{withFileTypes:true});
              list.forEach(file=>{
              
                    if(file.name=='.' || file.name=='..'){
                          return;
                    }
                    
                    if(file.isDirectory()){
                          dirs.push(file.name);
                    }
                    if(file.isFile()){
                          files.push(file.name);
                    }
                    
              });

              var str   = JSON.stringify({files,dirs});
              
              cors.headers(res);
              res.writeHead(200);
              res.end(str);
              
        }//readdir
        
        
        function load(req,res,fn){

              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              
              var mime      = getmime(fn);
              var stream    = fs.createReadStream(fn);

              cors.headers(res);
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
              
        }//load
        
        
        function save(req,res,fn){

              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              
              var stream    = fs.createWriteStream(fn);
              req.pipe(stream);
              req.on('end',()=>{
              
                    cors.headers(res);
                    res.writeHead(200);
                    res.end();
                    
              });
                            
        }//save
        
        
  //:
  
  
        function argv(id0){
        
              var nj    = arguments.length;
              
              var ni   = process.argv.length;
              for(var i=0;i<ni;i++){
              
                    var id2   = process.argv[i];
                    for(var j=0;j<nj;j++){
                    
                          var id    = arguments[j];
                          
                          switch(id2){
                          
                            case id           :
                            case `-${id}`     :
                            case `--${id}`    : return process.argv[i+1];
                            
                          }//switch
                    
                    }//forj
                    
              }//fori
              
              return null;
              
        }//argv
        
        
        
        
        
