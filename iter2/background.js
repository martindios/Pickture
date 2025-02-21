chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "showImageUrl",
    title: "Mostrar URL de la imagen",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "showImageUrl" && info.srcUrl) {
    chrome.windows.create({
      url: `popup.html?img=${encodeURIComponent(info.srcUrl)}`,
      type: "popup",
      width: 300,
      height: 150
    });
  }
});

