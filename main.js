import './src/index'
import Fingerprint2 from 'fingerprintjs2'
import getFingerprint from './log/utils/fingerprint';
import DeviceDected from './log/utils/deviceinfo';
var MobileDetect = require('mobile-detect')

console.log(new Date().getTime());
Fingerprint2.get(function (components) {
  console.log('components :>> ', components);
  var values = components.map(function (component) { return component.value })
  var murmur = Fingerprint2.x64hash128(values.join(''), 31)
  console.log(murmur);
  console.log(murmur.length);
})
console.log(new Date().getTime());

console.log('=============================');
console.log(getFingerprint());
console.log('=============================');
// alert(navigator.userAgent)

var md = new MobileDetect(navigator.userAgent);
console.log('md :>> ', md);
console.log(md.os());
console.log( md.mobile() );
console.log( md.phone() );
// alert(md.phone())

// ua
var ua = navigator.userAgent;
var uas = ua.split(";");
var brand = "others"
var j = 0;
for(var i =0;i<uas.length;i++){
  if (uas[i].indexOf("Build/") > 0){
      j = i;
      break;
  }
}
if (j > -1) {
  brand = uas[j].substring(0, uas[j].indexOf("Build/"));
}
console.log('brand :>> ', brand);
// alert(brand)


console.log('************************************');
const db = new DeviceDected();
console.log(db.deviceData);
console.log('************************************');