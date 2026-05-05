
        var jszip;
        export {create_archive,jszip};
        
        async function create_archive({download}){

              download  ||= ='https-server.zip'};

              ({create_archive,jszip}    = await import('https://libs.ext-code.com/js/io/create-archive/create-archive.m.js'));
              
              
              var zip   = {
                    'https-server'   :{directory:{
                          'https-server.js'   : {file:{github:{repo:'code',path:'/nodejs/servers/https-server/https-server.js'}}},
                          
                          'node_modules'      : {directory:{
                                                      'getmime.js'          : {file:{github:{repo:'libs',path:'/js/string/getmime/getmime.js'}}},
                                                      'keys.js'             : {file:{github:{repo:'libs',path:'/nodejs/keys/keys.js'}}},
                                                      'argv.js'             : {file:{github:{repo:'libs',path:'/nodejs/argv/argv.js'}}},
                                                      'server-cert.js'      : {file:{github:{repo:'libs',path:'/nodejs/server-cert/server-cert.js'}}},
                                                      'resolve.js'          : {file:{github:{repo:'libs',path:'/nodejs/resolve/resolve.js'}}},
                                                }}
                    }}
              };
              
              
              var blob    = await create_archive(zip,{download,df:true});
              return blob;              
              
        }//create_archive
        
        
