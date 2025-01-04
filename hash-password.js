
                                                                                //console.clear();
                                                                                console.log('password hash');
                                                                                
        var mode          = 'browser';
        
        
        var iterations    = 500_000;
        var keylen        = 128;
        var digest        = 'SHA-512';
        var saltlen       = 64;

        var password      = 'password2';


        setTimeout(init,50);
        
        async function init(){
        
              var start         = Date.now();
      
              
              var {salt,hash}   = await gen(password);
              console.log('salt',salt);
              console.log('hash',hash);

              
              console.log(Date.now()-start);
              start   = Date.now();

              
              var result        = await verify(hash,salt,password);
              console.log(result);
      
      
              var time          = Date.now()-start;
              console.log(time);
              
        }//init


        
        async function gen(password){
        
            var salt          = gen_salt();
            var hash          = await derive(password,salt);
            return {salt,hash};
            
        }//hash
        
        async function verify(hash,salt,password){
        
            var hash2         = await derive(password,salt);
            var result        = (hash==hash2);
            return result;
            
        }//verify


  //:
  
        function gen_salt(){
        
              return gen_salt[mode]();
              
        }//gen_salt
        
        gen_salt.browser=function(){
        
              var uint8   = new Uint8Array(saltlen);
              self.crypto.getRandomValues(uint8);
              var buf     = uint8.buffer;
              var str     = buf_str(buf);
              var b64     = btoa(str);
              return b64;
              
        }//browser
        
        
        gen_salt.nodejs=function(){
        
              var salt    = crypto.randomBytes(saltlen).toString('base64');
              return salt;
              
        }//nodejs
        
  //:
  
  
        function derive(password,salt){
        
            return derive[mode](password,salt);
            
        }//derive
        
        derive.browser=async function(password,salt){
                                                                          // First, create a PBKDF2 "key" containing the password
            var buf                   = str_buf(password);
            
            var format                = 'raw';
            var keyData               = buf;
            var algorithm             = {name:'PBKDF2'};
            var extractable           = false;
            var keyUsages             = ['deriveKey'];
            
            var baseKey               = await window.crypto.subtle.importKey(format,keyData,algorithm,extractable,keyUsages);
            
            
                                                                          // Derive a key from the password
            
                                                                          //  Key we want.Can be any AES algorithm ("AES-CTR", "AES-CBC", 
                                                                          //  "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC")
                                                                          //  Extractable
            salt                      = str_buf(salt);
            
            var algorithm             = {name:'PBKDF2',salt,iterations,hash:digest};
            var derivedKeyAlgorithm   = {name:'AES-CBC',length:keylen};
            var extractable           = true;
            var keyUsages             = ['encrypt','decrypt'];
            
            var aesKey                = await window.crypto.subtle.deriveKey(algorithm,baseKey,derivedKeyAlgorithm,extractable,keyUsages);
            
                                                                            // Export it so we can display it
            var keyBytes              = await window.crypto.subtle.exportKey('raw',aesKey);
            var str                   = buf_str(keyBytes);
            var b64                   = btoa(str);
            return b64;
                
        }//browser
        
        derive.nodejs=async function(password,salt){
        
            digest            = digest.replaceAll('-','');
            digest            = digest.toLowerCase();
            
            var buf           = crypto.pbkdf2Sync(password,salt,iterations,keylen,digest);
            var hash          = buf.toString('base64');
        
        }//nodejs
        
  //:
  
        
        function str_buf(byteString){
            
            var n           = byteString.length;
            var byteArray   = new Uint8Array(n);
            for(var i=0;i<n;i++){
            
                byteArray[i]    = byteString.codePointAt(i);
                
            }//for
            return byteArray;
            
        }//str_buf

        
        function  buf_str(buf){
        
              var byteArray     = new Uint8Array(buf);
              var n             = byteArray.length;
              var byteString    = '';
              for(var i=0;i<n;i++){
              
                  byteString   += String.fromCodePoint(byteArray[i]);
                  
              }//for
              return byteString;
              
        }//buf_str
        



