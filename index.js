window.onload = function() {
  if (window.performance) {
    var timing = window.performance.timing;
    console.log('performance.timing :>> ', timing);
    var timingData = pt_handler(timing);
    console.log('timingData :>> ', timingData);
  }
}

function pt_handler(performance) {
  var performanceTimingData = {}
  if (performance) {
    // 重定向时间
    performanceTimingData.redirectTime = performance.redirectEnd - performance.redirectStart
    // 缓存时间
    performanceTimingData.cacheTime = performance.domainLookupStart - performance.fetchStart
    // dns查询时间
    performanceTimingData.dnsTime = performance.domainLookupEnd - performance.domainLookupStart
    // tcp握手时间
    performanceTimingData.TcpTime = performance.connectEnd - performance.connectStart
    // ajax请求时间
    performanceTimingData.ajaxTime = performance.responseEnd - performance.requestStart
    // dom Load time
    


    // 开始解析dom时间，此时document.readyState 变为 loading
    performanceTimingData.domLoadingTime = performance.domLoading - performance.navigationStart
    // dom解析完成时间，此时document.readyState 变为 interactive
    performanceTimingData.domInteractiveTime = performance.domInteractive - performance.navigationStart
    // dom解析完成，资源加载完成，脚本完成
    performanceTimingData.domContentLoadedEventEndTime = performance.domContentLoadedEventEnd - performance.navigationStart
    // 页面从开始到结束的全部时间时间
    performanceTimingData.loadPageTime = performance.loadEventEnd - performance.navigationStart
  }
  return performanceTimingData
}
