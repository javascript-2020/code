


/*

extension.js

01-11-26


*/
                                                                                console.clear();
                                                                                console.log('extension.js');
                                                                                
        if(typeof browser=='undefined')browser=chrome;
        
        
        
        var tabs            = new Set();
        
        var from            = 'resource-cache-extension';
        var webpage_from    = 'resource-cache-webpage';
        var port_name       = 'resource-cache';
        
        var ok              = 'ok';
        
        var urls            = [
                                    `https://localhost/html/resource-cache.html`,
                                    `https://127.0.0.1/html/resource-cache.html`,
                                    `https://resource-cache.dev/*`
                              ];
                              
                              
        //delete_all();
        
        
        
  //:
  
  
  
        setup();
        
        async function setup(){
        
              var tabs    = await browser.tabs.query({url:urls});
              for(var tab of tabs){
                                                                                      console.log(tab);
                    var promise   = browser.scripting.executeScript({target:{tabId:tab.id},files:['content-script.js']})
                    promise.catch(err=>{
                                                                                      console.log('error tab',tab.id,tab.title,tab.url)
                                                                                      console.error(err);
                    });
                    
              }//for
              
        }//setup
        
        
        browser.runtime.onConnect.addListener(port=>{
        
              if(port.name!==port_name)return;
              
              var sender    = port.sender;
              
              port.onMessage.addListener(request=>{
              
                    var response    = data=>port.postMessage(data);
                    
                    onmessage(request,sender,response);
                    
              });
              
        });
        
        browser.runtime.onMessage.addListener(onmessage);
        
        
        browser.tabs.onRemoved.addListener(tabId=>{
                                                                                console.log('tab closed',tabId);
              tabs.delete(tabId);
              
        });
        
        
        chrome.action.onClicked.addListener(async tab=>{
        
              var existing    = await browser.tabs.query({url:urls});
              
              if(existing.length>0){
                                                                                console.log(existing[0]);
                    browser.tabs.update(existing[0].id,{active:true});
                    browser.windows.update(existing[0].windowId,{focused:true});
              }else{
                    //browser.tabs.create({url:urls[0]});
              }
              
        });
        
        
        
        var err;
        try{
        
              browser.declarativeNetRequest.onRuleMatchedDebug.addListener(match);
              
        }//try
        catch(err2){
        
              err   = err2;
              
        }//catch
        if(err){
                                                                                console.error(err.message);
        }
        
        
  //:
  
  
        function onmessage(request,sender,response){
        
              if(request.from!==webpage_from)return;
              rec(request,sender,response);
              return true;
              
        }//onmessage
        
        
        function rec(request,sender,response){
                                                                                console.log('rec',request);
              var {id,action,payload}   = request;
              
              var reply   = payload=>response({from,id,payload});
              
              rec[action](payload,reply,sender);
                                                                                //  return true to respond asynchronously
              return true;
              
        }//rec
        
        
        rec.ping    = function(payload,reply,sender){
                                                                                console.log('rec.ping',sender);
              if(sender.tab && sender.tab.id){
                                                                                console.log('tab opened',sender.tab.id);
                    var id    = sender.tab.id;
                    tabs.add(id);
              }
              
              reply({pong:'pong'});
              
        }//ping
        
        
        rec.reload    = function(){
                                                                                console.log('rec.reload');
              browser.runtime.reload();
              
        }//reload
        
        
        rec.add   = async function(payload,reply){
                                                                                console.log('rec.add',payload);
              var rule    = payload;
                                                                                console.log(rule);
              var {ok,error}      = await add(rule);
              if(error){
                    reply({error});
                    return;
              }
              reply({ok});
              
        }//add
        
        
        rec.read   = async function(payload,reply){
                                                                                console.log('rec.read',payload);
              var {rules,error}   = await read();
              reply({rules,error});
              
        }//read
        
        
        rec.delete    = async function(payload,reply){
                                                                                console.log('rec.delete',payload);
              var {id}    = payload;
              
              await del(id);
              
              reply({ok});
              
        }//delete
        
        
        rec['delete-all']   = async function(payload,reply){
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
              
                    await browser.declarativeNetRequest.updateDynamicRules({removeRuleIds:[rule.id],addRules:[rule]});
                    
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
  
  
        function match(info){
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
        
        
        
        
        
        
        
        
        