import x64hash128 from './x64hash128';
var DataBaseKeyMap = [
  { key: 'userAgent', getData: 'getUserAgent' },
  { key: 'language', getData: 'getSystemLanguage' },
  { key: 'colorDepth', getData: 'getColorDepth' },
  { key: 'deviceMemory', getData: 'getDeviceMemory' },
  { key: 'pixelRatio', getData: 'getPixelRatio' },
  { key: 'timeZone', getData: 'getTimeZone' },
  { key: 'timeZoneOffset', getData: 'getTimeZoneOffset' },
  { key: 'screenSize', getData: 'getScreenSize' },
  { key: 'platform', getData: 'getPlatform' },
  { key: 'cpu', getData: 'getCpu' },
  { key: 'vendor', getData: 'getVendor' },
  { key: 'hardwareConcurrency', getData: 'getHardwareConcurrency' }

]

var options = {
  NOT_AVAILABLE: 'NOT_AVAILABLE'
}

var DataBaseFunMap = {
  getUserAgent() {
    return navigator.userAgent;
  },
  getSystemLanguage() {
    return navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || options.NOT_AVAILABLE;
  },
  getColorDepth() {
    return window.screen.colorDepth || options.NOT_AVAILABLE;
  },
  getDeviceMemory() {
    return navigator.deviceMemory || options.NOT_AVAILABLE;
  },
  getPixelRatio() {
    return window.devicePixelRatio || options.NOT_AVAILABLE;
  },
  getTimeZone() {
    if (window.Intl && window.Intl.DateTimeFormat) {
      return new window.Intl.DateTimeFormat().resolvedOptions().timeZone
    } else {
      return options.NOT_AVAILABLE;
    }
  },
  getTimeZoneOffset() {
    return new Date().getTimezoneOffset();
  },
  getScreenSize() {
    return [window.screen.width, window.screen.height, window.screen.availHeight, window.screen.availWidth].join();
  },
  getPlatform() {
    return navigator.platform || options.NOT_AVAILABLE;
  },
  getCpu() {
    return navigator.oscpu || options.NOT_AVAILABLE;
  },
  getVendor() {
    return navigator.vendor || options.NOT_AVAILABLE;
  },
  getHardwareConcurrency() {
    return navigator.hardwareConcurrency || options.NOT_AVAILABLE;
  }
}

var getFingerprint = function() {
  var database = '';
  var datalist = [];
  for (var i = 0; i < DataBaseKeyMap.length; i++) {
    var value = DataBaseFunMap[DataBaseKeyMap[i].getData]();
    datalist.push(
      {
        key: DataBaseKeyMap[i].key,
        value
      }
    )
    database += String(value);
  }
  console.log('fingetDataList:', datalist);
  var seed = 30;
  var screatString = x64hash128(database, seed);
  return screatString;
}

export default getFingerprint;