function DeviceDected() {
  this.ua = navigator.userAgent;
  this.deviceData = {
    platform: "", // (PC | Mobile)
    osType: "", // 系统类型(Android | IOS | Others)
    osVersion: "", // 系统版本
    mobileBrand: "", // 手机品牌
    mobileModel: "", // 手机型号
    browserType: "", // 浏览器类型
    screenWidth: window.screen.width, // 屏幕宽度
    screenHeight: window.screen.height, // 屏幕高度
    userAgent: navigator.userAgent, // ua
    netStatus: "" // 网络情况

  };
  this.isMobile = false;
  this.init();
}

// 初始化
DeviceDected.prototype.init = function () {
  this.deviceData.platform = this.checkIsMobile() ? "Mobile" : "PC";
  this.getOsType();
  this.getOsVersion();

  if (this.isMobile) {
    this.getMobileBrand();
  }

  this.getNetStatus();
};

// 判断是否是移动端
DeviceDected.prototype.checkIsMobile = function () {
  var canTouchEvent = "ontouchstart" in window;
  var isMobileUA = this.ua.match(
    /phone|pad|pod|iPhone|iPod|ios|iOS|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/gi
  );
  var canUseOrientation = window.orientation !== undefined;
  var isM = canTouchEvent || isMobileUA || canUseOrientation;
  this.isMobile = isM;
  return isM;
};

// 获取系统类型
DeviceDected.prototype.getOsType = function () {
  var OsType = "";
  var _DEFAULT = 'Others';
  if (this.isMobile) {
    const MobileOsMap = {
      'Android': /Android|Linux/gi,
      'iOS': /iPhone|iPad|iPod|iOS|Mac/gi
    }
    OsType = this.findMatch(MobileOsMap, this.ua) || _DEFAULT;
  } else {
    const PcOsMap = {
      'Windows': /Win|Windows/gi,
      'MacOS': /Mac/gi
    }
    OsType = this.findMatch(PcOsMap, this.ua) || _DEFAULT;
  }
  this.deviceData.osType = OsType;
};

// 获取系统版本
DeviceDected.prototype.getOsVersion = function() {
  // alert(this.ua)
  var OsVersion = 'Unknown';
  if (this.isMobile) {
    if (this.deviceData.osType === 'Android') {
      // Android
      var regex1 = /\((.+?)\)/g;
      var info = this.ua.match(regex1)[0];
      if (info) {
        info = info.replace(/\s/g, '').split(';')
        for(var i=0; i< info.length; i++) {
          if(info[i].indexOf('Android') !== -1) {
            var res = info[i].split('Android')[1];
            var res = Number(res);
            if (!isNaN(res)) {
              OsVersion = String(res);
            }
          }
        }
      }
    } else if(this.deviceData.osType === 'iOS') {
      // iOS
      var reg = /os [\d._]*/gi ;
      var iosVerInfo = this.ua.match(reg) ;
      var iosVersion = (iosVerInfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
      console.log('iosVersion :>> ', iosVersion);
      OsVersion = iosVersion;
    }
  } else {
    if (this.deviceData.osType === 'Windows') {
      const PcOsVersionMap = {
        'Windows XP': /NT 5.1/gi,
        'Windows 7': /NT 6.1/gi,
        'Windows 8': /NT 6.2/gi,
        'Windows 8.1': /NT 6.3/gi,
        'Windows 10': /NT 10/gi
      }
      OsVersion = this.findMatch(PcOsVersionMap, this.ua) || 'Unknown';
      console.log('OsVersion :>> ', OsVersion);
    } else if (this.deviceData.osType === 'MacOS') {
      // 
      var reg = /Mac OS X [\d._]*/gi ;
      var iosVerInfo = this.ua.match(reg);
      var iosVersion = (iosVerInfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
      console.log('macOS :>> ', iosVersion);
      OsVersion = iosVersion || 'Unknown';
    }
  }

  // alert(OsVersion)
  this.deviceData.osVersion = OsVersion;

}

// 获取移动设备型号
DeviceDected.prototype.getMobileBrand = function() {
  var myBrand = 'Unknown';
  var myModel = 'Unknown';
  var osType = this.deviceData.osType;
  if (osType === 'Android') {
    var ualist = this.ua.split(";");
    var j = 0;
    for(var i =0;i<ualist.length;i++){
      if (ualist[i].indexOf("Build/") > 0){
          j = i;
          break;
      }
    }
    if (j > -1) {
      myModel = ualist[j].substring(0, ualist[j].indexOf("Build/"));
    }
  } else if (osType = 'iOS') {
    // alert(window.screen.width + '/' + window.screen.height);
    let width = window.screen.width,
    height = window.screen.height;
    if(width === 414 && height === 896) {
      myBrand = 'iPhone';
      if (window.devicePixelRatio === 3) {
        myModel = '11ProMax/XsMax';
      } else {
        myModel = '11/XR';
      }
    } else if(width === 375 && height === 812) {
      myModel = '11Pro/X/XS';
      myBrand = 'iPhone';
    } else if(width === 414 && height === 736) {
      myModel = '6/6S/7/8 Plus';
      myBrand = 'iPhone';
    }else if (width === 375 && height === 667) {
      myModel = '6/6S/7/8';
      myBrand = 'iPhone';
    } else if (width === 320 && height === 568) {
      myModel = '5/5S/5C/SE';
      myBrand = 'iPhone';
    } else if (width === 320 && height === 480) {
      myModel = '4/4S';
      myBrand = 'iPhone';
    }  else if (width >= 768 && height >= 1024) {
      myModel = 'Unkown';
      myBrand = 'iPad';
    } 
  }

  this.deviceData.mobileBrand = myBrand;
  this.deviceData.mobileModel = myModel;
}

DeviceDected.prototype.getNetStatus = function() {
  var netStatus = 'Unknown';
  if (
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
    netStatus = netMap[navigator.connection.effectiveType] || "UNKNOWN";
  }
  this.deviceData.netStatus = netStatus;
}

DeviceDected.prototype.findMatch = function (rules, userAgent) {
  for (var key in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, key)) {
      if (rules[key].test(userAgent)) {
        return key;
      }
    }
  }
  return null;
};

export default DeviceDected;
