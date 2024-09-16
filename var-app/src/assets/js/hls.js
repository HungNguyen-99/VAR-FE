var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || 'function' == typeof Object.defineProperties
    ? Object.defineProperty
    : function (t, g, k) {
        t != Array.prototype && t != Object.prototype && (t[g] = k.value);
      };
$jscomp.getGlobal = function (t) {
  return 'undefined' != typeof window && window === t ? t : 'undefined' != typeof global && null != global ? global : t;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function () {
  $jscomp.initSymbol = function () {};
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.Symbol = (function () {
  var t = 0;
  return function (g) {
    return $jscomp.SYMBOL_PREFIX + (g || '') + t++;
  };
})();
$jscomp.initSymbolIterator = function () {
  $jscomp.initSymbol();
  var t = $jscomp.global.Symbol.iterator;
  t || (t = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol('iterator'));
  'function' != typeof Array.prototype[t] &&
    $jscomp.defineProperty(Array.prototype, t, {
      configurable: !0,
      writable: !0,
      value: function () {
        return $jscomp.arrayIterator(this);
      },
    });
  $jscomp.initSymbolIterator = function () {};
};
$jscomp.arrayIterator = function (t) {
  var g = 0;
  return $jscomp.iteratorPrototype(function () {
    return g < t.length
      ? {
          done: !1,
          value: t[g++],
        }
      : {
          done: !0,
        };
  });
};
$jscomp.iteratorPrototype = function (t) {
  $jscomp.initSymbolIterator();
  t = {
    next: t,
  };
  t[$jscomp.global.Symbol.iterator] = function () {
    return this;
  };
  return t;
};
$jscomp.iteratorFromArray = function (t, g) {
  $jscomp.initSymbolIterator();
  t instanceof String && (t += '');
  var k = 0,
    n = {
      next: function () {
        if (k < t.length) {
          var l = k++;
          return {
            value: g(l, t[l]),
            done: !1,
          };
        }
        n.next = function () {
          return {
            done: !0,
            value: void 0,
          };
        };
        return n.next();
      },
    };
  n[Symbol.iterator] = function () {
    return n;
  };
  return n;
};
$jscomp.polyfill = function (t, g, k, n) {
  if (g) {
    k = $jscomp.global;
    t = t.split('.');
    for (n = 0; n < t.length - 1; n++) {
      var l = t[n];
      l in k || (k[l] = {});
      k = k[l];
    }
    t = t[t.length - 1];
    n = k[t];
    g = g(n);
    g != n &&
      null != g &&
      $jscomp.defineProperty(k, t, {
        configurable: !0,
        writable: !0,
        value: g,
      });
  }
};
$jscomp.polyfill(
  'Array.prototype.keys',
  function (t) {
    return t
      ? t
      : function () {
          return $jscomp.iteratorFromArray(this, function (g) {
            return g;
          });
        };
  },
  'es6',
  'es3'
);
$jscomp.polyfill(
  'Number.MAX_SAFE_INTEGER',
  function () {
    return 9007199254740991;
  },
  'es6',
  'es3'
);
(function (t) {
  'object' === typeof exports && 'undefined' !== typeof module
    ? (module.exports = t())
    : 'function' === typeof define && define.amd
    ? define([], t)
    : (('undefined' !== typeof window
        ? window
        : 'undefined' !== typeof global
        ? global
        : 'undefined' !== typeof self
        ? self
        : this
      ).Hls = t());
})(function () {
  return (function g(k, n, l) {
    function f(c, b) {
      if (!n[c]) {
        if (!k[c]) {
          var a = 'function' == typeof require && require;
          if (!b && a) return a(c, !0);
          if (e) return e(c, !0);
          b = Error("Cannot find module '" + c + "'");
          throw ((b.code = 'MODULE_NOT_FOUND'), b);
        }
        b = n[c] = {
          exports: {},
        };
        k[c][0].call(
          b.exports,
          function (a) {
            var h = k[c][1][a];
            return f(h ? h : a);
          },
          b,
          b.exports,
          g,
          k,
          n,
          l
        );
      }
      return n[c].exports;
    }
    for (var e = 'function' == typeof require && require, d = 0; d < l.length; d++) f(l[d]);
    return f;
  })(
    {
      1: [
        function (g, k, n) {
          function l() {
            this._events = this._events || {};
            this._maxListeners = this._maxListeners || void 0;
          }
          function f(d) {
            return 'function' === typeof d;
          }
          function e(d) {
            return 'object' === typeof d && null !== d;
          }
          k.exports = l;
          l.EventEmitter = l;
          l.prototype._events = void 0;
          l.prototype._maxListeners = void 0;
          l.defaultMaxListeners = 10;
          l.prototype.setMaxListeners = function (d) {
            if ('number' !== typeof d || 0 > d || isNaN(d)) throw TypeError('n must be a positive number');
            this._maxListeners = d;
            return this;
          };
          l.prototype.emit = function (d) {
            var c;
            this._events || (this._events = {});
            if ('error' === d && (!this._events.error || (e(this._events.error) && !this._events.error.length))) {
              var b = arguments[1];
              if (b instanceof Error) throw b;
              throw TypeError('Uncaught, unspecified "error" event.');
            }
            var a = this._events[d];
            if (void 0 === a) return !1;
            if (f(a))
              switch (arguments.length) {
                case 1:
                  a.call(this);
                  break;
                case 2:
                  a.call(this, arguments[1]);
                  break;
                case 3:
                  a.call(this, arguments[1], arguments[2]);
                  break;
                default:
                  (b = Array.prototype.slice.call(arguments, 1)), a.apply(this, b);
              }
            else if (e(a)) {
              b = Array.prototype.slice.call(arguments, 1);
              var m = a.slice();
              a = m.length;
              for (c = 0; c < a; c++) m[c].apply(this, b);
            }
            return !0;
          };
          l.prototype.addListener = function (d, c) {
            if (!f(c)) throw TypeError('listener must be a function');
            this._events || (this._events = {});
            this._events.newListener && this.emit('newListener', d, f(c.listener) ? c.listener : c);
            this._events[d]
              ? e(this._events[d])
                ? this._events[d].push(c)
                : (this._events[d] = [this._events[d], c])
              : (this._events[d] = c);
            e(this._events[d]) &&
              !this._events[d].warned &&
              (c = void 0 !== this._maxListeners ? this._maxListeners : l.defaultMaxListeners) &&
              0 < c &&
              this._events[d].length > c &&
              ((this._events[d].warned = !0),
              console.error(
                '(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',
                this._events[d].length
              ),
              'function' === typeof console.trace && console.trace());
            return this;
          };
          l.prototype.on = l.prototype.addListener;
          l.prototype.once = function (d, c) {
            function b() {
              this.removeListener(d, b);
              a || ((a = !0), c.apply(this, arguments));
            }
            if (!f(c)) throw TypeError('listener must be a function');
            var a = !1;
            b.listener = c;
            this.on(d, b);
            return this;
          };
          l.prototype.removeListener = function (d, c) {
            if (!f(c)) throw TypeError('listener must be a function');
            if (!this._events || !this._events[d]) return this;
            var b = this._events[d];
            var a = b.length;
            var m = -1;
            if (b === c || (f(b.listener) && b.listener === c))
              delete this._events[d], this._events.removeListener && this.emit('removeListener', d, c);
            else if (e(b)) {
              for (; 0 < a--; )
                if (b[a] === c || (b[a].listener && b[a].listener === c)) {
                  m = a;
                  break;
                }
              if (0 > m) return this;
              1 === b.length ? ((b.length = 0), delete this._events[d]) : b.splice(m, 1);
              this._events.removeListener && this.emit('removeListener', d, c);
            }
            return this;
          };
          l.prototype.removeAllListeners = function (d) {
            if (!this._events) return this;
            if (!this._events.removeListener)
              return 0 === arguments.length ? (this._events = {}) : this._events[d] && delete this._events[d], this;
            if (0 === arguments.length) {
              for (c in this._events) 'removeListener' !== c && this.removeAllListeners(c);
              this.removeAllListeners('removeListener');
              this._events = {};
              return this;
            }
            var c = this._events[d];
            if (f(c)) this.removeListener(d, c);
            else if (c) for (; c.length; ) this.removeListener(d, c[c.length - 1]);
            delete this._events[d];
            return this;
          };
          l.prototype.listeners = function (d) {
            return this._events && this._events[d]
              ? f(this._events[d])
                ? [this._events[d]]
                : this._events[d].slice()
              : [];
          };
          l.prototype.listenerCount = function (d) {
            if (this._events) {
              d = this._events[d];
              if (f(d)) return 1;
              if (d) return d.length;
            }
            return 0;
          };
          l.listenerCount = function (d, c) {
            return d.listenerCount(c);
          };
        },
        {},
      ],
      2: [
        function (g, k, n, l, f, e) {
          var d = JSON.stringify;
          k.exports = function (c) {
            for (var b, a, m = Object.keys(e), h = 0, q = m.length; h < q; h++) {
              b = m[h];
              var v = e[b].exports;
              if (v === c || v.default === c) {
                a = b;
                break;
              }
            }
            if (!a) {
              a = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
              v = {};
              h = 0;
              for (q = m.length; h < q; h++) (b = m[h]), (v[b] = b);
              f[a] = [Function(['require', 'module', 'exports'], '(' + c + ')(self)'), v];
            }
            c = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
            b = {};
            b[a] = a;
            f[c] = [Function(['require'], 'var f = require(' + d(a) + ');(f.default ? f.default : f)(self);'), b];
            a =
              '(' +
              l +
              ')({' +
              Object.keys(f)
                .map(function (a) {
                  return d(a) + ':[' + f[a][0] + ',' + d(f[a][1]) + ']';
                })
                .join(',') +
              '},{},[' +
              d(c) +
              '])';
            return new Worker(
              (window.URL || window.webkitURL || window.mozURL || window.msURL).createObjectURL(
                new Blob([a], {
                  type: 'text/javascript',
                })
              )
            );
          };
        },
        {},
      ],
      3: [
        function (g, k, n) {
          function l(c, b) {
            if ('function' !== typeof b && null !== b)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof b);
            c.prototype = Object.create(b && b.prototype, {
              constructor: {
                value: c,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            b && (Object.setPrototypeOf ? Object.setPrototypeOf(c, b) : (c.__proto__ = b));
          }
          var f = (function () {
            function c(b, a) {
              for (var c = 0; c < a.length; c++) {
                var h = a[c];
                h.enumerable = h.enumerable || !1;
                h.configurable = !0;
                'value' in h && (h.writable = !0);
                Object.defineProperty(b, h.key, h);
              }
            }
            return function (b, a, d) {
              a && c(b.prototype, a);
              d && c(b, d);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var e =
              (k = g('../events')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            d =
              (g = g('../event-handler')) && g.__esModule
                ? g
                : {
                    default: g,
                  };
          g = (function (c) {
            function b(a) {
              if (!(this instanceof b)) throw new TypeError('Cannot call a class as a function');
              a = Object.getPrototypeOf(b).call(this, a, e.default.FRAG_LOAD_PROGRESS);
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              a = !a || ('object' !== typeof a && 'function' !== typeof a) ? this : a;
              a.lastfetchlevel = 0;
              a._autoLevelCapping = -1;
              a._nextAutoLevel = -1;
              return a;
            }
            l(b, c);
            f(b, [
              {
                key: 'destroy',
                value: function () {
                  d.default.prototype.destroy.call(this);
                },
              },
              {
                key: 'onFragLoadProgress',
                value: function (a) {
                  var b = a.stats;
                  void 0 === b.aborted &&
                    1 === a.frag.loadCounter &&
                    ((this.lastfetchduration = (performance.now() - b.trequest) / 1e3),
                    (this.lastfetchlevel = a.frag.level),
                    (this.lastbw = (8 * b.loaded) / this.lastfetchduration));
                },
              },
              {
                key: 'autoLevelCapping',
                get: function () {
                  return this._autoLevelCapping;
                },
                set: function (a) {
                  this._autoLevelCapping = a;
                },
              },
              {
                key: 'nextAutoLevel',
                get: function () {
                  var a = this.lastbw,
                    b = this.hls,
                    h;
                  var c = -1 === this._autoLevelCapping ? b.levels.length - 1 : this._autoLevelCapping;
                  if (-1 !== this._nextAutoLevel) {
                    var d = Math.min(this._nextAutoLevel, c);
                    if (d === this.lastfetchlevel) this._nextAutoLevel = -1;
                    else return d;
                  }
                  for (h = 0; h <= c; h++)
                    if (((d = h <= this.lastfetchlevel ? 0.8 * a : 0.7 * a), d < b.levels[h].bitrate))
                      return Math.max(0, h - 1);
                  return h - 1;
                },
                set: function (a) {
                  this._nextAutoLevel = a;
                },
              },
            ]);
            return b;
          })(d.default);
          n.default = g;
        },
        {
          '../event-handler': 20,
          '../events': 21,
        },
      ],
      4: [
        function (g, k, n) {
          function l(a, b) {
            if ('function' !== typeof b && null !== b)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof b);
            a.prototype = Object.create(b && b.prototype, {
              constructor: {
                value: a,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : (a.__proto__ = b));
          }
          var f = (function () {
            function a(a, b) {
              for (var h = 0; h < b.length; h++) {
                var c = b[h];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (b, h, c) {
              h && a(b.prototype, h);
              c && a(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var e =
              (k = g('../events')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            d =
              (k = g('../event-handler')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            c = g('../utils/logger'),
            b = g('../errors');
          g = (function (a) {
            function m(a) {
              if (!(this instanceof m)) throw new TypeError('Cannot call a class as a function');
              a = Object.getPrototypeOf(m).call(
                this,
                a,
                e.default.MEDIA_ATTACHING,
                e.default.MEDIA_DETACHING,
                e.default.BUFFER_RESET,
                e.default.BUFFER_APPENDING,
                e.default.BUFFER_CODECS,
                e.default.BUFFER_EOS,
                e.default.BUFFER_FLUSHING
              );
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              a = !a || ('object' !== typeof a && 'function' !== typeof a) ? this : a;
              a.onsbue = a.onSBUpdateEnd.bind(a);
              a.onsbe = a.onSBUpdateError.bind(a);
              return a;
            }
            l(m, a);
            f(m, [
              {
                key: 'destroy',
                value: function () {
                  d.default.prototype.destroy.call(this);
                },
              },
              {
                key: 'onMediaAttaching',
                value: function (a) {
                  a = this.media = a.media;
                  var b = (this.mediaSource = new MediaSource());
                  this.onmso = this.onMediaSourceOpen.bind(this);
                  this.onmse = this.onMediaSourceEnded.bind(this);
                  this.onmsc = this.onMediaSourceClose.bind(this);
                  b.addEventListener('sourceopen', this.onmso);
                  b.addEventListener('sourceended', this.onmse);
                  b.addEventListener('sourceclose', this.onmsc);
                  a.src = URL.createObjectURL(b);
                },
              },
              {
                key: 'onMediaDetaching',
                value: function () {
                  var a = this.mediaSource;
                  if (a) {
                    if ('open' === a.readyState)
                      try {
                        a.endOfStream();
                      } catch (q) {
                        c.logger.warn('onMediaDetaching:' + q.message + ' while calling endOfStream');
                      }
                    a.removeEventListener('sourceopen', this.onmso);
                    a.removeEventListener('sourceended', this.onmse);
                    a.removeEventListener('sourceclose', this.onmsc);
                    this.media.src = '';
                    this.pendingTracks = this.media = this.mediaSource = null;
                  }
                  this.onmso = this.onmse = this.onmsc = null;
                  this.hls.trigger(e.default.MEDIA_DETACHED);
                },
              },
              {
                key: 'onMediaSourceOpen',
                value: function () {
                  c.logger.log('media source opened');
                  this.hls.trigger(e.default.MEDIA_ATTACHED, {
                    media: this.media,
                  });
                  this.mediaSource.removeEventListener('sourceopen', this.onmso);
                  var a = this.pendingTracks;
                  a && (this.onBufferCodecs(a), (this.pendingTracks = null), this.doAppending());
                },
              },
              {
                key: 'onMediaSourceClose',
                value: function () {
                  c.logger.log('media source closed');
                },
              },
              {
                key: 'onMediaSourceEnded',
                value: function () {
                  c.logger.log('media source ended');
                },
              },
              {
                key: 'onSBUpdateEnd',
                value: function () {
                  this._needsFlush && this.doFlush();
                  if (this._needsEos) this.onBufferEos();
                  this.hls.trigger(e.default.BUFFER_APPENDED);
                  this.doAppending();
                },
              },
              {
                key: 'onSBUpdateError',
                value: function (a) {
                  c.logger.error('sourceBuffer error:' + a);
                  this.hls.trigger(e.default.ERROR, {
                    type: b.ErrorTypes.MEDIA_ERROR,
                    details: b.ErrorDetails.BUFFER_APPENDING_ERROR,
                    fatal: !1,
                  });
                },
              },
              {
                key: 'onBufferReset',
                value: function () {
                  var a = this.sourceBuffer;
                  if (a) {
                    for (var b in a) {
                      var c = a[b];
                      try {
                        this.mediaSource.removeSourceBuffer(c),
                          c.removeEventListener('updateend', this.onsbue),
                          c.removeEventListener('error', this.onsbe);
                      } catch (p) {}
                    }
                    this.sourceBuffer = null;
                  }
                  this.flushRange = [];
                  this.appended = 0;
                },
              },
              {
                key: 'onBufferCodecs',
                value: function (a) {
                  var b;
                  if (!this.media) this.pendingTracks = a;
                  else if (!this.sourceBuffer) {
                    var d = {},
                      h = this.mediaSource;
                    for (b in a) {
                      var e = a[b];
                      var m = e.levelCodec || e.codec;
                      e = e.container + ';codecs=' + m;
                      c.logger.log('creating sourceBuffer with mimeType:' + e);
                      e = d[b] = h.addSourceBuffer(e);
                      e.addEventListener('updateend', this.onsbue);
                      e.addEventListener('error', this.onsbe);
                    }
                    this.sourceBuffer = d;
                  }
                },
              },
              {
                key: 'onBufferAppending',
                value: function (a) {
                  this.segments ? this.segments.push(a) : (this.segments = [a]);
                  this.doAppending();
                },
              },
              {
                key: 'onBufferAppendFail',
                value: function (a) {
                  c.logger.error('sourceBuffer error:' + a.event);
                  this.hls.trigger(e.default.ERROR, {
                    type: b.ErrorTypes.MEDIA_ERROR,
                    details: b.ErrorDetails.BUFFER_APPENDING_ERROR,
                    fatal: !1,
                    frag: this.fragCurrent,
                  });
                },
              },
              {
                key: 'onBufferEos',
                value: function () {
                  var a = this.sourceBuffer,
                    b = this.mediaSource;
                  b &&
                    'open' === b.readyState &&
                    ((a.audio && a.audio.updating) || (a.video && a.video.updating)
                      ? (this._needsEos = !0)
                      : (c.logger.log(
                          'all media data available, signal endOfStream() to MediaSource and stop loading fragment'
                        ),
                        b.endOfStream(),
                        (this._needsEos = !1)));
                },
              },
              {
                key: 'onBufferFlushing',
                value: function (a) {
                  this.flushRange.push({
                    start: a.startOffset,
                    end: a.endOffset,
                  });
                  this.flushBufferCounter = 0;
                  this.doFlush();
                },
              },
              {
                key: 'doFlush',
                value: function () {
                  for (; this.flushRange.length; ) {
                    var a = this.flushRange[0];
                    if (this.flushBuffer(a.start, a.end)) this.flushRange.shift(), (this.flushBufferCounter = 0);
                    else {
                      this._needsFlush = !0;
                      return;
                    }
                  }
                  if (0 === this.flushRange.length) {
                    this._needsFlush = !1;
                    a = 0;
                    var b = this.sourceBuffer;
                    if (b) for (var c in b) a += b[c].buffered.length;
                    this.appended = a;
                    this.hls.trigger(e.default.BUFFER_FLUSHED);
                  }
                },
              },
              {
                key: 'doAppending',
                value: function () {
                  var a = this.hls,
                    d = this.sourceBuffer,
                    m = this.segments;
                  if (d)
                    if (this.media.error)
                      c.logger.error('trying to append although a media error occured, flush segment and abort');
                    else {
                      for (var p in d) if (d[p].updating) return;
                      if (m.length) {
                        p = m.shift();
                        try {
                          d[p.type].appendBuffer(p.data), (this.appendError = 0), this.appended++;
                        } catch (C) {
                          c.logger.error('error while trying to append buffer:' + C.message),
                            m.unshift(p),
                            (d = {
                              type: b.ErrorTypes.MEDIA_ERROR,
                            }),
                            22 !== C.code
                              ? (this.appendError ? this.appendError++ : (this.appendError = 1),
                                (d.details = b.ErrorDetails.BUFFER_APPEND_ERROR),
                                (d.frag = this.fragCurrent),
                                this.appendError > a.config.appendErrorMaxRetry
                                  ? (c.logger.log(
                                      'fail ' +
                                        a.config.appendErrorMaxRetry +
                                        ' times to append segment in sourceBuffer'
                                    ),
                                    (d.fatal = !0))
                                  : (d.fatal = !1))
                              : (d.details = b.ErrorDetails.BUFFER_FULL),
                            a.trigger(e.default.ERROR, d);
                        }
                      }
                    }
                },
              },
              {
                key: 'flushBuffer',
                value: function (a, b) {
                  var d;
                  if (this.flushBufferCounter < this.appended && this.sourceBuffer)
                    for (var h in this.sourceBuffer) {
                      var e = this.sourceBuffer[h];
                      if (e.updating) return c.logger.warn('cannot flush, sb updating in progress'), !1;
                      for (d = 0; d < e.buffered.length; d++) {
                        var m = e.buffered.start(d);
                        var q = e.buffered.end(d);
                        if (
                          -1 !== navigator.userAgent.toLowerCase().indexOf('firefox') &&
                          b === Number.POSITIVE_INFINITY
                        ) {
                          var f = a;
                          var r = b;
                        } else (f = Math.max(m, a)), (r = Math.min(q, b));
                        if (0.5 < Math.min(r, q) - f)
                          return (
                            this.flushBufferCounter++,
                            c.logger.log(
                              'flush ' +
                                h +
                                ' [' +
                                f +
                                ',' +
                                r +
                                '], of [' +
                                m +
                                ',' +
                                q +
                                '], pos:' +
                                this.media.currentTime
                            ),
                            e.remove(f, r),
                            !1
                          );
                      }
                    }
                  else c.logger.warn('abort flushing too many retries');
                  c.logger.log('buffer flushed');
                  return !0;
                },
              },
            ]);
            return m;
          })(d.default);
          n.default = g;
        },
        {
          '../errors': 19,
          '../event-handler': 20,
          '../events': 21,
          '../utils/logger': 34,
        },
      ],
      5: [
        function (g, k, n) {
          function l(b, a) {
            if ('function' !== typeof a && null !== a)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof a);
            b.prototype = Object.create(a && a.prototype, {
              constructor: {
                value: b,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            a && (Object.setPrototypeOf ? Object.setPrototypeOf(b, a) : (b.__proto__ = a));
          }
          var f = (function () {
            function b(a, b) {
              for (var c = 0; c < b.length; c++) {
                var d = b[c];
                d.enumerable = d.enumerable || !1;
                d.configurable = !0;
                'value' in d && (d.writable = !0);
                Object.defineProperty(a, d.key, d);
              }
            }
            return function (a, c, d) {
              c && b(a.prototype, c);
              d && b(a, d);
              return a;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var e =
            (k = g('../events')) && k.__esModule
              ? k
              : {
                  default: k,
                };
          k =
            (k = g('../event-handler')) && k.__esModule
              ? k
              : {
                  default: k,
                };
          var d = g('../utils/logger'),
            c = g('../errors');
          g = (function (b) {
            function a(b) {
              if (!(this instanceof a)) throw new TypeError('Cannot call a class as a function');
              b = Object.getPrototypeOf(a).call(
                this,
                b,
                e.default.MANIFEST_LOADED,
                e.default.LEVEL_LOADED,
                e.default.ERROR
              );
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              b = !b || ('object' !== typeof b && 'function' !== typeof b) ? this : b;
              b.ontick = b.tick.bind(b);
              b._manualLevel = b._autoLevelCapping = -1;
              return b;
            }
            l(a, b);
            f(a, [
              {
                key: 'destroy',
                value: function () {
                  this.timer && clearInterval(this.timer);
                  this._manualLevel = -1;
                },
              },
              {
                key: 'onManifestLoaded',
                value: function (a) {
                  var b = [],
                    m = [],
                    f,
                    p = {},
                    C = !1,
                    B = !1,
                    g = this.hls;
                  a.levels.forEach(function (a) {
                    a.videoCodec && (C = !0);
                    a.audioCodec && (B = !0);
                    var c = p[a.bitrate];
                    void 0 === c
                      ? ((p[a.bitrate] = b.length), (a.url = [a.url]), (a.urlId = 0), b.push(a))
                      : b[c].url.push(a.url);
                  });
                  C && B
                    ? b.forEach(function (a) {
                        a.videoCodec && m.push(a);
                      })
                    : (m = b);
                  m = m.filter(function (a) {
                    var b = a.audioCodec;
                    a = a.videoCodec;
                    return (
                      (!b || MediaSource.isTypeSupported('audio/mp4;codecs=' + b)) &&
                      (!a || MediaSource.isTypeSupported('video/mp4;codecs=' + a))
                    );
                  });
                  if (m.length) {
                    var u = m[0].bitrate;
                    m.sort(function (a, b) {
                      return a.bitrate - b.bitrate;
                    });
                    this._levels = m;
                    for (f = 0; f < m.length; f++)
                      if (m[f].bitrate === u) {
                        this._firstLevel = f;
                        d.logger.log('manifest loaded,' + m.length + ' level(s) found, first bitrate:' + u);
                        break;
                      }
                    g.trigger(e.default.MANIFEST_PARSED, {
                      levels: this._levels,
                      firstLevel: this._firstLevel,
                      stats: a.stats,
                    });
                  } else
                    g.trigger(e.default.ERROR, {
                      type: c.ErrorTypes.NETWORK_ERROR,
                      details: c.ErrorDetails.MANIFEST_PARSING_ERROR,
                      fatal: !0,
                      url: g.url,
                      reason: 'no compatible level found in manifest',
                    });
                },
              },
              {
                key: 'setLevelInternal',
                value: function (a) {
                  if (0 <= a && a < this._levels.length) {
                    this.timer && (clearInterval(this.timer), (this.timer = null));
                    this._level = a;
                    d.logger.log('switching to level ' + a);
                    this.hls.trigger(e.default.LEVEL_SWITCH, {
                      level: a,
                    });
                    var b = this._levels[a];
                    if (void 0 === b.details || !0 === b.details.live) {
                      d.logger.log('(re)loading playlist for level ' + a);
                      var m = b.urlId;
                      this.hls.trigger(e.default.LEVEL_LOADING, {
                        url: b.url[m],
                        level: a,
                        id: m,
                      });
                    }
                  } else
                    this.hls.trigger(e.default.ERROR, {
                      type: c.ErrorTypes.OTHER_ERROR,
                      details: c.ErrorDetails.LEVEL_SWITCH_ERROR,
                      level: a,
                      fatal: !1,
                      reason: 'invalid level idx',
                    });
                },
              },
              {
                key: 'onError',
                value: function (a) {
                  if (!a.fatal) {
                    var b = a.details,
                      e = this.hls;
                    switch (b) {
                      case c.ErrorDetails.FRAG_LOAD_ERROR:
                      case c.ErrorDetails.FRAG_LOAD_TIMEOUT:
                      case c.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                      case c.ErrorDetails.KEY_LOAD_ERROR:
                      case c.ErrorDetails.KEY_LOAD_TIMEOUT:
                        var m = a.frag.level;
                        break;
                      case c.ErrorDetails.LEVEL_LOAD_ERROR:
                      case c.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                        m = a.level;
                    }
                    if (void 0 !== m) {
                      var p = this._levels[m];
                      p.urlId < p.url.length - 1
                        ? (p.urlId++,
                          (p.details = void 0),
                          d.logger.warn(
                            'level controller,' +
                              b +
                              ' for level ' +
                              m +
                              ': switching to redundant stream id ' +
                              p.urlId
                          ))
                        : -1 === this._manualLevel && m
                        ? (d.logger.warn('level controller,' + b + ': emergency switch-down for next fragment'),
                          (e.abrController.nextAutoLevel = 0))
                        : p && p.details && p.details.live
                        ? d.logger.warn('level controller,' + b + ' on live stream, discard')
                        : b !== c.ErrorDetails.FRAG_LOAD_ERROR &&
                          b !== c.ErrorDetails.FRAG_LOAD_TIMEOUT &&
                          (d.logger.error('cannot recover ' + b + ' error'),
                          (this._level = void 0),
                          this.timer && (clearInterval(this.timer), (this.timer = null)),
                          (a.fatal = !0),
                          e.trigger(event, a));
                    }
                  }
                },
              },
              {
                key: 'onLevelLoaded',
                value: function (a) {
                  a.details.live &&
                    !this.timer &&
                    (this.timer = setInterval(this.ontick, 1e3 * a.details.targetduration));
                  !a.details.live && this.timer && (clearInterval(this.timer), (this.timer = null));
                },
              },
              {
                key: 'tick',
                value: function () {
                  var a = this._level;
                  if (void 0 !== a) {
                    var b = this._levels[a],
                      c = b.urlId;
                    this.hls.trigger(e.default.LEVEL_LOADING, {
                      url: b.url[c],
                      level: a,
                      id: c,
                    });
                  }
                },
              },
              {
                key: 'nextLoadLevel',
                value: function () {
                  return -1 !== this._manualLevel ? this._manualLevel : this.hls.abrController.nextAutoLevel;
                },
              },
              {
                key: 'levels',
                get: function () {
                  return this._levels;
                },
              },
              {
                key: 'level',
                get: function () {
                  return this._level;
                },
                set: function (a) {
                  (this._level === a && void 0 !== this._levels[a].details) || this.setLevelInternal(a);
                },
              },
              {
                key: 'manualLevel',
                get: function () {
                  return this._manualLevel;
                },
                set: function (a) {
                  this._manualLevel = a;
                  -1 !== a && (this.level = a);
                },
              },
              {
                key: 'firstLevel',
                get: function () {
                  return this._firstLevel;
                },
                set: function (a) {
                  this._firstLevel = a;
                },
              },
              {
                key: 'startLevel',
                get: function () {
                  return void 0 === this._startLevel ? this._firstLevel : this._startLevel;
                },
                set: function (a) {
                  this._startLevel = a;
                },
              },
            ]);
            return a;
          })(k.default);
          n.default = g;
        },
        {
          '../errors': 19,
          '../event-handler': 20,
          '../events': 21,
          '../utils/logger': 34,
        },
      ],
      6: [
        function (g, k, n) {
          function l(a) {
            return a && a.__esModule
              ? a
              : {
                  default: a,
                };
          }
          function f(a, b) {
            if ('function' !== typeof b && null !== b)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof b);
            a.prototype = Object.create(b && b.prototype, {
              constructor: {
                value: a,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : (a.__proto__ = b));
          }
          var e = (function () {
            function a(a, b) {
              for (var c = 0; c < b.length; c++) {
                var d = b[c];
                d.enumerable = d.enumerable || !1;
                d.configurable = !0;
                'value' in d && (d.writable = !0);
                Object.defineProperty(a, d.key, d);
              }
            }
            return function (b, c, d) {
              c && a(b.prototype, c);
              d && a(b, d);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('../demux/demuxer');
          var d = l(k);
          k = g('../events');
          var c = l(k);
          k = g('../event-handler');
          var b = l(k),
            a = g('../utils/logger');
          k = g('../utils/binary-search');
          var m = l(k);
          k = g('../helper/level-helper');
          var h = l(k),
            q = g('../errors');
          g = (function (v) {
            function p(a) {
              if (!(this instanceof p)) throw new TypeError('Cannot call a class as a function');
              var b = Object.getPrototypeOf(p).call(
                this,
                a,
                c.default.MEDIA_ATTACHED,
                c.default.MEDIA_DETACHING,
                c.default.MANIFEST_PARSED,
                c.default.LEVEL_LOADED,
                c.default.KEY_LOADED,
                c.default.FRAG_LOADED,
                c.default.FRAG_PARSING_INIT_SEGMENT,
                c.default.FRAG_PARSING_DATA,
                c.default.FRAG_PARSED,
                c.default.ERROR,
                c.default.BUFFER_APPENDED,
                c.default.BUFFER_FLUSHED
              );
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              b = !b || ('object' !== typeof b && 'function' !== typeof b) ? this : b;
              b.config = a.config;
              b.audioCodecSwap = !1;
              b.ticks = 0;
              b.ontick = b.tick.bind(b);
              return b;
            }
            f(p, v);
            e(p, [
              {
                key: 'destroy',
                value: function () {
                  this.stop();
                  b.default.prototype.destroy.call(this);
                  this.state = 'IDLE';
                },
              },
              {
                key: 'startLoad',
                value: function () {
                  if (this.levels) {
                    var b = this.media,
                      c = this.lastCurrentTime;
                    this.stop();
                    this.demuxer = new d.default(this.hls);
                    this.timer = setInterval(this.ontick, 100);
                    this.level = -1;
                    this.fragLoadError = 0;
                    b && c
                      ? (a.logger.log('configure startPosition @' + c),
                        this.lastPaused || (a.logger.log('resuming video'), b.play()),
                        (this.state = 'IDLE'))
                      : ((this.lastCurrentTime = this.startPosition ? this.startPosition : 0),
                        (this.state = 'STARTING'));
                    this.nextLoadPosition = this.startPosition = this.lastCurrentTime;
                    this.tick();
                  } else a.logger.warn('cannot start loading as manifest not parsed yet');
                },
              },
              {
                key: 'stop',
                value: function () {
                  this.bufferRange = [];
                  this.stalled = !1;
                  var b = this.fragCurrent;
                  b && (b.loader && b.loader.abort(), (this.fragCurrent = null));
                  this.fragPrevious = null;
                  a.logger.log('trigger BUFFER_RESET');
                  this.hls.trigger(c.default.BUFFER_RESET);
                  this.timer && (clearInterval(this.timer), (this.timer = null));
                  this.demuxer && (this.demuxer.destroy(), (this.demuxer = null));
                },
              },
              {
                key: 'tick',
                value: function () {
                  this.ticks++;
                  1 === this.ticks && (this.doTick(), 1 < this.ticks && setTimeout(this.tick, 1), (this.ticks = 0));
                },
              },
              {
                key: 'doTick',
                value: function () {
                  var b = this.hls,
                    d = b.config;
                  switch (this.state) {
                    case 'STARTING':
                      this.startLevel = b.startLevel;
                      -1 === this.startLevel && ((this.startLevel = 0), (this.fragBitrateTest = !0));
                      this.level = b.nextLoadLevel = this.startLevel;
                      this.state = 'WAITING_LEVEL';
                      this.loadedmetadata = !1;
                      break;
                    case 'IDLE':
                      if (!this.media && (this.startFragRequested || !d.startFragPrefetch)) break;
                      var e = this.loadedmetadata ? this.media.currentTime : this.nextLoadPosition;
                      var h = !1 === this.startFragRequested ? this.startLevel : b.nextLoadLevel;
                      var p = this.bufferInfo(e, d.maxBufferHole),
                        f = p.len,
                        v = p.end;
                      p = this.fragPrevious;
                      if (this.levels[h].hasOwnProperty('bitrate')) {
                        var g = Math.max((8 * d.maxBufferSize) / this.levels[h].bitrate, d.maxBufferLength);
                        g = Math.min(g, d.maxMaxBufferLength);
                      } else g = d.maxBufferLength;
                      if (f < g)
                        if (
                          ((this.level = b.nextLoadLevel = h),
                          (g = this.levels[h].details),
                          'undefined' === typeof g || (g.live && this.levelLastLoaded !== h))
                        )
                          this.state = 'WAITING_LEVEL';
                        else {
                          var k = g.fragments,
                            l = k.length,
                            n = k[0].start,
                            G = k[l - 1].start + k[l - 1].duration;
                          f = void 0;
                          g.live
                            ? (v < Math.max(n, G - d.liveMaxLatencyDurationCount * g.targetduration) &&
                                ((this.seekAfterBuffered =
                                  n + Math.max(0, g.totalduration - d.liveSyncDurationCount * g.targetduration)),
                                a.logger.log(
                                  'buffer end: ' +
                                    v +
                                    ' is located too far from the end of live sliding playlist, media position will be reseted to: ' +
                                    this.seekAfterBuffered.toFixed(3)
                                ),
                                (v = this.seekAfterBuffered)),
                              this.startFragRequested &&
                                !g.PTSKnown &&
                                (p &&
                                  ((n = p.sn + 1),
                                  n >= g.startSN &&
                                    n <= g.endSN &&
                                    ((f = k[n - g.startSN]),
                                    a.logger.log(
                                      'live playlist, switching playlist, load frag with next SN: ' + f.sn
                                    ))),
                                f ||
                                  ((f = k[Math.min(l - 1, Math.round(l / 2))]),
                                  a.logger.log(
                                    'live playlist, switching playlist, unknown, load middle frag : ' + f.sn
                                  ))))
                            : v < n && (f = k[0]);
                          !f &&
                            (l =
                              v < G
                                ? m.default.search(k, function (a) {
                                    return a.start + a.duration <= v ? 1 : a.start > v ? -1 : 0;
                                  })
                                : k[l - 1]) &&
                            ((f = l),
                            (n = l.start),
                            p &&
                              f.level === p.level &&
                              f.sn === p.sn &&
                              (f.sn < g.endSN
                                ? ((f = k[f.sn + 1 - g.startSN]),
                                  a.logger.log('SN just loaded, load next one: ' + f.sn))
                                : (g.live || (this.hls.trigger(c.default.BUFFER_EOS), (this.state = 'ENDED')),
                                  (f = null))));
                          if (f)
                            if (null != f.decryptdata.uri && null == f.decryptdata.key)
                              a.logger.log(
                                'Loading key for ' + f.sn + ' of [' + g.startSN + ' ,' + g.endSN + '],level ' + h
                              ),
                                (this.state = 'KEY_LOADING'),
                                b.trigger(c.default.KEY_LOADING, {
                                  frag: f,
                                });
                            else {
                              a.logger.log(
                                'Loading ' +
                                  f.sn +
                                  ' of [' +
                                  g.startSN +
                                  ' ,' +
                                  g.endSN +
                                  '],level ' +
                                  h +
                                  ', currentTime:' +
                                  e +
                                  ',bufferEnd:' +
                                  v.toFixed(3)
                              );
                              f.autoLevel = b.autoLevelEnabled;
                              1 < this.levels.length &&
                                ((f.expectedLen = Math.round((f.duration * this.levels[h].bitrate) / 8)),
                                (f.trequest = performance.now()));
                              void 0 !== this.fragLoadIdx ? this.fragLoadIdx++ : (this.fragLoadIdx = 0);
                              if (f.loadCounter) {
                                if (
                                  (f.loadCounter++,
                                  (d = d.fragLoadingLoopThreshold),
                                  f.loadCounter > d && Math.abs(this.fragLoadIdx - f.loadIdx) < d)
                                ) {
                                  b.trigger(c.default.ERROR, {
                                    type: q.ErrorTypes.MEDIA_ERROR,
                                    details: q.ErrorDetails.FRAG_LOOP_LOADING_ERROR,
                                    fatal: !1,
                                    frag: f,
                                  });
                                  return;
                                }
                              } else f.loadCounter = 1;
                              f.loadIdx = this.fragLoadIdx;
                              this.fragCurrent = f;
                              this.startFragRequested = !0;
                              b.trigger(c.default.FRAG_LOADING, {
                                frag: f,
                              });
                              this.state = 'FRAG_LOADING';
                            }
                        }
                      break;
                    case 'WAITING_LEVEL':
                      (h = this.levels[this.level]) && h.details && (this.state = 'IDLE');
                      break;
                    case 'FRAG_LOADING':
                      e = this.media;
                      h = this.fragCurrent;
                      e &&
                        (!e.paused || !1 === this.loadedmetadata) &&
                        h.autoLevel &&
                        this.level &&
                        1 < this.levels.length &&
                        ((p = performance.now() - h.trequest),
                        p > 500 * h.duration &&
                          ((p = (1e3 * h.loaded) / p),
                          h.expectedLen < h.loaded && (h.expectedLen = h.loaded),
                          (e = e.currentTime),
                          (f = (h.expectedLen - h.loaded) / p),
                          (d = this.bufferInfo(e, d.maxBufferHole).end - e),
                          (e = (h.duration * this.levels[b.nextLoadLevel].bitrate) / (8 * p)),
                          d < 2 * h.duration &&
                            f > d &&
                            f > e &&
                            (a.logger.warn('loading too slow, abort fragment loading'),
                            a.logger.log(
                              'fragLoadedDelay/bufferStarvationDelay/fragLevelNextLoadedDelay :' +
                                f.toFixed(1) +
                                '/' +
                                d.toFixed(1) +
                                '/' +
                                e.toFixed(1)
                            ),
                            h.loader.abort(),
                            b.trigger(c.default.FRAG_LOAD_EMERGENCY_ABORTED, {
                              frag: h,
                            }),
                            (this.state = 'IDLE'))));
                      break;
                    case 'FRAG_LOADING_WAITING_RETRY':
                      if (
                        ((b = performance.now()),
                        (d = this.retryDate),
                        (e = (e = this.media) && e.seeking),
                        !d || b >= d || e)
                      )
                        a.logger.log('mediaController: retryDate reached, switch back to IDLE state'),
                          (this.state = 'IDLE');
                  }
                  this._checkBuffer();
                  this._checkFragmentChanged();
                },
              },
              {
                key: 'bufferInfo',
                value: function (a, b) {
                  var d = this.media;
                  if (d) {
                    d = d.buffered;
                    var c = [],
                      e;
                    for (e = 0; e < d.length; e++)
                      c.push({
                        start: d.start(e),
                        end: d.end(e),
                      });
                    return this.bufferedInfo(c, a, b);
                  }
                  return {
                    len: 0,
                    start: 0,
                    end: 0,
                    nextStart: void 0,
                  };
                },
              },
              {
                key: 'bufferedInfo',
                value: function (a, b, d) {
                  var c = [],
                    e,
                    h;
                  a.sort(function (a, b) {
                    var d = a.start - b.start;
                    return d ? d : b.end - a.end;
                  });
                  for (h = 0; h < a.length; h++)
                    if ((e = c.length)) {
                      var m = c[e - 1].end;
                      a[h].start - m < d ? a[h].end > m && (c[e - 1].end = a[h].end) : c.push(a[h]);
                    } else c.push(a[h]);
                  a = h = 0;
                  for (e = m = b; h < c.length; h++) {
                    var q = c[h].start,
                      f = c[h].end;
                    if (b + d >= q && b < f) (e = q), (m = f + d), (a = m - b);
                    else if (b + d < q) {
                      var p = q;
                      break;
                    }
                  }
                  return {
                    len: a,
                    start: e,
                    end: m,
                    nextStart: p,
                  };
                },
              },
              {
                key: 'getBufferRange',
                value: function (a) {
                  var b;
                  for (b = this.bufferRange.length - 1; 0 <= b; b--) {
                    var d = this.bufferRange[b];
                    if (a >= d.start && a <= d.end) return d;
                  }
                  return null;
                },
              },
              {
                key: 'followingBufferRange',
                value: function (a) {
                  return a ? this.getBufferRange(a.end + 0.5) : null;
                },
              },
              {
                key: 'isBuffered',
                value: function (a) {
                  for (var b = this.media.buffered, d = 0; d < b.length; d++)
                    if (a >= b.start(d) && a <= b.end(d)) return !0;
                  return !1;
                },
              },
              {
                key: '_checkFragmentChanged',
                value: function () {
                  var a,
                    b = this.media;
                  if (b && !1 === b.seeking) {
                    var d = b.currentTime;
                    d > b.playbackRate * this.lastCurrentTime && (this.lastCurrentTime = d);
                    this.isBuffered(d)
                      ? (a = this.getBufferRange(d))
                      : this.isBuffered(d + 0.1) && (a = this.getBufferRange(d + 0.1));
                    a &&
                      ((a = a.frag),
                      a !== this.fragPlaying &&
                        ((this.fragPlaying = a),
                        this.hls.trigger(c.default.FRAG_CHANGED, {
                          frag: a,
                        })));
                  }
                },
              },
              {
                key: 'immediateLevelSwitch',
                value: function () {
                  a.logger.log('immediateLevelSwitch');
                  this.immediateSwitch ||
                    ((this.immediateSwitch = !0), (this.previouslyPaused = this.media.paused), this.media.pause());
                  var b = this.fragCurrent;
                  b && b.loader && b.loader.abort();
                  this.fragCurrent = null;
                  this.hls.trigger(c.default.BUFFER_FLUSHING, {
                    startOffset: 0,
                    endOffset: Number.POSITIVE_INFINITY,
                  });
                  this.state = 'PAUSED';
                  this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold;
                  this.tick();
                },
              },
              {
                key: 'immediateLevelSwitchEnd',
                value: function () {
                  this.immediateSwitch = !1;
                  this.media.currentTime -= 1e-4;
                  this.previouslyPaused || this.media.play();
                },
              },
              {
                key: 'nextLevelSwitch',
                value: function () {
                  var a;
                  (a = this.getBufferRange(this.media.currentTime)) &&
                    1 < a.start &&
                    (this.hls.trigger(c.default.BUFFER_FLUSHING, {
                      startOffset: 0,
                      endOffset: a.start - 1,
                    }),
                    (this.state = 'PAUSED'));
                  if (this.media.paused) a = 0;
                  else {
                    a = this.levels[this.hls.nextLoadLevel];
                    var b = this.fragLastKbps;
                    a = b && this.fragCurrent ? (this.fragCurrent.duration * a.bitrate) / (1e3 * b) + 1 : 0;
                  }
                  if ((a = this.getBufferRange(this.media.currentTime + a)))
                    if ((a = this.followingBufferRange(a)))
                      this.hls.trigger(c.default.BUFFER_FLUSHING, {
                        startOffset: a.start,
                        endOffset: Number.POSITIVE_INFINITY,
                      }),
                        (this.state = 'PAUSED'),
                        (a = this.fragCurrent) && a.loader && a.loader.abort(),
                        (this.fragCurrent = null),
                        (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold);
                },
              },
              {
                key: 'onMediaAttached',
                value: function (a) {
                  a = this.media = a.media;
                  this.onvseeking = this.onMediaSeeking.bind(this);
                  this.onvseeked = this.onMediaSeeked.bind(this);
                  this.onvended = this.onMediaEnded.bind(this);
                  a.addEventListener('seeking', this.onvseeking);
                  a.addEventListener('seeked', this.onvseeked);
                  a.addEventListener('ended', this.onvended);
                  this.levels && this.config.autoStartLoad && this.startLoad();
                },
              },
              {
                key: 'onMediaDetaching',
                value: function () {
                  var b = this.media;
                  b &&
                    b.ended &&
                    (a.logger.log('MSE detaching and video ended, reset startPosition'),
                    (this.startPosition = this.lastCurrentTime = 0));
                  var d = this.levels;
                  d &&
                    d.forEach(function (a) {
                      a.details &&
                        a.details.fragments.forEach(function (a) {
                          a.loadCounter = void 0;
                        });
                    });
                  b &&
                    (b.removeEventListener('seeking', this.onvseeking),
                    b.removeEventListener('seeked', this.onvseeked),
                    b.removeEventListener('ended', this.onvended),
                    (this.onvseeking = this.onvseeked = this.onvended = null));
                  this.media = null;
                  this.loadedmetadata = !1;
                  this.stop();
                },
              },
              {
                key: 'onMediaSeeking',
                value: function () {
                  if ('FRAG_LOADING' === this.state) {
                    if (0 === this.bufferInfo(this.media.currentTime, this.config.maxBufferHole).len) {
                      a.logger.log('seeking outside of buffer while fragment load in progress, cancel fragment load');
                      var b = this.fragCurrent;
                      b && (b.loader && b.loader.abort(), (this.fragCurrent = null));
                      this.fragPrevious = null;
                      this.state = 'IDLE';
                    }
                  } else 'ENDED' === this.state && (this.state = 'IDLE');
                  this.media && (this.lastCurrentTime = this.media.currentTime);
                  void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold);
                  this.tick();
                },
              },
              {
                key: 'onMediaSeeked',
                value: function () {
                  this.tick();
                },
              },
              {
                key: 'onMediaEnded',
                value: function () {
                  a.logger.log('media ended');
                  this.startPosition = this.lastCurrentTime = 0;
                },
              },
              {
                key: 'onManifestParsed',
                value: function (b) {
                  var d = !1,
                    c = !1,
                    h;
                  b.levels.forEach(function (a) {
                    if ((h = a.audioCodec))
                      -1 !== h.indexOf('mp4a.40.2') && (d = !0), -1 !== h.indexOf('mp4a.40.5') && (c = !0);
                  });
                  (this.audioCodecSwitch = d && c) &&
                    a.logger.log('both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC');
                  this.levels = b.levels;
                  this.startFragRequested = this.startLevelLoaded = !1;
                  this.config.autoStartLoad && this.startLoad();
                },
              },
              {
                key: 'onLevelLoaded',
                value: function (b) {
                  var d = b.details;
                  b = b.level;
                  var e = this.levels[b],
                    m = d.totalduration,
                    q = 0;
                  a.logger.log('level ' + b + ' loaded [' + d.startSN + ',' + d.endSN + '],duration:' + m);
                  this.levelLastLoaded = b;
                  if (d.live) {
                    var f = e.details;
                    f
                      ? (h.default.mergeDetails(f, d),
                        (q = d.fragments[0].start),
                        d.PTSKnown
                          ? a.logger.log('live playlist sliding:' + q.toFixed(3))
                          : a.logger.log('live playlist - outdated PTS, unknown sliding'))
                      : ((d.PTSKnown = !1), a.logger.log('live playlist - first load, unknown sliding'));
                  } else d.PTSKnown = !1;
                  e.details = d;
                  this.hls.trigger(c.default.LEVEL_UPDATED, {
                    details: d,
                    level: b,
                  });
                  !1 === this.startFragRequested &&
                    (d.live &&
                      (this.startPosition = Math.max(0, q + m - this.config.liveSyncDurationCount * d.targetduration)),
                    (this.nextLoadPosition = this.startPosition));
                  'WAITING_LEVEL' === this.state && (this.state = 'IDLE');
                  this.tick();
                },
              },
              {
                key: 'onKeyLoaded',
                value: function () {
                  'KEY_LOADING' === this.state && ((this.state = 'IDLE'), this.tick());
                },
              },
              {
                key: 'onFragLoaded',
                value: function (b) {
                  var d = this.fragCurrent;
                  if ('FRAG_LOADING' === this.state && d && b.frag.level === d.level && b.frag.sn === d.sn)
                    if (!0 === this.fragBitrateTest)
                      (this.state = 'IDLE'),
                        (this.fragBitrateTest = !1),
                        (b.stats.tparsed = b.stats.tbuffered = performance.now()),
                        this.hls.trigger(c.default.FRAG_BUFFERED, {
                          stats: b.stats,
                          frag: d,
                        });
                    else {
                      this.state = 'PARSING';
                      this.stats = b.stats;
                      var h = this.levels[this.level],
                        e = h.details,
                        m = e.totalduration,
                        q = d.start,
                        f = d.level,
                        p = d.sn,
                        g = h.audioCodec || this.config.defaultAudioCodec;
                      this.audioCodecSwap &&
                        (a.logger.log('swapping playlist audio codec'),
                        void 0 === g && (g = this.lastAudioCodec),
                        g && (g = -1 !== g.indexOf('mp4a.40.5') ? 'mp4a.40.2' : 'mp4a.40.5'));
                      this.pendingAppending = 0;
                      a.logger.log('Demuxing ' + p + ' of [' + e.startSN + ' ,' + e.endSN + '],level ' + f);
                      this.demuxer.push(b.payload, g, h.videoCodec, q, d.cc, f, p, m, d.decryptdata);
                    }
                  this.fragLoadError = 0;
                },
              },
              {
                key: 'onFragParsingInitSegment',
                value: function (b) {
                  if ('PARSING' === this.state) {
                    var d = b.tracks,
                      h,
                      e;
                    if ((e = d.audio)) {
                      var m = this.levels[this.level].audioCodec;
                      m &&
                        this.audioCodecSwap &&
                        (a.logger.log('swapping playlist audio codec'),
                        (m = -1 !== m.indexOf('mp4a.40.5') ? 'mp4a.40.2' : 'mp4a.40.5'));
                      if (this.audioCodecSwitch) {
                        var q = navigator.userAgent.toLowerCase();
                        1 !== e.metadata.channelCount &&
                          -1 === q.indexOf('android') &&
                          -1 === q.indexOf('firefox') &&
                          (m = 'mp4a.40.5');
                      }
                      e.levelCodec = m;
                    }
                    if ((e = d.video)) e.levelCodec = this.levels[this.level].videoCodec;
                    if (b.unique) {
                      m = {
                        codec: '',
                        levelCodec: '',
                      };
                      for (h in b.tracks)
                        (e = d[h]),
                          (m.container = e.container),
                          m.codec && ((m.codec += ','), (m.levelCodec += ',')),
                          e.codec && (m.codec += e.codec),
                          e.levelCodec && (m.levelCodec += e.levelCodec);
                      d = {
                        audiovideo: m,
                      };
                    }
                    this.hls.trigger(c.default.BUFFER_CODECS, d);
                    for (h in d)
                      if (
                        ((e = d[h]),
                        a.logger.log(
                          'track:' +
                            h +
                            ',container:' +
                            e.container +
                            ',codecs[level/parsed]=[' +
                            e.levelCodec +
                            '/' +
                            e.codec +
                            ']'
                        ),
                        (b = e.initSegment))
                      )
                        this.pendingAppending++,
                          this.hls.trigger(c.default.BUFFER_APPENDING, {
                            type: h,
                            data: b,
                          });
                    this.tick();
                  }
                },
              },
              {
                key: 'onFragParsingData',
                value: function (b) {
                  var d = this;
                  if ('PARSING' === this.state) {
                    this.tparse2 = Date.now();
                    var e = this.levels[this.level],
                      m = this.fragCurrent;
                    a.logger.log(
                      'parsed ' +
                        b.type +
                        ',PTS:[' +
                        b.startPTS.toFixed(3) +
                        ',' +
                        b.endPTS.toFixed(3) +
                        '],DTS:[' +
                        b.startDTS.toFixed(3) +
                        '/' +
                        b.endDTS.toFixed(3) +
                        '],nb:' +
                        b.nb
                    );
                    var q = h.default.updateFragPTS(e.details, m.sn, b.startPTS, b.endPTS),
                      f = this.hls;
                    f.trigger(c.default.LEVEL_PTS_UPDATED, {
                      details: e.details,
                      level: this.level,
                      drift: q,
                    });
                    [b.data1, b.data2].forEach(function (a) {
                      a &&
                        (d.pendingAppending++,
                        f.trigger(c.default.BUFFER_APPENDING, {
                          type: b.type,
                          data: a,
                        }));
                    });
                    this.nextLoadPosition = b.endPTS;
                    this.bufferRange.push({
                      type: b.type,
                      start: b.startPTS,
                      end: b.endPTS,
                      frag: m,
                    });
                    this.tick();
                  } else a.logger.warn('not in PARSING state but ' + this.state + ', ignoring FRAG_PARSING_DATA event');
                },
              },
              {
                key: 'onFragParsed',
                value: function () {
                  'PARSING' === this.state &&
                    ((this.stats.tparsed = performance.now()), (this.state = 'PARSED'), this._checkAppendedParsed());
                },
              },
              {
                key: 'onBufferAppended',
                value: function () {
                  switch (this.state) {
                    case 'PARSING':
                    case 'PARSED':
                      this.pendingAppending--, this._checkAppendedParsed();
                  }
                },
              },
              {
                key: '_checkAppendedParsed',
                value: function () {
                  if ('PARSED' === this.state && 0 === this.pendingAppending) {
                    var b = this.fragCurrent,
                      d = this.stats;
                    b &&
                      ((this.fragPrevious = b),
                      (d.tbuffered = performance.now()),
                      (this.fragLastKbps = Math.round((8 * d.length) / (d.tbuffered - d.tfirst))),
                      this.hls.trigger(c.default.FRAG_BUFFERED, {
                        stats: d,
                        frag: b,
                      }),
                      a.logger.log('media buffered : ' + this.timeRangesToString(this.media.buffered)),
                      (this.state = 'IDLE'));
                    this.tick();
                  }
                },
              },
              {
                key: 'onError',
                value: function (b) {
                  switch (b.details) {
                    case q.ErrorDetails.FRAG_LOAD_ERROR:
                    case q.ErrorDetails.FRAG_LOAD_TIMEOUT:
                      if (!b.fatal) {
                        var d = this.fragLoadError;
                        d ? d++ : (d = 1);
                        d <= this.config.fragLoadingMaxRetry
                          ? ((this.fragLoadError = d),
                            (b.frag.loadCounter = 0),
                            (b = Math.min(Math.pow(2, d - 1) * this.config.fragLoadingRetryDelay, 64e3)),
                            a.logger.warn('mediaController: frag loading failed, retry in ' + b + ' ms'),
                            (this.retryDate = performance.now() + b),
                            (this.state = 'FRAG_LOADING_WAITING_RETRY'))
                          : (a.logger.error(
                              'mediaController: ' + b.details + ' reaches max retry, redispatch as fatal ...'
                            ),
                            (b.fatal = !0),
                            this.hls.trigger(c.default.ERROR, b),
                            (this.state = 'ERROR'));
                      }
                      break;
                    case q.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                    case q.ErrorDetails.LEVEL_LOAD_ERROR:
                    case q.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                    case q.ErrorDetails.KEY_LOAD_ERROR:
                    case q.ErrorDetails.KEY_LOAD_TIMEOUT:
                      a.logger.warn(
                        'mediaController: ' +
                          b.details +
                          ' while loading frag,switch to ' +
                          (b.fatal ? 'ERROR' : 'IDLE') +
                          ' state ...'
                      );
                      this.state = b.fatal ? 'ERROR' : 'IDLE';
                      break;
                    case q.ErrorDetails.BUFFER_FULL:
                      (this.config.maxMaxBufferLength /= 2),
                        a.logger.warn(
                          'reduce max buffer length to ' +
                            this.config.maxMaxBufferLength +
                            's and trigger a nextLevelSwitch to flush old buffer and fix QuotaExceededError'
                        ),
                        this.nextLevelSwitch();
                  }
                },
              },
              {
                key: '_checkBuffer',
                value: function () {
                  var b = this.media;
                  if (b) {
                    var d = b.readyState;
                    if (d) {
                      var e = this.seekAfterBuffered;
                      if (e) {
                        if (b.duration >= e) {
                          var h = e;
                          this.seekAfterBuffered = void 0;
                        }
                      } else {
                        var m = b.currentTime;
                        !this.loadedmetadata &&
                          b.buffered.length &&
                          ((this.loadedmetadata = !0), m || m === this.startPosition || (h = this.startPosition));
                      }
                      h && ((m = h), a.logger.log('target seek position:' + h));
                      e = this.bufferInfo(m, 0);
                      d = !(b.paused || b.ended || b.seeking || 2 > d);
                      var f = 0.2,
                        p = m > b.playbackRate * this.lastCurrentTime;
                      this.stalled && p && (this.stalled = !1);
                      e.len <= f
                        ? (p || !d
                            ? (f = 0)
                            : (a.logger.log('playback seems stuck @' + m),
                              this.stalled ||
                                (this.hls.trigger(c.default.ERROR, {
                                  type: q.ErrorTypes.MEDIA_ERROR,
                                  details: q.ErrorDetails.BUFFER_STALLED_ERROR,
                                  fatal: !1,
                                }),
                                (this.stalled = !0))),
                          e.len <= f &&
                            ((h = e.nextStart),
                            (m = h - m),
                            h &&
                              m < this.config.maxSeekHole &&
                              0.005 < m &&
                              !b.seeking &&
                              (a.logger.log('adjust currentTime from ' + b.currentTime + ' to next buffered @ ' + h),
                              (b.currentTime = h))))
                        : h &&
                          b.currentTime !== h &&
                          (a.logger.log('adjust currentTime from ' + b.currentTime + ' to ' + h), (b.currentTime = h));
                    }
                  }
                },
              },
              {
                key: 'onBufferFlushed',
                value: function () {
                  var a = [],
                    b;
                  for (b = 0; b < this.bufferRange.length; b++) {
                    var d = this.bufferRange[b];
                    this.isBuffered((d.start + d.end) / 2) && a.push(d);
                  }
                  this.bufferRange = a;
                  this.immediateSwitch && this.immediateLevelSwitchEnd();
                  this.state = 'IDLE';
                  this.fragPrevious = null;
                },
              },
              {
                key: 'swapAudioCodec',
                value: function () {
                  this.audioCodecSwap = !this.audioCodecSwap;
                },
              },
              {
                key: 'timeRangesToString',
                value: function (a) {
                  for (var b = '', d = a.length, c = 0; c < d; c++) b += '[' + a.start(c) + ',' + a.end(c) + ']';
                  return b;
                },
              },
              {
                key: 'currentLevel',
                get: function () {
                  if (this.media) {
                    var a = this.getBufferRange(this.media.currentTime);
                    if (a) return a.frag.level;
                  }
                  return -1;
                },
              },
              {
                key: 'nextBufferRange',
                get: function () {
                  return this.media ? this.followingBufferRange(this.getBufferRange(this.media.currentTime)) : null;
                },
              },
              {
                key: 'nextLevel',
                get: function () {
                  var a = this.nextBufferRange;
                  return a ? a.frag.level : -1;
                },
              },
            ]);
            return p;
          })(b.default);
          n.default = g;
        },
        {
          '../demux/demuxer': 15,
          '../errors': 19,
          '../event-handler': 20,
          '../events': 21,
          '../helper/level-helper': 22,
          '../utils/binary-search': 32,
          '../utils/logger': 34,
        },
      ],
      7: [
        function (g, k, n) {
          function l(a) {
            return a && a.__esModule
              ? a
              : {
                  default: a,
                };
          }
          function f(a, b) {
            if ('function' !== typeof b && null !== b)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof b);
            a.prototype = Object.create(b && b.prototype, {
              constructor: {
                value: a,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : (a.__proto__ = b));
          }
          var e = (function () {
            function a(a, b) {
              for (var d = 0; d < b.length; d++) {
                var c = b[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (b, d, c) {
              d && a(b.prototype, d);
              c && a(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('../events');
          var d = l(k);
          k = g('../event-handler');
          var c = l(k);
          g = g('../utils/cea-708-interpreter');
          var b = l(g);
          g = (function (a) {
            function m(a) {
              if (!(this instanceof m)) throw new TypeError('Cannot call a class as a function');
              var c = Object.getPrototypeOf(m).call(
                this,
                a,
                d.default.MEDIA_ATTACHING,
                d.default.MEDIA_DETACHING,
                d.default.FRAG_PARSING_USERDATA,
                d.default.MANIFEST_LOADING,
                d.default.FRAG_LOADED
              );
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              c = !c || ('object' !== typeof c && 'function' !== typeof c) ? this : c;
              c.hls = a;
              c.config = a.config;
              c.config.enableCEA708Captions && (c.cea708Interpreter = new b.default());
              return c;
            }
            f(m, a);
            e(m, [
              {
                key: 'destroy',
                value: function () {
                  c.default.prototype.destroy.call(this);
                },
              },
              {
                key: 'onMediaAttaching',
                value: function (a) {
                  a = this.media = a.media;
                  this.cea708Interpreter.attach(a);
                },
              },
              {
                key: 'onMediaDetaching',
                value: function () {
                  this.cea708Interpreter.detach();
                },
              },
              {
                key: 'onManifestLoading',
                value: function () {
                  this.lastPts = Number.POSITIVE_INFINITY;
                },
              },
              {
                key: 'onFragLoaded',
                value: function (a) {
                  a = a.frag.start;
                  a <= this.lastPts && this.cea708Interpreter.clear();
                  this.lastPts = a;
                },
              },
              {
                key: 'onFragParsingUserdata',
                value: function (a) {
                  for (var b = 0; b < a.samples.length; b++)
                    this.cea708Interpreter.push(a.samples[b].pts, a.samples[b].bytes);
                },
              },
            ]);
            return m;
          })(c.default);
          n.default = g;
        },
        {
          '../event-handler': 20,
          '../events': 21,
          '../utils/cea-708-interpreter': 33,
        },
      ],
      8: [
        function (g, k, n) {
          var l = (function () {
            function f(e, d) {
              for (var c = 0; c < d.length; c++) {
                var b = d[c];
                b.enumerable = b.enumerable || !1;
                b.configurable = !0;
                'value' in b && (b.writable = !0);
                Object.defineProperty(e, b.key, b);
              }
            }
            return function (e, d, c) {
              d && f(e.prototype, d);
              c && f(e, c);
              return e;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          g = (function () {
            function f(e) {
              if (!(this instanceof f)) throw new TypeError('Cannot call a class as a function');
              this._tables = [
                [[], [], [], [], []],
                [[], [], [], [], []],
              ];
              this._precompute();
              var d = this._tables[0][4],
                c = this._tables[1];
              var b = e.length;
              var a = 1;
              if (4 !== b && 6 !== b && 8 !== b) throw Error('Invalid aes key size=' + b);
              var m = e.slice(0);
              var h = [];
              this._key = [m, h];
              for (e = b; e < 4 * b + 28; e++) {
                var q = m[e - 1];
                if (0 === e % b || (8 === b && 4 === e % b))
                  (q = (d[q >>> 24] << 24) ^ (d[(q >> 16) & 255] << 16) ^ (d[(q >> 8) & 255] << 8) ^ d[q & 255]),
                    0 === e % b && ((q = (q << 8) ^ (q >>> 24) ^ (a << 24)), (a = (a << 1) ^ (283 * (a >> 7))));
                m[e] = m[e - b] ^ q;
              }
              for (b = 0; e; b++, e--)
                (q = m[b & 3 ? e : e - 4]),
                  (h[b] =
                    4 >= e || 4 > b
                      ? q
                      : c[0][d[q >>> 24]] ^ c[1][d[(q >> 16) & 255]] ^ c[2][d[(q >> 8) & 255]] ^ c[3][d[q & 255]]);
            }
            l(f, [
              {
                key: '_precompute',
                value: function () {
                  var e = this._tables[0],
                    d = this._tables[1],
                    c = e[4],
                    b = d[4],
                    a,
                    m,
                    h,
                    q = [],
                    f = [],
                    p;
                  for (a = 0; 256 > a; a++) f[(q[a] = (a << 1) ^ (283 * (a >> 7))) ^ a] = a;
                  for (m = h = 0; !c[m]; m ^= p || 1, h = f[h] || 1) {
                    var g = h ^ (h << 1) ^ (h << 2) ^ (h << 3) ^ (h << 4);
                    g = (g >> 8) ^ (g & 255) ^ 99;
                    c[m] = g;
                    b[g] = m;
                    var k = q[(a = q[(p = q[m])])];
                    var l = (16843009 * k) ^ (65537 * a) ^ (257 * p) ^ (16843008 * m);
                    k = (257 * q[g]) ^ (16843008 * g);
                    for (a = 0; 4 > a; a++)
                      (e[a][m] = k = (k << 24) ^ (k >>> 8)), (d[a][g] = l = (l << 24) ^ (l >>> 8));
                  }
                  for (a = 0; 5 > a; a++) (e[a] = e[a].slice(0)), (d[a] = d[a].slice(0));
                },
              },
              {
                key: 'decrypt',
                value: function (e, d, c, b, a, m) {
                  var h = this._key[1];
                  e ^= h[0];
                  b ^= h[1];
                  c ^= h[2];
                  d ^= h[3];
                  var q = h.length / 4 - 2,
                    f,
                    p = 4;
                  var g = this._tables[1];
                  var k = g[0],
                    l = g[1],
                    n = g[2],
                    r = g[3],
                    w = g[4];
                  for (f = 0; f < q; f++) {
                    g = k[e >>> 24] ^ l[(b >> 16) & 255] ^ n[(c >> 8) & 255] ^ r[d & 255] ^ h[p];
                    var A = k[b >>> 24] ^ l[(c >> 16) & 255] ^ n[(d >> 8) & 255] ^ r[e & 255] ^ h[p + 1];
                    var y = k[c >>> 24] ^ l[(d >> 16) & 255] ^ n[(e >> 8) & 255] ^ r[b & 255] ^ h[p + 2];
                    d = k[d >>> 24] ^ l[(e >> 16) & 255] ^ n[(b >> 8) & 255] ^ r[c & 255] ^ h[p + 3];
                    p += 4;
                    e = g;
                    b = A;
                    c = y;
                  }
                  for (f = 0; 4 > f; f++)
                    (a[(3 & -f) + m] =
                      (w[e >>> 24] << 24) ^
                      (w[(b >> 16) & 255] << 16) ^
                      (w[(c >> 8) & 255] << 8) ^
                      w[d & 255] ^
                      h[p++]),
                      (g = e),
                      (e = b),
                      (b = c),
                      (c = d),
                      (d = g);
                },
              },
            ]);
            return f;
          })();
          n.default = g;
        },
        {},
      ],
      9: [
        function (g, k, n) {
          var l = (function () {
            function e(d, c) {
              for (var b = 0; b < c.length; b++) {
                var a = c[b];
                a.enumerable = a.enumerable || !1;
                a.configurable = !0;
                'value' in a && (a.writable = !0);
                Object.defineProperty(d, a.key, a);
              }
            }
            return function (d, c, b) {
              c && e(d.prototype, c);
              b && e(d, b);
              return d;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f =
            (g = g('./aes')) && g.__esModule
              ? g
              : {
                  default: g,
                };
          g = (function () {
            function e(d, c) {
              if (!(this instanceof e)) throw new TypeError('Cannot call a class as a function');
              this.key = d;
              this.iv = c;
            }
            l(e, [
              {
                key: 'ntoh',
                value: function (d) {
                  return (d << 24) | ((d & 65280) << 8) | ((d & 16711680) >> 8) | (d >>> 24);
                },
              },
              {
                key: 'doDecrypt',
                value: function (d, c, b) {
                  var a = new Int32Array(d.buffer, d.byteOffset, d.byteLength >> 2);
                  c = new f.default(Array.prototype.slice.call(c));
                  d = new Uint8Array(d.byteLength);
                  var e = new Int32Array(d.buffer),
                    h;
                  var q = ~~b[0];
                  var g = ~~b[1];
                  var p = ~~b[2];
                  b = ~~b[3];
                  for (h = 0; h < a.length; h += 4) {
                    var k = ~~this.ntoh(a[h]);
                    var l = ~~this.ntoh(a[h + 1]);
                    var n = ~~this.ntoh(a[h + 2]);
                    var u = ~~this.ntoh(a[h + 3]);
                    c.decrypt(k, l, n, u, e, h);
                    e[h] = this.ntoh(e[h] ^ q);
                    e[h + 1] = this.ntoh(e[h + 1] ^ g);
                    e[h + 2] = this.ntoh(e[h + 2] ^ p);
                    e[h + 3] = this.ntoh(e[h + 3] ^ b);
                    q = k;
                    g = l;
                    p = n;
                    b = u;
                  }
                  return d;
                },
              },
              {
                key: 'localDecrypt',
                value: function (d, c, b, a) {
                  c = this.doDecrypt(d, c, b);
                  a.set(c, d.byteOffset);
                },
              },
              {
                key: 'decrypt',
                value: function (d) {
                  var c = new Int32Array(d);
                  d = new Uint8Array(d.byteLength);
                  var b = 0,
                    a = this.key,
                    e = this.iv;
                  this.localDecrypt(c.subarray(b, b + 32e3), a, e, d);
                  for (b = 32e3; b < c.length; b += 32e3)
                    (e = new Uint32Array([
                      this.ntoh(c[b - 4]),
                      this.ntoh(c[b - 3]),
                      this.ntoh(c[b - 2]),
                      this.ntoh(c[b - 1]),
                    ])),
                      this.localDecrypt(c.subarray(b, b + 32e3), a, e, d);
                  return d;
                },
              },
            ]);
            return e;
          })();
          n.default = g;
        },
        {
          './aes': 8,
        },
      ],
      10: [
        function (g, k, n) {
          var l = (function () {
            function d(b, a) {
              for (var d = 0; d < a.length; d++) {
                var c = a[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(b, c.key, c);
              }
            }
            return function (b, a, c) {
              a && d(b.prototype, a);
              c && d(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f =
              (k = g('./aes128-decrypter')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            e = g('../errors'),
            d = g('../utils/logger');
          g = (function () {
            function c(b) {
              if (!(this instanceof c)) throw new TypeError('Cannot call a class as a function');
              this.hls = b;
              try {
                var a = window ? window.crypto : crypto;
                this.subtle = a.subtle || a.webkitSubtle;
                this.disableWebCrypto = !this.subtle;
              } catch (m) {
                this.disableWebCrypto = !0;
              }
            }
            l(c, [
              {
                key: 'destroy',
                value: function () {},
              },
              {
                key: 'decrypt',
                value: function (b, a, d, c) {
                  this.disableWebCrypto && this.hls.config.enableSoftwareAES
                    ? this.decryptBySoftware(b, a, d, c)
                    : this.decryptByWebCrypto(b, a, d, c);
                },
              },
              {
                key: 'decryptByWebCrypto',
                value: function (b, a, c, e) {
                  var h = this;
                  d.logger.log('decrypting by WebCrypto API');
                  this.subtle
                    .importKey(
                      'raw',
                      a,
                      {
                        name: 'AES-CBC',
                        length: 128,
                      },
                      !1,
                      ['decrypt']
                    )
                    .then(function (d) {
                      h.subtle
                        .decrypt(
                          {
                            name: 'AES-CBC',
                            iv: c.buffer,
                          },
                          d,
                          b
                        )
                        .then(e)
                        .catch(function (d) {
                          h.onWebCryptoError(d, b, a, c, e);
                        });
                    })
                    .catch(function (d) {
                      h.onWebCryptoError(d, b, a, c, e);
                    });
                },
              },
              {
                key: 'decryptBySoftware',
                value: function (b, a, c, e) {
                  d.logger.log('decrypting by JavaScript Implementation');
                  var h = new DataView(a.buffer);
                  a = new Uint32Array([h.getUint32(0), h.getUint32(4), h.getUint32(8), h.getUint32(12)]);
                  h = new DataView(c.buffer);
                  c = new Uint32Array([h.getUint32(0), h.getUint32(4), h.getUint32(8), h.getUint32(12)]);
                  c = new f.default(a, c);
                  e(c.decrypt(b).buffer);
                },
              },
              {
                key: 'onWebCryptoError',
                value: function (b, a, c, h, f) {
                  this.hls.config.enableSoftwareAES
                    ? (d.logger.log('disabling to use WebCrypto API'),
                      (this.disableWebCrypto = !0),
                      this.decryptBySoftware(a, c, h, f))
                    : (d.logger.error('decrypting error : ' + b.message),
                      this.hls.trigger(Event.ERROR, {
                        type: e.ErrorTypes.MEDIA_ERROR,
                        details: e.ErrorDetails.FRAG_DECRYPT_ERROR,
                        fatal: !0,
                        reason: b.message,
                      }));
                },
              },
            ]);
            return c;
          })();
          n.default = g;
        },
        {
          '../errors': 19,
          '../utils/logger': 34,
          './aes128-decrypter': 9,
        },
      ],
      11: [
        function (g, k, n) {
          var l = (function () {
            function d(b, a) {
              for (var d = 0; d < a.length; d++) {
                var c = a[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(b, c.key, c);
              }
            }
            return function (b, a, c) {
              a && d(b.prototype, a);
              c && d(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f =
              (k = g('./adts')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            e = g('../utils/logger'),
            d =
              (g = g('../demux/id3')) && g.__esModule
                ? g
                : {
                    default: g,
                  };
          g = (function () {
            function c(b, a) {
              if (!(this instanceof c)) throw new TypeError('Cannot call a class as a function');
              this.observer = b;
              this.remuxerClass = a;
              this.remuxer = new this.remuxerClass(b);
              this._aacTrack = {
                container: 'audio/adts',
                type: 'audio',
                id: -1,
                sequenceNumber: 0,
                samples: [],
                len: 0,
              };
            }
            l(
              c,
              [
                {
                  key: 'push',
                  value: function (b, a, c, h, q, g, p, k) {
                    c = this._aacTrack;
                    q = new d.default(b);
                    g = 90 * q.timeStamp;
                    var m;
                    p = q.length;
                    for (m = b.length; p < m - 1 && (255 !== b[p] || 240 !== (b[p + 1] & 240)); p++);
                    c.audiosamplerate ||
                      ((a = f.default.getAudioConfig(this.observer, b, p, a)),
                      (c.config = a.config),
                      (c.audiosamplerate = a.samplerate),
                      (c.channelCount = a.channelCount),
                      (c.codec = a.codec),
                      (c.timescale = a.samplerate),
                      (c.duration = a.samplerate * k),
                      e.logger.log(
                        'parsed codec:' + c.codec + ',rate:' + a.samplerate + ',nb channel:' + a.channelCount
                      ));
                    var v = 0;
                    for (a = 9216e4 / c.audiosamplerate; p + 5 < m; ) {
                      var l = b[p + 1] & 1 ? 7 : 9;
                      k = ((b[p + 3] & 3) << 11) | (b[p + 4] << 3) | ((b[p + 5] & 224) >>> 5);
                      k -= l;
                      if (0 < k && p + l + k <= m) {
                        var r = g + v * a;
                        r = {
                          unit: b.subarray(p + l, p + l + k),
                          pts: r,
                          dts: r,
                        };
                        c.samples.push(r);
                        c.len += k;
                        p += k + l;
                        for (v++; p < m - 1 && (255 !== b[p] || 240 !== (b[p + 1] & 240)); p++);
                      } else break;
                    }
                    this.remuxer.remux(
                      this._aacTrack,
                      {
                        samples: [],
                      },
                      {
                        samples: [
                          {
                            pts: g,
                            dts: g,
                            unit: q.payload,
                          },
                        ],
                      },
                      {
                        samples: [],
                      },
                      h
                    );
                  },
                },
                {
                  key: 'destroy',
                  value: function () {},
                },
              ],
              [
                {
                  key: 'probe',
                  value: function (b) {
                    var a = new d.default(b),
                      c;
                    if (a.hasTimeStamp)
                      for (a = a.length, c = b.length; a < c - 1; a++)
                        if (255 === b[a] && 240 === (b[a + 1] & 240)) return !0;
                    return !1;
                  },
                },
              ]
            );
            return c;
          })();
          n.default = g;
        },
        {
          '../demux/id3': 17,
          '../utils/logger': 34,
          './adts': 12,
        },
      ],
      12: [
        function (g, k, n) {
          var l = (function () {
            function d(d, b) {
              for (var a = 0; a < b.length; a++) {
                var c = b[a];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(d, c.key, c);
              }
            }
            return function (c, b, a) {
              b && d(c.prototype, b);
              a && d(c, a);
              return c;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f = g('../utils/logger'),
            e = g('../errors');
          g = (function () {
            function d() {
              if (!(this instanceof d)) throw new TypeError('Cannot call a class as a function');
            }
            l(d, null, [
              {
                key: 'getAudioConfig',
                value: function (d, b, a, m) {
                  var c = navigator.userAgent.toLowerCase(),
                    q = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
                  var g = ((b[a + 2] & 192) >>> 6) + 1;
                  var p = (b[a + 2] & 60) >>> 2;
                  if (p > q.length - 1)
                    d.trigger(Event.ERROR, {
                      type: e.ErrorTypes.MEDIA_ERROR,
                      details: e.ErrorDetails.FRAG_PARSING_ERROR,
                      fatal: !0,
                      reason: 'invalid ADTS sampling index:' + p,
                    });
                  else
                    return (
                      (d = (b[a + 2] & 1) << 2),
                      (d |= (b[a + 3] & 192) >>> 6),
                      f.logger.log(
                        'manifest codec:' +
                          m +
                          ',ADTS data:type:' +
                          g +
                          ',sampleingIndex:' +
                          p +
                          '[' +
                          q[p] +
                          'Hz],channelConfig:' +
                          d
                      ),
                      -1 !== c.indexOf('firefox')
                        ? (b = 6 <= p ? p - 3 : p)
                        : -1 !== c.indexOf('android')
                        ? (b = p)
                        : (m && (-1 !== m.indexOf('mp4a.40.29') || -1 !== m.indexOf('mp4a.40.5'))) || (!m && 6 <= p)
                        ? (b = p - 3)
                        : (m && m.indexOf('mp4a.40.2'), (b = p)),
                      (g = 2),
                      (a = Array(2)),
                      (a[0] = g << 3),
                      (a[0] |= (p & 14) >> 1),
                      (a[1] |= (p & 1) << 7),
                      (a[1] |= d << 3),
                      5 === g && ((a[1] |= (b & 14) >> 1), (a[2] = (b & 1) << 7), (a[2] |= 8), (a[3] = 0)),
                      {
                        config: a,
                        samplerate: q[p],
                        channelCount: d,
                        codec: 'mp4a.40.' + g,
                      }
                    );
                },
              },
            ]);
            return d;
          })();
          n.default = g;
        },
        {
          '../errors': 19,
          '../utils/logger': 34,
        },
      ],
      13: [
        function (g, k, n) {
          function l(a) {
            return a && a.__esModule
              ? a
              : {
                  default: a,
                };
          }
          var f = (function () {
            function a(a, b) {
              for (var d = 0; d < b.length; d++) {
                var c = b[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (b, d, c) {
              d && a(b.prototype, d);
              c && a(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('../events');
          var e = l(k),
            d = g('../errors');
          k = g('../demux/aacdemuxer');
          var c = l(k);
          k = g('../demux/tsdemuxer');
          var b = l(k);
          k = g('../remux/mp4-remuxer');
          var a = l(k);
          g = g('../remux/passthrough-remuxer');
          var m = l(g);
          g = (function () {
            function h(a, b) {
              if (!(this instanceof h)) throw new TypeError('Cannot call a class as a function');
              this.hls = a;
              this.typeSupported = b;
            }
            f(h, [
              {
                key: 'destroy',
                value: function () {
                  var a = this.demuxer;
                  a && a.destroy();
                },
              },
              {
                key: 'push',
                value: function (h, f, p, g, k, l, n, r) {
                  var q = this.demuxer;
                  if (!q) {
                    q = this.hls;
                    if (b.default.probe(h))
                      q = !0 === this.typeSupported.mp2t ? new b.default(q, m.default) : new b.default(q, a.default);
                    else if (c.default.probe(h)) q = new c.default(q, a.default);
                    else {
                      q.trigger(e.default.ERROR, {
                        type: d.ErrorTypes.MEDIA_ERROR,
                        details: d.ErrorDetails.FRAG_PARSING_ERROR,
                        fatal: !0,
                        reason: 'no demux matching with content found',
                      });
                      return;
                    }
                    this.demuxer = q;
                  }
                  q.push(h, f, p, g, k, l, n, r);
                },
              },
            ]);
            return h;
          })();
          n.default = g;
        },
        {
          '../demux/aacdemuxer': 11,
          '../demux/tsdemuxer': 18,
          '../errors': 19,
          '../events': 21,
          '../remux/mp4-remuxer': 29,
          '../remux/passthrough-remuxer': 30,
        },
      ],
      14: [
        function (g, k, n) {
          function l(d) {
            return d && d.__esModule
              ? d
              : {
                  default: d,
                };
          }
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('../demux/demuxer-inline');
          var f = l(k);
          k = g('../events');
          var e = l(k);
          g = g('events');
          var d = l(g);
          n.default = function (c) {
            var b = new d.default();
            b.trigger = function (a) {
              for (var d = arguments.length, c = Array(1 < d ? d - 1 : 0), e = 1; e < d; e++) c[e - 1] = arguments[e];
              b.emit.apply(b, [a, a].concat(c));
            };
            b.off = function (a) {
              for (var d = arguments.length, c = Array(1 < d ? d - 1 : 0), e = 1; e < d; e++) c[e - 1] = arguments[e];
              b.removeListener.apply(b, [a].concat(c));
            };
            c.addEventListener('message', function (a) {
              a = a.data;
              switch (a.cmd) {
                case 'init':
                  c.demuxer = new f.default(b, a.typeSupported);
                  break;
                case 'demux':
                  c.demuxer.push(
                    new Uint8Array(a.data),
                    a.audioCodec,
                    a.videoCodec,
                    a.timeOffset,
                    a.cc,
                    a.level,
                    a.sn,
                    a.duration
                  );
              }
            });
            b.on(e.default.FRAG_PARSING_INIT_SEGMENT, function (a, b) {
              c.postMessage({
                event: a,
                tracks: b.tracks,
                unique: b.unique,
              });
            });
            b.on(e.default.FRAG_PARSING_DATA, function (a, b) {
              a = {
                event: a,
                type: b.type,
                startPTS: b.startPTS,
                endPTS: b.endPTS,
                startDTS: b.startDTS,
                endDTS: b.endDTS,
                data1: b.data1.buffer,
                data2: b.data2.buffer,
                nb: b.nb,
              };
              c.postMessage(a, [a.data1, a.data2]);
            });
            b.on(e.default.FRAG_PARSED, function (a) {
              c.postMessage({
                event: a,
              });
            });
            b.on(e.default.ERROR, function (a, b) {
              c.postMessage({
                event: a,
                data: b,
              });
            });
            b.on(e.default.FRAG_PARSING_METADATA, function (a, b) {
              c.postMessage({
                event: a,
                samples: b.samples,
              });
            });
            b.on(e.default.FRAG_PARSING_USERDATA, function (a, b) {
              c.postMessage({
                event: a,
                samples: b.samples,
              });
            });
          };
        },
        {
          '../demux/demuxer-inline': 13,
          '../events': 21,
          events: 1,
        },
      ],
      15: [
        function (g, k, n) {
          function l(a) {
            return a && a.__esModule
              ? a
              : {
                  default: a,
                };
          }
          var f = (function () {
            function a(a, b) {
              for (var d = 0; d < b.length; d++) {
                var c = b[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (b, d, c) {
              d && a(b.prototype, d);
              c && a(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('../events');
          var e = l(k);
          k = g('../demux/demuxer-inline');
          var d = l(k);
          k = g('../demux/demuxer-worker');
          var c = l(k),
            b = g('../utils/logger');
          k = g('../crypt/decrypter');
          var a = l(k);
          k = (function () {
            function m(a) {
              if (!(this instanceof m)) throw new TypeError('Cannot call a class as a function');
              this.hls = a;
              var e = {
                mp4: MediaSource.isTypeSupported('video/mp4'),
                mp2t: a.config.enableMP2TPassThrough && MediaSource.isTypeSupported('video/mp2t'),
              };
              if (a.config.enableWorker && 'undefined' !== typeof Worker) {
                b.logger.log('demuxing in webworker');
                try {
                  (this.w = g('webworkify')(c.default)),
                    (this.onwmsg = this.onWorkerMessage.bind(this)),
                    this.w.addEventListener('message', this.onwmsg),
                    this.w.postMessage({
                      cmd: 'init',
                      typeSupported: e,
                    });
                } catch (v) {
                  b.logger.error('error while initializing DemuxerWorker, fallback on DemuxerInline'),
                    (this.demuxer = new d.default(a, e));
                }
              } else this.demuxer = new d.default(a, e);
              this.demuxInitialized = !0;
            }
            f(m, [
              {
                key: 'destroy',
                value: function () {
                  this.w
                    ? (this.w.removeEventListener('message', this.onwmsg), this.w.terminate(), (this.w = null))
                    : (this.demuxer.destroy(), (this.demuxer = null));
                  this.decrypter && (this.decrypter.destroy(), (this.decrypter = null));
                },
              },
              {
                key: 'pushDecrypted',
                value: function (a, b, d, c, e, f, m, g) {
                  this.w
                    ? this.w.postMessage(
                        {
                          cmd: 'demux',
                          data: a,
                          audioCodec: b,
                          videoCodec: d,
                          timeOffset: c,
                          cc: e,
                          level: f,
                          sn: m,
                          duration: g,
                        },
                        [a]
                      )
                    : this.demuxer.push(new Uint8Array(a), b, d, c, e, f, m, g);
                },
              },
              {
                key: 'push',
                value: function (b, d, c, e, f, m, g, k, r) {
                  if (0 < b.byteLength && null != r && null != r.key && 'AES-128' === r.method) {
                    null == this.decrypter && (this.decrypter = new a.default(this.hls));
                    var h = this;
                    this.decrypter.decrypt(b, r.key, r.iv, function (a) {
                      h.pushDecrypted(a, d, c, e, f, m, g, k);
                    });
                  } else this.pushDecrypted(b, d, c, e, f, m, g, k);
                },
              },
              {
                key: 'onWorkerMessage',
                value: function (a) {
                  a = a.data;
                  switch (a.event) {
                    case e.default.FRAG_PARSING_INIT_SEGMENT:
                      var b = {};
                      b.tracks = a.tracks;
                      b.unique = a.unique;
                      this.hls.trigger(e.default.FRAG_PARSING_INIT_SEGMENT, b);
                      break;
                    case e.default.FRAG_PARSING_DATA:
                      this.hls.trigger(e.default.FRAG_PARSING_DATA, {
                        data1: new Uint8Array(a.data1),
                        data2: new Uint8Array(a.data2),
                        startPTS: a.startPTS,
                        endPTS: a.endPTS,
                        startDTS: a.startDTS,
                        endDTS: a.endDTS,
                        type: a.type,
                        nb: a.nb,
                      });
                      break;
                    case e.default.FRAG_PARSING_METADATA:
                      this.hls.trigger(e.default.FRAG_PARSING_METADATA, {
                        samples: a.samples,
                      });
                      break;
                    case e.default.FRAG_PARSING_USERDATA:
                      this.hls.trigger(e.default.FRAG_PARSING_USERDATA, {
                        samples: a.samples,
                      });
                      break;
                    default:
                      this.hls.trigger(a.event, a.data);
                  }
                },
              },
            ]);
            return m;
          })();
          n.default = k;
        },
        {
          '../crypt/decrypter': 10,
          '../demux/demuxer-inline': 13,
          '../demux/demuxer-worker': 14,
          '../events': 21,
          '../utils/logger': 34,
          webworkify: 2,
        },
      ],
      16: [
        function (g, k, n) {
          var l = (function () {
            function e(d, c) {
              for (var b = 0; b < c.length; b++) {
                var a = c[b];
                a.enumerable = a.enumerable || !1;
                a.configurable = !0;
                'value' in a && (a.writable = !0);
                Object.defineProperty(d, a.key, a);
              }
            }
            return function (d, c, b) {
              c && e(d.prototype, c);
              b && e(d, b);
              return d;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f = g('../utils/logger');
          g = (function () {
            function e(d) {
              if (!(this instanceof e)) throw new TypeError('Cannot call a class as a function');
              this.data = d;
              this.bytesAvailable = this.data.byteLength;
              this.bitsAvailable = this.word = 0;
            }
            l(e, [
              {
                key: 'loadWord',
                value: function () {
                  var d = this.data.byteLength - this.bytesAvailable,
                    c = new Uint8Array(4),
                    b = Math.min(4, this.bytesAvailable);
                  if (0 === b) throw Error('no bytes available');
                  c.set(this.data.subarray(d, d + b));
                  this.word = new DataView(c.buffer).getUint32(0);
                  this.bitsAvailable = 8 * b;
                  this.bytesAvailable -= b;
                },
              },
              {
                key: 'skipBits',
                value: function (d) {
                  if (!(this.bitsAvailable > d)) {
                    d -= this.bitsAvailable;
                    var c = d >> 3;
                    d -= c >> 3;
                    this.bytesAvailable -= c;
                    this.loadWord();
                  }
                  this.word <<= d;
                  this.bitsAvailable -= d;
                },
              },
              {
                key: 'readBits',
                value: function (d) {
                  var c = Math.min(this.bitsAvailable, d),
                    b = this.word >>> (32 - c);
                  32 < d && f.logger.error('Cannot read more than 32 bits at a time');
                  this.bitsAvailable -= c;
                  0 < this.bitsAvailable ? (this.word <<= c) : 0 < this.bytesAvailable && this.loadWord();
                  c = d - c;
                  return 0 < c ? (b << c) | this.readBits(c) : b;
                },
              },
              {
                key: 'skipLZ',
                value: function () {
                  var d;
                  for (d = 0; d < this.bitsAvailable; ++d)
                    if (0 !== (this.word & (2147483648 >>> d))) return (this.word <<= d), (this.bitsAvailable -= d), d;
                  this.loadWord();
                  return d + this.skipLZ();
                },
              },
              {
                key: 'skipUEG',
                value: function () {
                  this.skipBits(1 + this.skipLZ());
                },
              },
              {
                key: 'skipEG',
                value: function () {
                  this.skipBits(1 + this.skipLZ());
                },
              },
              {
                key: 'readUEG',
                value: function () {
                  var d = this.skipLZ();
                  return this.readBits(d + 1) - 1;
                },
              },
              {
                key: 'readEG',
                value: function () {
                  var d = this.readUEG();
                  return 1 & d ? (1 + d) >>> 1 : -1 * (d >>> 1);
                },
              },
              {
                key: 'readBoolean',
                value: function () {
                  return 1 === this.readBits(1);
                },
              },
              {
                key: 'readUByte',
                value: function () {
                  return this.readBits(8);
                },
              },
              {
                key: 'readUShort',
                value: function () {
                  return this.readBits(16);
                },
              },
              {
                key: 'readUInt',
                value: function () {
                  return this.readBits(32);
                },
              },
              {
                key: 'skipScalingList',
                value: function (d) {
                  var c = 8,
                    b = 8,
                    a;
                  for (a = 0; a < d; a++)
                    0 !== b && ((b = this.readEG()), (b = (c + b + 256) % 256)), (c = 0 === b ? c : b);
                },
              },
              {
                key: 'readSPS',
                value: function () {
                  var d = 0,
                    c = 0,
                    b = 0,
                    a = 0,
                    e = 1;
                  this.readUByte();
                  var h = this.readUByte();
                  this.readBits(5);
                  this.skipBits(3);
                  this.readUByte();
                  this.skipUEG();
                  if (
                    100 === h ||
                    110 === h ||
                    122 === h ||
                    244 === h ||
                    44 === h ||
                    83 === h ||
                    86 === h ||
                    118 === h ||
                    128 === h
                  )
                    if (
                      ((h = this.readUEG()),
                      3 === h && this.skipBits(1),
                      this.skipUEG(),
                      this.skipUEG(),
                      this.skipBits(1),
                      this.readBoolean())
                    ) {
                      var f = 3 !== h ? 8 : 12;
                      for (h = 0; h < f; h++)
                        this.readBoolean() && (6 > h ? this.skipScalingList(16) : this.skipScalingList(64));
                    }
                  this.skipUEG();
                  h = this.readUEG();
                  if (0 === h) this.readUEG();
                  else if (1 === h)
                    for (this.skipBits(1), this.skipEG(), this.skipEG(), f = this.readUEG(), h = 0; h < f; h++)
                      this.skipEG();
                  this.skipUEG();
                  this.skipBits(1);
                  h = this.readUEG();
                  f = this.readUEG();
                  var g = this.readBits(1);
                  0 === g && this.skipBits(1);
                  this.skipBits(1);
                  this.readBoolean() &&
                    ((d = this.readUEG()), (c = this.readUEG()), (b = this.readUEG()), (a = this.readUEG()));
                  if (this.readBoolean() && this.readBoolean()) {
                    var p = void 0;
                    switch (this.readUByte()) {
                      case 1:
                        p = [1, 1];
                        break;
                      case 2:
                        p = [12, 11];
                        break;
                      case 3:
                        p = [10, 11];
                        break;
                      case 4:
                        p = [16, 11];
                        break;
                      case 5:
                        p = [40, 33];
                        break;
                      case 6:
                        p = [24, 11];
                        break;
                      case 7:
                        p = [20, 11];
                        break;
                      case 8:
                        p = [32, 11];
                        break;
                      case 9:
                        p = [80, 33];
                        break;
                      case 10:
                        p = [18, 11];
                        break;
                      case 11:
                        p = [15, 11];
                        break;
                      case 12:
                        p = [64, 33];
                        break;
                      case 13:
                        p = [160, 99];
                        break;
                      case 14:
                        p = [4, 3];
                        break;
                      case 15:
                        p = [3, 2];
                        break;
                      case 16:
                        p = [2, 1];
                        break;
                      case 255:
                        p = [(this.readUByte() << 8) | this.readUByte(), (this.readUByte() << 8) | this.readUByte()];
                    }
                    p && (e = p[0] / p[1]);
                  }
                  return {
                    width: Math.ceil((16 * (h + 1) - 2 * d - 2 * c) * e),
                    height: (2 - g) * (f + 1) * 16 - (g ? 2 : 4) * (b + a),
                  };
                },
              },
              {
                key: 'readSliceType',
                value: function () {
                  this.readUByte();
                  this.readUEG();
                  return this.readUEG();
                },
              },
            ]);
            return e;
          })();
          n.default = g;
        },
        {
          '../utils/logger': 34,
        },
      ],
      17: [
        function (g, k, n) {
          var l = (function () {
            function e(d, c) {
              for (var b = 0; b < c.length; b++) {
                var a = c[b];
                a.enumerable = a.enumerable || !1;
                a.configurable = !0;
                'value' in a && (a.writable = !0);
                Object.defineProperty(d, a.key, a);
              }
            }
            return function (d, c, b) {
              c && e(d.prototype, c);
              b && e(d, b);
              return d;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f = g('../utils/logger');
          g = (function () {
            function e(d) {
              if (!(this instanceof e)) throw new TypeError('Cannot call a class as a function');
              this._hasTimeStamp = !1;
              var c = 0;
              do {
                var b = this.readUTF(d, c, 3);
                c += 3;
                if ('ID3' === b) {
                  c += 3;
                  b = d[c++] & 127;
                  var a = d[c++] & 127;
                  var m = d[c++] & 127;
                  var h = d[c++] & 127;
                  b = (b << 21) + (a << 14) + (m << 7) + h;
                  b = c + b;
                  this._parseID3Frames(d, c, b);
                  c = b;
                } else if ('3DI' === b) (c += 7), f.logger.log('3DI footer found, end: ' + c);
                else {
                  if ((c -= 3))
                    this.hasTimeStamp || f.logger.warn('ID3 tag found, but no timestamp'),
                      (this._length = c),
                      (this._payload = d.subarray(0, c));
                  break;
                }
              } while (1);
            }
            l(e, [
              {
                key: 'readUTF',
                value: function (d, c, b) {
                  var a = '',
                    e = c;
                  c += b;
                  do a += String.fromCharCode(d[e++]);
                  while (e < c);
                  return a;
                },
              },
              {
                key: '_parseID3Frames',
                value: function (d, c, b) {
                  for (var a; c + 8 <= b; )
                    switch (((a = this.readUTF(d, c, 4)), (c += 4), c++, c++, c++, c++, c++, c++, a)) {
                      case 'PRIV':
                        if ('com.apple.streaming.transportStreamTimestamp' === this.readUTF(d, c, 44)) {
                          c += 44;
                          c += 4;
                          var e = d[c++] & 1;
                          this._hasTimeStamp = !0;
                          a = ((d[c++] << 23) + (d[c++] << 15) + (d[c++] << 7) + d[c++]) / 45;
                          e && (a += 4.772185884e7);
                          a = Math.round(a);
                          f.logger.trace('ID3 timestamp found: ' + a);
                          this._timeStamp = a;
                        }
                    }
                },
              },
              {
                key: 'hasTimeStamp',
                get: function () {
                  return this._hasTimeStamp;
                },
              },
              {
                key: 'timeStamp',
                get: function () {
                  return this._timeStamp;
                },
              },
              {
                key: 'length',
                get: function () {
                  return this._length;
                },
              },
              {
                key: 'payload',
                get: function () {
                  return this._payload;
                },
              },
            ]);
            return e;
          })();
          n.default = g;
        },
        {
          '../utils/logger': 34,
        },
      ],
      18: [
        function (g, k, n) {
          function l(a) {
            return a && a.__esModule
              ? a
              : {
                  default: a,
                };
          }
          var f = (function () {
            function a(a, b) {
              for (var d = 0; d < b.length; d++) {
                var c = b[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (b, d, c) {
              d && a(b.prototype, d);
              c && a(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('./adts');
          var e = l(k);
          k = g('../events');
          var d = l(k);
          k = g('./exp-golomb');
          var c = l(k),
            b = g('../utils/logger'),
            a = g('../errors');
          g = (function () {
            function m(a, b) {
              if (!(this instanceof m)) throw new TypeError('Cannot call a class as a function');
              this.observer = a;
              this.remuxerClass = b;
              this.lastCC = 0;
              this.remuxer = new this.remuxerClass(a);
            }
            f(
              m,
              [
                {
                  key: 'switchLevel',
                  value: function () {
                    this.pmtParsed = !1;
                    this._pmtId = -1;
                    this.aacOverFlow = this.lastAacPTS = null;
                    this._avcTrack = {
                      container: 'video/mp2t',
                      type: 'video',
                      id: -1,
                      sequenceNumber: 0,
                      samples: [],
                      len: 0,
                      nbNalu: 0,
                    };
                    this._aacTrack = {
                      container: 'video/mp2t',
                      type: 'audio',
                      id: -1,
                      sequenceNumber: 0,
                      samples: [],
                      len: 0,
                    };
                    this._id3Track = {
                      type: 'id3',
                      id: -1,
                      sequenceNumber: 0,
                      samples: [],
                      len: 0,
                    };
                    this._txtTrack = {
                      type: 'text',
                      id: -1,
                      sequenceNumber: 0,
                      samples: [],
                      len: 0,
                    };
                    this.remuxer.switchLevel();
                  },
                },
                {
                  key: 'insertDiscontinuity',
                  value: function () {
                    this.switchLevel();
                    this.remuxer.insertDiscontinuity();
                  },
                },
                {
                  key: 'push',
                  value: function (c, e, f, m, g, k, l, n) {
                    var h = c.length,
                      p = this.remuxer.passthrough;
                    this.audioCodec = e;
                    this.videoCodec = f;
                    this.timeOffset = m;
                    this._duration = n;
                    this.contiguous = !1;
                    g !== this.lastCC
                      ? (b.logger.log('discontinuity detected'), this.insertDiscontinuity(), (this.lastCC = g))
                      : k !== this.lastLevel
                      ? (b.logger.log('level switch detected'), this.switchLevel(), (this.lastLevel = k))
                      : l === this.lastSN + 1 && (this.contiguous = !0);
                    this.lastSN = l;
                    this.contiguous || (this.aacOverFlow = null);
                    g = this.pmtParsed;
                    k = this._avcTrack.id;
                    l = this._aacTrack.id;
                    n = this._id3Track.id;
                    h -= h % 188;
                    for (e = 0; e < h; e += 188)
                      if (71 === c[e]) {
                        f = !!(c[e + 1] & 64);
                        m = ((c[e + 1] & 31) << 8) + c[e + 2];
                        var q = (c[e + 3] & 48) >> 4;
                        if (1 < q) {
                          if (((q = e + 5 + c[e + 4]), q === e + 188)) continue;
                        } else q = e + 4;
                        if (g)
                          if (m === k) {
                            if (f) {
                              if (
                                v &&
                                (this._parseAVCPES(this._parsePES(v)),
                                p && this._avcTrack.codec && (-1 === l || this._aacTrack.codec))
                              ) {
                                this.remux(c);
                                return;
                              }
                              var v = {
                                data: [],
                                size: 0,
                              };
                            }
                            v && (v.data.push(c.subarray(q, e + 188)), (v.size += e + 188 - q));
                          } else if (m === l) {
                            if (f) {
                              if (
                                B &&
                                (this._parseAACPES(this._parsePES(B)),
                                p && this._aacTrack.codec && (-1 === k || this._avcTrack.codec))
                              ) {
                                this.remux(c);
                                return;
                              }
                              var B = {
                                data: [],
                                size: 0,
                              };
                            }
                            B && (B.data.push(c.subarray(q, e + 188)), (B.size += e + 188 - q));
                          } else {
                            if (m === n) {
                              if (f) {
                                u && this._parseID3PES(this._parsePES(u));
                                var u = {
                                  data: [],
                                  size: 0,
                                };
                              }
                              u && (u.data.push(c.subarray(q, e + 188)), (u.size += e + 188 - q));
                            }
                          }
                        else
                          f && (q += c[q] + 1),
                            0 === m
                              ? this._parsePAT(c, q)
                              : m === this._pmtId &&
                                (this._parsePMT(c, q),
                                (g = this.pmtParsed = !0),
                                (k = this._avcTrack.id),
                                (l = this._aacTrack.id),
                                (n = this._id3Track.id));
                      } else
                        this.observer.trigger(d.default.ERROR, {
                          type: a.ErrorTypes.MEDIA_ERROR,
                          details: a.ErrorDetails.FRAG_PARSING_ERROR,
                          fatal: !1,
                          reason: 'TS packet did not start with 0x47',
                        });
                    v && this._parseAVCPES(this._parsePES(v));
                    B && this._parseAACPES(this._parsePES(B));
                    u && this._parseID3PES(this._parsePES(u));
                    this.remux(null);
                  },
                },
                {
                  key: 'remux',
                  value: function (a) {
                    this.remuxer.remux(
                      this._aacTrack,
                      this._avcTrack,
                      this._id3Track,
                      this._txtTrack,
                      this.timeOffset,
                      this.contiguous,
                      a
                    );
                  },
                },
                {
                  key: 'destroy',
                  value: function () {
                    this.switchLevel();
                    this._initPTS = this._initDTS = void 0;
                    this._duration = 0;
                  },
                },
                {
                  key: '_parsePAT',
                  value: function (a, b) {
                    this._pmtId = ((a[b + 10] & 31) << 8) | a[b + 11];
                  },
                },
                {
                  key: '_parsePMT',
                  value: function (a, d) {
                    var c = d + 3 + (((a[d + 1] & 15) << 8) | a[d + 2]) - 4;
                    for (d += 12 + (((a[d + 10] & 15) << 8) | a[d + 11]); d < c; ) {
                      var e = ((a[d + 1] & 31) << 8) | a[d + 2];
                      switch (a[d]) {
                        case 15:
                          this._aacTrack.id = e;
                          break;
                        case 21:
                          this._id3Track.id = e;
                          break;
                        case 27:
                          this._avcTrack.id = e;
                          break;
                        default:
                          b.logger.log('unkown stream type:' + a[d]);
                      }
                      d += (((a[d + 3] & 15) << 8) | a[d + 4]) + 5;
                    }
                  },
                },
                {
                  key: '_parsePES',
                  value: function (a) {
                    var b = 0,
                      d = a.data;
                    var c = d[0];
                    if (1 === (c[0] << 16) + (c[1] << 8) + c[2]) {
                      var e = (c[4] << 8) + c[5];
                      var h = c[7];
                      if (h & 192) {
                        var f =
                          536870912 * (c[9] & 14) +
                          4194304 * (c[10] & 255) +
                          16384 * (c[11] & 254) +
                          128 * (c[12] & 255) +
                          (c[13] & 254) / 2;
                        4294967295 < f && (f -= 8589934592);
                        if (h & 64) {
                          var m =
                            536870912 * (c[14] & 14) +
                            4194304 * (c[15] & 255) +
                            16384 * (c[16] & 254) +
                            128 * (c[17] & 255) +
                            (c[18] & 254) / 2;
                          4294967295 < m && (m -= 8589934592);
                        } else m = f;
                      }
                      c = c[8];
                      h = c + 9;
                      a.size -= h;
                      for (a = new Uint8Array(a.size); d.length; ) {
                        c = d.shift();
                        var g = c.byteLength;
                        if (h)
                          if (h > g) {
                            h -= g;
                            continue;
                          } else (c = c.subarray(h)), (g -= h), (h = 0);
                        a.set(c, b);
                        b += g;
                      }
                      return {
                        data: a,
                        pts: f,
                        dts: m,
                        len: e,
                      };
                    }
                    return null;
                  },
                },
                {
                  key: '_parseAVCPES',
                  value: function (a) {
                    var d = this,
                      e = this._avcTrack,
                      h = e.samples,
                      f = this._parseAVCNALu(a.data),
                      m = [],
                      g = !1,
                      k = 0,
                      r,
                      l,
                      n;
                    if (0 === f.length && 0 < h.length) {
                      var y = h[h.length - 1],
                        x = y.units.units[y.units.units.length - 1],
                        z = new Uint8Array(x.data.byteLength + a.data.byteLength);
                      z.set(x.data, 0);
                      z.set(a.data, x.data.byteLength);
                      x.data = z;
                      y.units.length += a.data.byteLength;
                      e.len += a.data.byteLength;
                    }
                    a.data = null;
                    var D = '';
                    f.forEach(function (b) {
                      switch (b.type) {
                        case 1:
                          l = !0;
                          break;
                        case 5:
                          g = l = !0;
                          break;
                        case 6:
                          l = !0;
                          r = new c.default(b.data);
                          r.readUByte();
                          if (4 === r.readUByte()) {
                            do var h = r.readUByte();
                            while (255 === h);
                            if (
                              181 === r.readUByte() &&
                              49 === r.readUShort() &&
                              1195456820 === r.readUInt() &&
                              3 === r.readUByte()
                            ) {
                              var f = r.readUByte(),
                                q = r.readUByte();
                              h = 31 & f;
                              f = [f, q];
                              for (n = 0; n < h; n++)
                                f.push(r.readUByte()), f.push(r.readUByte()), f.push(r.readUByte());
                              d._txtTrack.samples.push({
                                type: 3,
                                pts: a.pts,
                                bytes: f,
                              });
                            }
                          }
                          break;
                        case 7:
                          l = !0;
                          if (!e.sps) {
                            r = new c.default(b.data);
                            h = r.readSPS();
                            e.width = h.width;
                            e.height = h.height;
                            e.sps = [b.data];
                            e.timescale = d.remuxer.timescale;
                            e.duration = d.remuxer.timescale * d._duration;
                            h = b.data.subarray(1, 4);
                            f = 'avc1.';
                            for (n = 0; 3 > n; n++) (q = h[n].toString(16)), 2 > q.length && (q = '0' + q), (f += q);
                            e.codec = f;
                          }
                          break;
                        case 8:
                          l = !0;
                          e.pps || (e.pps = [b.data]);
                          break;
                        case 9:
                          l = !1;
                          break;
                        default:
                          (l = !1), (D += 'unknown NAL ' + b.type + ' ');
                      }
                      l && (m.push(b), (k += b.data.byteLength));
                    });
                    D.length && b.logger.log(D);
                    m.length &&
                      (!0 === g || e.sps) &&
                      ((f = {
                        units: {
                          units: m,
                          length: k,
                        },
                        pts: a.pts,
                        dts: a.dts,
                        key: g,
                      }),
                      h.push(f),
                      (e.len += k),
                      (e.nbNalu += m.length));
                  },
                },
                {
                  key: '_parseAVCNALu',
                  value: function (a) {
                    var b = 0,
                      d = a.byteLength;
                    var c = 0;
                    for (var e = [], h, f; b < d; ) {
                      var m = a[b++];
                      switch (c) {
                        case 0:
                          0 === m && (c = 1);
                          break;
                        case 1:
                          c = 0 === m ? 2 : 0;
                          break;
                        case 2:
                        case 3:
                          if (0 === m) c = 3;
                          else {
                            if (1 === m && b < d) {
                              m = a[b] & 31;
                              if (h)
                                (c = {
                                  data: a.subarray(h, b - c - 1),
                                  type: f,
                                }),
                                  e.push(c);
                              else if ((c = b - c - 1))
                                if (((h = this._avcTrack), (f = h.samples), f.length)) {
                                  f = f[f.length - 1];
                                  var g = f.units.units;
                                  g = g[g.length - 1];
                                  var k = new Uint8Array(g.data.byteLength + c);
                                  k.set(g.data, 0);
                                  k.set(a.subarray(0, c), g.data.byteLength);
                                  g.data = k;
                                  f.units.length += c;
                                  h.len += c;
                                }
                              h = b;
                              f = m;
                            }
                            c = 0;
                          }
                      }
                    }
                    h &&
                      ((c = {
                        data: a.subarray(h, d),
                        type: f,
                      }),
                      e.push(c));
                    return e;
                  },
                },
                {
                  key: '_parseAACPES',
                  value: function (c) {
                    var h = this._aacTrack,
                      f = c.data;
                    c = c.pts;
                    var m = this._duration,
                      g = this.audioCodec,
                      k = this.aacOverFlow,
                      l = this.lastAacPTS,
                      n;
                    if (k) {
                      var r = new Uint8Array(k.byteLength + f.byteLength);
                      r.set(k, 0);
                      r.set(f, k.byteLength);
                      f = r;
                    }
                    r = 0;
                    for (n = f.length; r < n - 1 && (255 !== f[r] || 240 !== (f[r + 1] & 240)); r++);
                    if (r) {
                      if (r < n - 1) {
                        var w = 'AAC PES did not start with ADTS header,offset:' + r;
                        var A = !1;
                      } else (w = 'no ADTS header found in AAC PES'), (A = !0);
                      this.observer.trigger(d.default.ERROR, {
                        type: a.ErrorTypes.MEDIA_ERROR,
                        details: a.ErrorDetails.FRAG_PARSING_ERROR,
                        fatal: A,
                        reason: w,
                      });
                      if (A) return;
                    }
                    h.audiosamplerate ||
                      ((g = e.default.getAudioConfig(this.observer, f, r, g)),
                      (h.config = g.config),
                      (h.audiosamplerate = g.samplerate),
                      (h.channelCount = g.channelCount),
                      (h.codec = g.codec),
                      (h.timescale = g.samplerate),
                      (h.duration = g.samplerate * m),
                      b.logger.log(
                        'parsed codec:' + h.codec + ',rate:' + g.samplerate + ',nb channel:' + g.channelCount
                      ));
                    g = 0;
                    m = 9216e4 / h.audiosamplerate;
                    k &&
                      l &&
                      ((k = l + m),
                      1 < Math.abs(k - c) &&
                        (b.logger.log('AAC: align PTS for overlapping frames by ' + Math.round((k - c) / 90)),
                        (c = k)));
                    for (; r + 5 < n; )
                      if (
                        ((l = f[r + 1] & 1 ? 7 : 9),
                        (k = ((f[r + 3] & 3) << 11) | (f[r + 4] << 3) | ((f[r + 5] & 224) >>> 5)),
                        (k -= l),
                        0 < k && r + l + k <= n)
                      ) {
                        var y = c + g * m;
                        w = {
                          unit: f.subarray(r + l, r + l + k),
                          pts: y,
                          dts: y,
                        };
                        h.samples.push(w);
                        h.len += k;
                        r += k + l;
                        for (g++; r < n - 1 && (255 !== f[r] || 240 !== (f[r + 1] & 240)); r++);
                      } else break;
                    this.aacOverFlow = k = r < n ? f.subarray(r, n) : null;
                    this.lastAacPTS = y;
                  },
                },
                {
                  key: '_parseID3PES',
                  value: function (a) {
                    this._id3Track.samples.push(a);
                  },
                },
              ],
              [
                {
                  key: 'probe',
                  value: function (a) {
                    return 564 <= a.length && 71 === a[0] && 71 === a[188] && 71 === a[376] ? !0 : !1;
                  },
                },
              ]
            );
            return m;
          })();
          n.default = g;
        },
        {
          '../errors': 19,
          '../events': 21,
          '../utils/logger': 34,
          './adts': 12,
          './exp-golomb': 16,
        },
      ],
      19: [
        function (g, k, n) {
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          n.ErrorTypes = {
            NETWORK_ERROR: 'hlsNetworkError',
            MEDIA_ERROR: 'hlsMediaError',
            OTHER_ERROR: 'hlsOtherError',
          };
          n.ErrorDetails = {
            MANIFEST_LOAD_ERROR: 'manifestLoadError',
            MANIFEST_LOAD_TIMEOUT: 'manifestLoadTimeOut',
            MANIFEST_PARSING_ERROR: 'manifestParsingError',
            LEVEL_LOAD_ERROR: 'levelLoadError',
            LEVEL_LOAD_TIMEOUT: 'levelLoadTimeOut',
            LEVEL_SWITCH_ERROR: 'levelSwitchError',
            FRAG_LOAD_ERROR: 'fragLoadError',
            FRAG_LOOP_LOADING_ERROR: 'fragLoopLoadingError',
            FRAG_LOAD_TIMEOUT: 'fragLoadTimeOut',
            FRAG_DECRYPT_ERROR: 'fragDecryptError',
            FRAG_PARSING_ERROR: 'fragParsingError',
            KEY_LOAD_ERROR: 'keyLoadError',
            KEY_LOAD_TIMEOUT: 'keyLoadTimeOut',
            BUFFER_APPEND_ERROR: 'bufferAppendError',
            BUFFER_APPENDING_ERROR: 'bufferAppendingError',
            BUFFER_STALLED_ERROR: 'bufferStalledError',
            BUFFER_FULL_ERROR: 'bufferFullError',
          };
        },
        {},
      ],
      20: [
        function (g, k, n) {
          var l =
              'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e && 'function' === typeof Symbol && e.constructor === Symbol ? 'symbol' : typeof e;
                  },
            f = (function () {
              function e(d, c) {
                for (var b = 0; b < c.length; b++) {
                  var a = c[b];
                  a.enumerable = a.enumerable || !1;
                  a.configurable = !0;
                  'value' in a && (a.writable = !0);
                  Object.defineProperty(d, a.key, a);
                }
              }
              return function (d, c, b) {
                c && e(d.prototype, c);
                b && e(d, b);
                return d;
              };
            })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          g = (function () {
            function e(d) {
              if (!(this instanceof e)) throw new TypeError('Cannot call a class as a function');
              this.hls = d;
              this.onEvent = this.onEvent.bind(this);
              for (var c = arguments.length, b = Array(1 < c ? c - 1 : 0), a = 1; a < c; a++) b[a - 1] = arguments[a];
              this.handledEvents = b;
              this.useGenericHandler = !0;
              this.registerListeners();
            }
            f(e, [
              {
                key: 'destroy',
                value: function () {
                  this.unregisterListeners();
                },
              },
              {
                key: 'isEventHandler',
                value: function () {
                  return (
                    'object' === l(this.handledEvents) &&
                    this.handledEvents.length &&
                    'function' === typeof this.onEvent
                  );
                },
              },
              {
                key: 'registerListeners',
                value: function () {
                  this.isEventHandler() &&
                    this.handledEvents.forEach(
                      function (d) {
                        if ('hlsEventGeneric' === d) throw Error('Forbidden event name: ' + d);
                        this.hls.on(d, this.onEvent);
                      }.bind(this)
                    );
                },
              },
              {
                key: 'unregisterListeners',
                value: function () {
                  this.isEventHandler() &&
                    this.handledEvents.forEach(
                      function (d) {
                        this.hls.off(d, this.onEvent);
                      }.bind(this)
                    );
                },
              },
              {
                key: 'onEvent',
                value: function (d, c) {
                  this.onEventGeneric(d, c);
                },
              },
              {
                key: 'onEventGeneric',
                value: function (d, c) {
                  var b = 'on' + d.replace('hls', '');
                  if ('function' !== typeof this[b])
                    throw Error(
                      'Event ' +
                        d +
                        ' has no generic handler in this ' +
                        this.constructor.name +
                        ' class (tried ' +
                        b +
                        ')'
                    );
                  this[b].bind(this, c).call();
                },
              },
            ]);
            return e;
          })();
          n.default = g;
        },
        {},
      ],
      21: [
        function (g, k, n) {
          k.exports = {
            MEDIA_ATTACHING: 'hlsMediaAttaching',
            MEDIA_ATTACHED: 'hlsMediaAttached',
            MEDIA_DETACHING: 'hlsMediaDetaching',
            MEDIA_DETACHED: 'hlsMediaDetached',
            BUFFER_RESET: 'hlsBufferReset',
            BUFFER_CODECS: 'hlsBufferCodecs',
            BUFFER_APPENDING: 'hlsBufferAppending',
            BUFFER_APPENDED: 'hlsBufferAppended',
            BUFFER_EOS: 'hlsBufferEos',
            BUFFER_FLUSHING: 'hlsBufferFlushing',
            BUFFER_FLUSHED: 'hlsBufferFlushed',
            MANIFEST_LOADING: 'hlsManifestLoading',
            MANIFEST_LOADED: 'hlsManifestLoaded',
            MANIFEST_PARSED: 'hlsManifestParsed',
            LEVEL_LOADING: 'hlsLevelLoading',
            LEVEL_LOADED: 'hlsLevelLoaded',
            LEVEL_UPDATED: 'hlsLevelUpdated',
            LEVEL_PTS_UPDATED: 'hlsLevelPtsUpdated',
            LEVEL_SWITCH: 'hlsLevelSwitch',
            FRAG_LOADING: 'hlsFragLoading',
            FRAG_LOAD_PROGRESS: 'hlsFragLoadProgress',
            FRAG_LOAD_EMERGENCY_ABORTED: 'hlsFragLoadEmergencyAborted',
            FRAG_LOADED: 'hlsFragLoaded',
            FRAG_PARSING_INIT_SEGMENT: 'hlsFragParsingInitSegment',
            FRAG_PARSING_USERDATA: 'hlsFragParsingUserdata',
            FRAG_PARSING_METADATA: 'hlsFragParsingMetadata',
            FRAG_PARSING_DATA: 'hlsFragParsingData',
            FRAG_PARSED: 'hlsFragParsed',
            FRAG_BUFFERED: 'hlsFragBuffered',
            FRAG_CHANGED: 'hlsFragChanged',
            FPS_DROP: 'hlsFpsDrop',
            ERROR: 'hlsError',
            DESTROYING: 'hlsDestroying',
            KEY_LOADING: 'hlsKeyLoading',
            KEY_LOADED: 'hlsKeyLoaded',
          };
        },
        {},
      ],
      22: [
        function (g, k, n) {
          var l = (function () {
            function e(d, c) {
              for (var b = 0; b < c.length; b++) {
                var a = c[b];
                a.enumerable = a.enumerable || !1;
                a.configurable = !0;
                'value' in a && (a.writable = !0);
                Object.defineProperty(d, a.key, a);
              }
            }
            return function (d, c, b) {
              c && e(d.prototype, c);
              b && e(d, b);
              return d;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f = g('../utils/logger');
          g = (function () {
            function e() {
              if (!(this instanceof e)) throw new TypeError('Cannot call a class as a function');
            }
            l(e, null, [
              {
                key: 'mergeDetails',
                value: function (d, c) {
                  var b = Math.max(d.startSN, c.startSN) - c.startSN,
                    a = Math.min(d.endSN, c.endSN) - c.startSN,
                    m = c.startSN - d.startSN,
                    h = d.fragments,
                    g = c.fragments,
                    k = 0;
                  if (a < b) c.PTSKnown = !1;
                  else {
                    for (; b <= a; b++) {
                      var p = h[m + b],
                        l = g[b];
                      k = p.cc - l.cc;
                      if (!isNaN(p.startPTS)) {
                        l.start = l.startPTS = p.startPTS;
                        l.endPTS = p.endPTS;
                        l.duration = p.duration;
                        var n = l;
                      }
                    }
                    if (k)
                      for (
                        f.logger.log('discontinuity sliding from playlist, take drift into account'), b = 0;
                        b < g.length;
                        b++
                      )
                        g[b].cc += k;
                    if (n) e.updateFragPTS(c, n.sn, n.startPTS, n.endPTS);
                    else for (a = h[m].start, b = 0; b < g.length; b++) g[b].start += a;
                    c.PTSKnown = d.PTSKnown;
                  }
                },
              },
              {
                key: 'updateFragPTS',
                value: function (d, c, b, a) {
                  if (c < d.startSN || c > d.endSN) return 0;
                  c -= d.startSN;
                  var f = d.fragments;
                  var h = f[c];
                  isNaN(h.startPTS) || ((b = Math.min(b, h.startPTS)), (a = Math.max(a, h.endPTS)));
                  var g = b - h.start;
                  h.start = h.startPTS = b;
                  h.endPTS = a;
                  h.duration = a - b;
                  for (b = c; 0 < b; b--) e.updatePTS(f, b, b - 1);
                  for (b = c; b < f.length - 1; b++) e.updatePTS(f, b, b + 1);
                  d.PTSKnown = !0;
                  return g;
                },
              },
              {
                key: 'updatePTS',
                value: function (d, c, b) {
                  var a = d[c];
                  d = d[b];
                  var e = d.startPTS;
                  isNaN(e)
                    ? (d.start = b > c ? a.start + a.duration : a.start - d.duration)
                    : b > c
                    ? ((a.duration = e - a.start),
                      0 > a.duration &&
                        f.logger.error(
                          'negative duration computed for frag ' +
                            a.sn +
                            ',level ' +
                            a.level +
                            ', there should be some duration drift between playlist and fragment!'
                        ))
                    : ((d.duration = a.start - e),
                      0 > d.duration &&
                        f.logger.error(
                          'negative duration computed for frag ' +
                            d.sn +
                            ',level ' +
                            d.level +
                            ', there should be some duration drift between playlist and fragment!'
                        ));
                },
              },
            ]);
            return e;
          })();
          n.default = g;
        },
        {
          '../utils/logger': 34,
        },
      ],
      23: [
        function (g, k, n) {
          function l(a) {
            return a && a.__esModule
              ? a
              : {
                  default: a,
                };
          }
          var f = (function () {
            function a(a, b) {
              for (var d = 0; d < b.length; d++) {
                var c = b[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (b, d, c) {
              d && a(b.prototype, d);
              c && a(b, c);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('./events');
          var e = l(k),
            d = g('./errors');
          k = g('./loader/playlist-loader');
          var c = l(k);
          k = g('./loader/fragment-loader');
          var b = l(k);
          k = g('./controller/abr-controller');
          var a = l(k);
          k = g('./controller/buffer-controller');
          var m = l(k);
          k = g('./controller/stream-controller');
          var h = l(k);
          k = g('./controller/level-controller');
          var q = l(k);
          k = g('./controller/timeline-controller');
          var v = l(k),
            p = g('./utils/logger');
          k = g('./utils/xhr-loader');
          var C = l(k);
          k = g('events');
          var B = l(k);
          g = g('./loader/key-loader');
          var I = l(g);
          g = (function () {
            function g() {
              var a = 0 >= arguments.length || void 0 === arguments[0] ? {} : arguments[0];
              if (!(this instanceof g)) throw new TypeError('Cannot call a class as a function');
              var d = g.DefaultConfig,
                e;
              for (e in d) e in a || (a[e] = d[e]);
              if (void 0 !== a.liveMaxLatencyDurationCount && a.liveMaxLatencyDurationCount <= a.liveSyncDurationCount)
                throw Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be gt "liveSyncDurationCount"');
              (0, p.enableLogs)(a.debug);
              this.config = a;
              var f = (this.observer = new B.default());
              f.trigger = function (a) {
                for (var b = arguments.length, d = Array(1 < b ? b - 1 : 0), c = 1; c < b; c++) d[c - 1] = arguments[c];
                f.emit.apply(f, [a, a].concat(d));
              };
              f.off = function (a) {
                for (var b = arguments.length, d = Array(1 < b ? b - 1 : 0), c = 1; c < b; c++) d[c - 1] = arguments[c];
                f.removeListener.apply(f, [a].concat(d));
              };
              this.on = f.on.bind(f);
              this.off = f.off.bind(f);
              this.trigger = f.trigger.bind(f);
              this.playlistLoader = new c.default(this);
              this.fragmentLoader = new b.default(this);
              this.levelController = new q.default(this);
              this.abrController = new a.abrController(this);
              this.bufferController = new a.bufferController(this);
              this.streamController = new a.streamController(this);
              this.timelineController = new a.timelineController(this);
              this.keyLoader = new I.default(this);
            }
            f(g, null, [
              {
                key: 'isSupported',
                value: function () {
                  return (
                    window.MediaSource &&
                    window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
                  );
                },
              },
              {
                key: 'Events',
                get: function () {
                  return e.default;
                },
              },
              {
                key: 'ErrorTypes',
                get: function () {
                  return d.ErrorTypes;
                },
              },
              {
                key: 'ErrorDetails',
                get: function () {
                  return d.ErrorDetails;
                },
              },
              {
                key: 'DefaultConfig',
                get: function () {
                  g.defaultConfig ||
                    (g.defaultConfig = {
                      autoStartLoad: !0,
                      debug: !1,
                      maxBufferLength: 30,
                      maxBufferSize: 6e7,
                      maxBufferHole: 0.5,
                      maxSeekHole: 2,
                      liveSyncDurationCount: 3,
                      liveMaxLatencyDurationCount: Infinity,
                      maxMaxBufferLength: 600,
                      enableWorker: !0,
                      enableSoftwareAES: !0,
                      manifestLoadingTimeOut: 1e4,
                      manifestLoadingMaxRetry: 1,
                      manifestLoadingRetryDelay: 1e3,
                      levelLoadingTimeOut: 1e4,
                      levelLoadingMaxRetry: 4,
                      levelLoadingRetryDelay: 1e3,
                      fragLoadingTimeOut: 2e4,
                      fragLoadingMaxRetry: 6,
                      fragLoadingRetryDelay: 1e3,
                      fragLoadingLoopThreshold: 3,
                      startFragPrefetch: !1,
                      appendErrorMaxRetry: 3,
                      loader: C.default,
                      fLoader: void 0,
                      pLoader: void 0,
                      abrController: a.default,
                      bufferController: m.default,
                      streamController: h.default,
                      timelineController: v.default,
                      enableCEA708Captions: !0,
                      enableMP2TPassThrough: !1,
                    });
                  return g.defaultConfig;
                },
                set: function (a) {
                  g.defaultConfig = a;
                },
              },
            ]);
            f(g, [
              {
                key: 'destroy',
                value: function () {
                  p.logger.log('destroy');
                  this.trigger(e.default.DESTROYING);
                  this.detachMedia();
                  this.playlistLoader.destroy();
                  this.fragmentLoader.destroy();
                  this.levelController.destroy();
                  this.bufferController.destroy();
                  this.streamController.destroy();
                  this.timelineController.destroy();
                  this.keyLoader.destroy();
                  this.url = null;
                  this.observer.removeAllListeners();
                },
              },
              {
                key: 'attachMedia',
                value: function (a) {
                  p.logger.log('attachMedia');
                  this.media = a;
                  this.trigger(e.default.MEDIA_ATTACHING, {
                    media: a,
                  });
                },
              },
              {
                key: 'detachMedia',
                value: function () {
                  p.logger.log('detachMedia');
                  this.trigger(e.default.MEDIA_DETACHING);
                  this.media = null;
                },
              },
              {
                key: 'loadSource',
                value: function (a) {
                  p.logger.log('loadSource:' + a);
                  this.url = a;
                  this.trigger(e.default.MANIFEST_LOADING, {
                    url: a,
                  });
                },
              },
              {
                key: 'startLoad',
                value: function () {
                  p.logger.log('startLoad');
                  this.streamController.startLoad();
                },
              },
              {
                key: 'swapAudioCodec',
                value: function () {
                  p.logger.log('swapAudioCodec');
                  this.streamController.swapAudioCodec();
                },
              },
              {
                key: 'recoverMediaError',
                value: function () {
                  p.logger.log('recoverMediaError');
                  var a = this.media;
                  this.detachMedia();
                  this.attachMedia(a);
                },
              },
              {
                key: 'levels',
                get: function () {
                  return this.levelController.levels;
                },
              },
              {
                key: 'currentLevel',
                get: function () {
                  return this.streamController.currentLevel;
                },
                set: function (a) {
                  p.logger.log('set currentLevel:' + a);
                  this.loadLevel = a;
                  this.streamController.immediateLevelSwitch();
                },
              },
              {
                key: 'nextLevel',
                get: function () {
                  return this.streamController.nextLevel;
                },
                set: function (a) {
                  p.logger.log('set nextLevel:' + a);
                  this.levelController.manualLevel = a;
                  this.streamController.nextLevelSwitch();
                },
              },
              {
                key: 'loadLevel',
                get: function () {
                  return this.levelController.level;
                },
                set: function (a) {
                  p.logger.log('set loadLevel:' + a);
                  this.levelController.manualLevel = a;
                },
              },
              {
                key: 'nextLoadLevel',
                get: function () {
                  return this.levelController.nextLoadLevel();
                },
                set: function (a) {
                  this.levelController.level = a;
                },
              },
              {
                key: 'firstLevel',
                get: function () {
                  return this.levelController.firstLevel;
                },
                set: function (a) {
                  p.logger.log('set firstLevel:' + a);
                  this.levelController.firstLevel = a;
                },
              },
              {
                key: 'startLevel',
                get: function () {
                  return this.levelController.startLevel;
                },
                set: function (a) {
                  p.logger.log('set startLevel:' + a);
                  this.levelController.startLevel = a;
                },
              },
              {
                key: 'autoLevelCapping',
                get: function () {
                  return this.abrController.autoLevelCapping;
                },
                set: function (a) {
                  p.logger.log('set autoLevelCapping:' + a);
                  this.abrController.autoLevelCapping = a;
                },
              },
              {
                key: 'autoLevelEnabled',
                get: function () {
                  return -1 === this.levelController.manualLevel;
                },
              },
              {
                key: 'manualLevel',
                get: function () {
                  return this.levelController.manualLevel;
                },
              },
            ]);
            return g;
          })();
          n.default = g;
        },
        {
          './controller/abr-controller': 3,
          './controller/buffer-controller': 4,
          './controller/level-controller': 5,
          './controller/stream-controller': 6,
          './controller/timeline-controller': 7,
          './errors': 19,
          './events': 21,
          './loader/fragment-loader': 25,
          './loader/key-loader': 26,
          './loader/playlist-loader': 27,
          './utils/logger': 34,
          './utils/xhr-loader': 36,
          events: 1,
        },
      ],
      24: [
        function (g, k, n) {
          k.exports = g('./hls.js').default;
        },
        {
          './hls.js': 23,
        },
      ],
      25: [
        function (g, k, n) {
          function l(b, a) {
            if ('function' !== typeof a && null !== a)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof a);
            b.prototype = Object.create(a && a.prototype, {
              constructor: {
                value: b,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            a && (Object.setPrototypeOf ? Object.setPrototypeOf(b, a) : (b.__proto__ = a));
          }
          var f = (function () {
            function b(a, b) {
              for (var d = 0; d < b.length; d++) {
                var c = b[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (a, d, c) {
              d && b(a.prototype, d);
              c && b(a, c);
              return a;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var e =
              (k = g('../events')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            d =
              (k = g('../event-handler')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            c = g('../errors');
          g = (function (b) {
            function a(b) {
              if (!(this instanceof a)) throw new TypeError('Cannot call a class as a function');
              b = Object.getPrototypeOf(a).call(this, b, e.default.FRAG_LOADING);
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return !b || ('object' !== typeof b && 'function' !== typeof b) ? this : b;
            }
            l(a, b);
            f(a, [
              {
                key: 'destroy',
                value: function () {
                  this.loader && (this.loader.destroy(), (this.loader = null));
                  d.default.prototype.destroy.call(this);
                },
              },
              {
                key: 'onFragLoading',
                value: function (a) {
                  this.frag = a = a.frag;
                  this.frag.loaded = 0;
                  var b = this.hls.config;
                  a.loader = this.loader = 'undefined' !== typeof b.fLoader ? new b.fLoader(b) : new b.loader(b);
                  this.loader.load(
                    a.url,
                    'arraybuffer',
                    this.loadsuccess.bind(this),
                    this.loaderror.bind(this),
                    this.loadtimeout.bind(this),
                    b.fragLoadingTimeOut,
                    1,
                    0,
                    this.loadprogress.bind(this),
                    a
                  );
                },
              },
              {
                key: 'loadsuccess',
                value: function (a, b) {
                  a = a.currentTarget.response;
                  b.length = a.byteLength;
                  this.frag.loader = void 0;
                  this.hls.trigger(e.default.FRAG_LOADED, {
                    payload: a,
                    frag: this.frag,
                    stats: b,
                  });
                },
              },
              {
                key: 'loaderror',
                value: function (a) {
                  this.loader.abort();
                  this.hls.trigger(e.default.ERROR, {
                    type: c.ErrorTypes.NETWORK_ERROR,
                    details: c.ErrorDetails.FRAG_LOAD_ERROR,
                    fatal: !1,
                    frag: this.frag,
                    response: a,
                  });
                },
              },
              {
                key: 'loadtimeout',
                value: function () {
                  this.loader.abort();
                  this.hls.trigger(e.default.ERROR, {
                    type: c.ErrorTypes.NETWORK_ERROR,
                    details: c.ErrorDetails.FRAG_LOAD_TIMEOUT,
                    fatal: !1,
                    frag: this.frag,
                  });
                },
              },
              {
                key: 'loadprogress',
                value: function (a, b) {
                  this.frag.loaded = b.loaded;
                  this.hls.trigger(e.default.FRAG_LOAD_PROGRESS, {
                    frag: this.frag,
                    stats: b,
                  });
                },
              },
            ]);
            return a;
          })(d.default);
          n.default = g;
        },
        {
          '../errors': 19,
          '../event-handler': 20,
          '../events': 21,
        },
      ],
      26: [
        function (g, k, n) {
          function l(b, a) {
            if ('function' !== typeof a && null !== a)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof a);
            b.prototype = Object.create(a && a.prototype, {
              constructor: {
                value: b,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            a && (Object.setPrototypeOf ? Object.setPrototypeOf(b, a) : (b.__proto__ = a));
          }
          var f = (function () {
            function b(a, b) {
              for (var d = 0; d < b.length; d++) {
                var c = b[d];
                c.enumerable = c.enumerable || !1;
                c.configurable = !0;
                'value' in c && (c.writable = !0);
                Object.defineProperty(a, c.key, c);
              }
            }
            return function (a, c, d) {
              c && b(a.prototype, c);
              d && b(a, d);
              return a;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var e =
              (k = g('../events')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            d =
              (k = g('../event-handler')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            c = g('../errors');
          g = (function (b) {
            function a(b) {
              if (!(this instanceof a)) throw new TypeError('Cannot call a class as a function');
              b = Object.getPrototypeOf(a).call(this, b, e.default.KEY_LOADING);
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              b = !b || ('object' !== typeof b && 'function' !== typeof b) ? this : b;
              b.decryptkey = null;
              b.decrypturl = null;
              return b;
            }
            l(a, b);
            f(a, [
              {
                key: 'destroy',
                value: function () {
                  this.loader && (this.loader.destroy(), (this.loader = null));
                  d.default.prototype.destroy.call(this);
                },
              },
              {
                key: 'onKeyLoading',
                value: function (a) {
                  a = this.frag = a.frag;
                  var b = a.decryptdata,
                    c = b.uri;
                  c !== this.decrypturl || null === this.decryptkey
                    ? ((b = this.hls.config),
                      (a.loader = this.loader = new b.loader(b)),
                      (this.decrypturl = c),
                      (this.decryptkey = null),
                      a.loader.load(
                        c,
                        'arraybuffer',
                        this.loadsuccess.bind(this),
                        this.loaderror.bind(this),
                        this.loadtimeout.bind(this),
                        b.fragLoadingTimeOut,
                        b.fragLoadingMaxRetry,
                        b.fragLoadingRetryDelay,
                        this.loadprogress.bind(this),
                        a
                      ))
                    : this.decryptkey &&
                      ((b.key = this.decryptkey),
                      this.hls.trigger(e.default.KEY_LOADED, {
                        frag: a,
                      }));
                },
              },
              {
                key: 'loadsuccess',
                value: function (a) {
                  var b = this.frag;
                  this.decryptkey = b.decryptdata.key = new Uint8Array(a.currentTarget.response);
                  b.loader = void 0;
                  this.hls.trigger(e.default.KEY_LOADED, {
                    frag: b,
                  });
                },
              },
              {
                key: 'loaderror',
                value: function (a) {
                  this.loader.abort();
                  this.hls.trigger(e.default.ERROR, {
                    type: c.ErrorTypes.NETWORK_ERROR,
                    details: c.ErrorDetails.KEY_LOAD_ERROR,
                    fatal: !1,
                    frag: this.frag,
                    response: a,
                  });
                },
              },
              {
                key: 'loadtimeout',
                value: function () {
                  this.loader.abort();
                  this.hls.trigger(e.default.ERROR, {
                    type: c.ErrorTypes.NETWORK_ERROR,
                    details: c.ErrorDetails.KEY_LOAD_TIMEOUT,
                    fatal: !1,
                    frag: this.frag,
                  });
                },
              },
              {
                key: 'loadprogress',
                value: function () {},
              },
            ]);
            return a;
          })(d.default);
          n.default = g;
        },
        {
          '../errors': 19,
          '../event-handler': 20,
          '../events': 21,
        },
      ],
      27: [
        function (g, k, n) {
          function l(a) {
            return a && a.__esModule
              ? a
              : {
                  default: a,
                };
          }
          function f(a, b) {
            if ('function' !== typeof b && null !== b)
              throw new TypeError('Super expression must either be null or a function, not ' + typeof b);
            a.prototype = Object.create(b && b.prototype, {
              constructor: {
                value: a,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
            b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : (a.__proto__ = b));
          }
          var e = (function () {
            function a(a, b) {
              for (var c = 0; c < b.length; c++) {
                var d = b[c];
                d.enumerable = d.enumerable || !1;
                d.configurable = !0;
                'value' in d && (d.writable = !0);
                Object.defineProperty(a, d.key, d);
              }
            }
            return function (b, c, d) {
              c && a(b.prototype, c);
              d && a(b, d);
              return b;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          k = g('../events');
          var d = l(k);
          k = g('../event-handler');
          var c = l(k),
            b = g('../errors');
          k = g('../utils/url');
          var a = l(k);
          g = g('../utils/attr-list');
          var m = l(g);
          g = (function (g) {
            function h(a) {
              if (!(this instanceof h)) throw new TypeError('Cannot call a class as a function');
              a = Object.getPrototypeOf(h).call(this, a, d.default.MANIFEST_LOADING, d.default.LEVEL_LOADING);
              if (!this) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return !a || ('object' !== typeof a && 'function' !== typeof a) ? this : a;
            }
            f(h, g);
            e(h, [
              {
                key: 'destroy',
                value: function () {
                  this.loader && (this.loader.destroy(), (this.loader = null));
                  this.url = this.id = null;
                  c.default.prototype.destroy.call(this);
                },
              },
              {
                key: 'onManifestLoading',
                value: function (a) {
                  this.load(a.url, null);
                },
              },
              {
                key: 'onLevelLoading',
                value: function (a) {
                  this.load(a.url, a.level, a.id);
                },
              },
              {
                key: 'load',
                value: function (a, b, c) {
                  var d = this.hls.config;
                  this.url = a;
                  this.id = b;
                  this.id2 = c;
                  if (void 0 === this.id) {
                    b = d.manifestLoadingMaxRetry;
                    c = d.manifestLoadingTimeOut;
                    var e = d.manifestLoadingRetryDelay;
                  } else (b = d.levelLoadingMaxRetry), (c = d.levelLoadingTimeOut), (e = d.levelLoadingRetryDelay);
                  this.loader = 'undefined' !== typeof d.pLoader ? new d.pLoader(d) : new d.loader(d);
                  this.loader.load(
                    a,
                    '',
                    this.loadsuccess.bind(this),
                    this.loaderror.bind(this),
                    this.loadtimeout.bind(this),
                    c,
                    b,
                    e
                  );
                },
              },
              {
                key: 'resolve',
                value: function (b, d) {
                  return a.default.buildAbsoluteURL(d, b);
                },
              },
              {
                key: 'parseMasterPlaylist',
                value: function (a, b) {
                  for (var d = [], c, e = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g; null != (c = e.exec(a)); ) {
                    var f = {},
                      g = (f.attrs = new m.default(c[1]));
                    f.url = this.resolve(c[2], b);
                    if ((c = g.decimalResolution('RESOLUTION'))) (f.width = c.width), (f.height = c.height);
                    f.bitrate = g.decimalInteger('BANDWIDTH');
                    f.name = g.NAME;
                    if ((g = g.CODECS))
                      for (g = g.split(','), c = 0; c < g.length; c++) {
                        var h = g[c];
                        -1 !== h.indexOf('avc1') ? (f.videoCodec = this.avc1toavcoti(h)) : (f.audioCodec = h);
                      }
                    d.push(f);
                  }
                  return d;
                },
              },
              {
                key: 'avc1toavcoti',
                value: function (a) {
                  var b = a.split('.');
                  2 < b.length &&
                    ((a = b.shift() + '.'),
                    (a += parseInt(b.shift()).toString(16)),
                    (a += ('000' + parseInt(b.shift()).toString(16)).substr(-4)));
                  return a;
                },
              },
              {
                key: 'cloneObj',
                value: function (a) {
                  return JSON.parse(JSON.stringify(a));
                },
              },
              {
                key: 'parseLevelPlaylist',
                value: function (a, b, c) {
                  var d = 0,
                    e = 0,
                    f = {
                      url: b,
                      fragments: [],
                      live: !0,
                      startSN: 0,
                    },
                    g = {
                      method: null,
                      key: null,
                      iv: null,
                      uri: null,
                    },
                    h = 0,
                    k = null,
                    l = null,
                    p,
                    q;
                  for (
                    q =
                      /(?:#EXT-X-(MEDIA-SEQUENCE):(\d+))|(?:#EXT-X-(TARGETDURATION):(\d+))|(?:#EXT-X-(KEY):(.*))|(?:#EXT(INF):([\d\.]+)[^\r\n]*([\r\n]+[^#|\r\n]+)?)|(?:#EXT-X-(BYTERANGE):([\d]+[@[\d]*)]*[\r\n]+([^#|\r\n]+)?|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(PROGRAM-DATE-TIME):(.*))/g;
                    null !== (p = q.exec(a));

                  )
                    switch (
                      (p.shift(),
                      (p = p.filter(function (a) {
                        return void 0 !== a;
                      })),
                      p[0])
                    ) {
                      case 'MEDIA-SEQUENCE':
                        d = f.startSN = parseInt(p[1]);
                        break;
                      case 'TARGETDURATION':
                        f.targetduration = parseFloat(p[1]);
                        break;
                      case 'ENDLIST':
                        f.live = !1;
                        break;
                      case 'DIS':
                        h++;
                        break;
                      case 'BYTERANGE':
                        var n = p[1].split('@');
                        var v = 1 === n.length ? C : parseInt(n[1]);
                        var C = parseInt(n[0]) + v;
                        l &&
                          !l.url &&
                          ((l.byteRangeStartOffset = v), (l.byteRangeEndOffset = C), (l.url = this.resolve(p[2], b)));
                        break;
                      case 'INF':
                        n = parseFloat(p[1]);
                        if (!isNaN(n)) {
                          var E = d++;
                          if (g.method && g.uri && !g.iv) {
                            l = this.cloneObj(g);
                            for (var H = new Uint8Array(16), F = 12; 16 > F; F++) H[F] = (E >> (8 * (15 - F))) & 255;
                            l.iv = H;
                          } else l = g;
                          l = {
                            url: p[2] ? this.resolve(p[2], b) : null,
                            duration: n,
                            start: e,
                            sn: E,
                            level: c,
                            cc: h,
                            byteRangeStartOffset: v,
                            byteRangeEndOffset: C,
                            decryptdata: l,
                            programDateTime: k,
                          };
                          f.fragments.push(l);
                          e += n;
                          k = v = null;
                        }
                        break;
                      case 'KEY':
                        E = new m.default(p[1]);
                        p = E.enumeratedString('METHOD');
                        n = E.URI;
                        E = E.hexadecimalInteger('IV');
                        p &&
                          ((g = {
                            method: null,
                            key: null,
                            iv: null,
                            uri: null,
                          }),
                          n &&
                            'AES-128' === p &&
                            ((g.method = p), (g.uri = this.resolve(n, b)), (g.key = null), (g.iv = E)));
                        break;
                      case 'PROGRAM-DATE-TIME':
                        k = new Date(Date.parse(p[1]));
                    }
                  l && !l.url && (f.fragments.pop(), (e -= l.duration));
                  f.totalduration = e;
                  f.endSN = d - 1;
                  return f;
                },
              },
              {
                key: 'loadsuccess',
                value: function (a, c) {
                  var e = a.currentTarget,
                    f = e.responseText,
                    g = e.responseURL,
                    h = this.id,
                    m = this.id2;
                  a = this.hls;
                  void 0 === g && (g = this.url);
                  c.tload = performance.now();
                  c.mtime = new Date(e.getResponseHeader('Last-Modified'));
                  0 === f.indexOf('#EXTM3U')
                    ? 0 < f.indexOf('#EXTINF:')
                      ? null === this.id
                        ? a.trigger(d.default.MANIFEST_LOADED, {
                            levels: [
                              {
                                url: g,
                              },
                            ],
                            url: g,
                            stats: c,
                          })
                        : ((g = this.parseLevelPlaylist(f, g, h)),
                          (c.tparsed = performance.now()),
                          a.trigger(d.default.LEVEL_LOADED, {
                            details: g,
                            level: h,
                            id: m,
                            stats: c,
                          }))
                      : ((h = this.parseMasterPlaylist(f, g)),
                        h.length
                          ? a.trigger(d.default.MANIFEST_LOADED, {
                              levels: h,
                              url: g,
                              stats: c,
                            })
                          : a.trigger(d.default.ERROR, {
                              type: b.ErrorTypes.NETWORK_ERROR,
                              details: b.ErrorDetails.MANIFEST_PARSING_ERROR,
                              fatal: !0,
                              url: g,
                              reason: 'no level found in manifest',
                            }))
                    : a.trigger(d.default.ERROR, {
                        type: b.ErrorTypes.NETWORK_ERROR,
                        details: b.ErrorDetails.MANIFEST_PARSING_ERROR,
                        fatal: !0,
                        url: g,
                        reason: 'no EXTM3U delimiter',
                      });
                },
              },
              {
                key: 'loaderror',
                value: function (a) {
                  if (null === this.id) {
                    var c = b.ErrorDetails.MANIFEST_LOAD_ERROR;
                    var e = !0;
                  } else (c = b.ErrorDetails.LEVEL_LOAD_ERROR), (e = !1);
                  this.loader.abort();
                  this.hls.trigger(d.default.ERROR, {
                    type: b.ErrorTypes.NETWORK_ERROR,
                    details: c,
                    fatal: e,
                    url: this.url,
                    loader: this.loader,
                    response: a.currentTarget,
                    level: this.id,
                    id: this.id2,
                  });
                },
              },
              {
                key: 'loadtimeout',
                value: function () {
                  if (null === this.id) {
                    var a = b.ErrorDetails.MANIFEST_LOAD_TIMEOUT;
                    var c = !0;
                  } else (a = b.ErrorDetails.LEVEL_LOAD_TIMEOUT), (c = !1);
                  this.loader.abort();
                  this.hls.trigger(d.default.ERROR, {
                    type: b.ErrorTypes.NETWORK_ERROR,
                    details: a,
                    fatal: c,
                    url: this.url,
                    loader: this.loader,
                    level: this.id,
                    id: this.id2,
                  });
                },
              },
            ]);
            return h;
          })(c.default);
          n.default = g;
        },
        {
          '../errors': 19,
          '../event-handler': 20,
          '../events': 21,
          '../utils/attr-list': 31,
          '../utils/url': 35,
        },
      ],
      28: [
        function (g, k, n) {
          var l = (function () {
            function f(e, d) {
              for (var c = 0; c < d.length; c++) {
                var b = d[c];
                b.enumerable = b.enumerable || !1;
                b.configurable = !0;
                'value' in b && (b.writable = !0);
                Object.defineProperty(e, b.key, b);
              }
            }
            return function (e, d, c) {
              d && f(e.prototype, d);
              c && f(e, c);
              return e;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          g = (function () {
            function f() {
              if (!(this instanceof f)) throw new TypeError('Cannot call a class as a function');
            }
            l(f, null, [
              {
                key: 'init',
                value: function () {
                  f.types = {
                    avc1: [],
                    avcC: [],
                    btrt: [],
                    dinf: [],
                    dref: [],
                    esds: [],
                    ftyp: [],
                    hdlr: [],
                    mdat: [],
                    mdhd: [],
                    mdia: [],
                    mfhd: [],
                    minf: [],
                    moof: [],
                    moov: [],
                    mp4a: [],
                    mvex: [],
                    mvhd: [],
                    sdtp: [],
                    stbl: [],
                    stco: [],
                    stsc: [],
                    stsd: [],
                    stsz: [],
                    stts: [],
                    tfdt: [],
                    tfhd: [],
                    traf: [],
                    trak: [],
                    trun: [],
                    trex: [],
                    tkhd: [],
                    vmhd: [],
                    smhd: [],
                  };
                  for (var e in f.types)
                    f.types.hasOwnProperty(e) &&
                      (f.types[e] = [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)]);
                  e = new Uint8Array([
                    0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101,
                    111, 72, 97, 110, 100, 108, 101, 114, 0,
                  ]);
                  var d = new Uint8Array([
                    0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110,
                    100, 72, 97, 110, 100, 108, 101, 114, 0,
                  ]);
                  f.HDLR_TYPES = {
                    video: e,
                    audio: d,
                  };
                  e = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1]);
                  d = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
                  f.STTS = f.STSC = f.STCO = d;
                  f.STSZ = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                  f.VMHD = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
                  f.SMHD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
                  f.STSD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);
                  d = new Uint8Array([105, 115, 111, 109]);
                  var c = new Uint8Array([97, 118, 99, 49]),
                    b = new Uint8Array([0, 0, 0, 1]);
                  f.FTYP = f.box(f.types.ftyp, d, b, d, c);
                  f.DINF = f.box(f.types.dinf, f.box(f.types.dref, e));
                },
              },
              {
                key: 'box',
                value: function (e) {
                  for (var d = Array.prototype.slice.call(arguments, 1), c = 8, b = d.length, a = b, f; b--; )
                    c += d[b].byteLength;
                  f = new Uint8Array(c);
                  f[0] = (c >> 24) & 255;
                  f[1] = (c >> 16) & 255;
                  f[2] = (c >> 8) & 255;
                  f[3] = c & 255;
                  f.set(e, 4);
                  b = 0;
                  for (c = 8; b < a; b++) f.set(d[b], c), (c += d[b].byteLength);
                  return f;
                },
              },
              {
                key: 'hdlr',
                value: function (e) {
                  return f.box(f.types.hdlr, f.HDLR_TYPES[e]);
                },
              },
              {
                key: 'mdat',
                value: function (e) {
                  return f.box(f.types.mdat, e);
                },
              },
              {
                key: 'mdhd',
                value: function (e, d) {
                  return f.box(
                    f.types.mdhd,
                    new Uint8Array([
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      2,
                      0,
                      0,
                      0,
                      3,
                      (e >> 24) & 255,
                      (e >> 16) & 255,
                      (e >> 8) & 255,
                      e & 255,
                      d >> 24,
                      (d >> 16) & 255,
                      (d >> 8) & 255,
                      d & 255,
                      85,
                      196,
                      0,
                      0,
                    ])
                  );
                },
              },
              {
                key: 'mdia',
                value: function (e) {
                  return f.box(f.types.mdia, f.mdhd(e.timescale, e.duration), f.hdlr(e.type), f.minf(e));
                },
              },
              {
                key: 'mfhd',
                value: function (e) {
                  return f.box(
                    f.types.mfhd,
                    new Uint8Array([0, 0, 0, 0, e >> 24, (e >> 16) & 255, (e >> 8) & 255, e & 255])
                  );
                },
              },
              {
                key: 'minf',
                value: function (e) {
                  return 'audio' === e.type
                    ? f.box(f.types.minf, f.box(f.types.smhd, f.SMHD), f.DINF, f.stbl(e))
                    : f.box(f.types.minf, f.box(f.types.vmhd, f.VMHD), f.DINF, f.stbl(e));
                },
              },
              {
                key: 'moof',
                value: function (e, d, c) {
                  return f.box(f.types.moof, f.mfhd(e), f.traf(c, d));
                },
              },
              {
                key: 'moov',
                value: function (e) {
                  for (var d = e.length, c = []; d--; ) c[d] = f.trak(e[d]);
                  return f.box.apply(
                    null,
                    [f.types.moov, f.mvhd(e[0].timescale, e[0].duration)].concat(c).concat(f.mvex(e))
                  );
                },
              },
              {
                key: 'mvex',
                value: function (e) {
                  for (var d = e.length, c = []; d--; ) c[d] = f.trex(e[d]);
                  return f.box.apply(null, [f.types.mvex].concat(c));
                },
              },
              {
                key: 'mvhd',
                value: function (e, d) {
                  e = new Uint8Array([
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    2,
                    (e >> 24) & 255,
                    (e >> 16) & 255,
                    (e >> 8) & 255,
                    e & 255,
                    (d >> 24) & 255,
                    (d >> 16) & 255,
                    (d >> 8) & 255,
                    d & 255,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    64,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    255,
                    255,
                    255,
                    255,
                  ]);
                  return f.box(f.types.mvhd, e);
                },
              },
              {
                key: 'sdtp',
                value: function (e) {
                  e = e.samples || [];
                  var d = new Uint8Array(4 + e.length),
                    c;
                  for (c = 0; c < e.length; c++) {
                    var b = e[c].flags;
                    d[c + 4] = (b.dependsOn << 4) | (b.isDependedOn << 2) | b.hasRedundancy;
                  }
                  return f.box(f.types.sdtp, d);
                },
              },
              {
                key: 'stbl',
                value: function (e) {
                  return f.box(
                    f.types.stbl,
                    f.stsd(e),
                    f.box(f.types.stts, f.STTS),
                    f.box(f.types.stsc, f.STSC),
                    f.box(f.types.stsz, f.STSZ),
                    f.box(f.types.stco, f.STCO)
                  );
                },
              },
              {
                key: 'avc1',
                value: function (e) {
                  var d = [],
                    c = [],
                    b;
                  for (b = 0; b < e.sps.length; b++) {
                    var a = e.sps[b];
                    var g = a.byteLength;
                    d.push((g >>> 8) & 255);
                    d.push(g & 255);
                    d = d.concat(Array.prototype.slice.call(a));
                  }
                  for (b = 0; b < e.pps.length; b++)
                    (a = e.pps[b]),
                      (g = a.byteLength),
                      c.push((g >>> 8) & 255),
                      c.push(g & 255),
                      (c = c.concat(Array.prototype.slice.call(a)));
                  d = f.box(
                    f.types.avcC,
                    new Uint8Array(
                      [1, d[3], d[4], d[5], 255, 224 | e.sps.length].concat(d).concat([e.pps.length]).concat(c)
                    )
                  );
                  c = e.width;
                  e = e.height;
                  return f.box(
                    f.types.avc1,
                    new Uint8Array([
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      (c >> 8) & 255,
                      c & 255,
                      (e >> 8) & 255,
                      e & 255,
                      0,
                      72,
                      0,
                      0,
                      0,
                      72,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      18,
                      100,
                      97,
                      105,
                      108,
                      121,
                      109,
                      111,
                      116,
                      105,
                      111,
                      110,
                      47,
                      104,
                      108,
                      115,
                      46,
                      106,
                      115,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      24,
                      17,
                      17,
                    ]),
                    d,
                    f.box(f.types.btrt, new Uint8Array([0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192]))
                  );
                },
              },
              {
                key: 'esds',
                value: function (e) {
                  var d = e.config.length;
                  return new Uint8Array(
                    [0, 0, 0, 0, 3, 23 + d, 0, 1, 0, 4, 15 + d, 64, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5]
                      .concat([d])
                      .concat(e.config)
                      .concat([6, 1, 2])
                  );
                },
              },
              {
                key: 'mp4a',
                value: function (e) {
                  var d = e.audiosamplerate;
                  return f.box(
                    f.types.mp4a,
                    new Uint8Array([
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      e.channelCount,
                      0,
                      16,
                      0,
                      0,
                      0,
                      0,
                      (d >> 8) & 255,
                      d & 255,
                      0,
                      0,
                    ]),
                    f.box(f.types.esds, f.esds(e))
                  );
                },
              },
              {
                key: 'stsd',
                value: function (e) {
                  return 'audio' === e.type
                    ? f.box(f.types.stsd, f.STSD, f.mp4a(e))
                    : f.box(f.types.stsd, f.STSD, f.avc1(e));
                },
              },
              {
                key: 'tkhd',
                value: function (e) {
                  var d = e.id,
                    c = e.duration,
                    b = e.width;
                  e = e.height;
                  return f.box(
                    f.types.tkhd,
                    new Uint8Array([
                      0,
                      0,
                      0,
                      7,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      (d >> 24) & 255,
                      (d >> 16) & 255,
                      (d >> 8) & 255,
                      d & 255,
                      0,
                      0,
                      0,
                      0,
                      c >> 24,
                      (c >> 16) & 255,
                      (c >> 8) & 255,
                      c & 255,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      64,
                      0,
                      0,
                      0,
                      (b >> 8) & 255,
                      b & 255,
                      0,
                      0,
                      (e >> 8) & 255,
                      e & 255,
                      0,
                      0,
                    ])
                  );
                },
              },
              {
                key: 'traf',
                value: function (e, d) {
                  var c = f.sdtp(e),
                    b = e.id;
                  return f.box(
                    f.types.traf,
                    f.box(
                      f.types.tfhd,
                      new Uint8Array([0, 0, 0, 0, b >> 24, (b >> 16) & 255, (b >> 8) & 255, b & 255])
                    ),
                    f.box(
                      f.types.tfdt,
                      new Uint8Array([0, 0, 0, 0, d >> 24, (d >> 16) & 255, (d >> 8) & 255, d & 255])
                    ),
                    f.trun(e, c.length + 16 + 16 + 8 + 16 + 8 + 8),
                    c
                  );
                },
              },
              {
                key: 'trak',
                value: function (e) {
                  e.duration = e.duration || 4294967295;
                  return f.box(f.types.trak, f.tkhd(e), f.mdia(e));
                },
              },
              {
                key: 'trex',
                value: function (e) {
                  e = e.id;
                  return f.box(
                    f.types.trex,
                    new Uint8Array([
                      0,
                      0,
                      0,
                      0,
                      e >> 24,
                      (e >> 16) & 255,
                      (e >> 8) & 255,
                      e & 255,
                      0,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                      1,
                    ])
                  );
                },
              },
              {
                key: 'trun',
                value: function (e, d) {
                  e = e.samples || [];
                  var c = e.length,
                    b = 12 + 16 * c,
                    a = new Uint8Array(b);
                  d += 8 + b;
                  a.set(
                    [
                      0,
                      0,
                      15,
                      1,
                      (c >>> 24) & 255,
                      (c >>> 16) & 255,
                      (c >>> 8) & 255,
                      c & 255,
                      (d >>> 24) & 255,
                      (d >>> 16) & 255,
                      (d >>> 8) & 255,
                      d & 255,
                    ],
                    0
                  );
                  for (d = 0; d < c; d++) {
                    var g = e[d];
                    b = g.duration;
                    var h = g.size;
                    var k = g.flags;
                    g = g.cts;
                    a.set(
                      [
                        (b >>> 24) & 255,
                        (b >>> 16) & 255,
                        (b >>> 8) & 255,
                        b & 255,
                        (h >>> 24) & 255,
                        (h >>> 16) & 255,
                        (h >>> 8) & 255,
                        h & 255,
                        (k.isLeading << 2) | k.dependsOn,
                        (k.isDependedOn << 6) | (k.hasRedundancy << 4) | (k.paddingValue << 1) | k.isNonSync,
                        k.degradPrio & 61440,
                        k.degradPrio & 15,
                        (g >>> 24) & 255,
                        (g >>> 16) & 255,
                        (g >>> 8) & 255,
                        g & 255,
                      ],
                      12 + 16 * d
                    );
                  }
                  return f.box(f.types.trun, a);
                },
              },
              {
                key: 'initSegment',
                value: function (e) {
                  f.types || f.init();
                  e = f.moov(e);
                  var d = new Uint8Array(f.FTYP.byteLength + e.byteLength);
                  d.set(f.FTYP);
                  d.set(e, f.FTYP.byteLength);
                  return d;
                },
              },
            ]);
            return f;
          })();
          n.default = g;
        },
        {},
      ],
      29: [
        function (g, k, n) {
          var l = (function () {
            function b(a, b) {
              for (var c = 0; c < b.length; c++) {
                var d = b[c];
                d.enumerable = d.enumerable || !1;
                d.configurable = !0;
                'value' in d && (d.writable = !0);
                Object.defineProperty(a, d.key, d);
              }
            }
            return function (a, c, d) {
              c && b(a.prototype, c);
              d && b(a, d);
              return a;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f =
              (k = g('../events')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            e = g('../utils/logger'),
            d =
              (k = g('../remux/mp4-generator')) && k.__esModule
                ? k
                : {
                    default: k,
                  },
            c = g('../errors');
          g = (function () {
            function b(a) {
              if (!(this instanceof b)) throw new TypeError('Cannot call a class as a function');
              this.observer = a;
              this.ISGenerated = !1;
              this.PES2MP4SCALEFACTOR = 4;
              this.PES_TIMESCALE = 9e4;
              this.MP4_TIMESCALE = this.PES_TIMESCALE / this.PES2MP4SCALEFACTOR;
            }
            l(b, [
              {
                key: 'destroy',
                value: function () {},
              },
              {
                key: 'insertDiscontinuity',
                value: function () {
                  this._initPTS = this._initDTS = this.nextAacPts = this.nextAvcDts = void 0;
                },
              },
              {
                key: 'switchLevel',
                value: function () {
                  this.ISGenerated = !1;
                },
              },
              {
                key: 'remux',
                value: function (a, b, c, d, e, g) {
                  this.ISGenerated || this.generateIS(a, b, e);
                  b.samples.length && this.remuxVideo(b, e, g);
                  a.samples.length && this.remuxAudio(a, e, g);
                  c.samples.length && this.remuxID3(c, e);
                  d.samples.length && this.remuxText(d, e);
                  this.observer.trigger(f.default.FRAG_PARSED);
                },
              },
              {
                key: 'generateIS',
                value: function (a, b, e) {
                  var g = this.observer,
                    h = a.samples,
                    k = b.samples,
                    m = this.PES_TIMESCALE,
                    l = {},
                    n = {
                      tracks: l,
                      unique: !1,
                    },
                    u = void 0 === this._initPTS,
                    r,
                    w;
                  u && (r = w = Infinity);
                  a.config &&
                    h.length &&
                    ((l.audio = {
                      container: 'audio/mp4',
                      codec: a.codec,
                      initSegment: d.default.initSegment([a]),
                      metadata: {
                        channelCount: a.channelCount,
                      },
                    }),
                    u && (r = w = h[0].pts - m * e));
                  b.sps &&
                    b.pps &&
                    k.length &&
                    ((l.video = {
                      container: 'video/mp4',
                      codec: b.codec,
                      initSegment: d.default.initSegment([b]),
                      metadata: {
                        width: b.width,
                        height: b.height,
                      },
                    }),
                    u && ((r = Math.min(r, k[0].pts - m * e)), (w = Math.min(w, k[0].dts - m * e))));
                  Object.keys(l)
                    ? (g.trigger(f.default.FRAG_PARSING_INIT_SEGMENT, n),
                      (this.ISGenerated = !0),
                      u && ((this._initPTS = r), (this._initDTS = w)))
                    : g.trigger(f.default.ERROR, {
                        type: c.ErrorTypes.MEDIA_ERROR,
                        details: c.ErrorDetails.FRAG_PARSING_ERROR,
                        fatal: !1,
                        reason: 'no audio/video samples found',
                      });
                },
              },
              {
                key: 'remuxVideo',
                value: function (a, b, c) {
                  var g = 8;
                  b = this.PES_TIMESCALE;
                  var h = this.PES2MP4SCALEFACTOR,
                    k,
                    m = [];
                  var l = new Uint8Array(a.len + 4 * a.nbNalu + 8);
                  var n = new DataView(l.buffer);
                  n.setUint32(0, l.byteLength);
                  for (l.set(d.default.types.mdat, 4); a.samples.length; ) {
                    var u = a.samples.shift();
                    for (k = 0; u.units.units.length; ) {
                      var r = u.units.units.shift();
                      n.setUint32(g, r.data.byteLength);
                      g += 4;
                      l.set(r.data, g);
                      g += r.data.byteLength;
                      k += 4 + r.data.byteLength;
                    }
                    r = u.pts - this._initDTS;
                    var w = u.dts - this._initDTS;
                    w = Math.min(r, w);
                    if (void 0 !== A) {
                      r = this._PTSNormalize(r, A);
                      w = this._PTSNormalize(w, A);
                      var A = (w - A) / h;
                      0 >= A &&
                        (e.logger.log('invalid sample duration at PTS/DTS: ' + u.pts + '/' + u.dts + ':' + A), (A = 1));
                      z.duration = A;
                    } else {
                      var y = this.nextAvcDts;
                      r = this._PTSNormalize(r, y);
                      w = this._PTSNormalize(w, y);
                      var x = Math.round((w - y) / 90);
                      (c || 600 > Math.abs(x)) &&
                        x &&
                        (1 < x
                          ? e.logger.log('AVC:' + x + ' ms hole between fragments detected,filling it')
                          : -1 > x && e.logger.log('AVC:' + -x + ' ms overlapping between fragments detected'),
                        (w = y),
                        (r = Math.max(r - x, w)),
                        e.logger.log('Video/PTS/DTS adjusted: ' + r + '/' + w + ',delta:' + x));
                      y = Math.max(0, r);
                      x = Math.max(0, w);
                    }
                    var z = {
                      size: k,
                      duration: 0,
                      cts: (r - w) / h,
                      flags: {
                        isLeading: 0,
                        isDependedOn: 0,
                        hasRedundancy: 0,
                        degradPrio: 0,
                      },
                    };
                    k = z.flags;
                    !0 === u.key ? ((k.dependsOn = 2), (k.isNonSync = 0)) : ((k.dependsOn = 1), (k.isNonSync = 1));
                    m.push(z);
                    A = w;
                  }
                  c = 0;
                  2 <= m.length && ((c = m[m.length - 2].duration), (z.duration = c));
                  this.nextAvcDts = w + c * h;
                  a.len = 0;
                  a.nbNalu = 0;
                  m.length &&
                    -1 < navigator.userAgent.toLowerCase().indexOf('chrome') &&
                    ((k = m[0].flags), (k.dependsOn = 2), (k.isNonSync = 0));
                  a.samples = m;
                  n = d.default.moof(a.sequenceNumber++, x / h, a);
                  a.samples = [];
                  this.observer.trigger(f.default.FRAG_PARSING_DATA, {
                    data1: n,
                    data2: l,
                    startPTS: y / b,
                    endPTS: (r + h * c) / b,
                    startDTS: x / b,
                    endDTS: this.nextAvcDts / b,
                    type: 'video',
                    nb: m.length,
                  });
                },
              },
              {
                key: 'remuxAudio',
                value: function (a, b, c) {
                  var g = 8;
                  b = this.PES_TIMESCALE;
                  var h = b / a.timescale,
                    k = [],
                    m = [];
                  a.samples.sort(function (a, b) {
                    return a.pts - b.pts;
                  });
                  for (m = a.samples; m.length; ) {
                    var l = m.shift();
                    var n = l.unit;
                    var u = l.pts - this._initDTS;
                    var r = l.dts - this._initDTS;
                    if (void 0 !== D)
                      (l = this._PTSNormalize(u, D)),
                        (r = this._PTSNormalize(r, D)),
                        (z.duration = (r - D) / h),
                        10 < Math.abs(z.duration - 1024) &&
                          e.logger.log(
                            'invalid AAC sample duration at PTS ' +
                              Math.round(u / 90) +
                              ',should be 1024,found :' +
                              Math.round(z.duration)
                          ),
                        (z.duration = 1024),
                        (r = 1024 * h + D);
                    else {
                      var w = this.nextAacPts;
                      l = this._PTSNormalize(u, w);
                      r = this._PTSNormalize(r, w);
                      u = Math.round((1e3 * (l - w)) / b);
                      if ((c || 600 > Math.abs(u)) && u) {
                        if (0 < u) e.logger.log(u + ' ms hole between AAC samples detected,filling it');
                        else if (-12 > u) {
                          e.logger.log(-u + ' ms overlapping between AAC samples detected, drop frame');
                          a.len -= n.byteLength;
                          continue;
                        }
                        l = r = w;
                      }
                      var A = Math.max(0, l);
                      var y = Math.max(0, r);
                      if (0 < a.len) {
                        var x = new Uint8Array(a.len + 8);
                        var z = new DataView(x.buffer);
                        z.setUint32(0, x.byteLength);
                        x.set(d.default.types.mdat, 4);
                      } else return;
                    }
                    x.set(n, g);
                    g += n.byteLength;
                    z = {
                      size: n.byteLength,
                      cts: 0,
                      duration: 0,
                      flags: {
                        isLeading: 0,
                        isDependedOn: 0,
                        hasRedundancy: 0,
                        degradPrio: 0,
                        dependsOn: 1,
                      },
                    };
                    k.push(z);
                    var D = r;
                  }
                  c = 0;
                  g = k.length;
                  2 <= g && ((c = k[g - 2].duration), (z.duration = c));
                  g &&
                    ((this.nextAacPts = l + h * c),
                    (a.len = 0),
                    (a.samples = k),
                    (z = d.default.moof(a.sequenceNumber++, y / h, a)),
                    (a.samples = []),
                    this.observer.trigger(f.default.FRAG_PARSING_DATA, {
                      data1: z,
                      data2: x,
                      startPTS: A / b,
                      endPTS: this.nextAacPts / b,
                      startDTS: y / b,
                      endDTS: (r + h * c) / b,
                      type: 'audio',
                      nb: g,
                    }));
                },
              },
              {
                key: 'remuxID3',
                value: function (a, b) {
                  b = a.samples.length;
                  if (b) {
                    for (var c = 0; c < b; c++) {
                      var d = a.samples[c];
                      d.pts = (d.pts - this._initPTS) / this.PES_TIMESCALE;
                      d.dts = (d.dts - this._initDTS) / this.PES_TIMESCALE;
                    }
                    this.observer.trigger(f.default.FRAG_PARSING_METADATA, {
                      samples: a.samples,
                    });
                  }
                  a.samples = [];
                },
              },
              {
                key: 'remuxText',
                value: function (a, b) {
                  a.samples.sort(function (a, b) {
                    return a.pts - b.pts;
                  });
                  b = a.samples.length;
                  if (b) {
                    for (var c = 0; c < b; c++) {
                      var d = a.samples[c];
                      d.pts = (d.pts - this._initPTS) / this.PES_TIMESCALE;
                    }
                    this.observer.trigger(f.default.FRAG_PARSING_USERDATA, {
                      samples: a.samples,
                    });
                  }
                  a.samples = [];
                },
              },
              {
                key: '_PTSNormalize',
                value: function (a, b) {
                  var c;
                  if (void 0 === b) return a;
                  for (c = b < a ? -8589934592 : 8589934592; 4294967296 < Math.abs(a - b); ) a += c;
                  return a;
                },
              },
              {
                key: 'passthrough',
                get: function () {
                  return !1;
                },
              },
              {
                key: 'timescale',
                get: function () {
                  return this.MP4_TIMESCALE;
                },
              },
            ]);
            return b;
          })();
          n.default = g;
        },
        {
          '../errors': 19,
          '../events': 21,
          '../remux/mp4-generator': 28,
          '../utils/logger': 34,
        },
      ],
      30: [
        function (g, k, n) {
          var l = (function () {
            function e(d, c) {
              for (var b = 0; b < c.length; b++) {
                var a = c[b];
                a.enumerable = a.enumerable || !1;
                a.configurable = !0;
                'value' in a && (a.writable = !0);
                Object.defineProperty(d, a.key, a);
              }
            }
            return function (d, c, b) {
              c && e(d.prototype, c);
              b && e(d, b);
              return d;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f =
            (g = g('../events')) && g.__esModule
              ? g
              : {
                  default: g,
                };
          g = (function () {
            function e(d) {
              if (!(this instanceof e)) throw new TypeError('Cannot call a class as a function');
              this.observer = d;
              this.ISGenerated = !1;
            }
            l(e, [
              {
                key: 'destroy',
                value: function () {},
              },
              {
                key: 'insertDiscontinuity',
                value: function () {},
              },
              {
                key: 'switchLevel',
                value: function () {
                  this.ISGenerated = !1;
                },
              },
              {
                key: 'remux',
                value: function (d, c, b, a, e, g) {
                  b = this.observer;
                  if (!this.ISGenerated) {
                    a = {
                      tracks: {},
                      unique: !0,
                    };
                    var h = c.codec;
                    h &&
                      (a.tracks.video = {
                        container: c.container,
                        codec: h,
                        metadata: {
                          width: c.width,
                          height: c.height,
                        },
                      });
                    c = d;
                    if ((h = c.codec))
                      a.tracks.audio = {
                        container: c.container,
                        codec: h,
                        metadata: {
                          channelCount: c.channelCount,
                        },
                      };
                    this.ISGenerated = !0;
                    b.trigger(f.default.FRAG_PARSING_INIT_SEGMENT, a);
                  }
                  b.trigger(f.default.FRAG_PARSING_DATA, {
                    data1: g,
                    startPTS: e,
                    startDTS: e,
                    type: 'audiovideo',
                    nb: 1,
                  });
                },
              },
              {
                key: 'passthrough',
                get: function () {
                  return !0;
                },
              },
              {
                key: 'timescale',
                get: function () {
                  return 0;
                },
              },
            ]);
            return e;
          })();
          n.default = g;
        },
        {
          '../events': 21,
        },
      ],
      31: [
        function (g, k, n) {
          var l = (function () {
            function f(e, d) {
              for (var c = 0; c < d.length; c++) {
                var b = d[c];
                b.enumerable = b.enumerable || !1;
                b.configurable = !0;
                'value' in b && (b.writable = !0);
                Object.defineProperty(e, b.key, b);
              }
            }
            return function (e, d, c) {
              d && f(e.prototype, d);
              c && f(e, c);
              return e;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          g = (function () {
            function f(e) {
              if (!(this instanceof f)) throw new TypeError('Cannot call a class as a function');
              'string' === typeof e && (e = f.parseAttrList(e));
              for (var d in e) e.hasOwnProperty(d) && (this[d] = e[d]);
            }
            l(
              f,
              [
                {
                  key: 'decimalInteger',
                  value: function (e) {
                    e = parseInt(this[e], 10);
                    return e > Number.MAX_SAFE_INTEGER ? Infinity : e;
                  },
                },
                {
                  key: 'hexadecimalInteger',
                  value: function (e) {
                    if (this[e]) {
                      e = (this[e] || '0x').slice(2);
                      e = (e.length & 1 ? '0' : '') + e;
                      for (var d = new Uint8Array(e.length / 2), c = 0; c < e.length / 2; c++)
                        d[c] = parseInt(e.slice(2 * c, 2 * c + 2), 16);
                      return d;
                    }
                    return null;
                  },
                },
                {
                  key: 'hexadecimalIntegerAsNumber',
                  value: function (e) {
                    e = parseInt(this[e], 16);
                    return e > Number.MAX_SAFE_INTEGER ? Infinity : e;
                  },
                },
                {
                  key: 'decimalFloatingPoint',
                  value: function (e) {
                    return parseFloat(this[e]);
                  },
                },
                {
                  key: 'enumeratedString',
                  value: function (e) {
                    return this[e];
                  },
                },
                {
                  key: 'decimalResolution',
                  value: function (e) {
                    e = /^(\d+)x(\d+)$/.exec(this[e]);
                    if (null !== e)
                      return {
                        width: parseInt(e[1], 10),
                        height: parseInt(e[2], 10),
                      };
                  },
                },
              ],
              [
                {
                  key: 'parseAttrList',
                  value: function (e) {
                    for (var d = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g, c, b = {}; null !== (c = d.exec(e)); ) {
                      var a = c[2];
                      0 === a.indexOf('"') && a.lastIndexOf('"') === a.length - 1 && (a = a.slice(1, -1));
                      b[c[1]] = a;
                    }
                    return b;
                  },
                },
              ]
            );
            return f;
          })();
          n.default = g;
        },
        {},
      ],
      32: [
        function (g, k, n) {
          k.exports = {
            search: function (g, f) {
              for (var e = 0, d = g.length - 1, c, b; e <= d; ) {
                c = ((e + d) / 2) | 0;
                b = g[c];
                var a = f(b);
                if (0 < a) e = c + 1;
                else if (0 > a) d = c - 1;
                else return b;
              }
              return null;
            },
          };
        },
        {},
      ],
      33: [
        function (g, k, n) {
          var l = (function () {
            function f(e, d) {
              for (var c = 0; c < d.length; c++) {
                var b = d[c];
                b.enumerable = b.enumerable || !1;
                b.configurable = !0;
                'value' in b && (b.writable = !0);
                Object.defineProperty(e, b.key, b);
              }
            }
            return function (e, d, c) {
              d && f(e.prototype, d);
              c && f(e, c);
              return e;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          g = (function () {
            function f() {
              if (!(this instanceof f)) throw new TypeError('Cannot call a class as a function');
            }
            l(f, [
              {
                key: 'attach',
                value: function (e) {
                  this.media = e;
                  this.display = [];
                  this.memory = [];
                },
              },
              {
                key: 'detach',
                value: function () {
                  this.clear();
                },
              },
              {
                key: 'destroy',
                value: function () {},
              },
              {
                key: '_createCue',
                value: function () {
                  var e = (this.cue = new (window.VTTCue || window.TextTrackCue)(-1, -1, ''));
                  e.text = '';
                  e.pauseOnExit = !1;
                  e.startTime = Number.MAX_VALUE;
                  e.endTime = Number.MAX_VALUE;
                  this.memory.push(e);
                },
              },
              {
                key: 'clear',
                value: function () {
                  var e = this._textTrack;
                  if (e && e.cues) for (; 0 < e.cues.length; ) e.removeCue(e.cues[0]);
                },
              },
              {
                key: 'push',
                value: function (e, d) {
                  this.cue || this._createCue();
                  for (var c = d[0] & 31, b = 2, a, f, g, k, l = 0; l < c; l++)
                    if (
                      ((a = d[b++]),
                      (f = 127 & d[b++]),
                      (g = 127 & d[b++]),
                      (k = 0 === (4 & a) ? !1 : !0),
                      (a &= 3),
                      (0 !== f || 0 !== g) && k && 0 === a)
                    ) {
                      if (32 & f || 64 & f) this.cue.text += this._fromCharCode(f) + this._fromCharCode(g);
                      else if ((17 === f || 25 === f) && 48 <= g && 63 >= g)
                        switch (g) {
                          case 48:
                            this.cue.text += '\u00ae';
                            break;
                          case 49:
                            this.cue.text += '\u00b0';
                            break;
                          case 50:
                            this.cue.text += '\u00bd';
                            break;
                          case 51:
                            this.cue.text += '\u00bf';
                            break;
                          case 52:
                            this.cue.text += '\u2122';
                            break;
                          case 53:
                            this.cue.text += '\u00a2';
                            break;
                          case 54:
                            this.cue.text += '';
                            break;
                          case 55:
                            this.cue.text += '\u00a3';
                            break;
                          case 56:
                            this.cue.text += '\u266a';
                            break;
                          case 57:
                            this.cue.text += ' ';
                            break;
                          case 58:
                            this.cue.text += '\u00e8';
                            break;
                          case 59:
                            this.cue.text += '\u00e2';
                            break;
                          case 60:
                            this.cue.text += '\u00ea';
                            break;
                          case 61:
                            this.cue.text += '\u00ee';
                            break;
                          case 62:
                            this.cue.text += '\u00f4';
                            break;
                          case 63:
                            this.cue.text += '\u00fb';
                        }
                      if ((20 === f || 28 === f) && 32 <= g && 47 >= g)
                        switch (g) {
                          case 32:
                            this._clearActiveCues(e);
                            break;
                          case 33:
                            this.cue.text = this.cue.text.substr(0, this.cue.text.length - 1);
                            break;
                          case 41:
                            this._clearActiveCues(e);
                            break;
                          case 44:
                            this._clearActiveCues(e);
                            break;
                          case 46:
                            this._text = '';
                            break;
                          case 47:
                            this._flipMemory(e);
                        }
                    }
                },
              },
              {
                key: '_fromCharCode',
                value: function (e) {
                  switch (e) {
                    case 42:
                      return '\u00e1';
                    case 2:
                      return '\u00e1';
                    case 2:
                      return '\u00e9';
                    case 4:
                      return '\u00ed';
                    case 5:
                      return '\u00f3';
                    case 6:
                      return '\u00fa';
                    case 3:
                      return '\u00e7';
                    case 4:
                      return '\u00f7';
                    case 5:
                      return '\u00d1';
                    case 6:
                      return '\u00f1';
                    case 7:
                      return '\u2588';
                    default:
                      return String.fromCharCode(e);
                  }
                },
              },
              {
                key: '_flipMemory',
                value: function (e) {
                  this._clearActiveCues(e);
                  this._flushCaptions(e);
                },
              },
              {
                key: '_flushCaptions',
                value: function (e) {
                  this._has708 ||
                    ((this._textTrack = this.media.addTextTrack('captions', 'English', 'en')), (this._has708 = !0));
                  var d = !0,
                    c = !1,
                    b = void 0;
                  try {
                    for (var a = this.memory[Symbol.iterator](), f; !(d = (f = a.next()).done); d = !0) {
                      var g = f.value;
                      g.startTime = e;
                      this._textTrack.addCue(g);
                      this.display.push(g);
                    }
                  } catch (q) {
                    (c = !0), (b = q);
                  } finally {
                    try {
                      !d && a.return && a.return();
                    } finally {
                      if (c) throw b;
                    }
                  }
                  this.memory = [];
                  this.cue = null;
                },
              },
              {
                key: '_clearActiveCues',
                value: function (e) {
                  var d = !0,
                    c = !1,
                    b = void 0;
                  try {
                    for (var a = this.display[Symbol.iterator](), f; !(d = (f = a.next()).done); d = !0)
                      f.value.endTime = e;
                  } catch (h) {
                    (c = !0), (b = h);
                  } finally {
                    try {
                      !d && a.return && a.return();
                    } finally {
                      if (c) throw b;
                    }
                  }
                  this.display = [];
                },
              },
              {
                key: '_clearBufferedCues',
                value: function () {},
              },
            ]);
            return f;
          })();
          n.default = g;
        },
        {},
      ],
      34: [
        function (g, k, n) {
          function l() {}
          function f(a) {
            var b = window.console[a];
            return b
              ? function () {
                  for (var c = arguments.length, d = Array(c), e = 0; e < c; e++) d[e] = arguments[e];
                  d[0] && (d[0] = '[' + a + '] > ' + d[0]);
                  b.apply(window.console, d);
                }
              : l;
          }
          function e(a) {
            for (var c = arguments.length, d = Array(1 < c ? c - 1 : 0), e = 1; e < c; e++) d[e - 1] = arguments[e];
            d.forEach(function (c) {
              b[c] = a[c] ? a[c].bind(a) : f(c);
            });
          }
          var d =
            'function' === typeof Symbol && 'symbol' === typeof Symbol.iterator
              ? function (a) {
                  return typeof a;
                }
              : function (a) {
                  return a && 'function' === typeof Symbol && a.constructor === Symbol ? 'symbol' : typeof a;
                };
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var c = {
              trace: l,
              debug: l,
              log: l,
              warn: l,
              info: l,
              error: l,
            },
            b = c;
          n.enableLogs = function (a) {
            if (!0 === a || 'object' === ('undefined' === typeof a ? 'undefined' : d(a))) {
              e(a, 'debug', 'log', 'info', 'warn', 'error');
              try {
                b.log();
              } catch (m) {
                b = c;
              }
            } else b = c;
          };
          n.logger = b;
        },
        {},
      ],
      35: [
        function (g, k, n) {
          var l = {
            buildAbsoluteURL: function (f, e) {
              e = e.trim();
              if (/^[a-z]+:/i.test(e)) return e;
              var d = null,
                c = null,
                b = /^([^#]*)(.*)$/.exec(e);
              b && ((c = b[2]), (e = b[1]));
              if ((b = /^([^\?]*)(.*)$/.exec(e))) (d = b[2]), (e = b[1]);
              (b = /^([^#]*)(.*)$/.exec(f)) && (f = b[1]);
              (b = /^([^\?]*)(.*)$/.exec(f)) && (f = b[1]);
              var a = /^((([a-z]+):)?\/\/[a-z0-9\.-]+(:[0-9]+)?\/)(.*)$/i.exec(f);
              f = a[3];
              b = a[1];
              a = a[5];
              e = /^\/\//.test(e)
                ? f + '://' + l.buildAbsolutePath('', e.substring(2))
                : /^\//.test(e)
                ? b + l.buildAbsolutePath('', e.substring(1))
                : l.buildAbsolutePath(b + a, e);
              d && (e += d);
              c && (e += c);
              return e;
            },
            buildAbsolutePath: function (f, e) {
              var d = '';
              e = f.replace(/[^\/]*$/, e.replace(/(\/|^)(?:\.?\/+)+/g, '$1'));
              for (var c, b = 0; (c = e.indexOf('/../', b)), -1 < c; b = c + f)
                (f = /^\/(?:\.\.\/)*/.exec(e.slice(c))[0].length),
                  (d = (d + e.substring(b, c)).replace(new RegExp('(?:\\/+[^\\/]*){0,' + (f - 1) / 3 + '}$'), '/'));
              return d + e.substr(b);
            },
          };
          k.exports = l;
        },
        {},
      ],
      36: [
        function (g, k, n) {
          var l = (function () {
            function e(d, c) {
              for (var b = 0; b < c.length; b++) {
                var a = c[b];
                a.enumerable = a.enumerable || !1;
                a.configurable = !0;
                'value' in a && (a.writable = !0);
                Object.defineProperty(d, a.key, a);
              }
            }
            return function (d, c, b) {
              c && e(d.prototype, c);
              b && e(d, b);
              return d;
            };
          })();
          Object.defineProperty(n, '__esModule', {
            value: !0,
          });
          var f = g('../utils/logger');
          g = (function () {
            function e(d) {
              if (!(this instanceof e)) throw new TypeError('Cannot call a class as a function');
              d && d.xhrSetup && (this.xhrSetup = d.xhrSetup);
            }
            l(e, [
              {
                key: 'destroy',
                value: function () {
                  this.abort();
                  this.loader = null;
                },
              },
              {
                key: 'abort',
                value: function () {
                  var d = this.loader,
                    c = this.timeoutHandle;
                  d && 4 !== d.readyState && ((this.stats.aborted = !0), d.abort());
                  c && window.clearTimeout(c);
                },
              },
              {
                key: 'load',
                value: function (d, c, b, a, e, f, g, k) {
                  var h = 8 >= arguments.length || void 0 === arguments[8] ? null : arguments[8],
                    l = 9 >= arguments.length || void 0 === arguments[9] ? null : arguments[9];
                  this.url = d;
                  !l ||
                    isNaN(l.byteRangeStartOffset) ||
                    isNaN(l.byteRangeEndOffset) ||
                    (this.byteRange = l.byteRangeStartOffset + '-' + (l.byteRangeEndOffset - 1));
                  this.responseType = c;
                  this.onSuccess = b;
                  this.onProgress = h;
                  this.onTimeout = e;
                  this.onError = a;
                  this.stats = {
                    trequest: performance.now(),
                    retry: 0,
                  };
                  this.timeout = f;
                  this.maxRetry = g;
                  this.retryDelay = k;
                  this.timeoutHandle = window.setTimeout(this.loadtimeout.bind(this), f);
                  this.loadInternal();
                },
              },
              {
                key: 'loadInternal',
                value: function () {
                  var d =
                    'undefined' !== typeof XDomainRequest
                      ? (this.loader = new XDomainRequest())
                      : (this.loader = new XMLHttpRequest());
                  d.onloadend = this.loadend.bind(this);
                  d.onprogress = this.loadprogress.bind(this);
                  d.open('GET', this.url, !0);
                  this.byteRange && d.setRequestHeader('Range', 'bytes=' + this.byteRange);
                  d.responseType = this.responseType;
                  this.stats.tfirst = null;
                  this.stats.loaded = 0;
                  this.xhrSetup && this.xhrSetup(d, this.url);
                  d.send();
                },
              },
              {
                key: 'loadend',
                value: function (d) {
                  var c = d.currentTarget.status,
                    b = this.stats;
                  b.aborted ||
                    (200 <= c && 300 > c
                      ? (window.clearTimeout(this.timeoutHandle), (b.tload = performance.now()), this.onSuccess(d, b))
                      : b.retry < this.maxRetry
                      ? (f.logger.warn(c + ' while loading ' + this.url + ', retrying in ' + this.retryDelay + '...'),
                        this.destroy(),
                        window.setTimeout(this.loadInternal.bind(this), this.retryDelay),
                        (this.retryDelay = Math.min(2 * this.retryDelay, 64e3)),
                        b.retry++)
                      : (window.clearTimeout(this.timeoutHandle),
                        f.logger.error(c + ' while loading ' + this.url),
                        this.onError(d)));
                },
              },
              {
                key: 'loadtimeout',
                value: function (d) {
                  f.logger.warn('timeout while loading ' + this.url);
                  this.onTimeout(d, this.stats);
                },
              },
              {
                key: 'loadprogress',
                value: function (d) {
                  var c = this.stats;
                  null === c.tfirst && (c.tfirst = performance.now());
                  c.loaded = d.loaded;
                  if (this.onProgress) this.onProgress(d, c);
                },
              },
            ]);
            return e;
          })();
          n.default = g;
        },
        {
          '../utils/logger': 34,
        },
      ],
    },
    {},
    [24]
  )(24);
});
