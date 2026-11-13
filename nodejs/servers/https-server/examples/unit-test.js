




(async()=>{



        var url   = 'https://127.0.0.1:3002';
        
        var res   = await fetch(`${url}/index.html`);
        var txt   = await res.text();
        console.log(txt);
        
        
        
})();



