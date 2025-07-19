        function webrtc(type,socket,callback,sdp,ice){
                                                                                console.log('---  webrtc  ---');
              socket.onmessage                = onmsg;
              
              
              var makingOffer                 = false;
              var ignoreOffer                 = false;
              var polite                      = (type==='inv');
                                                                                console.log(name,polite);
              var pc                          = new RTCPeerConnection();
              pc.onicecandidate               = onice;
              pc.oniceconnectionstatechange   = oniceconstatechange;
              
              pc.onnegotiationneeded          = onneg;
              
              var dc                          = pc.createDataChannel('both',{negotiated:true,id:0});
              dc.send.json                    = sendjson;
              dc.onopen                       = onopen;
              
              
              webrtc.rec                      = rec;
              
              
              function process(){
              
                    sdp.forEach(json=>rec.sdp(json));
                    ice.forEach(json=>rec.ice(json));
                    
              }//process
              
              
              var timer   = setTimeout(restart,500);
              
              function restart(){
                                                                                console.log('*****   restart   *****');
                    //pc.restartIce();
                    webrtc(type,socket,callback,sdp,ice);
                    
                    
              }//restart
              
              
              function onopen(){
                                                                                console.log(name,'dc.onopen');
                    clearTimeout(timer);
                    callback(pc,dc);
                    
              }//onopen
              
              
              function sendjson(json){
              
                    var str   = JSON.stringify(json);
                    dc.send(str);
                    return true;
                    
              }//sendjson
              
              
              function onmsg(e){
              
                    var json    = JSON.parse(e.data);
                    rec(json);
                    
              }//onnmsg
              
              
              function rec(json){
              
                    var result    = true;
                    switch(json.type){
                    
                      case 'sdp'    : rec.sdp(json);       break;
                      case 'ice'    : rec.ice(json);       break;
                      
                      default       : result    = false;
                      
                    }//switch
                    return result;
                    
              }//rec
              
              
              rec.sdp=async function(json){
                                                                                log(name,'rec - sdp',json.sdp);
                    try {
                    
                        var sdp               = new RTCSessionDescription(json.sdp);
                        var offerCollision    = (sdp.type==='offer' && (makingOffer || pc.signalingState!=='stable'));
                        ignoreOffer           = (!polite && offerCollision);
                        if(ignoreOffer){
                              return;
                        }
                        
                        if(offerCollision){
                              await Promise.all([
                                    pc.setLocalDescription({type:'rollback'}),
                                    pc.setRemoteDescription(sdp)
                              ]);
                        } else {
                              await pc.setRemoteDescription(sdp);
                        }
                        
                        if(sdp.type==='offer'){
                              await pc.setLocalDescription(await pc.createAnswer());
                              var sdp     = pc.localDescription;
                              json        = {type:'sdp',sdp};
                              socket.send.json(json);
                        }
                        
                    }//try
                    
                    catch(err){
                                                                                console.log(name,err);
                    }
                    
              }//sdp
              
              
              rec.ice=async function(json){
                                                                                log(name,'rec - ice',json.ice);
                    try {
                    
                          await pc.addIceCandidate(json.ice);
                          
                    }
                    
                    catch(err) {
                    
                          if(!ignoreOffer){
                                                                                console.log(name,err);
                          }
                          
                    }
                    
              }//ice
              
              
              function onice(e){
              
                    if(e.candidate){
                                                                                log(name,'onice');
                          var candidate   = e.candidate;
                          var ice         = candidate;
                          var json        = {type:'ice',ice};
                          socket.send.json(json);
                    }
                    
              }//onice
              
              
              async function onneg(){
                                                                                console.log(name,'negotiation needed');
                      try{
                      
                            makingOffer   = true;
                            const offer   = await pc.createOffer();
                            if(pc.signalingState!=='stable'){
                                                                                console.log(name,'exit');
                                  return;
                            }
                            await pc.setLocalDescription(offer);
                            var sdp     = pc.localDescription;
                            var json    = {type:'sdp',sdp};
                            socket.send.json(json);
                            
                      }
                      
                      catch(e){
                                                                                log(`ONN ${e}`);
                      }
                      
                      finally {
                      
                            makingOffer   = false;
                            
                      }
                      
              }//onneg
              
              
              function oniceconstatechange(){
              
                    if(pc.iceConnectionState==='failed'){
                                                                                console.log('iceconnectionstate failed');
                          pc.restartIce();
                    }
                    
              }//oniceconstatechange
              
              
              process();
              
        }//webrtc
