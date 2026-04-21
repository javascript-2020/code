

<h1 style='display:flex;gap:20px'>
      https-server.js
      <div style='flex:1'></div>
      <input type=button value='download file' onclick='btn.download()' style='font-size:16px'>
      <input type=button value='download complete' onclick='btn.download.complete()' style='font-size:16px'>
</h1>


## Description

the https server is a simple nodejs script that allows serving files from a directory file system over https.  
It has a built in https certificate and key or they can be loaded from the same directory as the script itself.
It restricts access to only serving files within the docroot directory.


its use is fairly simple

```

      node https-server
      
```

## requires

- keys.js
- argv.js




