


/*

//file-transfer-server.js:d

22-07-25


*/
                                                                                console.clear();
                                                                                terminal_title('webrtc/file-transfer-http-server.js');
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
          var fs            = require('fs');
          
          
          var keys          = require('keys.js');
          var wsmod         = require('wsmod-v2.0.js');
          wsmod             = wsmod();
          var {key,cert}    = require('server-cert.js');


          var host          = '127.0.0.1';
          var port          = 3001;
          
          var server        = require('https').createServer({key,cert},request).listen({host,port});
                                                                                console.log(`listening https://localhost:${port}`);
          
          var clients       = [];
          
          
          async function request(req,res){
                                                                                console.log(req.method,req.url);
                if(cors(req,res)){
                      return
                }
                
                switch(req.url){
                
                  case '/init'    : request.init(req,res);        break;
                  case '/setup'   : request.setup(req,res);       break;
                  case '/sdp'     : request.sdp(req,res);         break;
                  case '/ice'     : request.ice(req,res);         break;
                  case '/read'    : request.read(req,res);        break;
                  
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
          

        function ncon(){

              var con   = {
                    sdp   : null,
                    ice   : []
              };
              return con;
              
        }//ncon
        

  //:
  
  
        request.init    = function(req,res){

              clients   = [];
              res.end('ok');
        
        }//init
        
        
        request.setup   = function(req,res){
        
              var mode    = 'master';
              if(clients.length){
                    mode    = 'polite';
              }
              
              clients.push(ncon());
              
              res.end(mode);
              
        }//setup
        
        
        
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
        
              var index   = 1;
              if(req.headers.mode=='polite'){
                    index   = 0;
              }

              
              var con   = clients[index];
              
              if(con){
              
                                                                  console.log('request.read',req.headers.mode,index);
                                                                  //console.log(con);
                                                                  console.log(!!con.sdp,con.ice.length);

                                                      
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










          
          function terminal_title(str){
                                                                                console.log(str);
                                                                                console.log();
                var esc   = String.fromCharCode(27);
                var c7    = String.fromCharCode(7);
                var cmd   = `${esc}]0;${str}${c7}`;
                process.stdout.write(cmd);
                
          }//terminal_title



          
          
          
