
## API


## command line arguments


the server supports the following command line arguments

|arg       | description                         | default   | example        |
|----------|-------------------------------------|-----------|----------------|
|          |                                     |           |                |
|-h, -host | specify the ip address to listen on | 127.0.0.1 | -h 127.0.0.2   |
|          |                                     |           |                |
|-p, -port | specify port                        | 3002      | -p 3001        |
|          |                                     |           |                |
| -d, -dir | the directory to server             |           |   -d www/      |
|          |                                     |           |                |


during operation the server supports the folling keypresses :

|arg                    | description                     |
|-----------------------|---------------------------------|
|   esc / q / ctrl+c    | quit                            |
|                       |                                 |
|  space                | clear screen                    |
|                       |                                 |
| - ( hyphen )          | insert a marker in the output   |
|                       |                                 |
|   i                   | display the main server info    |
|                       |                                 |


---

### start the server
                                   
```

        node https-server
        
        node https-server -p 3001
        
        node https-server -p 3001 -h 127.0.0.2 -d www/
        

```








