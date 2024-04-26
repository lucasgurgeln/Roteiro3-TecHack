document.addEventListener('DOMContentLoaded', function() {
  // Solicitar os dados após a interface do usuário ser carregada
  browser.runtime.sendMessage({request: "getData"}).then(response => {
      document.getElementById('third-party-requests').textContent = response.thirdPartyRequests;
      document.getElementById('cookies-used').textContent = response.cookiesUsed;
      document.getElementById('local-storage-items').textContent = response.localStorageItems;
      document.getElementById('session-storage-items').textContent = response.sessionStorageItems;
  }).catch(error => {
      console.error("Error requesting data:", error);
  });
});
