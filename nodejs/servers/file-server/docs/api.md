
## API


## command line arguments


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


the auth parameter is the way of securing the server, it specifies the value of a HTTP header 'auth' that must be included with the request







### file.create

creates a file on the server, similar to touch

### file.load

retrieve file contents


### file.save

write or overwrite file data


### file.delete

remove a file




### dir.read

list directory contents


### dir.create

make a new directory

### dir.delete

remove a directory


## dir.clear

clear directory, it is created if it doesnt exist





