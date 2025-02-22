// Creation of the contextual menu
chrome.contextMenus.create({
  id: "Pickture",
  title: "Search for similar clothes",
  contexts: ["image"]
});

// Listen for the click event on the contextual menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "Pickture") {
    const imgUrl = info.srcUrl;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showPanel,
      args: [imgUrl]
    });
  }
});

// Function to show the panel
function showPanel(imgUrl) {
  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('panel.html') + `?img=${encodeURIComponent(imgUrl)}`;
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.right = '0';
  iframe.style.width = '30%';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = '100000';
  iframe.style.backgroundColor = 'white';
  document.body.appendChild(iframe);
  // Listen for the message event to close the panel
  window.addEventListener('message', (event) => {
    if (event.data.action === 'closePanel') {
      iframe.remove();
    }
  });
}