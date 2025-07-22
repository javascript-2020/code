



      var url   = 'https://localhost:3010/';
      

      const stream    = new ReadableStream({start}).pipeThrough(new TextEncoderStream());
      
      function start(c){
      
          let count     = 0;
          const timer   = setInterval(send,1000);
          
          function send(){
                                                                        console.log('sent');
                c.enqueue('Hello');
                
                if(count==5){
                      clearInterval(timer);
                      c.close();
                }
                count++;
                
          }//send
          
      }//start
      
      
      const resp      = await fetch('test',{method:'post',body:stream,duplex:'half'});
      
      
      
      
      
      
      const reader    = resp.body.pipeThrough(new TextDecoderStream()).getReader();
                                                                        console.log('response stream aquired');
      while(true){
      
            const {value,done}    = await reader.read();
            if(done)break;
                                                                        console.log('fetch',value);
                                                                        
      }//while
      
      console.log('done');


