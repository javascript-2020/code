      var buffers = {};
      buffers.mem = [];
      buffers.copy = function () {
            var copy = [];
            buffers.mem.forEach(buf => copy.push(structuredClone(buf)));
            return copy;
      }; //copy
      buffers.set = function (copy) {
            buffers.mem.length = 0;
            copy.forEach(buf => buffers.mem.push(structuredClone(buf)));
      }; //set
      buffers.clear = function () {
            buffers.mem.length = 0;
      };
      //buffers.encoder               = new TextEncoder();
      //buffers.decoder               = new TextDecoder();
      buffers.add = function (uint8) {
            [...arguments].forEach(uint8 => buffers.mem.push(uint8));
      }; //add
      buffers.add.arraybuffer = function (buf) {
            [...arguments].forEach((buf, i) => {
                  console.log('buffers.add.arraybuffer', i);
                  var uint8 = new Uint8Array(buf);
                  buffers.mem.push(uint8);
            });
      }; //arraybuffer
      buffers.add.string = function (str) {
            [...arguments].forEach(str => {
                  var uint8 = buffers.encoder.encode(str);
                  buffers.mem.push(uint8);
            });
      }; //string
      buffers.len = function () {
            var size = 0;
            buffers.mem.forEach(buf => (size += buf.byteLength));
            return size;
      }; //len
      buffers.peek = {};
      buffers.peek.rd=function(len){
      
            var uint8   = buffers.rd(len,false);
            return uint8;
            
      }//peek.rd
      buffers.peek.slice=function(i1,i2){
      
            var uint8   = buffers.rd(i2+1,false);
            uint8       = uint8.slice(i1,i2+1);
            return uint8;
            
      }//peek.slice
      buffers.peek.uint16=function(offset){
            var uint8     = buffers.peek.slice(offset,offset+2);
            var view      = new DataView(uint8.buffer);
            var num       = view.getUint16(0);
            return num;
      }//uint16
      buffers.peek.uint64=function(offset){
      
            var uint8     = buffers.peek.slice(offset,offset+8);
            var view      = new DataView(uint8.buffer);
            var bigint    = view.getBigUint64(0);
            var num       = Number(bigint);
            return num;
            
      }//peek.bigint
      buffers.peek.number = function (offset) {
            var uint8 = buffers.rd(offset + 1, false);
            if (!uint8) {
                  return uint8;
            }
            var num = uint8[offset];
            return num;
      }; //peek.number
      buffers.rd = function (len, remove = true) {
            var info = [];
            var t = 0;
            var flag = false;
            var n = buffers.mem.length;
            for (var i = 0; i < n; i++) {
                  var buf2 = buffers.mem[i];
                  if (t + buf2.byteLength > len) {
                        var n1 = len - t;
                        info.push({index: i, num: n1});
                        t += n1;
                  } else {
                        info.push(i);
                        t += buf2.byteLength;
                  }
                  if (t == len) {
                        flag = true;
                        break;
                  }
            } //for
            
            if (!flag) {
                  return null;
            }
            
            var t = len;
            var buf = new Uint8Array(len);
            var buf2, buf3;
            var n = info.length;
            for (var j = n - 1; j >= 0; j--) {
                  var o = info[j];
                  if (typeof o == 'number') {
                        buf2 = buffers.mem[o];
                        t -= buf2.byteLength;
                        buf.set(buf2, t);
                  } else {
                        buf2 = buffers.mem[o.index];
                        buf3 = buf2.slice(0, o.num);
                        t -= o.num;
                        buf.set(buf3, t);
                  }
            } //for
            
            if (remove) {
                  var n = info.length;
                  for (var j = n - 1; j >= 0; j--) {
                        var o = info[j];
                        if (typeof o == 'number') {
                              buffers.mem.splice(o, 1);
                        } else {
                              buf3 = buf2.slice(n1);
                              buffers.mem.splice(o.index, 1, buf3);
                        }
                  } //for
            } //remove
            
            return buf;
      }; //rd
      buffers.rd.simple = function (len) {
            var copy = buffers.copy();
            var t = 0;
            var n = buffers.mem.length;
            for (var i = 0; i < n; i++) {
                  var buf2 = buffers.mem[i];
                  if (t + buf2.byteLength > len) {
                        var n1 = len - t;
                        var buf3 = buf2.slice(0, n1);
                        buf.set(buf3, t);
                        var buf3 = buf2.slice(n1);
                        buffers.mem.splice(i, 1, buf3);
                        t += n1;
                  } else {
                        buf.set(buf2, t);
                        t += buf2.byteLength;
                        buffers.mem.splice(i, 1);
                        i--;
                        n--;
                  }
                  if (t == len) {
                        return buf;
                  }
            } //for
            buffers.set(copy);
            return null;
      }; //rd.simple
      buffers.rd.string = function (len) {
            var uint8 = buffers.rd(len);
            if (!uint8) {
                  return uint8;
            }
            var str = buffers.decoder.decode(uint8);
            return str;
      }; //string
      buffers.rd.number = function () {
            var uint8 = buffers.rd(1);
            var num = uint8[0];
            return num;
      }; //rd.number
      buffers.display = function (pretty = true) {
            console.log('buffers :', buffers.mem.length);
            buffers.mem.forEach(uint8 => {
                  var n = uint8.length;
                  var str = '';
                  for (var i = 0; i < n; i++) {
                        var b = uint8[i];
                        str += b + ' ';
                  } //for
                  console.log(str);
            });
      }; //display
      
      return buffers;
