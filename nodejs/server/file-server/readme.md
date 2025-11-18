

## file-server

the file server is a nodejs script that allows interacting with the local file system
such as load, save, delete, create directory etc via a http request from say the browser

the server does have https key and cert built in, however it will load them if there 
are files in its directory named cert.pem and key.pem

its use is fairly simple

```

node fs-server

```


it supports the following command line arguments

|arg       | description                     | example        |
|----------|---------------------------------|----------------|
|-p, -port | specify port                    | -p 3001        |
|          |                                 |                |
|-auth     | specify authorisation header    | -auth p455w0rd |
|          |                                 |                |
| -d, -dir | specify the source directory    | -d /work/tmp   |
|          |                                 |                |

                                   
```

node file-server -p 3001 -auth my-password -d /work/tmp

```


the auth header is the way of securing the server



the server can be interacted with via the library

[file-server.js [ github.com ]](https://github.com/javascript-2020/libs/blob/main/js/io/file-server/file-server.js)



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



