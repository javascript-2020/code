

<h1 style='display:flex;gap:20px'>
      file-server.js
      <div style='flex:1'></div>
      <input type=button value='download file' onclick='btn.download()' style='font-size:16px'>
      <input type=button value='download complete' onclick='btn.download.complete()' style='font-size:16px'>
</h1>


## Description

the file server is a nodejs script that allows interacting with the local file system
such as load, save, delete, create directory etc via a http request from say the browser

the server does have https key and cert built in, however it will load them if there 
are files in its directory named cert.pem and key.pem

its use is fairly simple

```

node fs-server

```

This server can run locally and allow access to the local filesystem from the browser / javascript through https requests

```

        var res   = await fetch('https://localhost:3000/my-file.txt',{headers:{mode:'load',auth:'abc-123'}})
        var txt   = await res.text();
        consolelog(txt);
        
```

## requires

- getmime.js
- keys.js
- 





the server can be interacted with via the client-side library

[file-server.js](/libs/js/io/file-server/file-server.html)
      

<!--
[file-server.js [ github.com ]](https://github.com/javascript-2020/libs/blob/main/js/io/file-server/file-server.js)
-->



```


<script src='https://cdn.jsdelivr.net/gh/javascript-2020/libs/js/io/file-server/file-server.js'></script>

<script>

(async()=>{
  
        var fs    = window['file-server'];
        fs.url    = 'https://localhost:3000';
        fs.auth   = 'password';
        
        var {blob,error}    = await fs.file.load('/tmp/a.txt');
        if(error){
              console.error(error);
              return;
        }
        
        var txt   = await blob.text();
        console.log(txt);
        
})();

</script>

```


