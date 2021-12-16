package com.ranujabudget;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class CustomNativeModule extends ReactContextBaseJavaModule{
    public static ReactApplicationContext mContext;
    CustomNativeModule(ReactApplicationContext context){
        super(context);
        mContext = context;
    }

    @ReactMethod
    public void getAppVersion(Callback callback)  {
        try {
          PackageInfo packageInfo =   mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
          callback.invoke(packageInfo.versionName);
        }
        catch (Exception e){
            callback.invoke(null);
        }
    }
    @Override
    public String getName() {
        return "CustomNativeModule";
    }

}