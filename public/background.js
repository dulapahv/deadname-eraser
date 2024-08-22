/**
 * When user navigates to a new page, check if the deadname and preferred name are set.
 * If they are, replace all instances of the deadname with the preferred name.
 */

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url?.includes("chrome://")) return undefined;

  if (tab.active && changeInfo.status === "complete") {
    chrome.storage.sync.get(["deadname", "preferredName"], function (data) {
      if (data.deadname && data.preferredName) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: function (deadname, preferredName) {
            const replaceText = (node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = node.textContent.replace(
                  new RegExp(deadname, "gi"),
                  preferredName,
                );
              } else {
                node.childNodes.forEach(replaceText);
              }
            };

            document.body.childNodes.forEach(replaceText);
          },
          args: [data.deadname, data.preferredName],
        });
      }
    });
  }
});
