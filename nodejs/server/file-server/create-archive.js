

(async()=>{

              var {create_archive}    = await import('https://libs.ext-code.com/js/io/create-archive/create-archive.m.js');
              
              
              var zip   = {
                    'file-server'   :{directory:{
                          'fiile-server.js'   : {file:{github:{repo:'code',path:'/nodejs/server/file-server/file-server.js'}}},
                          
                          'node_modules'        : {directory:{
                                'getmime.js'    : {file:{github:{repo:'libs',path:'/js/string/getmime/getmime.js'}}},
                                'keys.js'       : {file:{github:{repo:'libs',path:'/nodejs/keys/keys.js'}}},
                          }}
                          
                    }}
              };
              
              create_archive(zip,{download:'file-server.zip',df:true});
              
})();

