#include <napi.h>
#include <windows.h>

Napi::Value SetAlwaysOnTop(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    HWND hwnd = GetForegroundWindow();
    if (!hwnd) return Napi::Boolean::New(env, false);

    BOOL result = SetWindowPos(
        hwnd,
        HWND_TOPMOST,
        0, 0, 0, 0,
        SWP_NOMOVE | SWP_NOSIZE
    );

    return Napi::Boolean::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("setAlwaysOnTop", Napi::Function::New(env, SetAlwaysOnTop));
    return exports;
}

NODE_API_MODULE(alwaysontop, Init)

      
      
      
