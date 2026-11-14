


/*

//  content-script.js:

14-11-26


*/

(()=>{

        var id    = crypto.randomUUID();
                                                                                console.log('[content-script] start',id);
        /*
        if(document.documentElement.dataset.active==='true'){
              console.log("Content script already active in this tab. Aborting duplicate injection.");
              // Optionally signal the old instance to ping back, or exit early
              return;
        }
        document.documentElement.dataset.active   = 'true';
        */
        
        
        
        if(typeof browser=='undefined')browser=chrome;
        
        
        
        var webpage_from      = 'resource-cache-webpage';
        var cs_from           = 'resource-cache-cs';
        var port_name         = 'resource-cache';
        
        var port;
        
        
  //:
  
  
        window.postMessage({action:'init',id,from:cs_from},'*');
        
        window.addEventListener('message',onmessage);
        connect();
        
        
        
  //:
  
  
        function destroy(){
                                                                                console.log('[content-script] destroy',id);
              window.removeEventListener('message',onmessage);
              if(port)port.disconnect();
              
        }//destoy
        
        
  //:
  
  
        function onmessage(e){
        
              if(e.source!==window || !e.data)return;
              
              switch(e.data.from){
              
                case webpage_from   : onmessage.webpage(e);       break;
                case cs_from        : onmessage.cs(e);            break;
                
              }//switch
              
        }//onmessage
        
        
  //:
  
  
        onmessage.webpage   = function(e){
        
              if(!port)connect();
              
              port.postMessage(e.data);
              //runtime.sendMessage(e.data,response=>window.postMessage(response,'*'));
              
        }//webpage
        
        
  //:
  
  
        onmessage.cs    = function(e){
        
              switch(e.data.action){
              
                case 'init'   : onmessage.cs.init(e);       break;
                
              }//switch
              
        }//cs
        
        
        onmessage.cs.init   = function(e){
        
              if(e.data.id===id)return;
              destroy();
              
        }//init
        
        
  //:
  
  
        function connect(){
                                                                                console.log('[content-script] connect');
              port    = browser.runtime.connect({name:port_name});
              
              port.onMessage.addListener(response=>{
                                                                                //console.log('port.onMessage',msg);
                    window.postMessage(response,'*');
                    
              });
              
              port.onDisconnect.addListener(()=>{
                                                                                console.log('[content-script] extension connection lost');
                    //window.removeEventListener('message',onmessage);
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





})();




