////////////////////////////////////////////////
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./contentScript.css";

const App: React.FC<{}> = () => {
  const [first, setFirst] = useState<boolean>();

  useEffect(() => {
    chrome.storage.local.get("isInstalled", function (data) {
      if (data.isInstalled !== undefined) {
        setFirst(data.isInstalled);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (first === true) {
        adAdBlocker();
        console.log(first);
      } else if (first === false) {
        removeAdBlocker();
        console.log(first);
      }
    }, 10);
  }, [first]);

  
  ////////////////// removing YTs ads //////////////////////
  const adAdBlocker = () => {

    console.log("adBlocker running");
    //blocking unwanted ads from some popular websites
    function otherAds() {
      const divs = document.getElementsByTagName("div");
      for (const div of divs) {
        // console.log("filter function loop is running");
        const classesToCheck = [
          "ad",
          "promo",
          "banner",
          "GoogleActiveViewElement",
          "desktopAd",
        ];
        if (
          classesToCheck.some((className) => div.classList.contains(className))
        ) {
          div.style.display = "none";
          // console.log("div blocked");
        }
      }
    }

   
    function getDom() {
      const targetNode =
        document.getElementById("movie_player") || document.body;

      selfObserver(targetNode);
    }

    // selfObserver for ytADS///
    const selfObserver = (documentNode: HTMLElement) => {
      const observer = new MutationObserver(() => {

           // Call the function to collect the counts
        const { counts, totalCount } = adFunction();
    
console.log(counts,"total counts")
    console.log("Total Count:", totalCount);
      });

      const config = {
        subtree: true,
        childList: true,
      };

      // Start observing
      observer.observe(documentNode, config);
    };
    const adFunction = () => {
      const counts = {
        mainDocumentHiddenCount: 0,
        playerOverlayHiddenCount: 0,
        imageOverlayHiddenCount: 0,
        textOverlayHiddenCount: 0,
        playerAdsHiddenCount: 0,
        richGridRowHiddenCount: 0,
        richGridRowAdsHiddenCount: 0,
        briefAdsHiddenCount: 0,
        TwitchHiddenCount: 0,
      };
    
      const mainDocument = document.getElementsByClassName(
        "video-ads ytp-ad-module"
      );
      const playerOverlay = document.getElementsByClassName(
        "ytp-ad-player-overlay"
      );
      const imageOverlay = document.getElementsByClassName(
        "ytp-ad-image-overlay"
      );
      const skipBtn = document.getElementsByClassName(
        "ytp-ad-skip-button ytp-button"
      );
      const videoDocument = document.getElementsByClassName(
        "video-stream html5-main-video"
      );
      const textOverlay = document.getElementsByClassName(
        "ytp-ad-text-overlay"
      );
      const playerAds = document.getElementById("player-ads");
      const richGridRow = document.getElementsByTagName("ytd-ad-slot-renderer");
      const richGridRowAds = document.getElementsByTagName(
        "ytd-in-feed-ad-layout-renderer"
      );
      const briefAds = document.getElementsByTagName("iframe");
      const Twitch = document.getElementsByClassName(
        "Layout-sc-1xcs6mc-0 cDieGF default-panel"
      );
    
      const handleSkipBtn = () => {
        if (skipBtn.length > 0) {
          (skipBtn[0] as HTMLButtonElement).click();
        }
      };
    
      if (mainDocument.length > 0) {
        counts.mainDocumentHiddenCount++;
        handleSkipBtn();
    
        if (playerOverlay.length > 0) {
          counts.playerOverlayHiddenCount++;
          (playerOverlay[0] as HTMLElement).style.visibility = "hidden";
          for (let i = 0; i < videoDocument.length; i++) {
            if (
              videoDocument[i] &&
              (videoDocument[i] as HTMLVideoElement).duration
            ) {
              (videoDocument[i] as HTMLVideoElement).currentTime = (
                videoDocument[i] as HTMLVideoElement
              ).duration;
            }
          }
          handleSkipBtn();
        }
        if (imageOverlay.length > 0) {
          counts.imageOverlayHiddenCount++;
          (imageOverlay[0] as HTMLElement).style.visibility = "hidden";
        }
      }
    
      if (playerAds) {
        counts.playerAdsHiddenCount++;
        (playerAds as HTMLElement).style.display = "none";
      }
    
      if (textOverlay.length > 0) {
        counts.textOverlayHiddenCount++;
        (textOverlay[0] as HTMLElement).style.display = "none";
      }
      if (richGridRow.length > 0) {
        for (let i = 0; i < richGridRow.length; i++) {
          const adElement = richGridRow[i] as HTMLElement;
          adElement.style.setProperty("display", "none", "important");
          counts.richGridRowHiddenCount++;
        }
      }
      if (richGridRowAds.length > 0) {
        for (let i = 0; i < richGridRowAds.length; i++) {
          const adElement = richGridRowAds[i] as HTMLElement;
          adElement.style.setProperty("display", "none", "important");
          counts.richGridRowAdsHiddenCount++;
        }
      }
      if (briefAds.length > 0) {
        for (let i = 0; i < briefAds.length; i++) {
          const adElement = briefAds[i] as HTMLElement;
          adElement.style.setProperty("display", "none", "important");
          counts.briefAdsHiddenCount++;
        }
      }
      if (Twitch.length > 0) {
        for (let i = 0; i < Twitch.length; i++) {
          const adElement = Twitch[i] as HTMLElement;
          adElement.style.setProperty("display", "none", "important");
          counts.TwitchHiddenCount++;
        }
      }
    
      // Calculate the total count
      const totalCount =
        Object.values(counts).reduce((total, count) => total + count, 0);
    
      // Return the counts and total count
      return { counts, totalCount };
    };
    // Call the function to collect the counts

    
    getDom();
    otherAds();
 
  };
  ///////////injecting normal DOM for showing ads///////////
  const removeAdBlocker = () => {
    console.log("blockder stoppted");

    const adFunction = () => {
      const mainDocument = document.getElementsByClassName(
        "video-ads ytp-ad-module"
      );
      const playerOverlay = document.getElementsByClassName(
        "ytp-ad-player-overlay"
      );
      const imageOverlay = document.getElementsByClassName(
        "ytp-ad-image-overlay"
      );

      const skipBtn = document.getElementsByClassName(
        "ytp-ad-skip-button ytp-button"
      );

      const videoDocument = document.getElementsByClassName(
        "video-stream html5-main-video"
      );

      const textOverlay = document.getElementsByClassName(
        "ytp-ad-text-overlay"
      );

      const playerAds = document.getElementById("player-ads");

      const handleSkipBtn = () => {
        if (skipBtn.length > 0) {
          (skipBtn[0] as HTMLButtonElement).click();
        }
      };

      if (mainDocument.length > 0) {
        handleSkipBtn();
        if (playerOverlay.length > 0) {
          (playerOverlay[0] as HTMLElement).style.setProperty(
            "visibility",
            "visible",
            "important"
          );
          for (let i = 0; i < videoDocument.length; i++) {
            if (
              videoDocument[i] &&
              (videoDocument[i] as HTMLVideoElement).duration
            ) {
              (videoDocument[i] as HTMLVideoElement).currentTime = (
                videoDocument[i] as HTMLVideoElement
              ).duration;
            }
          }
          handleSkipBtn();
        }
        if (imageOverlay.length > 0) {
          (imageOverlay[0] as HTMLElement).style.setProperty(
            "visibility",
            "visible",
            "important"
          );
        }
      }

      if (playerAds) {
        (playerAds as HTMLElement).style.setProperty(
          "display",
          "block",
          "important"
        );
      }

      if (textOverlay.length > 0) {
        (textOverlay[0] as HTMLElement).style.setProperty(
          "display",
          "block",
          "important"
        );
      }
    };

    adFunction();
  };

  ////////receiving message from popup.js////////
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message == true) {
      chrome.storage.local.set({ isInstalled: true }, () => {
        console.log("Value is set true");
      });
      window.location.reload();
    } else if (request.message == false) {
      chrome.storage.local.set({ isInstalled: false }, () => {
        console.log("Value is set to false");
      });
      window.location.reload();
    } else {
      return;
    }
    sendResponse({ farewell: "Response from background script" });
  });

  return <></>;
};

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
