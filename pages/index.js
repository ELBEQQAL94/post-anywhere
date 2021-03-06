import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import { useInitFbSDK } from "../hooks/facebook";

// You can find your Page ID
// in the "About" section of your page on Facebook.
const PAGE_ID = "108312214887984";

export default function Home() {
  // Initializes the Facebook SDK
  const isFbSDKInitialized = useInitFbSDK();

  // App state
  const [fbUserAccessToken, setFbUserAccessToken] = useState();
  const [fbPageAccessToken, setFbPageAccessToken] = useState();
  const [postText, setPostText] = useState();
  const [isPublishing, setIsPublishing] = useState(false);

  // Logs in a Facebook user
  const logInToFB = useCallback(() => {
    window.FB.login((response) => {
      setFbUserAccessToken(response.authResponse.accessToken);
    });
  }, []);

  // Logs out the current Facebook user
  const logOutOfFB = useCallback(() => {
    window.FB.logout(() => {
      setFbUserAccessToken(null);
      setFbPageAccessToken(null);
    });
  }, []);

  // Checks if the user is logged in to Facebook
  useEffect(() => {
    if (isFbSDKInitialized) {
      window.FB.getLoginStatus((response) => {
        setFbUserAccessToken(response.authResponse?.accessToken);
      });
    }
  }, [isFbSDKInitialized]);

  // Fetches an access token for the page
  useEffect(() => {
    if (fbUserAccessToken) {
      window.FB.api(
        `/${PAGE_ID}?fields=access_token&access_token=${fbUserAccessToken}`,
        ({ access_token }) => setFbPageAccessToken(access_token)
      );
    }
  }, [fbUserAccessToken]);

  // Publishes a post on the Facebook page
  const sendPostToPage = useCallback(() => {
    setIsPublishing(true);

    window.FB.api(
      `/${PAGE_ID}/feed`,
      "POST",
      {
        message: postText,
        access_token: fbPageAccessToken,
      },
      () => {
        setPostText("");
        setIsPublishing(false);
      }
    );
  }, [postText, fbPageAccessToken]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Post anywhere App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="app">
        <header id="app-header">
          <p id="logo-text">FB Page API</p>
          {fbUserAccessToken ? (
            <button onClick={logOutOfFB} className="btn confirm-btn">
              Log out
            </button>
          ) : (
            <button onClick={logInToFB} className="btn confirm-btn">
              Login with Facebook
            </button>
          )}
        </header>
        <main id="app-main">
          {fbPageAccessToken ? (
            <section className="app-section">
              <h3>Write something to the page</h3>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Message..."
                rows="8"
                disabled={isPublishing}
              />
              <button
                onClick={sendPostToPage}
                className="btn confirm-btn"
                disabled={!postText || isPublishing}
              >
                {isPublishing ? "Publishing..." : "Publish"}
              </button>
            </section>
          ) : (
            <h2 className="placeholder-container">Welcome!</h2>
          )}
        </main>
      </div>
    </div>
  );
}
