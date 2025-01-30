


/*

//dchp_ip_requests.js:d

30-01-25

*/


        var dgram       = require('dgram');
        
        
        
        var clients     = {};
        var listener    = dgram.createSocket('udp4');
        
        listener.on('message',onmessage);
        listener.bind(67,()=>console.log('socket created'));
        
        
        
        function onmessage(msg,rinfo){
                                                                                console.log('message');
              var data    = udp(msg,rinfo);
                                                                                console.log(data);
                                                                                
              if(
                    data.op=='BOOTPREQUEST'                       &&
                    data.options.dhcpMessageType=='DHCPREQUEST'   &&
                    !data.ciaddr                                  &&
                    data.options.clientIdentifier
              ){
                    var date              = new Date().toUTCString();
                    var hostname          = data.options.hostName;
                    var address           = data.options.requestedIpAddress;
                    var client_type       = data.options.clientIdentifier.type;
                    var client_address    = data.options.clientIdentifier.address;
                                                                                console.log('DHCPREQUEST',hostname,address);
                                                                                console.log(client_type,client_address);
                    clients[address]   = {name:hostname,address,date};
                    
              }
              
              
        }//onmessage
        
        
  //:
  
  
        var BOOTPMessageType    = ['NA','BOOTPREQUEST','BOOTPREPLY'];
        var ARPHardwareType     = ['NA','HW_ETHERNET','HW_EXPERIMENTAL_ETHERNET','HW_AMATEUR_RADIO_AX_25','HW_PROTEON_TOKEN_RING','HW_CHAOS','HW_IEEE_802_NETWORKS','HW_ARCNET','HW_HYPERCHANNEL','HW_LANSTAR'];
        var DHCPMessageType     = ['NA','DHCPDISCOVER','DHCPOFFER','DHCPREQUEST','DHCPDECLINE','DHCPACK','DHCPNAK','DHCPRELEASE','DHCPINFORM'];
        
        
        function udp(msg,rinfo){
        
              var type      = ARPHardwareType[msg.readUInt8(1)];
              var address   = readAddressRaw(msg,28,msg.readUInt8(2));
              var sname     = trimNulls(msg.toString('ascii',44,108));
              var file      = trimNulls(msg.toString('ascii',108,236));
              
              var p   = {
                    op        : BOOTPMessageType[msg.readUInt8(0)],
                                                                          // htype is combined into chaddr field object
                    hlen      : msg.readUInt8(2),
                    hops      : msg.readUInt8(3),
                    xid       : msg.readUInt32BE(4),
                    secs      : msg.readUInt16BE(8),
                    flags     : msg.readUInt16BE(10),
                    ciaddr    : readIpRaw(msg, 12),
                    yiaddr    : readIpRaw(msg, 16),
                    siaddr    : readIpRaw(msg, 20),
                    giaddr    : readIpRaw(msg, 24),
                    chaddr    : {type,address},
                    sname     : sname,
                    file      : file,
                    magic     : msg.readUInt32BE(236),
                    options   : {}
              };
              
              
              var offset    = 240;
              var code      = 0;
              
              while(code!=255 && offset<msg.length){
              
                    code    = msg.readUInt8(offset++);
                    
                    switch(code){
                    
                      case 0      :
                                                                                // pad
                                    continue;
                                    
                      case 255    :
                                                                                // end
                                    break;
                                    
                      case 12     :
                                                                                // hostName
                                    offset    = readString(msg,offset,p.options,'hostName');
                                    break;
                                    
                      case 50     :
                                                                                // requestedIpAddress
                                    offset    = readIp(msg,offset,p.options,'requestedIpAddress');
                                    break;
                                    
                      case 53     :
                                                                                // dhcpMessageType
                                    var len                     = msg.readUInt8(offset++);
                                    var mtype                   = msg.readUInt8(offset++);
                                    p.options.dhcpMessageType   = DHCPMessageType[mtype];
                                    break;
                                    
                      case 58     :
                                                                                // renewalTimeValue
                                    var len                       = msg.readUInt8(offset++);
                                    p.options.renewalTimeValue    = msg.readUInt32BE(offset);
                                    offset                       += len;
                                    break;
                                    
                      case 59     :
                                                                                // rebindingTimeValue
                                    var len                         = msg.readUInt8(offset++);
                                    p.options.rebindingTimeValue    = msg.readUInt32BE(offset);
                                    offset                         += len;
                                    break;
                                    
                      case 61     :
                                                                                // clientIdentifier
                                    var len                       = msg.readUInt8(offset++);
                                    var type                      = ARPHardwareType[msg.readUInt8(offset)];
                                    var address                   = readAddressRaw(msg,offset+1,len-1);
                                    p.options.clientIdentifier    = {type,address};
                                    offset                       += len;
                                    break;
                                    
                      case 81     :
                                                                                // fullyQualifiedDomainName
                                    var len                               = msg.readUInt8(offset++);
                                    var flags                             = msg.readUInt8(offset);
                                    var name                              = msg.toString('ascii',offset+3,offset+len);
                                    p.options.fullyQualifiedDomainName    = {flags,name};
                                    offset                               += len;
                                    break;
                                    
                      default     :
                                    var len   = msg.readUInt8(offset++);
                                    offset   += len;
                                                                                console.log(
                                                                                      'Unhandled DHCP option',
                                                                                      code,'/',len+'b'
                                                                                );
                                    break;
                                    
                    }//switch
                    
              }//while
              
              return p;
              
        }//udp
        
  //:
  
        function trimNulls(str){
        
              var idx   = str.indexOf('\u0000');
              return (-1===idx) ? str : str.substr(0,idx);
              
        }//trimnulls
        
        
        function readIpRaw(msg,offset){
        
              if(0===msg.readUInt8(offset)){
                    return;
              }
              
              var ip    = msg.readUInt8(offset++)+'.'   +
                          msg.readUInt8(offset++)+'.'   +
                          msg.readUInt8(offset++)+'.'   +
                          msg.readUInt8(offset++);
              return ip;
              
        }//readipraw
        
        
        function readIp(msg,offset,obj,name){
        
              var len     = msg.readUInt8(offset++);
              obj[name]   = readIpRaw(msg, offset);
              return offset+len;
              
        }//readip
        
        
        function readString(msg,offset,obj,name){
        
              var len     = msg.readUInt8(offset++);
              obj[name]   = msg.toString('ascii',offset,offset+len);
              offset     += len;
              return offset;
              
        }//readstring
        
        
        function readAddressRaw(msg,offset,len){
        
              var addr    = '';
              
              if(len===0){
                    return addr;
              }
              
              while(len--){
              
                    var b   = msg.readUInt8(offset++);
                    addr   += (b+0x100).toString(16).substr(-2);
                    if(len>0){
                          addr   += ':';
                    }
                    
              }//while
              return addr;
              
        }//readaddressraw
        
        
        function readHex(msg,offset,obj,name){
        
              var len     = msg.readUInt8(offset++);
              obj[name]   = readHexRaw(msg,offset,len);
              offset     += len;
              return offset;
              
        }//readhex
        
        
        function readHexRaw(msg,offset,len){
        
              var data    = '';
              while(len--){
              
                    var b   = msg.readUInt8(offset++);
                    data   += (b+0x100).toString(16).substr(-2);
                    
              }//while
              return data;
              
        }//readhexraw
        
        
        
        
        
        
        
        
        
