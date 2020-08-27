function paintDomData(data) {
  var dom = document.querySelector('.table');
  Object.keys(data).forEach(item => {
    var block = document.createElement('div');
    block.className = 'block';
    var title = document.createElement('div');
    title.className = 'title';
    title.innerText = item;
    block.appendChild(title);
    
    Object.keys(data[item]).forEach(key => {
      console.log(key);
      var content = document.createElement('div');
      content.className = 'content';
      var left = document.createElement('div');
      left.className = 'name';
      left.innerText = key;

      var right = document.createElement('div');
      right.className = 'value';
      right.innerText = data[item][key];

      content.appendChild(left)
      content.appendChild(right)

      block.appendChild(content)
    })

    dom.appendChild(block)
  })
  console.log(dom);
}
(function () {
  class PerformanceMonitor {
    constructor(id) {
      this.id = id; // 应用ID
      this.sdkVersion = "1.0.0"; // SDK版本
      this.dataSource = {}; // 性能数据
      this.loadFunMap = [
        "TimingInfo",
        "DeviceInfo",
        "LocationInfo",
        "NetInfo",
        "BasicInfo",
      ]; // onload事件需要执行的函数
      this.tempQueue = []; // 临时存储队列
    }

    // 获取Performance.timing数据
    getTimingInfo() {
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

      this.dataSource["TimingInfo"] = timingData;
      return timingData;
    }

    // 获取FP/FMP
    getPaintInfo() {
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
    getDeviceInfo() {
      var deviceInfo = {};
      if (window.shareitBridge && window.shareitBridge.syncInvoke) {
        var info = window.shareitBridge.syncInvoke(
          "web-p",
          "getDeviceInfo",
          ""
        );

        var parseInfo = JSON.parse(info);
        if (parseInfo && parseInfo.responseCode === "0") {
          deviceInfo = parseInfo;
        }
      }
      this.dataSource["DeviceInfo"] = deviceInfo;
      return deviceInfo;
    }

    // 获取地理位置信息(依赖客户端环境)
    getLocationInfo() {
      var locationInfo = {};
      if (window.shareitBridge && window.shareitBridge.syncInvoke) {
        var info = window.shareitBridge.syncInvoke(
          "web-p",
          "getLocationInfo",
          ""
        );
        var parseInfo = JSON.parse(info);
        if (parseInfo && parseInfo.responseCode === "0") {
          locationInfo = parseInfo;
        }
      }
      this.dataSource["LocationInfo"] = locationInfo;
      return locationInfo;
    }

    // 获取网络状态 	网络状态（OFFLINE, WIFI_HOT, WIFI, MOBILE_2G, MOBILE_3G, MOBILE_4G, MOBILE_UNKNOWN, UNKNOWN）
    getNetInfo() {
      var networkStatus = "";
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
        var info = window.shareitBridge.syncInvoke(
          "web-p",
          "getNetworkStatus",
          ""
        );
        var parseInfo = JSON.parse(info);
        if (parseInfo && parseInfo.responseCode === "0") {
          networkStatus = parseInfo.networkStatus;
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
      this.dataSource["NetInfo"] = { netStatus: networkStatus};
      return { netStatus: networkStatus};;
    }

    // 获取基础信息
    getBasicInfo() {
      var basicData = {};
      basicData.url = window.location.origin + window.location.pathname;
      basicData.query = window.location.search;
      basicData.hash = window.location.hash.substring(1);
      basicData.title = document.title;
      basicData.ua = window.navigator.userAgent;
      basicData.s_w = window.screen.width;
      basicData.s_h = window.screen.height;

      this.dataSource["BasicInfo"] = basicData;
      return basicData;
    }

    // 绑定onload事件
    bingOnloadEvent() {

    }

    // 绑定卸载事件
    bindUnloadEvent(callback) {
      if (typeof callback !== "function") {
        console.error("UnloadEvent Callback must be a function!");
        return;
      }

      if (window && window.addEventListener) {
        window.addEventListener("beforeunload", callback, false);
      } else if (window && window.attachEvent) {
        window.attachEvent("onbeforeunload", callback);
      } else {
        console.error(
          "UnloadEvent: not support addEventListener or attachEvent"
        );
      }
    }

    // 可见性检测
    visiableListener() {

    }

    // 数据上传
    uploadData() {

    }


  }

  var PM_ITEM = new PerformanceMonitor("test-project");
  window.addEventListener("load", function () {
    PM_ITEM.loadFunMap.forEach(function (key) {
      var funName = "get" + key;
      if (PM_ITEM[funName] && typeof PM_ITEM[funName] === "function") {
        PM_ITEM[funName]();
      }
    });
    // alert(JSON.stringify(PM_ITEM.dataSource))
    paintDomData(PM_ITEM.dataSource)
    console.log('dataSource:', PM_ITEM.dataSource);
  });
})();
