/*


  chrome --proxy-server="socks5://127.0.0.1:1080"

  chrome --proxy-server="socks5://127.0.0.1:1080" --proxy-bypass-list="localhost;127.0.0.1"
  chrome://net-internals/#proxy


  curl --proxy socks5://127.0.0.1:1080 https://example.com


*/
                                                                                console.clear();
        var net     = require('net');
        var tls     = require('tls');
        var fs      = require('fs');
        var path    = require('path');
        
                                                                                // Load your MITM cert/key for example.com
        var cert            = fs.readFileSync('cert.pem');
        var key             = fs.readFileSync('key.pem');
        var secureContext   = tls.createSecureContext({cert,key});
        
        var port      = 1080;
        var host      = '127.0.0.1';
        var server    = net.createServer(connection).listen(port,host);
        console.log(`SOCKS5 MITM proxy listening on ${host}:${port}`);


        
        function parseSocks5Request(req){
          
              var cmd     = req[1];
              var atyp    = req[3];
              
              var host;
              var port;
              
                                                                                // only CONNECT
              if(cmd!==0x01){
                    return null; 
              }
        
              switch(atyp){
                
                case 0x01   :
                                                                                // IPv4
                              host    = `${req[4]}.${req[5]}.${req[6]}.${req[7]}`;
                              port    = req.readUInt16BE(8);
                              break;
                    
                case 0x03   :
                                                                                // domain
                              var len   = req[4];
                              host      = req.slice(5,5+len).toString();
                              port      = req.readUInt16BE(5+len);
                              break;

                case 0x04   :                    
                                                                                // IPv6
                              var addr    = req.slice(4,20);
                              var parts   = [];
                              for(var i=0;i<16;i+=2){
                                
                                    var word    = addr.readUInt16BE(i);
                                    var hex     = word.toString(16);
                                    parts.push(hex);
                                    
                              }//for
                              host    = parts.join(':');
                              port    = req.readUInt16BE(20);
                              break;

                default     :
                
                              return null;
                    
              }//switch
              
              return {host,port};
              
        }//parseReq

        
        function connection(client){
                                                                                console.log('client connection');
              client.on('error',()=>client.destroy());
              client.on('close',()=>console.log('client closed'));
              client.once('data',initial);
              
              
              function initial(data){
                                                                                console.log('client1',data[0]);
                                                                                // SOCKS5 greeting: VER, NMETHODS, METHODS...
                    if(data[0]!==0x05){
                                                                                console.log('end1');
                          client.end();
                          return;
                    }
                                                                                // Choose "no auth"
                    client.write(Buffer.from([0x05,0x00]));
        
                    client.once('data',second);
                    
              }//initial
              
              
              function second(data){
                                                                                console.log('client2');
                    var dest    = parseSocks5Request(data);
                    if(!dest){
                                                                                console.log('end2');
                          client.end();
                          return;
                    }
                    
                    var {host,port}   = dest;
                                                                                console.log(host,port);
                                                                                // Send success reply: VER=5, REP=0, RSV=0, ATYP=1, BND.ADDR=0.0.0.0, BND.PORT=0
                    var buf   = Buffer.from([0x05,0x00,0x00,0x01,0,0,0,0,0,0])
                    client.write(buf);
  
                    switch(host){
                      
                      case 'example.com'    : proxy(client,host,port);          break;
                      default               : forward(client,host,port);
                      
                    }//switch
                          
              }//second
              

              function forward(client,host,port){
                                                                                // Non-target traffic: simple TCP forward without TLS termination
                    var remote    = net.connect(port,host,()=>{
                      
                          client.pipe(remote);
                          remote.pipe(client);
                          
                    });
                    remote.on('error',(e)=>client.destroy(e));
                    
              }//forward

              
              function proxy(client,host,port){
                            
                                                                                console.log('start tls');
                                                                                // Wrap client side with TLS server (terminate TLS) and force HTTP/1.1
                    var clientTls   = new tls.TLSSocket(client,{isServer:true,secureContext,ALPNProtocols:['http/1.1']});
                    clientTls.on('error',(e)=>client.destroy(e));
                    clientTls.on('close',()=>console.log('clientTls closed'));
      
                                                                                // Upstream TLS to real server (force http/1.1 for simpler header rewriting)
                    var upstream    = tls.connect({host,port,servername:host,ALPNProtocols:['http/1.1']});
                    upstream.on('error',(e)=>clientTls.destroy(e));
                    upstream.on('close',()=>console.log('upstream closed'));
                    upstream.on('secureConnect',()=>{
                                                                                console.log('remote connected');
      
                          proxy.client(clientTls,upstream);
                          proxy.remote(clientTls,upstream);
                          
                    });
                    
              }//proxy
              
              
              proxy.client    = function(clientTls,upstream){
                                                                                // Buffer the first client request until end of headers, rewrite, then pipe everything
                    var buf     = '';
                    var done    = false;
      
                    clientTls.on('data',chunk=>{
                                                                                console.log('\n\n','client data',done,chunk.length,'['+chunk.toString()+']','\n\n');
                          if(done){
                                                                                // After first request, just pipe through
                                upstream.write(chunk);
                                return;
                          }
                          
                          buf  += chunk;
                                                                                // Look for end of HTTP headers: \r\n\r\n
                          var end   = buf.indexOf('\r\n\r\n');
                          if(end!==-1){
                                                                                console.log('\n\n');
                                                                                console.log('end of headers found');
                                done        = true;
      
                                var hdrs    = buf.slice(0,end+4);
                                var rest    = buf.slice(end+4);
                                                                                console.log(hdrs);
                                upstream.write(hdrs);
                                if(rest){
                                      upstream.write(rest);
                                }
                                                                                // From now on, pipe raw data both ways
                                clientTls.pipe(upstream);
                                //upstream.pipe(clientTls);
                                                                                console.log('\n\n');
                          }
                          
                    });
                                
              }//client
              
              
              proxy.remote    = function(clientTls,upstream){
                                                                                // Buffer the first client request until end of headers, rewrite, then pipe everything
                    var buf     = '';
                    var done    = false;
      
                    upstream.on('data',chunk=>{
                                                                                console.log('\n\n','upstream data',done,chunk.length,'['+chunk.toString()+']','\n\n');
                          if(done){
                                                                                // After first request, just pipe through
                                clientTls.write(chunk);
                                return;
                          }
                          
                          buf  += chunk;
                                                                                // Look for end of HTTP headers: \r\n\r\n
                          var end   = buf.indexOf('\r\n\r\n');
                          if(end!==-1){
                                                                                console.log('\n\n');
                                                                                console.log('end of headers found');
                                done        = true;
      
                                var hdrs    = buf.slice(0,end+4);
                                var rest    = buf.slice(end+4);
                                                                                console.log(hdrs);
                                clientTls.write(hdrs);
                                if(rest){
                                      clientTls.write(rest);
                                }
                                                                                // From now on, pipe raw data both ways
                                //clientTls.pipe(upstream);
                                upstream.pipe(clientTls);
                                                                                console.log('\n\n');
                          }
                          
                    });
                                
              }//remote

        }//connection
        










