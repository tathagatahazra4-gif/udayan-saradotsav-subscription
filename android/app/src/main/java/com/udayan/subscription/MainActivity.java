package com.udayan.subscription;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();

        // -------------------------------------------------
        // Disable Xiaomi / Android Force Dark Mode
        // -------------------------------------------------

        if (
            WebViewFeature.isFeatureSupported(
                WebViewFeature.FORCE_DARK
            )
        ) {
            WebSettingsCompat.setForceDark(
                webView.getSettings(),
                WebSettingsCompat.FORCE_DARK_OFF
            );
        }

        if (
            WebViewFeature.isFeatureSupported(
                WebViewFeature.FORCE_DARK_STRATEGY
            )
        ) {
            WebSettingsCompat.setForceDarkStrategy(
                webView.getSettings(),
                WebSettingsCompat.DARK_STRATEGY_WEB_THEME_DARKENING_ONLY
            );
        }

        // -------------------------------------------------
        // Android Back Button
        //
        // If there is web navigation history:
        // go back to the previous page.
        //
        // If there is no history:
        // close the app normally.
        // -------------------------------------------------

        getOnBackPressedDispatcher().addCallback(
            this,
            new OnBackPressedCallback(true) {

                @Override
                public void handleOnBackPressed() {

                    if (webView.canGoBack()) {

                        webView.goBack();

                    } else {

                        // Temporarily disable this callback
                        // and allow Android's normal back
                        // handling to close the Activity.
                        setEnabled(false);

                        getOnBackPressedDispatcher()
                            .onBackPressed();

                        setEnabled(true);
                    }
                }
            }
        );
    }
}