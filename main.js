import './src/index'
import Fingerprint2 from 'fingerprintjs2'
import getFingerprint from './log/utils/fingerprint';

console.log(new Date().getTime());
console.log('111');
Fingerprint2.get(function (components) {
  console.log('components :>> ', components);
  var values = components.map(function (component) { return component.value })
  var murmur = Fingerprint2.x64hash128(values.join(''), 31)
  console.log(murmur);
  console.log(murmur.length);
})
console.log('222');
console.log(new Date().getTime());

console.log('=============================');
console.log(getFingerprint());
console.log('=============================');