


/*

//  extension.js:

01-11-26


*/
                                                                                console.clear();
                                                                                console.log('extension.js');
                                                                                
        if(typeof browser=='undefined')browser=chrome;
        
        
        
        var tab_list        = new Set();
        
        var from            = 'resource-cache-extension';
        var webpage_from    = 'resource-cache-webpage';
        var port_name       = 'resource-cache';
        var cur_port;
        
        
        var urls            = [
                                    `https://localhost/html/resource-cache.html`,
                                    `https://127.0.0.1/html/resource-cache.html`,
                                    `https://resource-cache.dev/*`
                              ];
                              
                              
        var ok              = 'ok';
        
        
        var runtime         = {};
        var tabs            = {};
        var action          = {};
        var dnr             = {};
        
        
        
  //:
  
  
        setTimeout(init,50);
        
        function init(){
                                                                                console.log('init');
                                                                                
                                                                                
              //delete_all();
              
              
              chrome.action.onClicked.addListener(action.onclicked);
              
              
              browser.runtime.onConnect.addListener(runtime.onconnect);
              browser.runtime.onMessage.addListener(runtime.onmessage);
              
              
              tabs.setup();
              browser.tabs.onRemoved.addListener(tabs.onremoved);
              
              
              if(!browser.declarativeNetRequest.onRuleMatchedDebug){
                                                                                console.log('dnr.onRuleMatchedDebug');
                    browser.declarativeNetRequest.onRuleMatchedDebug.addListener(dnr.match);
                    
              }
              
              
              
        }//init
        
        
  //:
  
  
        action.onclicked    = async function(tab){
        
              var existing    = await browser.tabs.query({url:urls});
              
              if(existing.length>0){
                                                                                console.log(existing[0]);
                    browser.tabs.update(existing[0].id,{active:true});
                    browser.windows.update(existing[0].windowId,{focused:true});
              }else{
                    //browser.tabs.create({url:urls[0]});
              }
              
        }//onclicked
        
        
  //:
  
  
        tabs.setup    = async function setup(){
        
              var tabs    = await browser.tabs.query({url:urls});
              for(var tab of tabs){
                                                                                console.log(tab);
                    var promise   = browser.scripting.executeScript({
                          target    : {tabId:tab.id},
                          files     : ['content-script.js']
                    })
                    promise.catch(err=>{
                                                                                console.log('error tab',tab.id,tab.title,tab.url)
                                                                                console.error(err);
                    });
                    
              }//for
              
        }//setup
        
        
        tabs.onremoved    = function(tabId){
                                                                                console.log('tab closed',tabId);
              var tab;
              for(var tab2 of tab_list){
              
                    if(tab2.id===tabId){
                          tab   = tab2;
                          break;
                    }
                    
              }//for
              tab_list.delete(tab);
              
        }//onremoved
        
        
  //:
  
  
        runtime.onconnect   = function(port){
        
              if(port.name!==port_name)return;
              
              cur_port      = port;
              var sender    = port.sender;
              
              port.onMessage.addListener(request=>{
              
                    runtime.onmessage(request,sender,runtime.response);
                    
              });
              
              port.onDisconnect.addListener(()=>{
                                                                                console.log('port disconnect');
              });
              
        }//onconnect
        
        
        runtime.response    = function(data){
        
              cur_port.postMessage(data);
              
        }//response
        
        
        runtime.onmessage   = function(request,sender,response){
        
              if(request.from!==webpage_from)return;
              
              runtime.rec(request,sender,response);
                                                                                //  return true to respond asynchronously
              return true;
              
        }//onmessage
        
        
        runtime.rec   = function(request,sender,response){
                                                                                console.log('rec',request);
              var {id,action,payload}   = request;
              
              var reply   = payload=>response({from,id,payload});
              
              runtime.rec[action](payload,reply,sender);
              
        }//rec
        
        
        runtime.rec.ping    = function(payload,reply,sender){
                                                                                console.log('rec.ping',sender);
              if(sender.tab && sender.tab.id){
                                                                                console.log('tab opened',sender.tab.id);
                    tab_list.add(sender.tab);
              }
              
              reply({pong:'pong'});
              
        }//ping
        
        
        runtime.rec.reload    = function(){
                                                                                console.log('rec.reload');
              browser.runtime.reload();
              
        }//reload
        
        
        runtime.rec.add   = async function(payload,reply){
                                                                                console.log('rec.add',payload);
              var rule    = payload;
                                                                                console.log(rule);
              var {ok,error}      = await add(rule);
              if(error){
                                                                                console.log(error);
                    reply({error});
                    return;
              }
              
              reply({ok});
              
        }//add
        
        
        runtime.rec.read   = async function(payload,reply){
                                                                                console.log('rec.read',payload);
              var {rules,error}   = await read();
              
              reply({rules,error});
              
        }//read
        
        
        runtime.rec.delete    = async function(payload,reply){
                                                                                console.log('rec.delete',payload);
              var {id}    = payload;
              
              await del(id);
              
              reply({ok});
              
        }//delete
        
        
        runtime.rec['delete-all']   = async function(payload,reply){
                                                                                console.log('rec.delete-all');
              await delete_all();
              
              reply({ok});
              
        }//delete-all
        
        
  //:
  
  
        async function add(rule){
                                                                                console.log('add');
                                                                                console.log(rule);
              var err;
              try{
              
                    await browser.declarativeNetRequest.updateDynamicRules({
                          removeRuleIds   : [rule.id],
                          addRules        : [rule]
                    });
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.message;
                    return {error};
              }
              return {ok};
              
        }//add
        
        
        async function read(){
                                                                                console.log('read');
              var rules   = await browser.declarativeNetRequest.getDynamicRules();
                                                                                console.log(rules);
              return {rules};
              
        }//read
        
        
        async function del(id){
        
              await browser.declarativeNetRequest.updateDynamicRules({removeRuleIds:[id]});
              
              return {ok};
              
        }//del
        
        
        async function delete_all(){
                                                                                console.log('delete_all');
              var rules           = await browser.declarativeNetRequest.getDynamicRules();
              var removeRuleIds   = rules.map(r=>r.id);
                                                                                console.log(removeRuleIds);
              await browser.declarativeNetRequest.updateDynamicRules({removeRuleIds});
              
              return {ok};
              
        }//all
        
        
  //:
  
  
        dnr.match   = function(info){
                                                                                console.log('[DNR Match Debug]',{
                                                                                      ruleId      : info.rule.ruleId,
                                                                                      initiator   : info.request.initiator,
                                                                                      url         : info.request.url,
                                                                                      type        : info.request.type
                                                                                });
              var payload   = {
                    request     : info.request,
                    rule        : info.rule,
                    timestamp   : new Date().toLocaleTimeString()
              };
              
              for(let tabId of tabs){
              
                    var data      = {from,action:'dnr',payload};
                    var promise   = browser.tabs.sendMessage(tabId,data);
                    promise.catch(err=>{
                                                                                //  If a tab somehow failed or went rogue, drop it from the set
                                                                                console.log(tabId,'removed');
                          tabs.delete(tabId);
                          
                    });
                    
              }//for
              
              
        }//match
        
        
  //:
  
  
        function new_id(){
        
              var uint32    = new Uint32Array(1);
              self.crypto.getRandomValues(uint32);
                                                                                //  keep values bound
              var int       = (uint32[0]%100_000)+1;
              return int;
              
        }//new_id
        
        
        
  //:
  //:
  //  notes:
  
  
/*



// Clear network cache and cache storage for a specific origin only
chrome.browsingData.remove(
    {
        origins: ["https://example.com"] // Must match the exact origin
    },
    {
        cache: true,         // Standard HTTP cache
        cacheStorage: true   // Cache API storage (if the site uses it)
    },
    () => {
        console.log("Cache successfully cleared for example.com");
    }
);









*/








