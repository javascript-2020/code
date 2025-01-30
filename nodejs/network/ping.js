



        var raw       = require ('raw-socket');
        
        
        var socket    = raw.createSocket({protocol:raw.Protocol.ICMP});
        socket.on('message',onmessage);
        
        
        
        var source    = '192.168.1.108';
        
                                                                                //[type]x1, [code]x1, [chksum]x2, [id]x2, [seq]x2, [data]x4
        var header    = Buffer.alloc(12);
                                                                                //type
        header.writeUInt8(0x8,0);
                                                                                //id
        header.writeUInt16LE(process.pid,4);
        header.writeUInt16LE(checksum(header),2);
        
        socket.send(header,0,12,source,function(err,bytes){
        
              if(err){
                    console.log(err);
              }
              
        });
        
        
        function onmessage(buffer,source){
                                                                                //[type]x1, [code]x1, [chksum]x2, [id]x2, [seq]x2, [data]x4
                                                                                // offset = 20
              var offset    = 20;
              var type      = buffer.readUInt8(offset);
              var code      = buffer.readUInt8(offset+1);
              socket.close();
              
              var result    = parseEcho(type,code);
              console.log(result);
              
        }//onmessage
        
        
        
        function checksum(array) {
        
              var buffer    = Buffer.from(array);
              var sum       = 0;
              var n         = buffer.length;
              
              for(var i=0;i<n;i+=2){
              
                    sum  += buffer.readUIntLE(i,2);
                    
              }//for
              
              sum   = (sum >> 16)+(sum & 0xFFFF);
              sum  += (sum >> 16);
              sum   = ~sum;
              
              var unsigned    = (new Uint16Array([sum]))[0];
              return unsigned;
              
        }//checksum
        
        
        
        function parseEcho(type,code){
        
              var ECHOMessageType               = ['REPLY','NA','NA','DESTINATION_UNREACHABLE','SOURCE_QUENCH','REDIRECT']; //etc
              var DestinationUnreachableCode    = ['NET','HOST','PROTOCOL','PORT','FRAGMENTATION','ROUTE_FAILED','NET_UNKNOWN','HOST_UNKNOWN','HOST_ISOLATED','NET_PROHIBITED','HOST_PROHIBITED','NET_UNREACHABLE','HOST_UNREACHABLE','COMM_PROHIBITED','HOST_PRECEDENCE','PRECEDENCE_CUTOFF'];
              var RedirectCode                  = ['NETWORK','HOST','SERVICE_NETWORK','HOST_NETWORK'];
              
              var type2   = 'OTHER';
              var code2   = 'NO_CODE';
              
              if(type<ECHOMessageType.length){
                    type2   = ECHOMessageType[type];
              }
              
              switch(type){
              
                case 3    :
                                                                                //DESTINATION_UNREACHABLE
                            code2   = DestinationUnreachableCode[code];
                            break;
                            
                case 5    :
                                                                                //REDIRECT
                            code2   = RedirectCode[code];
                            break;
                            
              }//switch
              
              var result    = {
                    result    : (type==0),
                    type      : type2,
                    code      : code2
              };
              return result;
              
        }//parseEcho
        
        
        
        
        
        
        
        
