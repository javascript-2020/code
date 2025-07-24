


(async()=>{

console.clear();
console.log('pretty print base64');
console.log();



        var w     = 60;
        
        
        var txt   = await navigator.clipboard.readText();
        
        
        var i     = txt.indexOf(',');
        txt       = txt.slice(i+1);
        
        var parts   = [];
        while(true){
        
              var s   = txt.slice(0,w);
              txt     = txt.slice(w);
              parts.push(s);
              
              if(!txt)break;
              
        }//while
        
        
        parts     = parts.map(str=>"'"+str+"'");
        parts     = parts.map(str=>str.padEnd(w+5,' ')+'+');
        
        var str   = parts.pop();
        var i     = str.lastIndexOf("'");
        str       = str.slice(0,i+1);
        parts.push(str);


        
        var txt   = parts.join('\n');
        console.log(txt);

        
        navigator.clipboard.writeText(txt);
        
        
})();


