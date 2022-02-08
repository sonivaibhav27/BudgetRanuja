package com.ranujabudget;
import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;
import com.google.android.play.core.review.testing.FakeReviewManager;
import com.google.android.play.core.tasks.OnCompleteListener;
import com.google.android.play.core.tasks.Task;

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
    @ReactMethod
    public void rateApp(Callback callback){
        ReviewManager manager = ReviewManagerFactory.create(mContext);
        Task<ReviewInfo> request = manager.requestReviewFlow();
        request.addOnCompleteListener(new OnCompleteListener<ReviewInfo>() {
            @Override
            public void onComplete(@NonNull Task<ReviewInfo> task) {
                if(task.isSuccessful()){
                    ReviewInfo reviewInfo = task.getResult();
                    Activity activity = getCurrentActivity();
                    if (activity == null) {
                        callback.invoke(false, "getCurrentActivity() unsuccessful");
                        return;
                    }
                    Task<Void> flow = manager.launchReviewFlow(activity, reviewInfo);
                    flow.addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> flowTask) {
                            if (flowTask.isSuccessful()) {
                                callback.invoke(true);
                            } else {
                                callback.invoke(false, "launchReviewFlow() unsuccessful");
                            }
                        }
                    });
                }
            }
        });

    }
    @Override
    public String getName() {
        return "CustomNativeModule";
    }

}