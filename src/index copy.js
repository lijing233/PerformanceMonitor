(function () {
  console.log("run");
  // 获取Performance.timing数据
  function getTimingInfo() {
    var timingData = {};
    var p =
      window.performance ||
      window.webkitPerformance ||
      window.msPerformance ||
      window.mozPerformance;
    if (p && p.timing) {
      var t = p.timing;
      // 卸载时间
      timingData.t_unload = t.unloadEventEnd - t.unloadEventStart;
      // 重定向时间
      timingData.t_redirect = t.redirectEnd - t.redirectStart;
      // dns缓存时间
      timingData.t_appcache = t.domainLookupStart - t.fetchStart;
      // dns查询时间
      timingData.t_dns = t.domainLookupEnd - t.domainLookupStart;
      // tcp时间
      timingData.t_tcp = t.connectEnd - t.connectStart;
      // ssl时间 (https)
      // timingData.t_ssl = t.connectEnd - t.secureConnectionStart;
      // ttfb(发出页面请求到接收到应答数据第一个字节所花费的毫秒数)
      timingData.t_ttfb = t.responseStart - t.requestStart;
      // contentdownload(页面下载时间)
      timingData.t_contentdownload = t.responseEnd - t.responseStart;
      // domparsing 浏览器已经解析好DOM树所需时间
      timingData.t_domparsing = t.domInteractive - t.responseEnd;
      // res
      timingData.t_res = t.loadEventStart - t.domContentLoadedEventEnd;
      // others
      // firstbyte
      timingData.t_firstbyte = t.responseStart - t.fetchStart;
      // tti
      timingData.t_tti = t.domInteractive - t.fetchStart;
      // domready
      timingData.t_domready = t.domContentLoadedEventEnd - t.fetchStart;
      // load
      timingData.t_load = t.loadEventStart - t.fetchStart;
      // total
      timingData.t_total = t.loadEventEnd - t.fetchStart;
    }
    return timingData;
  }

  // 获取FP/FMP
  function getPaintInfo() {
    var paintData = {};
    var p =
      window.performance ||
      window.webkitPerformance ||
      window.msPerformance ||
      window.mozPerformance;
    if (p && p.getEntriesByType) {
      var pobj = {};
      performance.getEntriesByType("paint").forEach(function (e) {
        pobj[e.name] = e.startTime;
      });
      paintData.firstpaint = pobj["first-paint"];
      paintData.firstcontentpaint = pobj["first-contentful-paint"];
    }
    return paintData;
  }

  // 获取设备信息(依赖客户端环境)
  function getDeviceInfo() {
    var deviceInfo = {};
    if (window.shareitBridge && window.shareitBridge.syncInvoke) {
      var info = window.shareitBridge.syncInvoke("web-p", "getDeviceInfo", "");
      if (info && info.responseCode === "0") {
        deviceInfo = info;
      }
    }
    return deviceInfo;
  }

  // 获取地理位置信息
  function getLocationInfo() {
    var locationInfo = {};
    if (window.shareitBridge && window.shareitBridge.syncInvoke) {
      var info = window.shareitBridge.syncInvoke(
        "web-p",
        "getLocationInfo",
        ""
      );
      if (info && info.responseCode === "0") {
        locationInfo = info;
      }
    }
    return locationInfo;
  }

  // 获取网络状态 	网络状态（OFFLINE, WIFI_HOT, WIFI, MOBILE_2G, MOBILE_3G, MOBILE_4G, MOBILE_UNKNOWN, UNKNOWN）
  function getNetInfo() {
    var networkStatus = "UNKNOWN";
    if (window.shareitBridge && window.shareitBridge.syncInvoke) {
      var netStatusMap = {
        OFFLINE: "OFFLINE",
        WIFI_HOT: "WIFI",
        WIFI: "WIFI",
        MOBILE_2G: "2G",
        MOBILE_3G: "3G",
        MOBILE_4G: "4G",
        MOBILE_UNKNOWN: "UNKNOWN",
        UNKNOWN: "UNKNOWN",
      };
      var status = window.shareitBridge.syncInvoke(
        "web-p",
        "getNetworkStatus",
        ""
      );
      if (status && status.responseCode === "0") {
        networkStatus = status.networkStatus;
      }
    }

    if (
      !networkStatus &&
      navigator.connection &&
      navigator.connection.effectiveType
    ) {
      var netMap = {
        "slow-2g": "2G",
        "2g": "2G",
        "3g": "3G",
        "4g": "4G",
      };
      // Andirod > 5
      networkStatus = netMap[navigator.connection.effectiveType] || "UNKNOWN";
    }
  }

  // 获取基础信息
  function getBasicInfo() {
    var basicData = {};
    basicData.url = window.location.origin + window.location.pathname;
    basicData.query = window.location.search;
    basicData.hash = window.location.hash.substring(1);
    basicData.title = document.title;
    basicData.ua = window.navigator.userAgent;
    basicData.s_w = window.screen.width;
    basicData.s_h = window.screen.height;
    return basicData;
  }

  // 绑定卸载事件
  function bindUnloadEvent(callback) {
    if (typeof callback !== "function") {
      console.error("UnloadEvent Callback must be a function!");
      return;
    }

    if (window && window.addEventListener) {
      window.addEventListener("beforeunload", callback, false);
    } else if (window && window.attachEvent) {
      window.attachEvent("onbeforeunload", callback);
    } else {
      console.error("UnloadEvent: not support addEventListener or attachEvent");
    }
  }

  var funMapLoad = [
    'TimingInfo',
    'DeviceInfo',
    'LocationInfo',
    'NetInfo',
    'BasicInfo'
  ]

  window.addEventListener('load', function() {
    console.log(this);
    // var DataSource = {};
    // funMapLoad.forEach(function(key) {
    //   DataSource[key] = 
    // })
    var timingData = getTimingInfo();
    console.log('timingData :>> ', timingData);
  })
})();

class PerformanceMonitor {
  constructor(id) {
    this.id = id;
    this.version = '1.0.0';
  }
  
}
