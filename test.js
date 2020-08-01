if (window.ntm.ready) {
  pluginPerformance()
} else {
  window.addEventListener("NTMReady", pluginPerformance)
}
function pluginPerformance() {
  var performance = window.performance || window.msPerformance || window.webkitPerformance;
  if (!performance) {
      return
  }
  var send = function() {
      var t = performance.timing;
      var pobj = {};
      var times = {};
      var loadTime = t.loadEventEnd - t.connectStart;
      times["version"] = "1.1.0";
      times["redirect"] = t.redirectEnd - t.redirectStart;
      times["TTP"] = t.fetchStart - t.navigationStart;
      times["appcache"] = t.domainLookupStart - t.fetchStart;
      times["DNS"] = t.domainLookupEnd - t.domainLookupStart;
      times["TCP"] = t.connectEnd - t.connectStart;
      times["HTTPSconnect"] = t.secureConnectionStart != 0 ? t.connectEnd - t.secureConnectionStart : 0;
      times["request"] = t.responseStart - t.requestStart;
      times["unload"] = t.unloadEventEnd - t.unloadEventStart;
      times["response"] = t.responseEnd - t.responseStart;
      times["processing"] = t.domComplete - t.domLoading;
      times["DOMrender"] = t.domInteractive - t.domLoading;
      times["beforeContentLoad"] = t.domContentLoadedEventStart - t.domLoading;
      times["DOMContentLoaded"] = t.domContentLoadedEventEnd - t.domContentLoadedEventStart;
      times["onloadEvent"] = t.loadEventEnd - t.loadEventStart;
      times["TTFB"] = t.responseStart - t.fetchStart;
      times["interactive"] = t.domInteractive - t.fetchStart;
      times["DOMcontentFinish"] = t.domContentLoadedEventEnd - t.fetchStart;
      times["pageLoad"] = t.loadEventEnd - t.fetchStart;
      if (performance.getEntriesByType) {
          performance.getEntriesByType("paint").forEach(function(e) {
              pobj[e.name] = e.startTime
          });
          times.firstpaint = pobj["first-paint"];
          times.firstcontentpaint = pobj["first-contentful-paint"]
      }
      if (loadTime <= 0) {
          setTimeout(function() {
              send()
          }, 200);
          return
      } else if (times["appcache"] < 0 || times["response"] <= 0 || times["TTFB"] < 0 || times["interactive"] <= 0 || times["pageLoad"] <= 0 || t.fetchStart <= 0 || times["DOMcontentFinish"] <= 0) {
          console.log("异常值");
          return
      }
      NTESAntAnalysis.sendData({
          host: "vmonitor.ws.netease.com/web/performance?param=",
          projectid: window.ntm.projectId,
          val_nm: "performance",
          val_act: "performance",
          info: {
              timing: times
          }
      })
  };
  send()
}
function roll100() {
  return Math.floor(Math.random() * 100)
}