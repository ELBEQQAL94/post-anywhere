import { useState } from "react";

// Injects the Facebook SDK into the page
const injectFbSDKScript = () => {
  if (process.browser) {
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }
  };
  
  export const useInitFbSDK = () => {
    const [isInitialized, setIsInitialized] = useState(false);
  
    // Initializes the SDK once the script has been loaded
    // https://developers.facebook.com/docs/javascript/quickstart/#loading
    if (process.browser) {
      // Client-side-only code
      window.fbAsyncInit = function () {
        window.FB.init({
          // Find your App ID on https://developers.facebook.com/apps/
          appId: "326183229249164",
          cookie: true,
          xfbml: true,
          version: "v8.0",
        });
    
        window.FB.AppEvents.logPageView();
        setIsInitialized(true);
      };
    }
  
    injectFbSDKScript();
  
    return isInitialized;
  };