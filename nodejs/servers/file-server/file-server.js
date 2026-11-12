


/*

//file-server.js:d
//version v2.0:

https://github.com/javascript-2020/code/blob/main/nodejs/servers/file-server/file-server.js

26-02-18
25-04-25
02-11-26

*/
                                                                                console.clear();
                                                                                terminal_title('file-server');
                                                                                console.log();
                                                                                console.json=(...args)=>args.forEach(v=>console.log(JSON.stringify(v,null,4)));
                                                                                //console.json(process.argv);
        var path                    = require('node:path');
        var fs                      = require('node:fs');
        
                                                                                lib.df=true;//lib.load=false;
        var resolve                 = lib('resolve.js',resolve);
        var {argv,argv_has}         = lib('argv.js','v2.0',{argv,argv_has});
        var server_cert             = lib('server-cert.js','v2.0',server_cert);
        var getmime                 = lib('getmime-min.js',getmime);
        var keysmod                 = lib('keys',keysmod);
                                                                                lib.df && console.log();
                                                                                
        var fsp                     = fs.promises;
        var {O_CREAT}               = fs.constants;
        
        var auth                    = argv('auth','auth-123');
        var dir                     = argv('d','dir','');
        var host                    = argv('h','host','127.0.0.1');
        var port                    = argv('p','port',3000);
        serve.enabled               = argv_has('s','serve')
        
        var keys                    = keysmod();
        keys.keypressed             = key=>{
        
                                            if(key=='i')info();
                                            if(key=='b')lib.build();
                                            
                                      }//keypressed
        var {key,cert}              = server_cert();
        
        var cwd                     = process.cwd();
        var docroot                 = path.resolve(cwd,dir);
        docroot                    += '/';
        
        if(!fs.existsSync(docroot) || !fs.statSync(docroot).isDirectory()){
                                                                                console.error(`Error: not a valid directory [${docroot}]`);
              process.exit(1);
        }
        
        
        var ok      = JSON.stringify({ok:'ok'});
        var file    = {};
        var dir     = {};
        
        
        
  //:
  
  
        var server    = require('https').createServer({key,cert},request)
        server.on('error',err=>{
                                                                                console.error(err);
        });
        server.listen({host,port});
        info();
        
        
        function info(){
                                                                                console.log('===');
                                                                                console.log();
                                                                                console.log(`        file  :: ${__filename}`);
                                                                                console.log(`   listening  :: https://${host}:${port}/`);
                                                                                console.log(`     serving  :: ${docroot}`);
                                                                                serve.enabled && console.log('     serve.enabled');
                                                                                console.log();
                                                                                console.log('===');
                                                                                console.log();
        }//info
        
        
  //:
  
  
        async function request(req,res){
        
              res.setHeader('cache-control','no-store');
              res.setHeader('access-control-allow-origin','*');
              res.setHeader('access-control-allow-headers','auth,mode,content-type');
              res.setHeader('access-control-expose-headers','content-range,accept-ranges,content-length');
              
              if(cors(req,res))return;
              if(ping(req,res))return;
              
              var url           = transform(req.url);
              var {abs,error}   = resolve(url,docroot);
              if(error){
                                                                                badreq(req,res,error);
                    return;
              }
              
              var mode      = req.headers.mode;
              
              if(serve.enabled){
                    if(!mode){
                          serve(req,res,abs);
                          return;
                    }
              }
              
              
              if(auth){
                    if(req.headers.auth!==auth){
                          var error   = to_error({name:'not authorised',message:''});
                                                                                unauthorised(req,res,error);
                          return;
                    }
              }
              
              
              var handled   = true;
              var error;
              
              switch(mode){
              
              
                case 'mkfile'             :
                case 'file.create'        :
                                            ({error}    = file.create(req,res,abs))
                                            break;
                case 'rmfile'             :
                case 'file.delete'        :
                                            ({error}    = file.delete(req,res,abs));
                                            break;
                case 'download'           :
                case 'file.download'      :
                case 'load'               :
                case 'file.load'          :
                                            ({error}    = file.load(req,res,abs));
                                            break;
                case 'upload'             :
                case 'file.upload'        :
                case 'save'               :
                case 'file.save'          :
                                            ({error}    = file.save(req,res,abs));
                                            break;
                                            
                                            
                case 'readdir'            :
                case 'dir.read'           :
                                            ({error}    = dir.read(req,res,abs));
                                            break;
                case 'readdir'            :
                case 'dir.read.full'      :
                                            ({error}    = dir.read.full(req,res,abs));
                                            break;
                case 'mkdir'              :
                case 'dir.create'         :
                                            ({error}    = dir.create(req,res,abs));
                                            break;
                case 'rmdir'              :
                case 'dir.delete'         :
                                            ({error}    = dir.delete(req,res,abs));
                                            break;
                case 'dir-clear'          :
                case 'dir.clear'          :
                                            ({error}    = dir.clear(req,res,abs));
                                            break;
                                            
                                            
                case undefined
                                          :
                                            handled   = false;
                                            no_mode(req,res);
                                            break;
                                            
                default                   :
                                            handled   = false;
                                            unknown_mode(req,res,mode);
                                            
              }//switch
              
              
              if(handled && !error){
                                                                                request.log(200,req,mode,abs);
              }
              
        }//request
        
        
        request.log   = function(code,req,mode,abs){
        
              var spc   = [5,10,20,20,5,20];
              var str   = [
                                code,
                                req.method,
                                req.url,
                                mode||'',
                                (abs && '=>')||'',
                                abs||''
                          ];
              str       = str.map((v,i)=>String(v).padEnd(spc[i]));
              str       = str.join(' ');
                                                                                console.log(str);
                                                                                
        }//log
        
        
        function transform(url){
        
              switch(url){
              
                /*
                case '/'    :
                              url   = '/index.html';
                                                            break;
                */
                
              }//switch
              
              return url;
              
        }//transform
        
        
  //:
  
  
        function cors(req,res){
        
              if(req.method!=='OPTIONS'){
                    return;
              }
                                                                                request.log(200,req);
              res.writeHead(200);
              res.end();
              return true;
              
        }//cors
        
        
        function ping(req,res){
        
              if(req.headers.mode!=='ping'){
                    return;
              }
                                                                                request.log(200,req,'ping');
              res.end('pong');
              
        }//ping
        
        
  //:
  
  
        function unauthorised(req,res,error){
                                                                                request.log(401,req);
              res.writeHead(401);
              res.end('unauthorised');
              
        }//unauthorised
        
        
        function notfound(req,res,error){
                                                                                request.log(404,req);
              res.writeHead(404);
              res.end(error);
              
        }//notfound
        
        
        function badreq(req,res,error){
                                                                                request.log(400,req);
              res.writeHead(400);
              res.end(error);
              
        }//badreq
        
        
        function range_not_satisfiable(req,res,error){
                                                                                request.log(416,req);
              req.writeHead(416);
              res.end(error);
              
        }//range_not_satisfiable
        
        
        function no_mode(req,res){
                                                                                request.log(400,req);
              var error   = to_error({name:'mode not set',message:''});
              res.writeHead(400);
              res.end(error);
              
        }//no_mode
        
        
        function unknown_mode(req,res,mode){
                                                                                request.log(400,req,mode);
              var error   = to_error({name:'unknown mode',message:mode});
              res.writeHead(400);
              res.end(error);
              
        }//unknown
        
        
  //:
  
  
        function serve(req,res,abs){
        
              if(!fs.existsSync(abs)){
                    var error   = to_error({name:'not found',message:''},abs);
                                                                                notfound(req,res,error);
                    return {error};
              }
              
              var {stat,err}    = stat_sync(abs);
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              if(!stat.isFile()){
                    var error   = to_error({name:'not file',message:''},abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              
              if(req.headers.range){
                    var result    = serve.range(req,res,abs,stat);
                    return result;
              }
              
              var err;
              try{
              
                    var stream    = fs.createReadStream(abs);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              var mime      = getmime(abs);
              var hdrs      = {'content-type':mime};
                                                                                request.log(200,req);
              res.writeHead(200,hdrs);
              stream.pipe(res);
              
              return {ok};
              
        }//serve
        
        
        serve.range   = function(req,res,abs,stat){
        
              var range         = req.headers.range;
              var [start,end]   = range.replace(/bytes=/,'').split('-');
              start             = parseInt(start);
              end               = parseInt(end);
              
              var size          = stat.size;
              
              if(isNaN(start)){
                    start       = size-end;
                    end         = size-1;
              }
              
              if(isNaN(end)){
                    end         = size-1;
              }
              
              if((start>=size)||(end>=size)){
                    var error   = to_error({name:'not satisfiable',message:''},abs);
                                                                                range_not_satisfiable(req,res,error);
                    return {error};
              }
              
              var err;
              try{
              
                    var stream    = fs.createReadStream(abs,{start,end});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              var mime      = getmime(abs);
              var hdrs      = {
                                    'content-range'     : `bytes ${start}-${end}/${size}`,
                                    'accept-ranges'     : 'bytes',
                                    'content-length'    : end-start+1,
                                    'content-type'      : mime,
                              };
                                                                                request.log(206,req);
              res.writeHead(206,hdrs);
              stream.pipe(res);
              
              return {ok};
              
        }//range
        
        
        
  //:
  
  
        file.create   = function(req,res,abs){
        
              var err;
              try{
              
                    var file    = fs.openSync(abs,O_CREAT);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              fs.closeSync(file);
              
              res.end(ok);
              
              return {ok};
              
        }//file.create
        
        
        file.delete   = function(req,res,abs){
        
              var {stat,err}    = stat_sync(abs);
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              if(!stat.isFile()){
                    var error   = to_error({name:'not file',message:''},abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              var err;
              try{
              
                    fs.rmSync(abs);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              res.end(ok);
              
              return {ok};
              
        }//file.delete
        
        
        file.load   = function(req,res,abs){
        
              var err;
              try{
              
                    var stream    = fs.createReadStream(abs);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              var mime      = getmime(abs);
              
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
              
              return {ok};
              
        }//file.load
        
        
        file.save   = function(req,res,abs){
        
              var err;
              try{
              
                    var stream    = fs.createWriteStream(abs);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badrequest(req,res,error)
                    return {error};
              }
              
              req.pipe(stream);
              req.on('end',()=>{
              
                    res.writeHead(200);
                    res.end();
                    
              });
              
              return {ok};
              
        }//file.save
        
        
  //:
  
  
        dir.delete    = function(req,res,abs){
        
              if(!fs.existsSync(abs)){
                    var error   = to_error({name:'not found',message:''},abs);
                                                                                notfound(req,res,error);
                    return;
              }
              
              var {stat,err}    = stat_sync(abs);
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return;
              }
              
              if(!stat.isDirectory()){
                    var error   = to_error({name:'not directory',message:''},abs);
                                                                                badreq(req,res,error);
                    return;
              }
              
              var err;
              try{
              
                    fs.rmSync(abs,{recursive:true,force:true});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              res.end(ok);
              
              return {ok};
              
        }//dir.delete
        
        
        dir.create    = function(req,res,abs){
        
              var err;
              try{
              
                    fs.mkdirSync(abs,{recursive:true});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              res.end(ok);
              
              return {ok};
              
        }//dir.create
        
        
        dir.read    = function(req,res,abs){
        
              var err;
              try{
              
                    var list    = fs.readdirSync(abs,{withFileTypes:true});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              var dirs    = [];
              var files   = [];
              
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
              res.end(str);
              
              return {ok};
              
        }//dir.read
        
        
        dir.read.full    = function(req,res,abs){
        
              var err;
              try{
              
                    var list    = fs.readdirSync(abs,{withFileTypes:true});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              if(!abs.endsWith('/')){
                    abs  += '/';
              }
              
              var dirs    = [];
              var files   = [];
              
              list.forEach(file=>{
              
                    if(file.name=='.' || file.name=='..'){
                          return;
                    }
                    
                    var {stat,err}    = stat_sync(abs+file.name);
                    if(err)return;
                    
                    if(stat.isDirectory()){
                          var o   = {
                                name    : file.name,
                          };
                          dirs.push(o);
                    }
                    if(stat.isFile()){
                          var o   = {
                                name    : file.name,
                                size    : stat.size,
                          };
                          files.push(o);
                    }
                    
              });
              
              var str   = JSON.stringify({files,dirs});
              res.end(str);
              
              return {ok};
              
        }//dir.read.full
        
        
        dir.clear   = async function(req,res,abs){
                                                                                //console.log('dir.clear',fn);
              var err;
              try{
              
                    fs.mkdirSync(abs,{recursive:true});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              
              var err;
              try{
              
                    var files     = await fsp.readdir(abs);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = to_error(err,abs);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              if(!abs.endsWith('/')){
                    abs  += '/';
              }
              
              var errors    = [];
              files.forEach((name,i)=>{
              
                    var err;
                    try{
                    
                          var path    = abs+name;
                                                                                //console.log(i,path);
                          fs.rmSync(path,{recursive:true,force:true});
                          
                    }//try
                    catch(err2){
                    
                          err   = err2;
                          
                    }//catch
                    if(err){
                                                                                console.error(err);
                          var error   = to_error(err,path);
                          errors.push(error);
                    }
                    
              });
              
              if(errors.length){
                    var error     = {name:'error',message:'error',errors};
                    error         = JSON.stringify(error);
                                                                                badreq(req,res,error);
                    return {error};
              }
              
              res.end(ok);
              
              return {ok};
              
        }//dir.clear
        
        
  //:
  
  
        function to_error(err,fn){
        
              var {name,message,file}   = err;
              file                      = fn||file;
              var error                 = JSON.stringify({name,message,file});
              return error;
              
        }//to_error
        
        
        function stat_sync(fn){
        
              var err;
              try{
              
                    var stat    = fs.statSync(fn);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    return {err};
              }
              return {stat};
              
        }//stat_sync
        
        
        function terminal_title(str){
                                                                                console.log(str);
              var esc   = String.fromCharCode(27);
              var c7    = String.fromCharCode(7);
              var cmd   = `${esc}]0;${str}${c7}`;
                                                                                process.stdout.write(cmd);
                                                                                
        }//terminal_title
        
        
        
  //:
  //:
  
  
        lib.df        = true;
        lib.enabled   = true;
        
        function lib(name,version,def){
                                                                                lib.df && process.stdout.write(`load ${name} => `);
              if(arguments.length==1){
                    def       = name;
                    name      = null;
                    version   = null;
              }
              if(arguments.length==2){
                    def       = version;
                    version   = null;
              }
              
              /*
              var path    = require('node:path');
              if(!lib.dir){
              var dir     = path.dirname(require.main.filename);
              */
              
              var abs;
              var result;
              
              if(lib.load!==false && name){
              
                    (()=>{
                    
                          if(name.endsWith('.js')){
                                name    = name.slice(0,-3);
                          }
                          
                          try{
                          
                                abs             = `${name}.js`;
                                if(version){
                                      abs       = `${name}/${version}/${name}-${version}.js`;
                                }
                                result          = require(abs);
                                return result;
                                
                          }//try
                          catch(err){
                          
                                if(err.code!=='MODULE_NOT_FOUND')throw err;
                                
                          }//catch
                          
                          try{
                          
                                abs             = `./libs/${name}.js`;
                                if(version){
                                      abs       = `./libs/${name}/${version}/${name}-${version}.js`;
                                }
                                result          = require(abs);
                                return result;
                                
                          }//try
                          catch(err){
                          
                                if(err.code!=='MODULE_NOT_FOUND')throw err;
                                
                          }//catch
                          if(result)return;
                          
                          
                          try{
                          
                                abs             = `./${name}.js`;
                                if(version){
                                      abs       = `./${name}-${version}.js`;
                                }
                                result          = require(abs);
                                return result;
                                
                          }//try
                          catch(err){
                          
                                if(err.code!=='MODULE_NOT_FOUND')throw err;
                                
                          }//catch
                          
                    })();
                    
              }
              
              if(result){
                                                                                lib.df && process.stdout.write(abs+'\n');
                                                                                !lib.list && (lib.list=[]);
                                                                                lib.list.push(require.resolve(abs));
                    return result;
              }
              
                                                                                lib.df && process.stdout.write('def\n');
              return def;
              
        }//lib
        
        
        lib.build   = function(){
                                                                                console.log('lib.build');
              var fs          = require('node:fs');
              var fn          = require.main.filename;
                                                                                console.log(fn);
              var txt         = fs.readFileSync(fn,'utf8');
              
              var i           = txt.indexOf('/'+'/libs:');
              i               = txt.indexOf('\n\n\n',i);
              txt             = txt.slice(0,i+3);
              
              lib.list.forEach((abs,i)=>{
                                                                                console.log(i,abs);
                    var js    = fs.readFileSync(abs,'utf8');
                    var i     = js.indexOf('module.exports');
                    js        = js.slice(0,i)+'//'+js.slice(i);
                    txt      += js;
                    
              });
              
              var i   = fn.lastIndexOf('.');
              fn      = fn.slice(0,i)+'-build'+fn.slice(i);
                                                                                console.log(fn);
              fs.writeFileSync(fn,txt);
              
        }//build
        
        
  //:
  //libs:
  //:
  
  
/*

//resolve:

20-08-26

*/


        resolve.df    = false;
        //resolve.df    = true
        
        function resolve(requrl,docroot='.'){
                                                                                resolve.df && console.log('=== resolve v3.0 ===');
                                                                                resolve.df && console.log('requrl ... : ',requrl);
                                                                                resolve.df && console.log('docroot .. : ',docroot);
        // ===
        
        
              var err;
              try{
              
                    requrl    = decodeURI(requrl);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                                                                                resolve.df && console.log('error .... : ',err.message);
                    var error   = 'invalid url';
                    return {error};
              }
              
              var url   = requrl;
              
              
        // ===
                                                                                /*
                                                                                    theres some annoying errors with \ in the path
                                                                                    windows supports /, so i restrict to only using /
                                                                                */
              if(url.indexOf('\\')!=-1){
                                                                                resolve.df && console.log('error .... : ','invalid url ( backslash )');
                    var error   = 'invalid url ( backslash )';
                    return {error};
              }
              
              
        // ===
        
        
              url         = url.slice(1);
                                                                                resolve.df && console.log('url ...... : ',url);
              var root    = path.resolve(docroot);
              //root       += path.sep;
                                                                                resolve.df && console.log('root ..... : ',root);
              var abs     = path.resolve(docroot,url);
                                                                                resolve.df && console.log('abs ...... : ',abs);
                                                                                
        // ===
        
        
              if(!abs.startsWith(root)){
                                                                                resolve.df && console.log('error .... : ','invalid docroot');
                    var error   = 'invalid docroot';
                    return {error};
              }
              
              if(abs.length>root.length){
                    if(abs[root.length]!=path.sep){
                                                                                resolve.df && console.log('error .... : ','invalid docroot-2');
                          var error   = 'invalid docroot-2';
                          return {error};
                    }
              }
              
              if(requrl.endsWith('/')){
                    abs  += '/';
              }
              
              
        // ===
        
                                                                                resolve.df && console.log('ok ....... : ',abs);
              return {abs};
              
              
        }//resolve
        
        
        
/*

//argv:d

18-04-25


*/

        function argv(id0,def){
        
              var args    = [...arguments];
              var ids     = [...arguments].slice(0,-1);
              def         = args.at(-1);
              
              var nj    = ids.length;
              for(var j=0;j<nj;j++){
              
                    var id    = ids[j];
                    
                    var nk    = process.argv.length;
                    for(var k=0;k<nk;k++){
                    
                          switch(process.argv[k]){
                          
                            case id         :
                            case '-'+id     :
                            case '--'+id    :
                                              var v   = process.argv[k+1];
                                              return v;
                                              
                          }//switch
                          
                    }///for
                    
              }//for
              return def;
              
        }//argv
        
        
        function argv_has(id0){
        
              var ids   = [...arguments];
              
              var nj    = ids.length;
              for(var j=0;j<nj;j++){
              
                    var id    = ids[j];
                    
                    var nk    = process.argv.length;
                    for(var k=0;k<nk;k++){
                    
                          switch(process.argv[k]){
                          
                            case id         :
                            case '-'+id     :
                            case '--'+id    :
                                              return true;
                                              
                          }//switch
                          
                    }///for
                    
              }//for
              
              return false;
              
        }//argv_has
        
        
        
/*

//server-cert:

20-08-26

*/


        function server_cert(dir='./'){
        
              var key;
              var cert;
              
              def();
              load_cert();
              
              return {key,cert};
              
              
              function trim(txt){
              
                    return txt.split('\n').map(line=>line.trim()).join('\n');
                    
              }//trim
              
              
              function load_cert(){
              
                    var fs              = require('node:fs');
                    var load            = '';
                    
                    var fn              = dir+'key.pem';
                    if(fs.existsSync(fn)){
                          key           = fs.readFileSync(fn,'utf8');
                          load         += fn;
                    }
                    
                    var fn              = dir+'cert.pem';
                    if(fs.existsSync(fn)){
                          cert          = fs.readFileSync(fn,'utf8');
                          if(load){
                                load   += ',';
                          }
                          load         += fn;
                    }
                    
                    if(load){
                                                                                      console.log('load_cert',load);
                    }
                    
              }//load_cert
              
              
              function def(){
              
                    key    = `
                          -----BEGIN RSA PRIVATE KEY-----
                          MIIEpAIBAAKCAQEAqvD7kk47a6sNWjX47x7ZuT5aIgQI+W2NaFPJhdsbDw9JkF0k
                          QGo6aWFIedpX5cBUF1zrZK+P7ku4SCbI2Z+Cueg3b6bAzacQ9HUP6UMXaZHs9EXz
                          2IeUXKnJmqjaPtah97Z1oazp5B07gPPYbUsf1YeUGyBj5UQqJU+HSOzhv3Hdfdkq
                          RhtVwQmLZ0v16ayCLYvUBeVuCDm+7G7lLNHsr4+9J9fzip/avP4ZJl0Pz07MpLby
                          tjqLUdgsL8iH2ObmP55NVaFqVxK0KuEhoM1p9p3JbP3QtxwKhtxNdKZGDk+iZ0Uo
                          toH2GjjkHg2CHLPSMySD0+08yN+ZqToJEqO2QQIDAQABAoIBADZWI6F9/KVc2gGy
                          5k4cIFkh2MS3Q6MFj8151LUX0KIY2elpsfxHyAl3QvJ41TfSyugiQTDgHYBB0XId
                          4fpLGeK+TeDPwLmeQWVzUHt1OBv2prt/AOPzNNW/orXmtnkDALkc5oddz3sTT7bN
                          zB3xo0zcq9dzlE1sPXlerkIgCiIwKpDi2y9c97L+SFxswvf0R0dpFPkhCyfAbXL5
                          owHo7hYqLLl7tk+KnMcl+72mp1fNlpUbaMITp5vztry4OL/kCFUdDYd5OFCYClAT
                          pLGBsLQiSAGh+KOWJVShhlkpkpriWhwQWsPp6fYej7FZ18oZ/UgbOebhWqT2n6RJ
                          ZwUuIAECgYEA1gr5v2ITmPO+J3CVWNDTWfyZqk+Dy/RpGRnWjX1FdmYrXDwafjI4
                          h/Y0H+RJ82wlxrRq+SUuRmqBaxa2/nG5Takrg3Qs8X/XHBeGDHrDK7QsQGKGxmOC
                          I2EKCVZCndaKUUrufXQb2sf23uBVoxpkqvENGLsqiq0gCWIvZQpAnVECgYEAzHMZ
                          3LTwDmZjb27JGnuozDnKGMagf8Hg50Fm6tAKfvL5YamSZqg4YFJbC01zABfLQUjy
                          vEB6QfWNlBEFFRm/x9xhD23CVh1sBnoEUHb4IH+OShL+YrzO4YKKwgVrYJfbeT2i
                          rV6nm4R872rS5HdGzfd3vN1wfVYhB+KnZ7AKjfECgYEAiFNTQDbqPne3/Ayzwm62
                          vlCpWpTsX6GasrcHNPS9oixun39UbF32LXp9NnbDNvwBj25n16l7sLOzHA7KnIK4
                          QCNoKIB9A4+l5SmCYj5qQlKuAJAAQSktwPTUXKAJK9hyHla4UUT7XLwRm2CMiqaL
                          yWhgLAlBjjO3/OIBR7xg7RECgYEArWs8lq+LqEtFMPJB9wrJZWHngRiKb5Pe14ns
                          aGTLYl9rFWIm4pjyKRHyVCX/1CZarCfabcArc+N7kgrVys4qlLbkRZgObclLJjs9
                          iZtAYSCRa1etG8eXnEWEuYqrSCXHbpHPeUt+1DWPW+26sTxTfMXadQNINahnIC8r
                          XJJAgaECgYB4ebF/2oodjZeM1QmKuUpABhBLKRwvVV0M/Eyor3b8muC+XpgbOR5q
                          VmW3W2dGFtg91DApwpAdZWNM2LwkYxhSIigirP76F8ByBH+Ag0qLw7Dj1qZf0KZF
                          owZ71DB9vdA02jynFiJVphYPeR/YJBkGMchrYtEdheSaoBhZLbcxcw==
                          -----END RSA PRIVATE KEY-----
                    `;
                    
                    
                    cert   = `
                          -----BEGIN CERTIFICATE-----
                          MIIDcjCCAlqgAwIBAgIBATANBgkqhkiG9w0BAQUFADAlMSMwIQYDVQQDExpsb2Nh
                          bGhvc3QgdGVzdCBjZXJ0aWZpY2F0ZTAeFw0yNTA4MDcxMzM0MDBaFw0yNjA4MDcx
                          MzM0MDBaMCUxIzAhBgNVBAMTGmxvY2FsaG9zdCB0ZXN0IGNlcnRpZmljYXRlMIIB
                          IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqvD7kk47a6sNWjX47x7ZuT5a
                          IgQI+W2NaFPJhdsbDw9JkF0kQGo6aWFIedpX5cBUF1zrZK+P7ku4SCbI2Z+Cueg3
                          b6bAzacQ9HUP6UMXaZHs9EXz2IeUXKnJmqjaPtah97Z1oazp5B07gPPYbUsf1YeU
                          GyBj5UQqJU+HSOzhv3HdfdkqRhtVwQmLZ0v16ayCLYvUBeVuCDm+7G7lLNHsr4+9
                          J9fzip/avP4ZJl0Pz07MpLbytjqLUdgsL8iH2ObmP55NVaFqVxK0KuEhoM1p9p3J
                          bP3QtxwKhtxNdKZGDk+iZ0UotoH2GjjkHg2CHLPSMySD0+08yN+ZqToJEqO2QQID
                          AQABo4GsMIGpMAkGA1UdEwQCMAAwIAYDVR0RBBkwF4IJbG9jYWxob3N0hwR/AAAB
                          hwR/AAACMB0GA1UdDgQWBBSHZcPoMBEl4CkjiDq3EA/JHX72BDALBgNVHQ8EBAMC
                          AvQwOwYDVR0lBDQwMgYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYB
                          BQUHAwEGCCsGAQUFBwMIMBEGCWCGSAGG+EIBAQQEAwIA5zANBgkqhkiG9w0BAQUF
                          AAOCAQEAEbQGZsY4maCkkCbpKTiO2sOZBLlbjVxGIt8/YPBTpA0pppfzRYIL0l+r
                          qDcSIvd+oJx2ctQnxsIABJhwTo6ibOJXpB6g4O7jG1gWciajyQK8MwYVp/UrYfVF
                          FM+JopxryEHzv3pZ6tLWPgZ/uKme9vJ2f62gDxKl+L7glW1OZqlzsgqes5yXIln9
                          GevVRUeoxKO7dvV3oVdI8lauY2MFoTHahkY1TDV0L/ysuaWixulp4qw6sxIuk9Ij
                          oz1EuTyR1PdxBTtvjjb5jGs6uynAtRzBJjoWYcwZWRRJtcpd9Rdhshe1VBo0Fn+L
                          R59dH9TiW6uixGS88c3LslTRbW57qw==
                          -----END CERTIFICATE-----
                    `;
                    
                    key     = trim(key);
                    cert    = trim(cert);
                    
              }//def
              
        }//server_cert
        
        
        
/*

//getmime:

20-08-26

*/


        function getmime(filename){
        
              var list    = {
              
                  // text
                  
                    'txt'       : 'text/plain',
                    'html'      : 'text/html',
                    'htm'       : 'text/html',
                    'css'       : 'text/css',
                    'js'        : 'text/javascript',
                    'json'      : 'application/json',
                    'csv'       : 'text/csv',
                    'xml'       : 'application/xml',
                    'mjs'       : 'text/javascript',
                    'cjs'       : 'text/javascript',
                    'map'       : 'application/json',
                    'wasm'      : 'application/wasm',
                    'manifest'  : 'application/manifest+json',
                    
                    
                  // images
                  
                    'jpg'       : 'image/jpeg',
                    'jpeg'      : 'image/jpeg',
                    'png'       : 'image/png',
                    'gif'       : 'image/gif',
                    'webp'      : 'image/webp',
                    'svg'       : 'image/svg+xml',
                    'ico'       : 'image/x-icon',
                    'bmp'       : 'image/bmp',
                    'tiff'      : 'image/tiff',
                    'avif'      : 'image/avif',
                    'heic'      : 'image/heic',
                    'heif'      : 'image/heif',
                    
                    
                  // audio
                  
                    'mp3'       : 'audio/mpeg',
                    'wav'       : 'audio/wav',
                    'oga'       : 'audio/ogg',
                    'm4a'       : 'audio/mp4',
                    'flac'      : 'audio/flac',
                    'aac'       : 'audio/aac',
                    'opus'      : 'audio/opus',
                    'm3u8'      : 'application/x-mpegURL',
                    
                    
                    
                  // video
                  
                    'mp4'       : 'video/mp4',
                    'webm'      : 'video/webm',
                    'mov'       : 'video/quicktime',
                    'avi'       : 'video/x-msvideo',
                    'mkv'       : 'video/x-matroska',
                    'ogg'       : 'video/ogg',
                    'ogv'       : 'video/ogg',
                    
                    
                  // fonts
                  
                    'woff'      : 'font/woff',
                    'woff2'     : 'font/woff2',
                    'ttf'       : 'font/ttf',
                    'otf'       : 'font/otf',
                    
                    
                  // docs
                  
                    'pdf'       : 'application/pdf',
                    'doc'       : 'application/msword',
                    'docx'      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'xls'       : 'application/vnd.ms-excel',
                    'xlsx'      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ppt'       : 'application/vnd.ms-powerpoint',
                    'pptx'      : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'md'        : 'text/markdown',
                    'odt'       : 'application/vnd.oasis.opendocument.text',
                    'ods'       : 'application/vnd.oasis.opendocument.spreadsheet',
                    
                    
                  // archives
                  
                    'zip'       : 'application/zip',
                    'tar'       : 'application/x-tar',
                    'gz'        : 'application/gzip',
                    'rar'       : 'application/vnd.rar',
                    '7z'        : 'application/x-7z-compressed',
                    
                  // binary
                  
                    'bin'       : 'application/octet-stream',
                    'exe'       : 'application/octet-stream',
                    'dmg'       : 'application/x-apple-diskimage'
                    
                    
              };
              
              var i       = filename.lastIndexOf('.');
              var ext     = filename.slice(i+1);
              
              var def     = 'application/octet-stream';
              var mime    = list[ext]||def
              
              return mime;
              
        }//getmime
        
        
/*

//keys:d

13-11-23

*/


        function keysmod(){
        
          var obj   = {};
          
          
                if(!process.stdin.isTTY){
                                                                                console.log('not tty');
                      return;
                }
                
                var ctrlc   = '\u0003';
                var esc     = String.fromCharCode(27);
                
                process.stdout.setEncoding('utf8');
                
                process.stdin.setRawMode(true);
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                process.stdin.on('data',keypressed);
                
                
                function keypressed(key){
                
                      if(typeof obj.keypressed=='function'){
                            var result    = obj.keypressed(key);
                            if(result===false){
                                  return;
                            }
                      }
                      
                      if(key==='r'){
                            if(typeof obj.reload!=='function'){
                                                                                console.log('reload not enabled');
                                  return;
                            }
                            
                            rem();
                            clear();
                                                                                console.log('reload');
                            obj.reload();
                      }
                      
                      if(
                            (key===ctrlc)   ||
                            (key==='q')     ||
                            (key===esc)
                      ){
                            process.exit();
                      }
                      
                      if(key===' '){
                            clear();
                                                                                console.log('---   clear   ---');
                      }
                      
                      if(key==='-'){
                                                                                console.log('---   ===    ---');
                      }
                      
                }//keypressed
                
                
                obj.rem=function(){return rem()}    //d
                
                function rem(){
                
                      process.stdin.off('data',keypressed);
                      
                }//rem
                
                
                obj.clear=function(){return clear()}    //d
                
                function clear(){
                
                      var esc   = '\x1B';
                      process.stdout.write(esc+'c');
                      //process.stdout.write('\033c');
                      console.clear();
                      
                }//clr
                
                
                
          return obj;
          
        }//keysmod
        
        
        
        
        
        
        
        
        
        
        
        
        