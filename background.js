function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  console.log("replacing J(a)...");

  let str = "";
  filter.ondata = event => {
    str += decoder.decode(event.data, {stream: true});
  };

  filter.onstop = event => {
    console.log("Trying to find video/audio override code");
    let re = /function J\(a\)\{a\.ctrlKey&&a\.altKey&&a\.shiftKey&&83\=\=a\.keyCode&&Q\.CF&&v\(\);\}/;
    str = str.replace(re, "function J(a){a.ctrlKey&&a.altKey&&a.shiftKey&&83==a.keyCode&&v();}");
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  //return {}; // not needed
}
chrome.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://assets.nflxext.com/en_us/ffe/player/html/cadmium-playercore-6.0012.095.051.js"]}, ["blocking"]
);
