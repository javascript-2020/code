


                                                                                console.clear();
        var dh                  = diffie_hellman();
                                                                                console.log('bits',dh.bits);
        var {p,g,q}             = dh.init;
                                                                                console.log('prime',p,'primitive root',g,' [','q',q,']');
        var alice               = dh.rnd;
        var A                   = dh.power(g,alice,p);
        
        var bob                 = dh.rnd;
        var B                   = dh.power(g,bob,p);
                                                                                console.log('alice',alice,'=>',A);
                                                                                console.log('bob',bob,'=>',B);
        var alice_secret        = dh.power(B,alice,p);
        var bob_secret          = dh.power(A,bob,p)
                                                                                console.log('secret',alice_secret);
                                                                                //console.log('secret,bob_secret);
                                                                                console.log(alice_secret==bob_secret);
                                                                                
                                                                                console.log(dh.time);
        function diffie_hellman(bits=1024){
        
          var obj   = {};
          
              Object.defineProperty(obj,'init',{get:init});
              Object.defineProperty(obj,'rnd',{get:rnd_n});
              Object.defineProperty(obj,'time',{get:time});
              
              obj.bits    = bits;
              
              var start   = performance.now()
              
              
              function init() {
              
                    var q       = gen(()=>rnd_n());
                    var p       = gen(()=>q*rnd_n()+1n);
                    var g       = rnd_n()%p;
                    return {p,g,q};
                    
              }//init
              
              
              function rnd_n(){
              
                    var bs      = '0b';
                    for(var i=0;i<bits;i++){
                    
                          bs   += Math.floor(Math.random()*2);
                          
                    }//for
                    return BigInt(bs);
                    
              }//rnd
              
              
              function gen(fn){
              
                    var p;
                    while(!isPrime(p=fn()));
                    return p;
                    
              }//gen
              
              
              function isPrime(prime){
              
                    var result    = lowlevel();
                    if(!result){
                          return false;
                    }
                    
                    result    = miller_rabin();
                    return result;
                    
                    
                    function lowlevel(){
                    
                          for(var div of list){
                          
                                if(prime%div==0n){
                                      return false;
                                }
                                
                                if(div**2n>=prime){
                                      return true;
                                }
                                
                          }//for
                          
                          return true;
                          
                    }//lowlevel
                    
                    
                    function miller_rabin(){
                    
                          var s   = 0;
                          var d   = prime-1n;
                          
                          while(d%2n==0n){
                          
                                d   >>= 1n;
                                s    += 1;
                                
                          }//while
                          
                          var num   = 20;
                          for(var i=0;i<num;i++){
                          
                                var a   = rnd_n();
                                if(composite()){
                                      return false
                                }
                                
                          }//for
                          
                          return true
                          
                          
                          function composite(){
                          
                                var x   = power(a,d,prime);
                                
                                for(var i=0;i<s;i++){
                                
                                      var y   = power(x,2n,prime);
                                      
                                      if(y==1n && x!=1n && x!=prime-1n){
                                            return true;
                                      }
                                      
                                      x   = y;
                                      
                                }//for
                                
                                if(y!=1){
                                      return true;
                                }
                                
                                return false;
                                
                          }//composite
                          
                    }//miller_rabin
                    
              }//isPrime
              
              
              obj.power=power;
              function power(x,y,p){
              
                    var res   = 1n;
                    x         = x%p;
                    
                    while(y>0){
                    
                        if(y&1n){
                              res   = (res*x)%p;
                        }
                        
                        y   = y>>1n;
                        x   = (x*x)%p;
                        
                    }//while
                    
                    return res;
                    
              }//power
              
              
              var list   = [
                    2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n,
                    31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n,
                    71n, 73n, 79n, 83n, 89n, 97n, 101n, 103n,
                    107n, 109n, 113n, 127n, 131n, 137n, 139n,
                    149n, 151n, 157n, 163n, 167n, 173n, 179n,
                    181n, 191n, 193n, 197n, 199n, 211n, 223n,
                    227n, 229n, 233n, 239n, 241n, 251n, 257n,
                    263n, 269n, 271n, 277n, 281n, 283n, 293n,
                    307n, 311n, 313n, 317n, 331n, 337n, 347n, 349n
              ];
              
              
              function time(){
              
                    var time    = (performance.now()-start).toFixed(1)+'ms';
                    return time;
                    
              }//time
              
              
          return obj;
          
        }//diffie-hellman
        
        
        
        
        
        
        
        
        
