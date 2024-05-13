document.addEventListener('DOMContentLoaded', function() {
  // Solicitar os dados após a interface do usuário ser carregada
  browser.runtime.sendMessage({request: "getData"}).then(response => {
      document.getElementById('third-party-requests').textContent = response.thirdPartyRequests;
      document.getElementById('first-party-cookies').textContent = response.firstPartyCookies;
      document.getElementById('third-party-cookies').textContent = response.thirdPartyCookies;
      document.getElementById('session-cookies').textContent = response.sessionCookies;
      document.getElementById('persistent-cookies').textContent = response.persistentCookies;
      document.getElementById('local-storage-items').textContent = response.localStorageItems;
      document.getElementById('session-storage-items').textContent = response.sessionStorageItems;
  }).catch(error => {
      console.error("Error requesting data:", error);
  });
});
