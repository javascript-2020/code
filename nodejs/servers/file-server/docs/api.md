
## API


## command line arguments


the server supports the following command line arguments :

|arg          | description                     | default   | example          |
|-------------|---------------------------------|-----------|------------------|
|-p, -port    | specify port                    | 3000      | -p 3001          |
|             |                                 |           |                  |
|-h, -host    | specify host                    | 127.0.0.1 | -h 127.0.0.1     |
|             |                                 |           |                  |
|-auth        | specify authorisation header    | auth-123  | -auth p455w0rd   |
|             |                                 |           |                  |
| -d, -dir    | specify the source directory    |           | -d /work/tmp/    |
|             |                                 |           |                  |
| -s, -serve  | serve the files over https      |           | -s               |
|             |                                 |           |                  |


during operation the server supports the folling keypresses :

|arg                    | description                     |
|-----------------------|---------------------------------|
|   esc / q /ctrl+c     | quit                            |
|                       |                                 |
|  space                | clear screen                    |
|                       |                                 |
| -   ( hyphen )        | insert a marker in the output   |
|                       |                                 |
|   i                   | display the main server info    |
|                       |                                 |


---


### start the server

```

node file-server -p 3001 -auth my-password -d /work/tmp/

```


the auth parameter is the way of securing the server, it specifies the value of a HTTP header 'auth' that must be included with each request




---


### file.create

creates a file on the server, similar to touch

```

        var res     = await fetch(`https://${host}:${port}/dir/touch.txt`,{headers:{auth:'auth-123',mode:'file.create'}});
        var json    = await res.json();
      
```


### file.load

retrieve file contents

```
        var res     = await fetch(`https://${host}:${port}/dir/test.txt`,{headers:{auth:'auth-123',mode:'file.load'}});
        var json    = await res.json();

```


### file.save

write or overwrite file data

```
        var res     = await fetch(`https://${host}:${port}/dir/test.txt`,{headers:{auth:'auth-123',mode:'file.save'},body:'helloworld',method:'post'});
        var json    = await res.json();

```


### file.delete

remove a file

```
        var res     = await fetch(`https://${host}:${port}/dir/del.txt`,{headers:{auth:'auth-123',mode:'file.delete'}});
        var json    = await res.json();
```


---


### dir.read

list directory contents

```
        var res   = await fetch(`https://${host}:${port}/dir/`,{headers:{auth:'auth-123',mode:'dir.read'}});
        if(!res.ok){
              var json    = await res.json();
              console.log(json);
              return;
        }
        var {files,dirs}    = await res.json();
```


### dir.create

create a new directory

```
        var res     = await fetch(`https://${host}:${port}/dir`,{headers:{auth:'auth-123',mode:'dir.create'}});
        var json    = await res.json();
```


## dir.clear

clear directory, it is created if it doesnt exist

```
        var res     = await fetch(`https://${host}:${port}/dir/`,{headers:{auth:'auth-123',mode:'dir.clear'}});
        var json    = await res.json();
```


### dir.delete

remove a directory

```
        var res     = await fetch(`https://${host}:${port}/dir/`,{headers:{auth:'auth-123',mode:'dir.delete'}});
        var json    = await res.json();
```





