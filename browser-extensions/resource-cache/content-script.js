






                                                                                console.log('content-script.js');
        var runtime           = chrome?.runtime||browser?.runtime
        var webpage_from      = 'cache-webpage';
        
        
  //:
  
  
        window.addEventListener('message',onmessage);
        
        function onmessage(event){
        
              if(event.source!==window || !event.data || event.data.from!==webpage_from){
                    return;
              }
              
              port.postMessage(event.data);
              //runtime.sendMessage(event.data,response=>window.postMessage(response,'*'));
              
        }//onmessage
        
        
  //:
  
  
        var port    = runtime.connect({name:'resource-cache'});
        
        port.onMessage.addListener(response=>{
                                                                                //console.log('port.onMessage',msg);
              window.postMessage(response,'*');
              
        });
        
        port.onDisconnect.addListener(() => {
                                                                                console.log("[Content] Extension connection lost. Cleaning up listeners and UI...");
              window.removeEventListener('message',onmessage);
              
        });
        
        
        
/*
        chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        
              window.postMessage(message,'*');
              
              if (message.type === "MASTER_LOG_UPDATE") {
                appendLogToDashboard(message.payload);
              }
              
        });
*/





