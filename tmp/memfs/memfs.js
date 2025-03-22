

console.clear();
$.full('#output').replaceChildren();


(async()=>{


//https://raw.githubusercontent.com/openssl/openssl/master/apps/openssl.cnf
//https://github.com/openssl/openssl/blob/master/apps/openssl.cnf

        var url   = 'https://raw.githubusercontent.com/openssl/openssl/master/apps/openssl.cnf';
        var cnf   = await fetch(url).then(res=>res.text());
        
        var memfs   = await import('https://cdn.jsdelivr.net/npm/memfs/+esm');
        var {fs,vol}    = memfs;
        
        //console.log(vol);
        //var Volume    = memfs.Volume;
        
        //var vol = new Volume();
        vol.fromJSON({
              '/usr/local/ssl/openssl.cnf':cnf,
              '/foo'    : 'bar',
              '/foo2'   : 'bar2'
        });

        //console.log(vol.toJSON());        
        
        
        console.log(fs.readFileSync('/foo','utf8'));
        
        
        
        

        var openssl   = await import('https://cdn.jsdelivr.net/npm/openssl.js/+esm');
        openssl       = new openssl.OpenSSL({fs});
        //console.log(openssl);

        
        let result1 = await openssl.runCommand("genrsa -out private.pem");        
        
        
        



})();



