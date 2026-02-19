


/*

//file-transfer-server.js:d

22-07-25


*/
                                                                                console.clear();
                                                                                terminal_title('webrtc/file-transfer.server.js');
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
          var fs            = require('fs');
          
          
          var keys          = require('keys.js');
          var wsmod         = require('wsmod-v2.0.js');
          wsmod             = wsmod();
          var {key,cert}    = require('server-cert.js');


          var host          = '127.0.0.1';
          var port          = 3002;
          
          var server        = require('https').createServer({key,cert},request).listen({host,port});
          server.on('upgrade',upgrade);
                                                                                console.log(`listening https://localhost:${port}`);
          
          var clients       = [];
          
          
          function request(req,res){
                                                                                console.log(req.method,req.url);
                if(cors(req,res)){
                      return
                }
                
                if(req.headers.mode==='init'){
                                                                                console.log('init');
                      clients   = [];
                      res.end('ok');
                      return;
                }

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
          
          
          
          function terminal_title(str){
                                                                                console.log(str);
                                                                                console.log();
                var esc   = String.fromCharCode(27);
                var c7    = String.fromCharCode(7);
                var cmd   = `${esc}]0;${str}${c7}`;
                process.stdout.write(cmd);
                
          }//terminal_title



          
          
          
