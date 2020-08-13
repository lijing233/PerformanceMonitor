!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.wpkperformancePlugin = t())
    : (e.wpkperformancePlugin = t());
})(this, function () {
  return (function (e) {
    var t = {};
    function n(o) {
      if (t[o]) return t[o].exports;
      var r = (t[o] = { i: o, l: !1, exports: {} });
      return e[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
    }
    return (
      (n.m = e),
      (n.c = t),
      (n.d = function (e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
      }),
      (n.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (n.t = function (e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var o = Object.create(null);
        if (
          (n.r(o),
          Object.defineProperty(o, "default", { enumerable: !0, value: e }),
          2 & t && "string" != typeof e)
        )
          for (var r in e)
            n.d(
              o,
              r,
              function (t) {
                return e[t];
              }.bind(null, r)
            );
        return o;
      }),
      (n.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return n.d(t, "a", t), t;
      }),
      (n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (n.p = ""),
      n((n.s = 5))
    );
  })({
    0: function (e, t) {
      e.exports = {
        sdk: { BID: "wpkreporter", CID: "jssdk", WID_KEY: "__wpkreporterwid_" },
        env: { BROWSER: "browser", NODEJS: "nodejs", WEEX: "weex" },
        px: {
          signKey: "Uvn#08uefVdwe&c4",
          addr: {
            cn: "http://px.effirst.com/api/v1/jssdk/upload",
            cn_https: "https://px.effirst.com/api/v1/jssdk/upload",
            intl: "http://px-intl.ucweb.com/api/v1/jssdk/upload",
            intl_https: "https://px-intl.ucweb.com/api/v1/jssdk/upload",
          },
          confAddr: {
            cn: "http://px.effirst.com/api/v1/jconfig",
            cn_https: "https://px.effirst.com/api/v1/jconfig",
            intl: "http://px-intl.ucweb.com/api/v1/jconfig",
            intl_https: "https://px-intl.ucweb.com/api/v1/jconfig",
          },
        },
        http: {
          methods: {
            GET: "GET",
            PUT: "PUT",
            POST: "POST",
            HEAD: "HEAD",
            DELETE: "DELETE",
            OPTIONS: "OPTIONS",
            CONNECT: "OPTIONS",
            TRACE: "OPTIONS",
            PATCH: "OPTIONS",
          },
          protocols: { HTTP: "http:", HTTPS: "https:" },
        },
        category: {
          JSERR: 1,
          API: 2,
          JSFSPERF: 3,
          RESLOADFAIL: 4,
          FLOW: 5,
          BKPG: 6,
          HARLOG: 7,
        },
        navConn: {
          types: {
            BLUETOOTH: "bluetooth",
            CELLULAR: "cellular",
            ETHERNET: "ethernet",
            MIXED: "mixed",
            NONE: "none",
            OTHER: "other",
            UNKNOWN: "unknown",
            WIFI: "wifi",
            WIMAX: "wimax",
          },
          effectiveTypes: {
            "2G": "2g",
            "3G": "3g",
            "4G": "4g",
            SLOW2G: "slow-2g",
          },
        },
      };
    },
    5: function (e, t, n) {
      var o,
        r = n(0).env,
        i = n(0).category,
        a = [
          "navigationStart",
          "unloadEventStart",
          "unloadEventEnd",
          "redirectStart",
          "redirectEnd",
          "fetchStart",
          "domainLookupStart",
          "domainLookupEnd",
          "connectStart",
          "secureConnectionStart",
          "connectEnd",
          "requestStart",
          "responseStart",
          "responseEnd",
          "domLoading",
          "domInteractive",
          "domContentLoadedEventStart",
          "domContentLoadedEventEnd",
          "domComplete",
          "loadEventStart",
          "loadEventEnd",
          "msFirstPaint",
        ],
        d = ["navigate", "reload", "back_forward"],
        p = function (e) {
          var t,
            n = e[a[5]];
          if (1 === e._ver) {
            var o;
            if (window.chrome && window.chrome.loadTimes)
              o = 1e3 * window.chrome.loadTimes().firstPaintTime;
            else o = e.msFirstPaint ? e.msFirstPaint : e[a[13]];
            if (!o) return -1;
            t = o >= n ? parseFloat((o - n).toFixed(2)) : -1;
          } else
            2 === e._ver &&
              ((t = e[a[13]] - n), (t = parseFloat(t.toFixed(2))));
          return t;
        },
        c = function (e, t) {
          var n,
            o,
            r,
            i = {};
          for (var d in t)
            (r = 0),
              (n = e[a[t[d][0]]]),
              (o = e[a[t[d][1]]]),
              n > 0 && o > 0 && (r = parseFloat((o - n).toFixed(2))),
              (i[d] = r);
          return i;
        },
        f = function (e, t) {
          var n = window;
          if (
            ((o =
              n.performance ||
              n.webkitPerformance ||
              n.msPerformance ||
              n.mozPerformance),
            e.env === r.BROWSER && o && o.timing)
          ) {
            t = t || {};
            var a = e.toolKit.extend({ enable: !0, sampleRate: 1 }, t);
            if (a.enable) {
              e.logger.info("wpkperformancePlugin已开启");
              var f,
                s,
                u,
                l,
                v = o.timing || {},
                m = 1;
              if ("function" == typeof n.PerformanceNavigationTiming)
                try {
                  var w = o.getEntriesByType("navigation")[0];
                  w && ((v = w), (m = 2));
                } catch (e) {}
              (v._ver = m),
                (f = window),
                (s = "load"),
                (u = function () {
                  /loaded|complete/.test(document.readyState) &&
                    setTimeout(function () {
                      var t = e.toolKit.extend(
                        (function (e) {
                          return c(e, {
                            w_unload: [1, 2],
                            w_redirect: [3, 4],
                            w_appcache: [5, 6],
                            w_dns: [6, 7],
                            w_tcp: [8, 10],
                            w_ssl: [9, 10],
                            w_ttfb: [11, 12],
                            w_contentdownload: [12, 13],
                            w_domparsing: [13, 15],
                            w_res: [17, 19],
                          });
                        })(v),
                        (function (e) {
                          var t = c(e, {
                            w_firstbyte: [5, 12],
                            w_tti: [5, 15],
                            w_domready: [5, 17],
                            w_load: [5, 19],
                            w_total: [5, 20],
                          });
                          return (t.w_fpt = p(e)), t;
                        })(v)
                      );
                      for (var n in t)
                        if (t[n] < 0 || t[n] > 6e4)
                          return void e.logger.warn("性能数据异常：", n, t[n]);
                      var r = e.toolKit.extend(
                        t,
                        (function (e) {
                          var t,
                            n = o.navigation || {},
                            r = -1,
                            i = -1,
                            a = -1;
                          return (
                            1 === e._ver
                              ? (t = d[n.type] || "other")
                              : 2 === e._ver &&
                                ((r = e.encodedBodySize),
                                (i = e.decodedBodySize),
                                (a = e.transferSize),
                                (t = e.type)),
                            {
                              w_enbdsize: r,
                              w_debdsize: i,
                              w_transize: a,
                              w_navtype: t,
                            }
                          );
                        })(v),
                        a,
                        { category: i.JSFSPERF }
                      );
                      e.report(r);
                    });
                }),
                f.addEventListener
                  ? f.addEventListener(s, u, l || !1)
                  : f.attachEvent("on" + s, u);
            } else e.logger.info("wpkperformancePlugin已关闭");
          } else e.logger.warn("基础性能插件仅支持浏览器环境");
        };
      (f.prototype.pluginId = "perf"), (e.exports = f);
    },
  });
});
