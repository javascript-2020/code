

/*

https://blog.mozilla.org/webrtc/perfect-negotiation-in-webrtc/
https://w3c.github.io/webrtc-pc/#perfect-negotiation-example

*/






setTimeout(setup,50);

function setup(){

        var win1;
        var iframe1       = document.createElement('iframe');
        iframe1.setAttribute('style',style);
        iframe1.srcdoc    = srcdoc;
        iframe1.onload    = e=>{
              win1    = iframe1.contentWindow;
              win1.eval(peer.toString());
              complete();
        };
        document.body.append(iframe1);
        
        var win2
        var iframe2       = document.createElement('iframe');
        iframe2.setAttribute('style',style);
        iframe2.srcdoc    = srcdoc;
        iframe2.onload    = e=>{
              win2    = iframe2.contentWindow;
              win2.eval(peer.toString());
              complete();
        };
        document.body.append(iframe2);
        
        var c=0;
        function complete(){
              c++;
              if(c!==2)return;
              win1.peer(win2,false);
              win2.peer(win1,true);
        }
        
}



        function peer(other,polite){
        
        
        
        
                window.onmessage          = onmsg;
                
                
                
                var makingOffer           = false;
                var ignoreOffer           = false;
                var pc                    = new RTCPeerConnection();
                pc.ontrack                = e=>{
                                                  $('video').srcObject   = e.streams[0];
                                                  $('video').play();
                }
                pc.onicecandidate         = ({candidate}) => send({candidate});
                pc.onnegotiationneeded    = onneg;
                
                
                var dc                    = pc.createDataChannel("both",{negotiated:true,id:0});
                dc.onopen                 = e=>log('dc open');
                dc.onmessage              = e=>log(e.data);
                
                
                var stream;
                var transceiver;
                var video;
                
                async function start(){
                
                      try {
                      
                            if(!stream){
                                  stream                  = await navigator.mediaDevices.getUserMedia({video:true});
                                  $('video').srcObject    = stream;
                                  $('video').play();
                                  transceiver             = pc.addTransceiver(stream.getTracks()[0],{streams:[stream]});
                            }else{
                                  stream.getTracks().forEach(track=>track.stop());
                                  transceiver.stop();
                                  stream    = null;
                            }
                            
                      }
                      
                      catch(err){
                      
                            log(err);
                            
                      }
                      
                }//start
                
                
                
                async function onneg(){
                
                      try{
                      
                            makingOffer = true;
                            const offer = await pc.createOffer();
                            if (pc.signalingState != "stable") return;
                            await pc.setLocalDescription(offer);
                            send({description: pc.localDescription});
                            
                      }
                      
                      catch(e){
                      
                            log(`ONN ${e}`);
                            
                      }
                      
                      finally {
                      
                            makingOffer = false;
                            
                      }
                      
                }//onneg
                
                
                
                
                async function onmsg({data:{description,candidate}}){
                                                                                  console.log(description,candidate);
                                                                                  
                                                                                  
                      try {
                      
                            if (description) {
                            
                                  const offerCollision = description.type == "offer" && (makingOffer || pc.signalingState != "stable");
                                  ignoreOffer = !polite && offerCollision;
                                  if (ignoreOffer)return;
                                  
                                  if (offerCollision) {
                                        await Promise.all([
                                              pc.setLocalDescription({type: "rollback"}),
                                              pc.setRemoteDescription(description)
                                        ]);
                                  } else {
                                        await pc.setRemoteDescription(description);
                                  }
                                  
                                  if (description.type == "offer") {
                                        await pc.setLocalDescription(await pc.createAnswer());
                                        send({description: pc.localDescription});
                                  }
                                  
                            }else if (candidate) {
                            
                                  try {
                                        await pc.addIceCandidate(candidate);
                                  }
                                  
                                  catch (e) {
                                        if (!ignoreOffer) log(e);
                                  }
                                  
                            }
                            
                      }
                      
                      catch (e) {
                            log(e);
                      }
                      
                }//onmessage
                
                
                
                
                
                    $('[type=button]').onclick    = start;
                    $('[type=text]').onkeydown    = e=>{if(e.key==='Enter')dc.send(e.target.value)};
                    function $(sel){return document.querySelector(sel)}
                    function log(txt){msg.innerHTML += txt+'<br>';}
                    function send(msg){
                    
                          other.postMessage(JSON.parse(JSON.stringify(msg)),"*");
                          
                    }//send
                    
        }//peer
        
        
        
        
        var srcdoc    = `
        
              <style>
                    video {
                          width:300px;
                          height:300px;
                          border:1px solid lightgray;
                    }
              </style>
              <video></video><br>
              <input type=button value='start'><br>
              <input type=text><br>
              <div id=msg></div>
              
        `;
        
        
        var style=`
              width:50%;
              height:500px;
        `;
        
        
