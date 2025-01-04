  
        var pass          = {};
        pass.saltlen      = 64;
        pass.keylen       = 128;
        pass.digest       = 'sha512';
        pass.iterations   = 500_000;
        pass.gen          = function(password,salt){
        
                                salt        = salt||crypto.randomBytes(pass.saltlen).toString('base64');
                                var buf     = crypto.pbkdf2Sync(password,salt,pass.iterations,pass.keylen,pass.digest);
                                var hash    = buf.toString('base64');
                                return {salt,hash};
                                
                            }//hash
        pass.verify       = function(hash,salt,password){
        
                                var hash2         = pass.gen(password,salt).hash
                                var result        = (hash==hash2);
                                return result;
                                
                            }//verify
  
