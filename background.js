let thirdPartyRequests = 0;
let firstPartyCookies = 0;
let thirdPartyCookies = 0;
let sessionCookies = 0;
let persistentCookies = 0;
let localStorageItems = 0;
let sessionStorageItems = 0;

function countCookies(details, tabHostname) {
  browser.cookies.getAll({url: details.url}).then(cookies => {
    cookies.forEach(cookie => {
      if (cookie.domain.includes(tabHostname)) {
        // Cookie de primeira parte
        firstPartyCookies++;
      } else {
        // Cookie de terceira parte
        thirdPartyCookies++;
      }
      // Diferenciação entre cookies de sessão e persistentes
      if (cookie.session) {
        sessionCookies++;
      } else {
        persistentCookies++;
      }
    });
  });
}

browser.webRequest.onCompleted.addListener(
  details => {
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      if (tabs[0] && tabs[0].url) {
        const tabUrl = new URL(tabs[0].url);
        const tabHostname = tabUrl.hostname;
        if (!details.url.includes(tabHostname)) {
          thirdPartyRequests++;
        }
        countCookies(details, tabHostname);
      }
    });
  },
  { urls: ["<all_urls>"] }
);

function injectScript() {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      if (tabs.length > 0 && tabs[0].id) {
          const code = `
              browser.runtime.sendMessage({
                  type: 'storageData',
                  localStorageCount: localStorage.length,
                  sessionStorageCount: sessionStorage.length
              });
          `;
          browser.tabs.executeScript(tabs[0].id, {code: code});
      }
  });
}

// Chame injectScript quando uma aba for atualizada ou uma nova aba selecionada
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
      injectScript();
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "storageData") {
      localStorageItems = message.localStorageCount;
      sessionStorageItems = message.sessionStorageCount;
  }

  if (message.request === "getData") {
      sendResponse({
          thirdPartyRequests,
          firstPartyCookies,
          thirdPartyCookies,
          sessionCookies,
          persistentCookies,
          localStorageItems,
          sessionStorageItems
      });
  }
});
