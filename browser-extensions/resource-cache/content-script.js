


/*

//  content-script.js:

14-11-26


*/
                                                                                console.log('content-script.js');
                                                                                
        if(typeof browser=='undefined')browser=chrome;
        
        
        
        var webpage_from      = 'cache-webpage';
        
        var port;
        
        
  //:
  
  
        window.addEventListener('message',onmessage);
        connect();
        
        
        
  //:
  
  
        function onmessage(event){
        
              if(event.source!==window || !event.data || event.data.from!==webpage_from){
                    return;
              }
              
              if(!port)connect();
              
              port.postMessage(event.data);
              //runtime.sendMessage(event.data,response=>window.postMessage(response,'*'));
              
        }//onmessage
        
        
  //:
  
  
        function connect(){
                                                                                console.log('[content-script] connect');
              port    = browser.runtime.connect({name:'resource-cache'});
              
              port.onMessage.addListener(response=>{
                                                                                //console.log('port.onMessage',msg);
                    window.postMessage(response,'*');
                    
              });
              
              port.onDisconnect.addListener(() => {
                                                                                console.log('[content-script] extension connection lost');
                    window.removeEventListener('message',onmessage);
                    port    = null;
                    
              });
              
        }//connect
        
        
        
/*
        chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        
              window.postMessage(message,'*');
              
              if (message.type === "MASTER_LOG_UPDATE") {
                appendLogToDashboard(message.payload);
              }
              
        });
*/





