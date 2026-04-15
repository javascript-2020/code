




        const ffi = require('ffi-napi');
        
        
        const user32 = ffi.Library('user32', {
          'GetForegroundWindow': ['int', []],
          'SetWindowPos': ['bool', ['int', 'int', 'int', 'int', 'int', 'int', 'uint']]
        });
        
        
        const hwnd = user32.GetForegroundWindow();
        user32.SetWindowPos(hwnd, -1, 0, 0, 0, 0, 0x0001 | 0x0002);
        
        
        
        
        