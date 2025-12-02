


/*

//file-transfer-server.js:d

22-07-25


*/
                                                                                console.clear();
                                                                                terminal_title('webrtc/webrtc-file-transfer-http-server.js');
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
          var fs                = require('fs');
          
          
          var keys              = require('keys.js');
          var wsmod             = require('wsmod.js');
          wsmod                 = wsmod();
          
          var key;
          var cert;
          if(fs.existsSync('key.pem')){
                                                                                console.log('load key/cert');
                key             = fs.readFileSync('key.pem');
                cert            = fs.readFileSync('cert.pem');
          }
          if(!key){
                                                                                console.log('default key/cert');
                ({key,cert}     = require('server-cert.js'));
          }



          var host              = argv('h','host')||'127.0.0.1';
          var port              = argv('p','port')||3001;


          
          var server    = require('https').createServer({key,cert},request).listen({host,port});
                                                                                console.log(`listening https://${host}:${port}`);
          
          var list          = [];
          var clients       = [];
          
          
          async function request(req,res){
                                                                                //console.log(req.method,req.url);
                if(cors(req,res)){
                      return
                }
                
                switch(req.url){
                
                  case '/'              : request.page(req,res);          break;
                  case '/test'          : request.test(req,res);          break;
                  
                  case '/init'          : request.init(req,res);          break;
                  case '/setup'         : request.setup(req,res);         break;
                  case '/offer'         : request.offer(req,res);         break;
                  case '/answer'        : request.answer(req,res);        break;
                  case '/sdp'           : request.sdp(req,res);           break;
                  case '/ice'           : request.ice(req,res);           break;
                  case '/read'          : request.read(req,res);          break;
                  
                }//switch
                
          }//request

          
          function cors(req,res){
          
                cors.headers(res);
                
                if(req.method!='OPTIONS'){
                      return;
                }
                
                res.writeHead(200);
                res.end();
                
                return true;
                
          }//cors
          
          
          cors.headers    = function(res){
          
                res.setHeader('access-control-allow-origin','*');
                res.setHeader('access-control-allow-headers','mode');
          
          }//headers
          

        
        function nsess(){
          
              var sess      = {};
              sess.clients  = [];
              sess.time     = Date.now();
              
        }//nsess
        
        
        function ncon(){

              var con   = {
                    sdp   : null,
                    ice   : []
              };
              return con;
              
        }//ncon
        

  //:
  
  
        request.page    = function(req,res){
          
              var stream    = fs.createReadStream('file-transfer-http.html');
              
              res.writeHead(200,{'content-type':'text/html'});
              stream.pipe(res);
              
        }//page
        
        
        request.test    = function(req,res){
          
              res.end('webrtc-file-transfer-http-server');
              
        }//test
        
        
        request.init    = function(req,res){

              clients   = [];
              res.end('ok');
        
        }//init
        
        
        request.setup   = async function(req,res){
        
              var body    = '';
              for await(data of req)body   += data;
              
              var mode    = 'master';
              if(clients.length){
                    mode    = 'polite';
              }
              
              clients.push(ncon());
              
              res.end(mode);
              
        }//setup
        
        
        request.offer   = async function(req,res){
          
              var index   = 0;
              if(req.headers.mode=='polite'){
                    index   = 1;
              }
              
              var body    = '';
              for await(data of req)body   += data;
                                                                  console.log('request.sdp',req.headers.mode,index);
                                                                  //console.log(body);
              
              
              clients[index].offer    = body;
              
              res.end('ok');
              
        }//offer
        
        
        request.answer    = async function(req,res){
          
              var index   = 0;
              if(req.headers.mode=='polite'){
                    index   = 1;
              }
              
              var body    = '';
              for await(data of req)body   += data;
                                                                  console.log('request.sdp',req.headers.mode,index);
                                                                  //console.log(body);
              
              
              clients[index].answer    = body;
              
              res.end('ok');
              
        }//answer
        
        
        request.sdp   = async function(req,res){
        
              var index   = 0;
              if(req.headers.mode=='polite'){
                    index   = 1;
              }
              
              var body    = '';
              for await(data of req)body   += data;
                                                                  console.log('request.sdp',req.headers.mode,index);
                                                                  //console.log(body);
              
              
              clients[index].sdp    = body;
              
              res.end('ok');
              
        }//sdp
        
        
        request.ice   = async function(req,res){
        
              var index   = 0;
              if(req.headers.mode=='polite'){
                    index   = 1;
              }
                                                                  console.log('request.ice',req.headers.mode,index);              
              var body    = '';
              for await(data of req)body   += data;
              
              clients[index].ice.push(body);
              
              res.end('ok');
        
        }//ice


        request.read    = function(req,res){
        
              var mode    = 'master';
              var index   = 1;
              if(req.headers.mode=='polite'){
                    mode    = 'polite';
                    index   = 0;
              }

          
              var str   = '';    
              var con   = clients[index];
              
              if(con){                                                                            
                                                                  console.log('request.read',req.headers.mode,index);
                                                                  //console.log(con);
                                                                  console.log(!!con.sdp,con.ice.length);
                    var str   = JSON.stringify(con);
      
                    if(mode=='master'){
                          con.offer     = null;
                    }else{
                          con.answer    = null;
                    }
                    con.ice.length    = 0;
              }

              res.end(str);
              
              
              
                            
/*              
              if(con){              

                                                      
                    if(con.sdp){
                          res.write('sdp\n\n');
                          res.write(con.sdp);
                          res.write('\n\n');
                          con.sdp   = null;
                    }
                    
                    if(con.ice.length){
                          con.ice.forEach(ice=>{
                          
                                res.write('ice\n\n');
                                res.write(ice);
                                res.write('\n\n');
                                
                          });
                          con.ice.length    = 0;
                    }
                    
              }
              
              res.end();
*/


        }//read














/*


          function upgrade(req,socket,head){
          
                var con   = wsmod.upgrade.server(req,socket,onrec,onclose,onerror);
                
                clients.push(con);

                
                var json    = {type:'init'};
                var mode    = 'polite';
                if(clients.length==1){
                      mode    = 'master';
                }
                json.mode   = mode;
                
                con.send.json(json);

                
          }//upgrade
          
          
          function onrec(buf,type,con){
                                                                                //console.log('onrec',type,buf);
                if(type==='text'){
                      var str   = buf.toString();
                      clients.forEach(con2=>{
                      
                            if(con2!==con){
                                  con2.send.text(buf);
                            }
                            
                      });
                }
                      
          }//onrec
          
          
          function onclose(){
          }//onclose
          
          
          function onerror(){
          }//onerror
          
          
*/



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












          
          function terminal_title(str){
                                                                                console.log(str);
                                                                                console.log();
                var esc   = String.fromCharCode(27);
                var c7    = String.fromCharCode(7);
                var cmd   = `${esc}]0;${str}${c7}`;
                process.stdout.write(cmd);
                
          }//terminal_title



          
          
          
