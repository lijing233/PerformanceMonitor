!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.wpkReporter = t())
    : (e.wpkReporter = t());
})(this, function () {
  return (function (e) {
    var t = {};
    function n(r) {
      if (t[r]) return t[r].exports;
      var o = (t[r] = { i: r, l: !1, exports: {} });
      return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    return (
      (n.m = e),
      (n.c = t),
      (n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
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
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, "default", { enumerable: !0, value: e }),
          2 & t && "string" != typeof e)
        )
          for (var o in e)
            n.d(
              r,
              o,
              function (t) {
                return e[t];
              }.bind(null, o)
            );
        return r;
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
      n((n.s = 3))
    );
  })([
    function (e, t) {
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
    function (e, t, n) {
      var r = n(6),
        o = n(0),
        i = o.px,
        a = o.category;
      function s(e) {
        if (!(this instanceof s)) return new s(e);
        (e = e || {}),
          (this._init = !1),
          (this.toolKit = r(e)),
          (this.logger = this.toolKit.logger),
          (this.debug = e.debug || !1),
          !0 === e.debug &&
            this.logger.warn(
              "[wpk] now in debug mode, you can see log details"
            ),
          (this._plugins = e.plugins || []),
          (this.bid = e.bid),
          (this.cid = e.cid),
          (this.uid = e.uid),
          (this.rel = e.rel),
          (this.spa = e.spa || !1),
          (this.delay = !1 !== e.delay),
          (this.cluster = e.cluster || "cn"),
          (this.sampleRate = e.sampleRate),
          (this.ignoreScriptError = !1 !== e.ignoreScriptError),
          (this.onlyCustom = e.onlyCustom || !1),
          (this.beforeSend = e.beforeSend || null),
          (this.checkHidden = !1 !== e.checkHidden),
          (this.supportBeaconBody = !1 !== e.supportBeaconBody),
          (this.blockAlipayMiniAppWebview = e.blockAlipayMiniAppWebview || !1),
          (this._waitingQueue = []);
      }
      function c(e) {
        if (
          e.toolKit.inAlipayMiniAppWebview() &&
          !0 === e.blockAlipayMiniAppWebview
        )
          e.logger.warn(
            "current runtime is alipay miniapp webview, this request will be blocked."
          );
        else {
          var t = i.confAddr[e.cluster + (e.isHttps ? "_https" : "")],
            n = i.signKey;
          (e._startTime = Date.now()),
            (e._dying = !0),
            e.toolKit.dynamicConf(e.bid, e.VERSION, t, n, function (t) {
              (e._dying = !1),
                (e._dyConf = t),
                e.logger.warn("jconfig come back");
            });
        }
      }
      (s.prototype = {
        VERSION: "0.7.1",
        initialize: function (e) {
          (this.env = e.env),
            e.root.location &&
              -1 !== e.root.location.search.indexOf("wpkReporterDebug=true") &&
              (this.debug = !0),
            (this.send = e.send),
            (this.getWid = e.getWid),
            (this.isHttps = e.isHttps),
            e.bindUnloadEvent(this);
        },
        ready: function () {
          return this._init;
        },
        setConfig: function (e) {
          return this.toolKit.isObject(e) && this.toolKit.extend(this, e), this;
        },
        report: function (e) {
          if (
            ("string" == typeof e && (e = { category: a.JSERR, msg: e }),
            e.sampleRate || (e.sampleRate = 1),
            this.toolKit.canReport(e.sampleRate || this.sampleRate))
          ) {
            if ((this._cleanData(e), this.ready())) {
              var t;
              if ("function" == typeof this.beforeSend) {
                try {
                  t = this.beforeSend(e);
                } catch (e) {
                  this.logger.error("exec beforeSend failed for:", e);
                }
                if (!1 === t)
                  return void this.logger.warn("beforeSend func return false");
                "object" == typeof t && (e = t);
              }
              var n = this.toolKit.getMetas(),
                r = e.bid || this.bid || n.wpkBid,
                o = e.cid || this.cid || n.wpkCid,
                s = e.rel || this.rel || n.wpkRel;
              this.toolKit.isFunction(s) && (s = s());
              var l = e.uid || this.uid;
              if (
                (this.toolKit.isFunction(l) && (l = l()),
                l || (l = this.getWid()),
                this.toolKit.extend(e, {
                  w_bid: r,
                  w_cid: o,
                  w_rel: s,
                  w_spa: this.spa,
                  w_tm: this.toolKit.timestamp(),
                  w_cnt: 1,
                  uid: l,
                  type: this.toolKit.categoryToType(e.category),
                  sdk_ver: this.VERSION,
                  log_src: "jssdk",
                  uc_param: this.uc_param || "",
                  wid: this.wid,
                }),
                this._dyConf && Date.now() < this._dyConf.expireAt)
              ) {
                var u =
                  void 0 !== this._dyConf[e.type]
                    ? this._dyConf[e.type]
                    : this._dyConf.all;
                if (void 0 !== u && !this.toolKit.canReport(u))
                  return void this.logger.warn(
                    "由于「动态配置」采样率控制，本条日志最终未上报，类型: ",
                    e.type,
                    " 采样率: ",
                    u
                  );
              } else
                !this._dying &&
                  Date.now() - this._startTime >= 18e5 &&
                  (this.logger.warn("syncing dynamic config"), c(this));
              var p = {
                  app: r,
                  cp: "none",
                  de: 4,
                  seq: this.toolKit.generateSeq(),
                  tm: this.toolKit.timestamp(!0),
                  ud: encodeURIComponent(e.uid),
                  ver: e.w_rel,
                  type: e.type,
                  sver: e.sdk_ver,
                  sign: "9bf8a190ef82c5049df7b199c599c45b",
                },
                f = i.addr[this.cluster + (this.isHttps ? "_https" : "")],
                d = this.toolKit.objToQueryString(p);
              this.toolKit.cutStr(e, ["c1", "c2", "c3", "c4", "c5"], 128),
                this.send(f, d, e);
            } else
              this._waitingQueue.push(e),
                this.logger.warn("sdk未完成初始化，数据已缓存");
            return this;
          }
          this.logger.warn(
            "由于采样率控制，本条日志最终未上报，采样率: ",
            e.sampleRate || this.sampleRate
          );
        },
        _cleanData: function (e) {
          for (var t, n = 1; n <= 10; n++)
            (t = "bl" + n),
              e.hasOwnProperty(t) && ((e["w_" + t] = e[t]), (e[t] = void 0));
          t = null;
        },
        reportFlow: function (e) {
          return (
            (e = e || {}),
            this.report(
              this.toolKit.extend(e || {}, { category: a.FLOW, sampleRate: 1 })
            ),
            this
          );
        },
        reportError: function (e, t) {
          return this.toolKit.isError(e)
            ? (((t = t || {}).category = a.JSERR),
              (t.w_msg = e.toString()),
              (t.stack = this.toolKit.parseErrorStack(e)),
              (t.w_file = e.filename || ""),
              (t.w_line = e.lineno || ""),
              (t.w_col = e.colno || ""),
              this.report(t),
              this)
            : this.report(e, t);
        },
        reportApiError: function (e, t) {
          return (
            e &&
              (this.toolKit.isObject(e.queryString) &&
                (e.queryString = this.toolKit.objToQueryString(e.queryString)),
              this.report(
                this.toolKit.extend(
                  t || {},
                  {
                    msg: e.msg || "",
                    w_res: e.url,
                    w_method: e.method,
                    w_param: e.queryString,
                    w_body: JSON.stringify(e.body),
                    w_resp: e.response,
                    w_rc: e.status,
                    w_rt: e.spent || "",
                    c1: e.c1,
                    c2: e.c2,
                    c3: e.c3,
                    c4: e.c4,
                    c5: e.c5,
                  },
                  { category: a.API, w_type: 16 }
                )
              )),
            this
          );
        },
        diagnose: function () {
          this.ready()
            ? this.bid
              ? (this.sampleRate ||
                  this.logger.warn(
                    "没有设置采样率参数sampleRate，将使用默认采样率"
                  ),
                this.report({ _diagnose: !0 }))
              : this.logger.warn("缺少bid参数,请确认是否已正确设置")
            : this.logger.warn(
                "wpkReporter尚未初始化，请确保已调用 install 方法"
              );
        },
        addPlugin: function (e, t) {
          return (
            this._plugins.push([e, t]),
            "function" == typeof e && this._init && e.apply(this, [this, t]),
            this
          );
        },
        install: function () {
          c(this);
          for (
            var e = n(2), t = this._plugins.length, r = !1, o = 0;
            o < t;
            o++
          ) {
            var i = this._plugins[o],
              a = i[0],
              s = i[1];
            a + "" == e + "" && (r = !0), a.apply(this, [this, s]);
          }
          return (
            (this.wid = this.getWid()),
            (this._sid = this.toolKit.uuid()),
            (this._init = !0),
            (0 !== t && r) ||
              (this.toolKit.logger.info("没有设置Flow，内置开启"),
              this.addPlugin(e)),
            this
          );
        },
        installAll: function () {
          var e = [
              [n(8), { resErr: !0 }],
              [n(9)],
              [n(10)],
              [n(2)],
              [n(11), { params: "prveosfrnw" }],
            ],
            t = this._plugins.length;
          if (0 === t) this._plugins = e;
          else {
            for (var r = [], o = e.length, i = 0; i < o; i++) {
              for (var a = e[i], s = 0; s < t; s++)
                if (
                  a[0].prototype.pluginId ===
                  this._plugins[s][0].prototype.pluginId
                ) {
                  a = this._plugins[s];
                  break;
                }
              r.push(a);
            }
            this._plugins = r;
          }
          return this.install();
        },
        uninstall: function () {
          return (this._plugins = []), (this._init = !1), this;
        },
      }),
        (e.exports = s);
    },
    function (e, t, n) {
      var r = n(0).env,
        o = function (e) {
          var t;
          return (
            (e
              ? (t = e.replace(/^#\/?/, "")) && "string" == typeof t
                ? t.replace(/^(https?:)?\/\//, "").replace(/\?.*$/, "")
                : ""
              : "") || "[index]"
          );
        },
        i = function (e, t) {
          if (((t = t || {}), e.env === r.BROWSER && window))
            if (e.toolKit.extend({ enable: !0 }, t).enable) {
              e.logger.info("wpkflowPlugin已开启");
              var i,
                a,
                s = function () {
                  e.reportFlow();
                };
              e.toolKit.onListen(window, "load", s, !0),
                e.spa &&
                  (n(7)(),
                  (i = function (t) {
                    o(location.hash) &&
                      ((e._sid = e.toolKit.uuid()), e.reportFlow());
                  }),
                  (a = function (t) {
                    o(t.detail) &&
                      ((e._sid = e.toolKit.uuid()), e.reportFlow());
                  }),
                  e.toolKit.onListen(window, "hashchange", i),
                  e.toolKit.onListen(window, "historystatechange", a)),
                e.toolKit.onListen(window, "beforeunload", function () {
                  e.toolKit.offListen(window, "load"),
                    e.toolKit.offListen(window, "hashchange"),
                    e.toolKit.offListen(window, "historystatechange"),
                    (s = i = a = null);
                });
            } else e.logger.info("wpkflowPlugin已关闭");
        };
      (i.prototype.pluginId = "flow"), (e.exports = i);
    },
    function (e, t, n) {
      (function (t) {
        var r = "object" == typeof t && t + "" == "[object process]",
          o = "function" == typeof callNative || "function" == typeof nativeLog;
        e.exports = n(o ? 5 : r ? 13 : 16);
      }.call(this, n(4)));
    },
    function (e, t) {
      var n,
        r,
        o = (e.exports = {});
      function i() {
        throw new Error("setTimeout has not been defined");
      }
      function a() {
        throw new Error("clearTimeout has not been defined");
      }
      function s(e) {
        if (n === setTimeout) return setTimeout(e, 0);
        if ((n === i || !n) && setTimeout)
          return (n = setTimeout), setTimeout(e, 0);
        try {
          return n(e, 0);
        } catch (t) {
          try {
            return n.call(null, e, 0);
          } catch (t) {
            return n.call(this, e, 0);
          }
        }
      }
      !(function () {
        try {
          n = "function" == typeof setTimeout ? setTimeout : i;
        } catch (e) {
          n = i;
        }
        try {
          r = "function" == typeof clearTimeout ? clearTimeout : a;
        } catch (e) {
          r = a;
        }
      })();
      var c,
        l = [],
        u = !1,
        p = -1;
      function f() {
        u &&
          c &&
          ((u = !1), c.length ? (l = c.concat(l)) : (p = -1), l.length && d());
      }
      function d() {
        if (!u) {
          var e = s(f);
          u = !0;
          for (var t = l.length; t; ) {
            for (c = l, l = []; ++p < t; ) c && c[p].run();
            (p = -1), (t = l.length);
          }
          (c = null),
            (u = !1),
            (function (e) {
              if (r === clearTimeout) return clearTimeout(e);
              if ((r === a || !r) && clearTimeout)
                return (r = clearTimeout), clearTimeout(e);
              try {
                r(e);
              } catch (t) {
                try {
                  return r.call(null, e);
                } catch (t) {
                  return r.call(this, e);
                }
              }
            })(e);
        }
      }
      function w(e, t) {
        (this.fun = e), (this.array = t);
      }
      function h() {}
      (o.nextTick = function (e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
        l.push(new w(e, t)), 1 !== l.length || u || s(d);
      }),
        (w.prototype.run = function () {
          this.fun.apply(null, this.array);
        }),
        (o.title = "browser"),
        (o.browser = !0),
        (o.env = {}),
        (o.argv = []),
        (o.version = ""),
        (o.versions = {}),
        (o.on = h),
        (o.addListener = h),
        (o.once = h),
        (o.off = h),
        (o.removeListener = h),
        (o.removeAllListeners = h),
        (o.emit = h),
        (o.prependListener = h),
        (o.prependOnceListener = h),
        (o.listeners = function (e) {
          return [];
        }),
        (o.binding = function (e) {
          throw new Error("process.binding is not supported");
        }),
        (o.cwd = function () {
          return "/";
        }),
        (o.chdir = function (e) {
          throw new Error("process.chdir is not supported");
        }),
        (o.umask = function () {
          return 0;
        });
    },
    function (e, t, n) {
      var r = n(1),
        o = n(12);
      e.exports = function (e) {
        var t = new r(e);
        return t.initialize(o), t;
      };
    },
    function (e, t) {
      var n = function (e) {
          return e || "";
        },
        r = function () {
          var e = Date.now();
          return (
            "undefined" != typeof window &&
              window.performance &&
              "function" == typeof window.performance.now &&
              (e += performance.now()),
            "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
              t
            ) {
              var n = (e + 16 * Math.random()) % 16 | 0;
              return (
                (e = Math.floor(e / 16)), ("x" === t ? n : 11 & n).toString(16)
              );
            })
          );
        },
        o = function (e) {
          return "object" == typeof e;
        },
        i = function (e) {
          var t = {}.toString.call(e);
          return (
            o(e) &&
            ("[object Error]" === t ||
              "[object Exception]" === t ||
              t instanceof Error)
          );
        },
        a = function (e) {
          return "[object Array]" === {}.toString.call(e);
        },
        s = function (e) {
          return "function" == typeof e;
        },
        c = function (e) {
          var t = +new Date();
          return !0 === e && (t = Math.floor(t / 1e3)), t;
        },
        l = function (e) {
          if (e.stack) {
            var t = e.stack.split("\n");
            return t.shift(), t.join("\n");
          }
          return "";
        },
        u = function (e) {
          var t;
          switch (e) {
            case 1:
              t = "jserr";
              break;
            case 2:
              t = "api";
              break;
            case 3:
              t = "jsfsperf";
              break;
            case 4:
              t = "resloadfail";
              break;
            case 5:
              t = "flow";
              break;
            case 6:
              t = "bkpg";
              break;
            case 7:
              t = "harlog";
              break;
            default:
              t = "jssdkidx";
          }
          return t;
        },
        p = function () {
          return c() + Math.floor(10 * Math.random());
        },
        f = function (e) {
          var t = [];
          for (var n in e) t.push(n + "=" + e[n]);
          return t.join("&");
        },
        d = function (e) {
          return JSON ? JSON.stringify(e) : e.toString();
        },
        w = function () {
          if ("undefined" != typeof document && document.getElementsByTagName)
            for (
              var e,
                t,
                n,
                r,
                o = document.getElementsByTagName("meta"),
                i = o.length,
                a = 0;
              a < i;
              a++
            )
              "wpk-bid" === (r = o[a]).name
                ? (e = r.content)
                : "wpk-cid" === r.name
                ? (t = r.content)
                : "wpk-rel" === r.name && (n = r.content);
          return { wpkBid: e || null, wpkCid: t || null, wpkRel: n || null };
        },
        h = function (e, t, n, r) {
          return (
            e.addEventListener
              ? e.addEventListener(
                  t,
                  function o(i) {
                    r && e.removeEventListener(t, o, !1), n.call(this, i);
                  },
                  !1
                )
              : e.attachEvent &&
                e.attachEvent("on" + t, function o(i) {
                  r && e.detachEvent("on" + t, o), n.call(this, i);
                }),
            this
          );
        },
        g = function (e, t, n) {
          return n
            ? (e.removeEventListener
                ? e.removeEventListener(t, n)
                : e.detachEvent && e.detachEvent(t, n),
              this)
            : this;
        },
        v = function (e) {
          return (
            !!e &&
            0 !== e &&
            (e >= 1 ||
              "100%" === e ||
              (/^\d+(\.\d+)?%$/.test(e)
                ? Math.random() < parseFloat(e) / 100
                : e > 0 && e < 1 && Math.random() < e))
          );
        },
        m = "wpk-reporter",
        y = function (e, t) {
          var n = [].slice.call(t);
          e.apply(this, [m].concat(n));
        },
        _ = function (e) {
          var t = "";
          switch (e.category) {
            case 1:
              t = [
                e.category,
                e.uid,
                e.w_url,
                e.w_ref,
                e.w_msg || "",
                e.w_line || "",
                e.w_col || "",
              ].join("");
              break;
            case 2:
              t = [e.category, e.uid, e.w_res, e.w_method, e.w_rc].join("");
              break;
            case 4:
              t = [e.category, e.uid, e.w_url, e.w_ref, e.w_res, e.w_type].join(
                ""
              );
          }
          return t;
        },
        b = function (e, t) {
          e = e || !1;
          try {
            if (
              ("undefined" != typeof window &&
                window.ucweb &&
                window.ucweb.window) ||
              t
            ) {
              for (
                var n = (t || navigator.userAgent).split(" "),
                  r = n.length,
                  o = !1,
                  i = !1,
                  a = 0;
                a < r;
                a++
              )
                if (-1 !== n[a].indexOf("UWS/")) {
                  var s = n[a].split("/");
                  i = x(s[1], "2.13.2.37");
                } else -1 !== n[a].indexOf("AliApp(DingTalk/") && (o = !0);
              return o ? i : e;
            }
          } catch (e) {}
          return !1;
        },
        x = function (e, t) {
          try {
            for (
              var n, r, o = e.split("."), i = t.split("."), a = o.length, s = 0;
              s < a;
              s++
            )
              if ((n = parseInt(o[s])) !== (r = parseInt(i[s]))) return n > r;
            return !0;
          } catch (e) {}
          return !1;
        },
        E = {
          get: function (e) {
            if ("undefined" != typeof localStorage) {
              var t = localStorage.getItem(e);
              if (t) {
                if (((t = JSON.parse(t)), Date.now() < t.expireAt)) return t;
                this.rm(e);
              }
            }
            return null;
          },
          set: function (e, t) {
            "undefined" != typeof localStorage &&
              e &&
              t &&
              ((t.expireAt = Date.now() + 18e5),
              localStorage.setItem(e, JSON.stringify(t)));
          },
          rm: function (e) {
            "undefined" != typeof localStorage && localStorage.removeItem(e);
          },
        },
        S = function (e, t) {
          if (t) {
            if (1 === t.length) return e === t[0];
            if (2 === t.length) {
              var n = t[0],
                r = t[1];
              return n && !r ? o(e, n) : n && r ? o(e, n) && o(r, e) : o(r, e);
            }
            return !1;
          }
          return !0;
          function o(e, t) {
            var n = e.split("."),
              r = t.split(".");
            return (
              !(parseInt(n[0]) < parseInt(r[0])) &&
              (parseInt(n[0]) > parseInt(r[0]) ||
                (!(parseInt(n[1]) < parseInt(r[1])) &&
                  (parseInt(n[1]) > parseInt(r[1]) ||
                    parseInt(n[2]) >= parseInt(r[2]))))
            );
          }
        },
        R = function (e, t, n, o, i) {
          var a = E.get("wpkreporter:dynamicConf");
          if (a) s(i) && i(a);
          else {
            var l = {
                app: e,
                tm: c(!0),
                ud: r(),
                sver: t,
                sign: "c41e43c828c16c16a6eb1c9c1e68e8ce",
              },
              u = f(l);
            !(function (e, t) {
              if ("undefined" == typeof XMLHttpRequest) t();
              else {
                var n = new XMLHttpRequest();
                n.onreadystatechange = function () {
                  if (4 === n.readyState) {
                    var e;
                    if (200 === n.status && n.response)
                      try {
                        var r = JSON.parse(n.response);
                        0 === r.code && (e = r.config || []);
                      } catch (e) {}
                    t(e);
                  }
                };
                try {
                  n.open("GET", e, !0), (n.timeout = 3e3), n.send();
                } catch (e) {}
              }
            })(n + "?wpk-header=" + encodeURIComponent(u), function (e) {
              if (((a = {}), void 0 !== e)) {
                for (var n = e.length, r = 0; r < n; r++) {
                  var o = e[r],
                    c = o.sdkver;
                  if (S(t, c)) {
                    if (
                      (o.common &&
                        void 0 !== o.common.sampleRate &&
                        (a.all = o.common.sampleRate),
                      o.config)
                    )
                      for (var l, u = o.config.length, p = 0; p < u; p++)
                        (l = o.config[p]).type &&
                          void 0 !== l.sampleRate &&
                          (a[l.type] = l.sampleRate);
                    break;
                  }
                }
                E.set("wpkreporter:dynamicConf", a);
              }
              s(i) && i(a);
            });
          }
        },
        k = function (e, t, n) {
          for (var r, o = t.length, i = 0; i < o; i++)
            "string" == typeof (r = e[t[i]])
              ? (e[t[i]] = r.substring(0, n))
              : "object" == typeof r && (e[t[i]] = String(r));
        },
        O = function () {
          var e = !1;
          try {
            if ("undefined" != typeof navigator) {
              var t = -1 !== navigator.userAgent.indexOf("Alipay"),
                n = -1 !== navigator.userAgent.indexOf("MiniProgram"),
                r = -1 !== navigator.userAgent.indexOf("APXWebView");
              e = t && (n || r);
            }
          } catch (e) {}
          return e;
        };
      e.exports = function (e) {
        return {
          noop: n,
          uuid: r,
          isError: i,
          isArray: a,
          isObject: o,
          isFunction: s,
          logger:
            "undefined" != typeof console && o(console) && e.debug
              ? {
                  trace: function () {
                    y(console.trace, arguments);
                  },
                  debug: function () {
                    y(console.debug, arguments);
                  },
                  log: function () {
                    y(console.log, arguments);
                  },
                  info: function () {
                    y(console.info, arguments);
                  },
                  warn: function () {
                    y(console.warn, arguments);
                  },
                  error: function () {
                    y(console.error, arguments);
                  },
                }
              : { trace: n, debug: n, log: n, info: n, warn: n, error: n },
          extend: function (e) {
            for (var t = 1, n = arguments.length; t < n; t++) {
              var r = arguments[t];
              for (var o in r)
                Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o]);
            }
            return e;
          },
          canReport: v,
          onListen: h,
          offListen: g,
          getMetas: w,
          timestamp: c,
          generateSeq: p,
          categoryToType: u,
          parseErrorStack: l,
          objToJsonString: d,
          objToQueryString: f,
          genContentHash: _,
          isU4HA: b,
          cutStr: k,
          dynamicConf: R,
          inAlipayMiniAppWebview: O,
        };
      };
    },
    function (e, t) {
      var n = window.history || {},
        r = window.document,
        o = function (e, t) {
          var n;
          window.CustomEvent
            ? (n = new CustomEvent(e, { detail: t }))
            : ((n = r.createEvent("HTMLEvents")).initEvent(e, !1, !0),
              (n.detail = t)),
            window.dispatchEvent(n);
        },
        i = function (e) {
          return e && "string" == typeof e
            ? e.replace(/^(https?:)?\/\//, "").replace(/\?.*$/, "")
            : "";
        },
        a = function (e) {
          var t = n[e];
          "function" == typeof t &&
            ((n[e] = function (e, r, a) {
              var s = location.href,
                c = t.call(n, e, r, a);
              if (!a || "string" != typeof a) return c;
              if (a === s) return c;
              try {
                var l = s.split("#"),
                  u = a.split("#"),
                  p = i(l[0]),
                  f = i(u[0]),
                  d = l[1] && l[1].replace(/^\/?(.*)/, "$1"),
                  w = u[1] && u[1].replace(/^\/?(.*)/, "$1");
                p !== f
                  ? o("historystatechange", f)
                  : d !== w && o("historystatechange", w);
              } catch (e) {}
              return c;
            }),
            (n[e].toString = e + "() { [native code] }"));
        };
      e.exports = function () {
        a("pushState"), a("replateState");
      };
    },
    function (e, t, n) {
      var r,
        o,
        i = n(0),
        a = i.env,
        s = i.category,
        c = function (e) {
          return "function" == typeof e;
        },
        l = function (e) {
          var t = -1;
          switch (e.tagName.toLowerCase()) {
            case "img":
              t = 1;
              break;
            case "link":
              e.rel && "stylesheet" === e.rel.toLowerCase() && (t = 2);
              break;
            case "script":
              t = 3;
              break;
            case "video":
              t = 11;
          }
          return t;
        },
        u = {},
        p = function (e, t, n, r) {
          e.addEventListener
            ? e.addEventListener(t, n, r || !1)
            : ((u["on" + t] = function () {
                return n.call(e, window.event);
              }),
              e.attachEvent("on" + t, u["on" + t]));
        },
        f = function (e, t) {
          var n = e.id ? "#" + e.id : "",
            r = e.className ? "." + e.className.split(" ").join(".") : "",
            o = e.tagName.toLowerCase();
          return e.parentNode && e.parentNode.tagName && t - 1 != 0
            ? f(e.parentNode, t - 1) + " > " + o.toLowerCase() + n + r
            : o + n + r;
        },
        d = function (e, t, n, i, a, l) {
          if (r)
            try {
              r.call(this, t, n, i, a, l);
            } catch (l) {}
          if (
            (/^script error\.?$/i.test(t) && (t = "Script error"),
            o.ignoreScriptError && "Script error" === t)
          )
            e.logger.warn("配置了ignoreScriptError，本次异常将不上报");
          else if (!c(o.jsErrFilter) || o.jsErrFilter.call(this, event)) {
            if (null != l) {
              var u = (l.stack || "").split("\n");
              u.shift();
              var p = {
                w_msg: t,
                w_file: n || "",
                w_line: i || "",
                w_col: a || "",
                stack: u.join("\n"),
                category: s.JSERR,
                sampleRate: o.jsErrSampleRate,
              };
              e.report(p);
            }
          } else
            e.logger.warn(
              "jserrFilter 返回false，本次日志将不上报, event: ",
              event
            );
        },
        w = function (e, t) {
          var n = window;
          n && e.env === a.BROWSER
            ? (e.logger.info("wpkglobalerrorPlugin已开启"),
              !1 !==
              (o = e.toolKit.extend(
                { jsErrSampleRate: 1, resErrSampleRate: 1 },
                t
              )).jsErr
                ? ((r = n.onerror),
                  (n.onerror = function (t, n, r, o, i) {
                    d(e, t, n, r, o, i);
                  }),
                  p(n, "unhandledrejection", function (t) {
                    var n = t.type;
                    "string" == typeof t.reason
                      ? (n = t.reason)
                      : t.reason &&
                        "object" == typeof t.reason &&
                        t.reason.message &&
                        (n = t.reason.message),
                      d(e, n, null, null, null, t.reason || t.type);
                  }))
                : e.logger.warn("js异常监控已关闭"),
              o.resErr
                ? p(
                    n,
                    "error",
                    function (t) {
                      !(function (e, t) {
                        if (
                          !t.target.tagName ||
                          t.message ||
                          t.filename ||
                          t.lineno ||
                          t.colno
                        )
                          e.logger.warn("非资源获取问题，跳出处理, event: ", t);
                        else if (
                          !c(o.resErrFilter) ||
                          o.resErrFilter.call(this, t)
                        ) {
                          var n = t.target.src || t.target.href;
                          e.report({
                            category: s.RESLOADFAIL,
                            sampleRate: o.resErrSampleRate,
                            msg: n + " 加载失败",
                            w_res: n,
                            w_type: l(t.target),
                            w_xpath: f(t.target, 5),
                          });
                        } else
                          e.logger.warn(
                            "reserrFilter 返回false，本次日志将不上报, event: ",
                            t
                          );
                      })(e, t);
                    },
                    !0
                  )
                : e.logger.warn("资源加载异常监控已关闭"))
            : e.logger.warn("全局错误监控插件不支持非浏览器环境");
        };
      (w.prototype.pluginId = "gerror"), (e.exports = w);
    },
    function (e, t, n) {
      var r = n(0),
        o = r.sdk,
        i = r.http.methods,
        a = r.category,
        s = function (e) {
          return e >= 200 && e <= 299;
        },
        c = function (e) {
          return (
            -1 === e.indexOf("//arms-retcode") &&
            -1 === e.indexOf("//retcode.taobao.com") &&
            -1 === e.indexOf("//retcode-sg-lazada.arms.aliyuncs.com") &&
            -1 === e.indexOf("//wpk-gateway") &&
            -1 === e.indexOf("//px.ucweb.com") &&
            -1 === e.indexOf("//px.effirst.com") &&
            -1 === e.indexOf("//px-intl.ucweb.com")
          );
        },
        l = function (e, t) {
          if (e.hasOwnProperty(t)) return e[t];
        },
        u = function (e, t, n) {
          e.toolKit.isObject(n) &&
            e.toolKit.extend(t, {
              c1: l(n, "c1"),
              c2: l(n, "c2"),
              c3: l(n, "c3"),
              c4: l(n, "c4"),
              c5: l(n, "c5"),
              bl1: l(n, "bl1"),
              bl2: l(n, "bl2"),
              bl3: l(n, "bl3"),
              bl4: l(n, "bl4"),
              bl5: l(n, "bl5"),
            }),
            e.report(t);
        };
      var p = function (e, t) {
        if (e.env === r.env.BROWSER && window) {
          var n = e.toolKit.extend({ enable: !0, sampleRate: 1 }, t);
          n.enable
            ? (e.logger.info("wpkinterfacePlugin已开启"),
              "XMLHttpRequest" in window &&
                (function (e, t) {
                  var n = window.XMLHttpRequest.prototype,
                    r = n.open;
                  n.open = function (e, t) {
                    this.__reqCtx__ = {
                      method: e,
                      url: t || "",
                      start: Date.now(),
                    };
                    var n = [].slice.call(arguments);
                    r.apply(this, n);
                  };
                  var l = n.send;
                  n.send = function (n) {
                    var r = this;
                    function p() {
                      if (r.__reqCtx__ && 4 === r.readyState)
                        try {
                          var l = Date.now(),
                            p = (r.responseURL || r.__reqCtx__.url).split("?"),
                            f = p[0],
                            d = p[1] || "",
                            w = "";
                          r.__reqCtx__.method.toUpperCase() !== i.GET &&
                            n &&
                            (w = JSON.stringify(n));
                          var h = String(r.response),
                            g = !0,
                            v = {};
                          "function" == typeof t.errorFilter &&
                            ((g = !!(v = t.errorFilter.call(this, {
                              url: f,
                              status: r.status,
                              response: h,
                            }))),
                            e.logger.warn("api errorFilter执行结果：", v)),
                            h.length > 2048 &&
                              (h = "[response content too large]");
                          var m = l - r.__reqCtx__.start;
                          if (g && m < 121e3 && c(f)) {
                            var y = v.bizCode || r.status,
                              _ = {
                                category: a.API,
                                sampleRate: t.sampleRate,
                                w_res: f,
                                w_param: d,
                                w_body: s(y) || !t.withBody ? "" : w,
                                w_method: r.__reqCtx__.method,
                                w_rc: y,
                                w_rt: m,
                                w_resp: s(y) || !t.withResp ? "" : v.resp || h,
                                msg: v.msg || "",
                                w_type: 16,
                              };
                            u(e, _, v);
                          }
                        } catch (t) {
                          e.reportError(t, {
                            bid: o.BID,
                            cid: o.CID,
                            category: a.JSERR,
                            sampleRate: 1,
                          });
                        }
                    }
                    if (
                      "onreadystatechange" in r &&
                      "function" == typeof r.onreadystatechange
                    ) {
                      var f = r.onreadystatechange;
                      r.onreadystatechange = function () {
                        var e = [].slice.call(arguments);
                        p.apply(this, e), f.apply(this, e);
                      };
                    } else r.onreadystatechange = p;
                    var d = [].slice.call(arguments);
                    return l.apply(this, d);
                  };
                })(e, n),
              "fetch" in window &&
                (function (e, t) {
                  var n = window.fetch;
                  window.fetch = function () {
                    var r = [].slice.call(arguments),
                      l = i.GET;
                    r[1] && r[1].method && (l = r[1].method.toUpperCase());
                    var p = Date.now();
                    return n
                      .apply(this, r)
                      .then(function (n) {
                        try {
                          var f = Date.now(),
                            d = (n.url || r[0]).split("?"),
                            w = d[0],
                            h = d[1] || "",
                            g = "";
                          l !== i.GET &&
                            r[1] &&
                            r[1].body &&
                            (g = JSON.stringify(r[1].body)),
                            n
                              .clone()
                              .text()
                              .then(function (r) {
                                r = r || "";
                                var o = !0,
                                  i = {};
                                if (
                                  ("function" == typeof t.errorFilter &&
                                    ((o = !!(i = t.errorFilter.call(this, {
                                      url: w,
                                      status: n.status,
                                      response: r,
                                    }))),
                                    e.logger.warn(
                                      "api errorFilter执行结果：",
                                      i
                                    )),
                                  (r =
                                    r.length > 2048
                                      ? "[response content too large]"
                                      : r),
                                  o && f - p < 121e3 && c(w))
                                ) {
                                  var d = i.bizCode || n.status,
                                    v = {
                                      category: a.API,
                                      sampleRate: t.sampleRate,
                                      w_res: w,
                                      w_param: h,
                                      w_body: s(d) || !t.withBody ? "" : g,
                                      w_method: l,
                                      w_rc: d,
                                      w_rt: f - p,
                                      w_resp:
                                        s(d) || !t.withResp ? "" : i.resp || r,
                                      msg: i.msg || "",
                                      w_type: 16,
                                    };
                                  u(e, v, i);
                                }
                              });
                        } catch (t) {
                          e.reportError(t, {
                            bid: o.BID,
                            cid: o.CID,
                            category: a.JSERR,
                            sampleRate: 1,
                          });
                        }
                        return n;
                      })
                      .catch(function (t) {
                        throw (e.reportError(t, { category: a.JSERR }), t);
                      });
                  };
                })(e, n))
            : e.logger.info("wpkinterfacePlugin已关闭");
        }
      };
      (p.prototype.pluginId = "api"), (e.exports = p);
    },
    function (e, t, n) {
      var r,
        o = n(0).env,
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
        s = ["navigate", "reload", "back_forward"],
        c = function (e) {
          var t,
            n = e[a[5]];
          if (1 === e._ver) {
            var r;
            if (window.chrome && window.chrome.loadTimes)
              r = 1e3 * window.chrome.loadTimes().firstPaintTime;
            else r = e.msFirstPaint ? e.msFirstPaint : e[a[13]];
            if (!r) return -1;
            t = r >= n ? parseFloat((r - n).toFixed(2)) : -1;
          } else
            2 === e._ver &&
              ((t = e[a[13]] - n), (t = parseFloat(t.toFixed(2))));
          return t;
        },
        l = function (e, t) {
          var n,
            r,
            o,
            i = {};
          for (var s in t)
            (o = 0),
              (n = e[a[t[s][0]]]),
              (r = e[a[t[s][1]]]),
              n > 0 && r > 0 && (o = parseFloat((r - n).toFixed(2))),
              (i[s] = o);
          return i;
        },
        u = function (e, t) {
          var n = window;
          if (
            ((r =
              n.performance ||
              n.webkitPerformance ||
              n.msPerformance ||
              n.mozPerformance),
            e.env === o.BROWSER && r && r.timing)
          ) {
            t = t || {};
            var a = e.toolKit.extend({ enable: !0, sampleRate: 1 }, t);
            if (a.enable) {
              e.logger.info("wpkperformancePlugin已开启");
              var u = r.timing || {},
                p = 1;
              if ("function" == typeof n.PerformanceNavigationTiming)
                try {
                  var f = r.getEntriesByType("navigation")[0];
                  f && ((u = f), (p = 2));
                } catch (e) {}
              (u._ver = p),
                (function (e, t, n, r) {
                  e.addEventListener
                    ? e.addEventListener(t, n, r || !1)
                    : e.attachEvent("on" + t, n);
                })(window, "load", function () {
                  /loaded|complete/.test(document.readyState) &&
                    setTimeout(function () {
                      var t = e.toolKit.extend(
                        (function (e) {
                          return l(e, {
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
                        })(u),
                        (function (e) {
                          var t = l(e, {
                            w_firstbyte: [5, 12],
                            w_tti: [5, 15],
                            w_domready: [5, 17],
                            w_load: [5, 19],
                            w_total: [5, 20],
                          });
                          return (t.w_fpt = c(e)), t;
                        })(u)
                      );
                      for (var n in t)
                        if (t[n] < 0 || t[n] > 6e4)
                          return void e.logger.warn("性能数据异常：", n, t[n]);
                      var o = e.toolKit.extend(
                        t,
                        (function (e) {
                          var t,
                            n = r.navigation || {},
                            o = -1,
                            i = -1,
                            a = -1;
                          return (
                            1 === e._ver
                              ? (t = s[n.type] || "other")
                              : 2 === e._ver &&
                                ((o = e.encodedBodySize),
                                (i = e.decodedBodySize),
                                (a = e.transferSize),
                                (t = e.type)),
                            {
                              w_enbdsize: o,
                              w_debdsize: i,
                              w_transize: a,
                              w_navtype: t,
                            }
                          );
                        })(u),
                        a,
                        { category: i.JSFSPERF }
                      );
                      e.report(o);
                    });
                });
            } else e.logger.info("wpkperformancePlugin已关闭");
          } else e.logger.warn("基础性能插件仅支持浏览器环境");
        };
      (u.prototype.pluginId = "perf"), (e.exports = u);
    },
    function (e, t, n) {
      var r = n(0).env,
        o = function (e, t) {
          if (
            ((t = t || {}),
            -1 !== [r.BROWSER, r.WEEX].indexOf(e.env) &&
              t.params &&
              "string" == typeof t.params)
          ) {
            e.logger.info("wpkucparamPlugin已开启");
            for (
              var n = t.params, o = ["pr", "ve", "os", "fr", "nw"], i = 0;
              i < 5;
              i++
            ) {
              var a = o[i];
              -1 === n.indexOf(a) && (n += a);
            }
            try {
              ucapi.biz.ucparams({
                params: n,
                success: function (t) {
                  e.uc_param = t || "";
                },
              });
            } catch (t) {
              e.logger.error("get uc_param_str error: ", t),
                (e.uc_param_str = n);
            }
          }
        };
      (o.prototype.pluginId = "ucparam"), (e.exports = o);
    },
    function (e, t, n) {
      var r = n(0),
        o = "undefined" != typeof weex ? weex : {},
        i = function () {
          var e = {
            wx_pf: WXEnvironment.platform,
            wx_ver: WXEnvironment.weexVersion,
            wx_app: WXEnvironment.appName,
            wx_app_ver: WXEnvironment.appVersion,
            wx_os: WXEnvironment.osName,
            wx_os_ver: WXEnvironment.osVersion,
            wx_dev_md: WXEnvironment.deviceModel,
            dsp_w: WXEnvironment.deviceWidth,
            dsp_h: WXEnvironment.deviceHeight,
          };
          if (void 0 !== weex.config.uc)
            try {
              var t = JSON.parse(weex.config.uc.ucParams);
              (e.net = t.nw), (e.wx_app = t.pr), (e.wx_app_ver = t.ve);
            } catch (e) {}
          return (
            "undefined" != typeof weex &&
            weex.config &&
            weex.config.bundleType &&
            "Vue" !== weex.config.bundleType &&
            "vue" !== weex.config.bundleType
              ? ("undefined" != typeof location
                  ? (e.wx_bdl_url = location.href)
                  : (e.wx_bdl_url =
                      "undefined" != typeof weex && weex.config
                        ? weex.config.bundleUrl
                        : "unknow"),
                (e.wx_bdl_type = "Rax"))
              : ((e.wx_bdl_url = weex.config.bundleUrl),
                (e.wx_bdl_type = "Vue")),
            (e.wx_bdl_name = (function (e) {
              try {
                var t = e.substring(e.lastIndexOf("/") + 1);
                return -1 === t.lastIndexOf(".")
                  ? t
                  : t.substring(0, t.lastIndexOf("."));
              } catch (e) {
                return "";
              }
            })(e.wx_bdl_url)),
            e
          );
        };
      e.exports = {
        env: r.env.WEEX,
        root: o,
        isHttps: !1,
        send: function (e, t, n) {
          var r = this.toolKit.extend(i(), n, { w_frmid: this._sid });
          (r.fr = r.wx_os),
            (r.rom = r.wx_os_ver),
            (r.brand = r.wx_dev_md),
            (r.model = r.wx_dev_md),
            (r.browser = r.wx_app),
            (r.bver = r.wx_app_ver),
            (r.w_url = r.wx_bdl_name),
            (r.w_send_mode = "weexfetch");
          var o = encodeURIComponent(t),
            a = encodeURIComponent(this.toolKit.objToJsonString(r));
          this.uc_param_str && (e += "&uc_param_str=" + this.uc_param_str),
            weex
              .requireModule("stream")
              .fetch(
                {
                  url: e,
                  method: "POST",
                  headers: { "wpk-header": o },
                  body: a,
                },
                function (e, t) {}
              );
        },
        getWid: function () {
          return this.toolKit.uuid();
        },
        bindUnloadEvent: function () {},
      };
    },
    function (e, t, n) {
      var r = n(1),
        o = n(14);
      e.exports = function (e) {
        var t = new r(e);
        return t.initialize(o), t;
      };
    },
    function (e, t, n) {
      (function (t) {
        var r = n(0),
          o = t;
        e.exports = { env: r.env.NODEJS, root: o, send: function (e, t, n) {} };
      }.call(this, n(15)));
    },
    function (e, t) {
      var n;
      n = (function () {
        return this;
      })();
      try {
        n = n || new Function("return this")();
      } catch (e) {
        "object" == typeof window && (n = window);
      }
      e.exports = n;
    },
    function (e, t, n) {
      var r = n(1),
        o = n(17);
      e.exports = function (e) {
        var t = new r(e);
        return t.initialize(o), t;
      };
    },
    function (e, t, n) {
      var r = n(0),
        o =
          "undefined" != typeof window
            ? window
            : "undefined" != typeof self
            ? self
            : {},
        i = o.document,
        a = o.navigator,
        s = o.location,
        c = {},
        l = function (e, t, n, r, o) {
          if (void 0 === t) {
            var a, s;
            if (!c[e]) {
              a = new RegExp(e + "=([^;]+)");
              try {
                s = a.exec(i.cookie);
              } catch (e) {
                return null;
              }
              s && (c[e] = s[1]);
            }
            return c[e];
          }
          var l = e + "=" + t;
          r && (l += "; domain=" + r),
            o && (l += "; path=" + o),
            n && (l += "; max-age=" + n);
          try {
            return (i.cookie = l), !!i.cookie;
          } catch (e) {
            return !1;
          }
        },
        u = function (e) {
          var t = window,
            n =
              "wpkimgreporter_" +
              +new Date() +
              ".r" +
              Math.floor(1e3 * Math.random()),
            r = (t[n] = new Image());
          (r.onload = r.onerror = function () {
            t[n] = null;
          }),
            (r.src = e);
        },
        p = null,
        f = function (e) {
          clearTimeout(p),
            (p = null),
            (function (e) {
              var t = e._waitingQueue;
              if (e.checkHidden && i && i.hidden)
                return (
                  e.logger.warn("当前页面不可见，日志数据将丢弃: ", t),
                  void (e._waitingQueue = [])
                );
              if (a && a.sendBeacon && o.Blob) {
                var n,
                  r,
                  s = (function (e) {
                    for (
                      var t, n, r = [], o = [], i = e.length, a = 0;
                      a < i;
                      a++
                    )
                      (n = e[a].category), -1 === o.indexOf(n) && o.push(n);
                    t = o.length;
                    for (var s = 0; s < t; s++) {
                      n = o[s];
                      for (var c = [], l = 0; l < i; l++) {
                        var u = e[l];
                        u.category === n && c.push(u);
                      }
                      r[s] = c;
                    }
                    return r;
                  })(t),
                  c = s.length;
                try {
                  for (var l, p = 0; p < c; p++) {
                    (l = (n = s[p])[0]._servAddr), (r = n.length);
                    for (var f = 0; f < r; f++)
                      (n[f].w_send_mode = "sendbeacon"),
                        (n[f]._servAddr = void 0),
                        (n[f]._hash = void 0),
                        (n[f] = e.toolKit.objToJsonString(n[f]));
                    var d = encodeURIComponent(n.join("\n"));
                    e.supportBeaconBody
                      ? a.sendBeacon(l, d)
                      : a.sendBeacon(l + "&data=" + d);
                  }
                  e._waitingQueue = [];
                } catch (e) {}
              } else {
                for (var w, h, g = 0; g < t.length; g++)
                  (h = (w = t[g])._servAddr),
                    (w.w_send_mode = "imgsrc"),
                    (w._servAddr = void 0),
                    (w._hash = void 0),
                    (w = encodeURIComponent(e.toolKit.objToJsonString(w))),
                    u(h + "&data=" + w);
                e._waitingQueue = [];
              }
            })(e);
        },
        d = function (e) {
          f(e);
        };
      e.exports = {
        env: r.env.BROWSER,
        root: o,
        isHttps: s.protocol === r.http.protocols.HTTPS,
        send: function (e, t, n) {
          var c = this;
          if (c.toolKit.isU4HA(c.onlyCustom) && n.category < 100)
            c.logger.warn("在u4内核环境，屏蔽非自定义的所有自动打点");
          else if (
            c.toolKit.inAlipayMiniAppWebview() &&
            !0 === c.blockAlipayMiniAppWebview
          )
            c.logger.warn(
              "current runtime is alipay miniapp webview, this request will be blocked."
            );
          else {
            var l = c.toolKit.extend(
              (function (e) {
                if (!i) return {};
                var t,
                  n = i.referrer;
                return (
                  n &&
                    -1 !== n.indexOf('"') &&
                    (n = encodeURIComponent(i.referrer)),
                  {
                    w_url: s.origin + s.pathname,
                    w_query: s.search,
                    w_ref: s.hash.substring(1),
                    w_title: i.title,
                    ua: a.userAgent,
                    referrer: n,
                    dsp_w: o.screen.width,
                    dsp_h: o.screen.height,
                    net:
                      ((t = a.connection),
                      t && t.type
                        ? t.type === r.navConn.types.NONE
                          ? "disconnected"
                          : t.type === r.navConn.types.CELLULAR
                          ? t.effectiveType === r.navConn.effectiveTypes.SLOW2G
                            ? "2g"
                            : t.effectiveType
                          : t.type
                        : ""),
                  }
                );
              })(c.spa),
              n,
              { w_frmid: c._sid }
            );
            if (
              (c.logger.warn("logData to send: ", e, l),
              (e += "?wpk-header=" + encodeURIComponent(t)),
              c.uc_param_str && (e += "&uc_param_str=" + c.uc_param_str),
              !0 === n._diagnose)
            )
              return (
                (l = encodeURIComponent(c.toolKit.objToJsonString(l))),
                void window.open(e + "&data=" + l)
              );
            (l._servAddr = e), (l._hash = c.toolKit.genContentHash(l));
            var u,
              d,
              w = c.delay && -1 !== [1, 2, 4].indexOf(l.category);
            if (
              (function (e, t) {
                var n = e._waitingQueue,
                  r = n.length,
                  o = t.reduplication || e.reduplication || !0,
                  i = !0;
                if (1 === t.category && o && 0 !== r) {
                  for (var a, s = 0; s < r; s++)
                    if ((a = n[s])._hash === t._hash) {
                      a.w_cnt++, (i = !1);
                      break;
                    }
                  i && n.push(t);
                } else n.push(t);
                return i;
              })(c, l) ||
              !w
            )
              (u = function () {
                f(c);
              }),
                (p =
                  -1 === (d = w ? 3e3 : -1)
                    ? (u(), null)
                    : setTimeout(u, d || 0));
            else c.logger.warn("logData被合并: ", l);
          }
        },
        getWid: function () {
          var e = l(r.sdk.WID_KEY);
          return (
            e || ((e = this.toolKit.uuid()), l(r.sdk.WID_KEY, e, 15552e3)), e
          );
        },
        bindUnloadEvent: function (e) {
          window &&
            (window.addEventListener
              ? window.addEventListener(
                  "beforeunload",
                  function (t) {
                    d(e);
                  },
                  !1
                )
              : window.attachEvent &&
                window.attachEvent("onbeforeunload", function (t) {
                  d(e);
                }));
        },
      };
    },
  ]);
});
