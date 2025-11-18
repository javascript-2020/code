

## file-server

the fs server is a nodejs script that allows interacting with the local file system
such as load, save, delete, create directory etc

its use is simple

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
                         

             


the auth header is the way of securing the server



the server can be interacted with via the library

[file-server.js [ github.com ]](https://github.com/javascript-2020/libs/blob/main/js/io/file-server/file-server.js)





