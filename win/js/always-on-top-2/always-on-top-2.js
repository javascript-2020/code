




        const ffi = require('ffi-napi');
        
        
        const user32 = ffi.Library('user32', {
          'GetForegroundWindow': ['int', []],
          'SetWindowPos': ['bool', ['int', 'int', 'int', 'int', 'int', 'int', 'uint']]
        });
        
        HWND_TOPMOST    = -1
        SWP_NOMOVE      = 0x0002
        SWP_NOSIZE      = 0x0001
        
        const hwnd = user32.GetForegroundWindow();
        user32.SetWindowPos(hwnd,HWND_TOPMOST, 0, 0, 0, 0, 0x0001 | SWP_NOMOVE);
        
        
        
        
        