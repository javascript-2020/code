


/*

unit test for file-server

11-11-26


*/



(async()=>{
                                                                                console.clear();
                                                                                console.log('unit test for file-server');
                                                                                console.log();
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
                                                                                
        var auth    = 'auth-123';
        var url     = 'https://127.0.0.1:3010';
                                                                                console.log('dir.create');
        var res   = await fetch(url+'/dir',{headers:{auth,mode:'dir.create'}});
        if(!res.ok){
              var json    = await res.json();
              console.json(json);
              return;
        }
        
                                                                                console.log('file.save');
        var res   = await fetch(url+'/dir/test.txt',{headers:{auth,mode:'file.save'},body:'helloworld',method:'post'});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        
                                                                                console.log('file.load');
        var res   = await fetch(url+'/dir/test.txt',{headers:{auth,mode:'file.load'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        var txt   = await res.text();
        console.log(txt);
        
                                                                                console.log('file.create');
        var res   = await fetch(url+'/dir/touch.txt',{headers:{auth,mode:'file.create'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        
        
        var res   = await fetch(url+'/dir/del.txt',{headers:{auth,mode:'file.create'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        
                                                                                console.log('file.delete');
        var res   = await fetch(url+'/dir/del.txt',{headers:{auth,mode:'file.delete'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        
                                                                                console.log('dir.read');
        var res   = await fetch(url+'/dir/',{headers:{auth,mode:'dir.read'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        var {files,dirs}    = await res.json();
        console.log('=== dir list ===');
        console.json(dirs);
        console.json(files);
        
                                                                                console.log('dir.clear');
        var res   = await fetch(url+'/dir/',{headers:{auth,mode:'dir.clear'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        
        var res   = await fetch(url+'/dir/',{headers:{auth,mode:'dir.read'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        var {files,dirs}    = await res.json();
        console.log('=== dir list ===');
        console.json(dirs);
        console.json(files);
        
                                                                                console.log('dir.delete');
        var res   = await fetch(url+'/dir/',{headers:{auth,mode:'dir.delete'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        
        
})();



