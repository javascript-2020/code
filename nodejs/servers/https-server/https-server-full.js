


/*

//https-server.js:d

20-07-25


*/

                                                                                console.clear();
                                                                                terminal_title('file-server');
                                                                                console.log();
                                                                                console.json=(...args)=>args.forEach(v=>console.log(JSON.stringify(v,null,4)));
                                                                                //console.json(process.argv);
        var fs            = require('fs');
        var path          = require('path');
        
        var dir           = argv('d','dir','.');
        var host          = argv('h','host','127.0.0.1');
        var port          = argv('p','port',3002);
        
        var keys          = keysmod();
        var {key,cert}    = server_cert();
        load_cert();
        
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
                                                                                console.error(err);
        });
        server.listen({host,port});
        
                                                                                console.log(`listening : https://${host}:${port}/`);
                                                                                console.log();
                                                                                console.log('serving :',docroot);
                                                                                console.log();
                                                                                console.log('===');
                                                                                console.log();
        function request(req,res){
        
              res.setHeader('cache-control','no-store');
              res.setHeader('access-control-allow-origin','*');
              res.setHeader('access-control-allow-headers','content-type');
              
              if(cors(req,res,abs)){
                                                                                request.log(req);
                    return;
              }
              
              var url   = transform(req.url);
              
              var {abs,error}   = resolve(url,docroot);
              if(error){
                                                                                request.log(req);
                    badrequest(req,res,error);
                    return;
              }
              
              if(!fs.existsSync(abs)){
                                                                                request.log(req,abs);
                    notfound(req,res,abs);
                    return;
              }
              
              var stat    = fs.statSync(abs);
              
              if(!stat.isFile()){
                                                                                request.log(req,abs);
                    badrequest(req,res,abs);
                    return;
              }
                                                                                request.log(req,abs);
              var mime      = getmime(abs);
              var stream    = fs.createReadStream(abs);
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
              
        }//request
        
        
        request.log   = function(req,abs){
        
              var spc   = [10,20,20];
              var str   = [req.method,req.url];
              if(abs){
                    str.push(abs);
              }
              str   = str.map((str,i)=>str.padEnd(spc[i]));
              str   = str.join(' ');
              
              console.log(str);
              
        }//log
        
        
        function transform(url){
        
              switch(url){
              
                case '/'    :
                              url   = '/index.html';
                                                            break;
              }//switch
              
              return url;
              
        }//transform
        
        
  //:
  
  
        function cors(req,res,abs){
        
              if(req.method!=='OPTIONS'){
                    return;
              }
              
              res.writeHead(200);
              res.end();
              return true;
              
        }//cors
        
        
  //:
  
  
        function notfound(req,res,abs){
        
              res.writeHead(404);
              res.end(req.url+' not found');
              
        }//notfound
        
        
        function badrequest(req,res,reason){
        
              res.writeHead(400);
              res.end(reason);
              
        }//badrequest
        
        
  //:
  
  
        function terminal_title(str){
                                                                                console.log(str);
                                                                                console.log();
              var esc   = String.fromCharCode(27);
              var c7    = String.fromCharCode(7);
              var cmd   = `${esc}]0;${str}${c7}`;
              process.stdout.write(cmd);
              
        }//terminal_title
        
        
        function load_cert(){
        
              var load    = '';
              if(fs.existsSync('key.pem')){
                    key   = fs.readFileSync('key.pem','utf8');
                    load += 'key.pem ';
              }
              if(fs.existsSync('cert.pem')){
                    cert    = fs.readFileSync('cert.pem','utf8');
                    if(load){
                          load   += ',';
                    }
                    load += 'cert.pem';
              }
              if(load){
                                                                                console.log('load_cert',load);
              }
              
        }//load_cert
        
        
  //:
  //libs:
  
/*
        require           = (require=>(path,mod)=>{
                                  try{return require(path)}catch(err){if(err.code!=='MODULE_NOT_FOUND')throw err}
                                  try{return require('./'+path)}catch(err)if(err.code!=='MODULE_NOT_FOUND')throw err}
                                  return mod;
                            })(require);
*/

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
        
        
        
/*

//server-cert:

20-08-26

*/


        function server_cert(){
        
              var key    = `
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
        
        
              var cert   = `
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
        
              return {key,cert};
              
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
                                                                                console.log('---   ...    ---');
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
              
              if(url.indexOf('\\')!=-1){
                                                                                resolve.df && console.log('error .... : ','invalid url ( backslash )');
                    var error   = 'invalid url ( backslash )';
                    return {error};
              }
              
              url         = url.slice(1);
                                                                                resolve.df && console.log('url ...... : ',url);
              var root    = path.resolve(docroot);
              //root       += path.sep;
                                                                                resolve.df && console.log('root ..... : ',root);
              var abs     = path.resolve(docroot,url);
                                                                                resolve.df && console.log('abs ...... : ',abs);
                                                                                
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
              
              
                                                                                resolve.df && console.log('ok ....... : ',abs);
              return {abs};
              
        }//resolve
        