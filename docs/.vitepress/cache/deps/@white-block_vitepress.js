import {
  Fragment,
  Teleport,
  Transition,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createTextVNode,
  createVNode,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  isRef,
  mergeDefaults,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeStyle,
  onBeforeUnmount,
  onMounted,
  openBlock,
  provide,
  ref,
  renderList,
  renderSlot,
  resolveComponent,
  resolveDynamicComponent,
  toDisplayString,
  toRefs,
  unref,
  vShow,
  watch,
  watchEffect,
  withCtx,
  withDirectives,
  withModifiers
} from "./chunk-PTNZ6ZZM.js";
import "./chunk-BUSYA2B4.js";

// ../node_modules/.pnpm/white-block@0.0.36-alpha.0_vue@3.5.13_typescript@5.0.2_/node_modules/white-block/dist/es/components/index.js
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function throttle(func, limit) {
  let inThrottle;
  let lastFuncCall;
  const throttledFunc = (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      lastFuncCall = Date.now();
    } else {
      const timeSinceLastCall = Date.now() - lastFuncCall;
      if (timeSinceLastCall >= limit) {
        func(...args);
        lastFuncCall = Date.now();
      }
    }
  };
  return throttledFunc;
}
function debounce$1(func, wait) {
  let timeoutId;
  const debounceFunc = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
  return debounceFunc;
}
function withInstall(component) {
  const comp = component;
  comp.install = (app) => {
    if (comp.name) {
      app.component(comp.name, comp);
    }
  };
  return comp;
}
function getComponentSize(size) {
  const h2 = Math.max(18, size);
  const p = Math.floor(h2 / 4);
  const f = p + 6;
  const r = (p - 4) / 2 + 2;
  const g = r;
  return {
    height: h2,
    padding: p,
    fontSize: f,
    radius: r,
    gap: g
  };
}
function getComponentSizeValue(size) {
  const sizePreset = {
    xs: 18,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48
  };
  return sizePreset[size];
}
function getComponentSizeStyles(name, size) {
  const h2 = Math.max(18, size);
  const p = Math.floor(h2 / 4) + 2;
  const f = p + 4;
  const r = (p - 6) / 2 + 2;
  const g = r;
  return {
    [`--${name}-height`]: `calc(${h2} / 16 * 1rem)`,
    [`--${name}-padding`]: `calc(${p} / 16 * 1rem)`,
    [`--${name}-font-size`]: `calc(${f} / 16 * 1rem)`,
    [`--${name}-radius`]: `calc(${r} / 16 * 1rem)`,
    [`--${name}-gap`]: `calc(${g} / 16 * 1rem)`
  };
}
function getRawSlots(slots) {
  const result = {};
  Object.keys(slots).forEach((slot) => {
    result[slot] = () => {
      var _a;
      return (_a = slots[slot]) == null ? void 0 : _a.call(slots);
    };
  });
  return result;
}
function clickDelegate(e, className, handler, fallback) {
  const domList = e.path ?? (e.composedPath && e.composedPath());
  const target = domList.find(
    (dom) => dom.className && dom.className.includes(className)
  );
  if (target) {
    handler(target.dataset, e);
    return;
  }
  fallback == null ? void 0 : fallback();
}
function clickDelegateKey(e, className, handler, fallback) {
  var _a, _b;
  const domList = e.path ?? (e.composedPath && e.composedPath());
  const target = domList.find(
    (dom) => dom.className && dom.className.includes(className)
  );
  if (target) {
    handler(((_b = (_a = target.__vueParentComponent) == null ? void 0 : _a.vnode) == null ? void 0 : _b.key) || null, e);
    return;
  }
  fallback == null ? void 0 : fallback();
}
function on(element, event, handler) {
  if (element && event && handler) {
    element.addEventListener(event, handler);
  }
}
function off(element, event, handler) {
  if (element && event) {
    element.removeEventListener(event, handler);
  }
}
async function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement("textarea");
    const previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    const selection = document.getSelection();
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
    document.body.appendChild(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    document.execCommand("copy");
    document.body.removeChild(element);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
}
var EventCenter = class {
  constructor(element, id) {
    __publicField(this, "id");
    __publicField(this, "element");
    __publicField(this, "events", {});
    __publicField(this, "handlers", {});
    this.element = element ?? document.body;
    this.id = id || "";
  }
  on(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
      const eventHandler = (e) => {
        if (!this.events[event]) return;
        for (const item of this.events[event]) {
          item(e);
        }
      };
      this.handlers[event] = eventHandler;
      this.element.addEventListener(event, eventHandler);
    }
    this.events[event].push(handler);
  }
  off(event, handler) {
    var _a;
    if (!((_a = this.events[event]) == null ? void 0 : _a.length)) {
      return;
    }
    this.events[event].splice(this.events[event].indexOf(handler), 1);
    if (!this.events[event].length) {
      delete this.events[event];
      this.element.removeEventListener(event, this.handlers[event]);
    }
  }
  clean() {
    for (const item in this.events) {
      this.element.removeEventListener(item, this.handlers[item]);
    }
    this.events = {};
  }
};
var GlobalEventCenterBuilder = class {
  constructor() {
    __publicField(this, "ElementEvents", {});
  }
  get(selector) {
    const element = document.querySelector(selector);
    if (!element) return null;
    if (!this.ElementEvents[selector]) {
      this.ElementEvents[selector] = new EventCenter(element, "body");
    }
    return this.ElementEvents[selector];
  }
};
var GlobalEventCenter = new GlobalEventCenterBuilder();
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var colorString$1 = { exports: {} };
var colorName = {
  "aliceblue": [240, 248, 255],
  "antiquewhite": [250, 235, 215],
  "aqua": [0, 255, 255],
  "aquamarine": [127, 255, 212],
  "azure": [240, 255, 255],
  "beige": [245, 245, 220],
  "bisque": [255, 228, 196],
  "black": [0, 0, 0],
  "blanchedalmond": [255, 235, 205],
  "blue": [0, 0, 255],
  "blueviolet": [138, 43, 226],
  "brown": [165, 42, 42],
  "burlywood": [222, 184, 135],
  "cadetblue": [95, 158, 160],
  "chartreuse": [127, 255, 0],
  "chocolate": [210, 105, 30],
  "coral": [255, 127, 80],
  "cornflowerblue": [100, 149, 237],
  "cornsilk": [255, 248, 220],
  "crimson": [220, 20, 60],
  "cyan": [0, 255, 255],
  "darkblue": [0, 0, 139],
  "darkcyan": [0, 139, 139],
  "darkgoldenrod": [184, 134, 11],
  "darkgray": [169, 169, 169],
  "darkgreen": [0, 100, 0],
  "darkgrey": [169, 169, 169],
  "darkkhaki": [189, 183, 107],
  "darkmagenta": [139, 0, 139],
  "darkolivegreen": [85, 107, 47],
  "darkorange": [255, 140, 0],
  "darkorchid": [153, 50, 204],
  "darkred": [139, 0, 0],
  "darksalmon": [233, 150, 122],
  "darkseagreen": [143, 188, 143],
  "darkslateblue": [72, 61, 139],
  "darkslategray": [47, 79, 79],
  "darkslategrey": [47, 79, 79],
  "darkturquoise": [0, 206, 209],
  "darkviolet": [148, 0, 211],
  "deeppink": [255, 20, 147],
  "deepskyblue": [0, 191, 255],
  "dimgray": [105, 105, 105],
  "dimgrey": [105, 105, 105],
  "dodgerblue": [30, 144, 255],
  "firebrick": [178, 34, 34],
  "floralwhite": [255, 250, 240],
  "forestgreen": [34, 139, 34],
  "fuchsia": [255, 0, 255],
  "gainsboro": [220, 220, 220],
  "ghostwhite": [248, 248, 255],
  "gold": [255, 215, 0],
  "goldenrod": [218, 165, 32],
  "gray": [128, 128, 128],
  "green": [0, 128, 0],
  "greenyellow": [173, 255, 47],
  "grey": [128, 128, 128],
  "honeydew": [240, 255, 240],
  "hotpink": [255, 105, 180],
  "indianred": [205, 92, 92],
  "indigo": [75, 0, 130],
  "ivory": [255, 255, 240],
  "khaki": [240, 230, 140],
  "lavender": [230, 230, 250],
  "lavenderblush": [255, 240, 245],
  "lawngreen": [124, 252, 0],
  "lemonchiffon": [255, 250, 205],
  "lightblue": [173, 216, 230],
  "lightcoral": [240, 128, 128],
  "lightcyan": [224, 255, 255],
  "lightgoldenrodyellow": [250, 250, 210],
  "lightgray": [211, 211, 211],
  "lightgreen": [144, 238, 144],
  "lightgrey": [211, 211, 211],
  "lightpink": [255, 182, 193],
  "lightsalmon": [255, 160, 122],
  "lightseagreen": [32, 178, 170],
  "lightskyblue": [135, 206, 250],
  "lightslategray": [119, 136, 153],
  "lightslategrey": [119, 136, 153],
  "lightsteelblue": [176, 196, 222],
  "lightyellow": [255, 255, 224],
  "lime": [0, 255, 0],
  "limegreen": [50, 205, 50],
  "linen": [250, 240, 230],
  "magenta": [255, 0, 255],
  "maroon": [128, 0, 0],
  "mediumaquamarine": [102, 205, 170],
  "mediumblue": [0, 0, 205],
  "mediumorchid": [186, 85, 211],
  "mediumpurple": [147, 112, 219],
  "mediumseagreen": [60, 179, 113],
  "mediumslateblue": [123, 104, 238],
  "mediumspringgreen": [0, 250, 154],
  "mediumturquoise": [72, 209, 204],
  "mediumvioletred": [199, 21, 133],
  "midnightblue": [25, 25, 112],
  "mintcream": [245, 255, 250],
  "mistyrose": [255, 228, 225],
  "moccasin": [255, 228, 181],
  "navajowhite": [255, 222, 173],
  "navy": [0, 0, 128],
  "oldlace": [253, 245, 230],
  "olive": [128, 128, 0],
  "olivedrab": [107, 142, 35],
  "orange": [255, 165, 0],
  "orangered": [255, 69, 0],
  "orchid": [218, 112, 214],
  "palegoldenrod": [238, 232, 170],
  "palegreen": [152, 251, 152],
  "paleturquoise": [175, 238, 238],
  "palevioletred": [219, 112, 147],
  "papayawhip": [255, 239, 213],
  "peachpuff": [255, 218, 185],
  "peru": [205, 133, 63],
  "pink": [255, 192, 203],
  "plum": [221, 160, 221],
  "powderblue": [176, 224, 230],
  "purple": [128, 0, 128],
  "rebeccapurple": [102, 51, 153],
  "red": [255, 0, 0],
  "rosybrown": [188, 143, 143],
  "royalblue": [65, 105, 225],
  "saddlebrown": [139, 69, 19],
  "salmon": [250, 128, 114],
  "sandybrown": [244, 164, 96],
  "seagreen": [46, 139, 87],
  "seashell": [255, 245, 238],
  "sienna": [160, 82, 45],
  "silver": [192, 192, 192],
  "skyblue": [135, 206, 235],
  "slateblue": [106, 90, 205],
  "slategray": [112, 128, 144],
  "slategrey": [112, 128, 144],
  "snow": [255, 250, 250],
  "springgreen": [0, 255, 127],
  "steelblue": [70, 130, 180],
  "tan": [210, 180, 140],
  "teal": [0, 128, 128],
  "thistle": [216, 191, 216],
  "tomato": [255, 99, 71],
  "turquoise": [64, 224, 208],
  "violet": [238, 130, 238],
  "wheat": [245, 222, 179],
  "white": [255, 255, 255],
  "whitesmoke": [245, 245, 245],
  "yellow": [255, 255, 0],
  "yellowgreen": [154, 205, 50]
};
var simpleSwizzle = { exports: {} };
var isArrayish$1 = function isArrayish(obj) {
  if (!obj || typeof obj === "string") {
    return false;
  }
  return obj instanceof Array || Array.isArray(obj) || obj.length >= 0 && (obj.splice instanceof Function || Object.getOwnPropertyDescriptor(obj, obj.length - 1) && obj.constructor.name !== "String");
};
var isArrayish2 = isArrayish$1;
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var swizzle$1 = simpleSwizzle.exports = function swizzle(args) {
  var results = [];
  for (var i = 0, len = args.length; i < len; i++) {
    var arg = args[i];
    if (isArrayish2(arg)) {
      results = concat.call(results, slice.call(arg));
    } else {
      results.push(arg);
    }
  }
  return results;
};
swizzle$1.wrap = function(fn2) {
  return function() {
    return fn2(swizzle$1(arguments));
  };
};
var simpleSwizzleExports = simpleSwizzle.exports;
var colorNames = colorName;
var swizzle2 = simpleSwizzleExports;
var hasOwnProperty = Object.hasOwnProperty;
var reverseNames = /* @__PURE__ */ Object.create(null);
for (name in colorNames) {
  if (hasOwnProperty.call(colorNames, name)) {
    reverseNames[colorNames[name]] = name;
  }
}
var name;
var cs = colorString$1.exports = {
  to: {},
  get: {}
};
cs.get = function(string) {
  var prefix = string.substring(0, 3).toLowerCase();
  var val;
  var model;
  switch (prefix) {
    case "hsl":
      val = cs.get.hsl(string);
      model = "hsl";
      break;
    case "hwb":
      val = cs.get.hwb(string);
      model = "hwb";
      break;
    default:
      val = cs.get.rgb(string);
      model = "rgb";
      break;
  }
  if (!val) {
    return null;
  }
  return { model, value: val };
};
cs.get.rgb = function(string) {
  if (!string) {
    return null;
  }
  var abbr = /^#([a-f0-9]{3,4})$/i;
  var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
  var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
  var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
  var keyword = /^(\w+)$/;
  var rgb = [0, 0, 0, 1];
  var match;
  var i;
  var hexAlpha;
  if (match = string.match(hex)) {
    hexAlpha = match[2];
    match = match[1];
    for (i = 0; i < 3; i++) {
      var i2 = i * 2;
      rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
    }
    if (hexAlpha) {
      rgb[3] = parseInt(hexAlpha, 16) / 255;
    }
  } else if (match = string.match(abbr)) {
    match = match[1];
    hexAlpha = match[3];
    for (i = 0; i < 3; i++) {
      rgb[i] = parseInt(match[i] + match[i], 16);
    }
    if (hexAlpha) {
      rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
    }
  } else if (match = string.match(rgba)) {
    for (i = 0; i < 3; i++) {
      rgb[i] = parseInt(match[i + 1], 0);
    }
    if (match[4]) {
      if (match[5]) {
        rgb[3] = parseFloat(match[4]) * 0.01;
      } else {
        rgb[3] = parseFloat(match[4]);
      }
    }
  } else if (match = string.match(per)) {
    for (i = 0; i < 3; i++) {
      rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
    }
    if (match[4]) {
      if (match[5]) {
        rgb[3] = parseFloat(match[4]) * 0.01;
      } else {
        rgb[3] = parseFloat(match[4]);
      }
    }
  } else if (match = string.match(keyword)) {
    if (match[1] === "transparent") {
      return [0, 0, 0, 0];
    }
    if (!hasOwnProperty.call(colorNames, match[1])) {
      return null;
    }
    rgb = colorNames[match[1]];
    rgb[3] = 1;
    return rgb;
  } else {
    return null;
  }
  for (i = 0; i < 3; i++) {
    rgb[i] = clamp(rgb[i], 0, 255);
  }
  rgb[3] = clamp(rgb[3], 0, 1);
  return rgb;
};
cs.get.hsl = function(string) {
  if (!string) {
    return null;
  }
  var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
  var match = string.match(hsl);
  if (match) {
    var alpha = parseFloat(match[4]);
    var h2 = (parseFloat(match[1]) % 360 + 360) % 360;
    var s = clamp(parseFloat(match[2]), 0, 100);
    var l = clamp(parseFloat(match[3]), 0, 100);
    var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
    return [h2, s, l, a];
  }
  return null;
};
cs.get.hwb = function(string) {
  if (!string) {
    return null;
  }
  var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
  var match = string.match(hwb);
  if (match) {
    var alpha = parseFloat(match[4]);
    var h2 = (parseFloat(match[1]) % 360 + 360) % 360;
    var w = clamp(parseFloat(match[2]), 0, 100);
    var b = clamp(parseFloat(match[3]), 0, 100);
    var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
    return [h2, w, b, a];
  }
  return null;
};
cs.to.hex = function() {
  var rgba = swizzle2(arguments);
  return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : "");
};
cs.to.rgb = function() {
  var rgba = swizzle2(arguments);
  return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ")" : "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + rgba[3] + ")";
};
cs.to.rgb.percent = function() {
  var rgba = swizzle2(arguments);
  var r = Math.round(rgba[0] / 255 * 100);
  var g = Math.round(rgba[1] / 255 * 100);
  var b = Math.round(rgba[2] / 255 * 100);
  return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + r + "%, " + g + "%, " + b + "%)" : "rgba(" + r + "%, " + g + "%, " + b + "%, " + rgba[3] + ")";
};
cs.to.hsl = function() {
  var hsla = swizzle2(arguments);
  return hsla.length < 4 || hsla[3] === 1 ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" : "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
};
cs.to.hwb = function() {
  var hwba = swizzle2(arguments);
  var a = "";
  if (hwba.length >= 4 && hwba[3] !== 1) {
    a = ", " + hwba[3];
  }
  return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
};
cs.to.keyword = function(rgb) {
  return reverseNames[rgb.slice(0, 3)];
};
function clamp(num, min2, max2) {
  return Math.min(Math.max(min2, num), max2);
}
function hexDouble(num) {
  var str = Math.round(num).toString(16).toUpperCase();
  return str.length < 2 ? "0" + str : str;
}
var colorStringExports = colorString$1.exports;
var cssKeywords = colorName;
var reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
  reverseKeywords[cssKeywords[key]] = key;
}
var convert$2 = {
  rgb: { channels: 3, labels: "rgb" },
  hsl: { channels: 3, labels: "hsl" },
  hsv: { channels: 3, labels: "hsv" },
  hwb: { channels: 3, labels: "hwb" },
  cmyk: { channels: 4, labels: "cmyk" },
  xyz: { channels: 3, labels: "xyz" },
  lab: { channels: 3, labels: "lab" },
  lch: { channels: 3, labels: "lch" },
  hex: { channels: 1, labels: ["hex"] },
  keyword: { channels: 1, labels: ["keyword"] },
  ansi16: { channels: 1, labels: ["ansi16"] },
  ansi256: { channels: 1, labels: ["ansi256"] },
  hcg: { channels: 3, labels: ["h", "c", "g"] },
  apple: { channels: 3, labels: ["r16", "g16", "b16"] },
  gray: { channels: 1, labels: ["gray"] }
};
var conversions$2 = convert$2;
for (const model of Object.keys(convert$2)) {
  if (!("channels" in convert$2[model])) {
    throw new Error("missing channels property: " + model);
  }
  if (!("labels" in convert$2[model])) {
    throw new Error("missing channel labels property: " + model);
  }
  if (convert$2[model].labels.length !== convert$2[model].channels) {
    throw new Error("channel and label counts mismatch: " + model);
  }
  const { channels, labels } = convert$2[model];
  delete convert$2[model].channels;
  delete convert$2[model].labels;
  Object.defineProperty(convert$2[model], "channels", { value: channels });
  Object.defineProperty(convert$2[model], "labels", { value: labels });
}
convert$2.rgb.hsl = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min2 = Math.min(r, g, b);
  const max2 = Math.max(r, g, b);
  const delta = max2 - min2;
  let h2;
  let s;
  if (max2 === min2) {
    h2 = 0;
  } else if (r === max2) {
    h2 = (g - b) / delta;
  } else if (g === max2) {
    h2 = 2 + (b - r) / delta;
  } else if (b === max2) {
    h2 = 4 + (r - g) / delta;
  }
  h2 = Math.min(h2 * 60, 360);
  if (h2 < 0) {
    h2 += 360;
  }
  const l = (min2 + max2) / 2;
  if (max2 === min2) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max2 + min2);
  } else {
    s = delta / (2 - max2 - min2);
  }
  return [h2, s * 100, l * 100];
};
convert$2.rgb.hsv = function(rgb) {
  let rdif;
  let gdif;
  let bdif;
  let h2;
  let s;
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const v = Math.max(r, g, b);
  const diff = v - Math.min(r, g, b);
  const diffc = function(c) {
    return (v - c) / 6 / diff + 1 / 2;
  };
  if (diff === 0) {
    h2 = 0;
    s = 0;
  } else {
    s = diff / v;
    rdif = diffc(r);
    gdif = diffc(g);
    bdif = diffc(b);
    if (r === v) {
      h2 = bdif - gdif;
    } else if (g === v) {
      h2 = 1 / 3 + rdif - bdif;
    } else if (b === v) {
      h2 = 2 / 3 + gdif - rdif;
    }
    if (h2 < 0) {
      h2 += 1;
    } else if (h2 > 1) {
      h2 -= 1;
    }
  }
  return [
    h2 * 360,
    s * 100,
    v * 100
  ];
};
convert$2.rgb.hwb = function(rgb) {
  const r = rgb[0];
  const g = rgb[1];
  let b = rgb[2];
  const h2 = convert$2.rgb.hsl(rgb)[0];
  const w = 1 / 255 * Math.min(r, Math.min(g, b));
  b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
  return [h2, w * 100, b * 100];
};
convert$2.rgb.cmyk = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
};
function comparativeDistance(x, y) {
  return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
}
convert$2.rgb.keyword = function(rgb) {
  const reversed = reverseKeywords[rgb];
  if (reversed) {
    return reversed;
  }
  let currentClosestDistance = Infinity;
  let currentClosestKeyword;
  for (const keyword of Object.keys(cssKeywords)) {
    const value = cssKeywords[keyword];
    const distance = comparativeDistance(rgb, value);
    if (distance < currentClosestDistance) {
      currentClosestDistance = distance;
      currentClosestKeyword = keyword;
    }
  }
  return currentClosestKeyword;
};
convert$2.keyword.rgb = function(keyword) {
  return cssKeywords[keyword];
};
convert$2.rgb.xyz = function(rgb) {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;
  r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
  g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
  b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  return [x * 100, y * 100, z * 100];
};
convert$2.rgb.lab = function(rgb) {
  const xyz = convert$2.rgb.xyz(rgb);
  let x = xyz[0];
  let y = xyz[1];
  let z = xyz[2];
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
  y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
  z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [l, a, b];
};
convert$2.hsl.rgb = function(hsl) {
  const h2 = hsl[0] / 360;
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let t2;
  let t3;
  let val;
  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }
  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }
  const t1 = 2 * l - t2;
  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h2 + 1 / 3 * -(i - 1);
    if (t3 < 0) {
      t3++;
    }
    if (t3 > 1) {
      t3--;
    }
    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }
    rgb[i] = val * 255;
  }
  return rgb;
};
convert$2.hsl.hsv = function(hsl) {
  const h2 = hsl[0];
  let s = hsl[1] / 100;
  let l = hsl[2] / 100;
  let smin = s;
  const lmin = Math.max(l, 0.01);
  l *= 2;
  s *= l <= 1 ? l : 2 - l;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (l + s) / 2;
  const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
  return [h2, sv * 100, v * 100];
};
convert$2.hsv.rgb = function(hsv) {
  const h2 = hsv[0] / 60;
  const s = hsv[1] / 100;
  let v = hsv[2] / 100;
  const hi = Math.floor(h2) % 6;
  const f = h2 - Math.floor(h2);
  const p = 255 * v * (1 - s);
  const q = 255 * v * (1 - s * f);
  const t2 = 255 * v * (1 - s * (1 - f));
  v *= 255;
  switch (hi) {
    case 0:
      return [v, t2, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t2];
    case 3:
      return [p, q, v];
    case 4:
      return [t2, p, v];
    case 5:
      return [v, p, q];
  }
};
convert$2.hsv.hsl = function(hsv) {
  const h2 = hsv[0];
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;
  const vmin = Math.max(v, 0.01);
  let sl;
  let l;
  l = (2 - s) * v;
  const lmin = (2 - s) * vmin;
  sl = s * vmin;
  sl /= lmin <= 1 ? lmin : 2 - lmin;
  sl = sl || 0;
  l /= 2;
  return [h2, sl * 100, l * 100];
};
convert$2.hwb.rgb = function(hwb) {
  const h2 = hwb[0] / 360;
  let wh = hwb[1] / 100;
  let bl = hwb[2] / 100;
  const ratio = wh + bl;
  let f;
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }
  const i = Math.floor(6 * h2);
  const v = 1 - bl;
  f = 6 * h2 - i;
  if ((i & 1) !== 0) {
    f = 1 - f;
  }
  const n = wh + f * (v - wh);
  let r;
  let g;
  let b;
  switch (i) {
    default:
    case 6:
    case 0:
      r = v;
      g = n;
      b = wh;
      break;
    case 1:
      r = n;
      g = v;
      b = wh;
      break;
    case 2:
      r = wh;
      g = v;
      b = n;
      break;
    case 3:
      r = wh;
      g = n;
      b = v;
      break;
    case 4:
      r = n;
      g = wh;
      b = v;
      break;
    case 5:
      r = v;
      g = wh;
      b = n;
      break;
  }
  return [r * 255, g * 255, b * 255];
};
convert$2.cmyk.rgb = function(cmyk) {
  const c = cmyk[0] / 100;
  const m = cmyk[1] / 100;
  const y = cmyk[2] / 100;
  const k = cmyk[3] / 100;
  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
};
convert$2.xyz.rgb = function(xyz) {
  const x = xyz[0] / 100;
  const y = xyz[1] / 100;
  const z = xyz[2] / 100;
  let r;
  let g;
  let b;
  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;
  r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
  g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
  b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);
  return [r * 255, g * 255, b * 255];
};
convert$2.xyz.lab = function(xyz) {
  let x = xyz[0];
  let y = xyz[1];
  let z = xyz[2];
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
  y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
  z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [l, a, b];
};
convert$2.lab.xyz = function(lab) {
  const l = lab[0];
  const a = lab[1];
  const b = lab[2];
  let x;
  let y;
  let z;
  y = (l + 16) / 116;
  x = a / 500 + y;
  z = y - b / 200;
  const y2 = y ** 3;
  const x2 = x ** 3;
  const z2 = z ** 3;
  y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
  x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
  z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
  x *= 95.047;
  y *= 100;
  z *= 108.883;
  return [x, y, z];
};
convert$2.lab.lch = function(lab) {
  const l = lab[0];
  const a = lab[1];
  const b = lab[2];
  let h2;
  const hr = Math.atan2(b, a);
  h2 = hr * 360 / 2 / Math.PI;
  if (h2 < 0) {
    h2 += 360;
  }
  const c = Math.sqrt(a * a + b * b);
  return [l, c, h2];
};
convert$2.lch.lab = function(lch) {
  const l = lch[0];
  const c = lch[1];
  const h2 = lch[2];
  const hr = h2 / 360 * 2 * Math.PI;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  return [l, a, b];
};
convert$2.rgb.ansi16 = function(args, saturation = null) {
  const [r, g, b] = args;
  let value = saturation === null ? convert$2.rgb.hsv(args)[2] : saturation;
  value = Math.round(value / 50);
  if (value === 0) {
    return 30;
  }
  let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
  if (value === 2) {
    ansi += 60;
  }
  return ansi;
};
convert$2.hsv.ansi16 = function(args) {
  return convert$2.rgb.ansi16(convert$2.hsv.rgb(args), args[2]);
};
convert$2.rgb.ansi256 = function(args) {
  const r = args[0];
  const g = args[1];
  const b = args[2];
  if (r === g && g === b) {
    if (r < 8) {
      return 16;
    }
    if (r > 248) {
      return 231;
    }
    return Math.round((r - 8) / 247 * 24) + 232;
  }
  const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
  return ansi;
};
convert$2.ansi16.rgb = function(args) {
  let color2 = args % 10;
  if (color2 === 0 || color2 === 7) {
    if (args > 50) {
      color2 += 3.5;
    }
    color2 = color2 / 10.5 * 255;
    return [color2, color2, color2];
  }
  const mult = (~~(args > 50) + 1) * 0.5;
  const r = (color2 & 1) * mult * 255;
  const g = (color2 >> 1 & 1) * mult * 255;
  const b = (color2 >> 2 & 1) * mult * 255;
  return [r, g, b];
};
convert$2.ansi256.rgb = function(args) {
  if (args >= 232) {
    const c = (args - 232) * 10 + 8;
    return [c, c, c];
  }
  args -= 16;
  let rem;
  const r = Math.floor(args / 36) / 5 * 255;
  const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
  const b = rem % 6 / 5 * 255;
  return [r, g, b];
};
convert$2.rgb.hex = function(args) {
  const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
  const string = integer.toString(16).toUpperCase();
  return "000000".substring(string.length) + string;
};
convert$2.hex.rgb = function(args) {
  const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [0, 0, 0];
  }
  let colorString2 = match[0];
  if (match[0].length === 3) {
    colorString2 = colorString2.split("").map((char) => {
      return char + char;
    }).join("");
  }
  const integer = parseInt(colorString2, 16);
  const r = integer >> 16 & 255;
  const g = integer >> 8 & 255;
  const b = integer & 255;
  return [r, g, b];
};
convert$2.rgb.hcg = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max2 = Math.max(Math.max(r, g), b);
  const min2 = Math.min(Math.min(r, g), b);
  const chroma = max2 - min2;
  let grayscale;
  let hue;
  if (chroma < 1) {
    grayscale = min2 / (1 - chroma);
  } else {
    grayscale = 0;
  }
  if (chroma <= 0) {
    hue = 0;
  } else if (max2 === r) {
    hue = (g - b) / chroma % 6;
  } else if (max2 === g) {
    hue = 2 + (b - r) / chroma;
  } else {
    hue = 4 + (r - g) / chroma;
  }
  hue /= 6;
  hue %= 1;
  return [hue * 360, chroma * 100, grayscale * 100];
};
convert$2.hsl.hcg = function(hsl) {
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
  let f = 0;
  if (c < 1) {
    f = (l - 0.5 * c) / (1 - c);
  }
  return [hsl[0], c * 100, f * 100];
};
convert$2.hsv.hcg = function(hsv) {
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;
  const c = s * v;
  let f = 0;
  if (c < 1) {
    f = (v - c) / (1 - c);
  }
  return [hsv[0], c * 100, f * 100];
};
convert$2.hcg.rgb = function(hcg) {
  const h2 = hcg[0] / 360;
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  if (c === 0) {
    return [g * 255, g * 255, g * 255];
  }
  const pure = [0, 0, 0];
  const hi = h2 % 1 * 6;
  const v = hi % 1;
  const w = 1 - v;
  let mg = 0;
  switch (Math.floor(hi)) {
    case 0:
      pure[0] = 1;
      pure[1] = v;
      pure[2] = 0;
      break;
    case 1:
      pure[0] = w;
      pure[1] = 1;
      pure[2] = 0;
      break;
    case 2:
      pure[0] = 0;
      pure[1] = 1;
      pure[2] = v;
      break;
    case 3:
      pure[0] = 0;
      pure[1] = w;
      pure[2] = 1;
      break;
    case 4:
      pure[0] = v;
      pure[1] = 0;
      pure[2] = 1;
      break;
    default:
      pure[0] = 1;
      pure[1] = 0;
      pure[2] = w;
  }
  mg = (1 - c) * g;
  return [
    (c * pure[0] + mg) * 255,
    (c * pure[1] + mg) * 255,
    (c * pure[2] + mg) * 255
  ];
};
convert$2.hcg.hsv = function(hcg) {
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  const v = c + g * (1 - c);
  let f = 0;
  if (v > 0) {
    f = c / v;
  }
  return [hcg[0], f * 100, v * 100];
};
convert$2.hcg.hsl = function(hcg) {
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  const l = g * (1 - c) + 0.5 * c;
  let s = 0;
  if (l > 0 && l < 0.5) {
    s = c / (2 * l);
  } else if (l >= 0.5 && l < 1) {
    s = c / (2 * (1 - l));
  }
  return [hcg[0], s * 100, l * 100];
};
convert$2.hcg.hwb = function(hcg) {
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  const v = c + g * (1 - c);
  return [hcg[0], (v - c) * 100, (1 - v) * 100];
};
convert$2.hwb.hcg = function(hwb) {
  const w = hwb[1] / 100;
  const b = hwb[2] / 100;
  const v = 1 - b;
  const c = v - w;
  let g = 0;
  if (c < 1) {
    g = (v - c) / (1 - c);
  }
  return [hwb[0], c * 100, g * 100];
};
convert$2.apple.rgb = function(apple) {
  return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
};
convert$2.rgb.apple = function(rgb) {
  return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
};
convert$2.gray.rgb = function(args) {
  return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};
convert$2.gray.hsl = function(args) {
  return [0, 0, args[0]];
};
convert$2.gray.hsv = convert$2.gray.hsl;
convert$2.gray.hwb = function(gray) {
  return [0, 100, gray[0]];
};
convert$2.gray.cmyk = function(gray) {
  return [0, 0, 0, gray[0]];
};
convert$2.gray.lab = function(gray) {
  return [gray[0], 0, 0];
};
convert$2.gray.hex = function(gray) {
  const val = Math.round(gray[0] / 100 * 255) & 255;
  const integer = (val << 16) + (val << 8) + val;
  const string = integer.toString(16).toUpperCase();
  return "000000".substring(string.length) + string;
};
convert$2.rgb.gray = function(rgb) {
  const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
  return [val / 255 * 100];
};
var conversions$1 = conversions$2;
function buildGraph() {
  const graph = {};
  const models2 = Object.keys(conversions$1);
  for (let len = models2.length, i = 0; i < len; i++) {
    graph[models2[i]] = {
      // http://jsperf.com/1-vs-infinity
      // micro-opt, but this is simple.
      distance: -1,
      parent: null
    };
  }
  return graph;
}
function deriveBFS(fromModel) {
  const graph = buildGraph();
  const queue = [fromModel];
  graph[fromModel].distance = 0;
  while (queue.length) {
    const current = queue.pop();
    const adjacents = Object.keys(conversions$1[current]);
    for (let len = adjacents.length, i = 0; i < len; i++) {
      const adjacent = adjacents[i];
      const node = graph[adjacent];
      if (node.distance === -1) {
        node.distance = graph[current].distance + 1;
        node.parent = current;
        queue.unshift(adjacent);
      }
    }
  }
  return graph;
}
function link(from, to) {
  return function(args) {
    return to(from(args));
  };
}
function wrapConversion(toModel, graph) {
  const path = [graph[toModel].parent, toModel];
  let fn2 = conversions$1[graph[toModel].parent][toModel];
  let cur = graph[toModel].parent;
  while (graph[cur].parent) {
    path.unshift(graph[cur].parent);
    fn2 = link(conversions$1[graph[cur].parent][cur], fn2);
    cur = graph[cur].parent;
  }
  fn2.conversion = path;
  return fn2;
}
var route$1 = function(fromModel) {
  const graph = deriveBFS(fromModel);
  const conversion = {};
  const models2 = Object.keys(graph);
  for (let len = models2.length, i = 0; i < len; i++) {
    const toModel = models2[i];
    const node = graph[toModel];
    if (node.parent === null) {
      continue;
    }
    conversion[toModel] = wrapConversion(toModel, graph);
  }
  return conversion;
};
var conversions = conversions$2;
var route = route$1;
var convert$1 = {};
var models = Object.keys(conversions);
function wrapRaw(fn2) {
  const wrappedFn = function(...args) {
    const arg0 = args[0];
    if (arg0 === void 0 || arg0 === null) {
      return arg0;
    }
    if (arg0.length > 1) {
      args = arg0;
    }
    return fn2(args);
  };
  if ("conversion" in fn2) {
    wrappedFn.conversion = fn2.conversion;
  }
  return wrappedFn;
}
function wrapRounded(fn2) {
  const wrappedFn = function(...args) {
    const arg0 = args[0];
    if (arg0 === void 0 || arg0 === null) {
      return arg0;
    }
    if (arg0.length > 1) {
      args = arg0;
    }
    const result = fn2(args);
    if (typeof result === "object") {
      for (let len = result.length, i = 0; i < len; i++) {
        result[i] = Math.round(result[i]);
      }
    }
    return result;
  };
  if ("conversion" in fn2) {
    wrappedFn.conversion = fn2.conversion;
  }
  return wrappedFn;
}
models.forEach((fromModel) => {
  convert$1[fromModel] = {};
  Object.defineProperty(convert$1[fromModel], "channels", { value: conversions[fromModel].channels });
  Object.defineProperty(convert$1[fromModel], "labels", { value: conversions[fromModel].labels });
  const routes = route(fromModel);
  const routeModels = Object.keys(routes);
  routeModels.forEach((toModel) => {
    const fn2 = routes[toModel];
    convert$1[fromModel][toModel] = wrapRounded(fn2);
    convert$1[fromModel][toModel].raw = wrapRaw(fn2);
  });
});
var colorConvert = convert$1;
var colorString = colorStringExports;
var convert = colorConvert;
var skippedModels = [
  // To be honest, I don't really feel like keyword belongs in color convert, but eh.
  "keyword",
  // Gray conflicts with some method names, and has its own method defined.
  "gray",
  // Shouldn't really be in color-convert either...
  "hex"
];
var hashedModelKeys = {};
for (const model of Object.keys(convert)) {
  hashedModelKeys[[...convert[model].labels].sort().join("")] = model;
}
var limiters = {};
function Color(object, model) {
  if (!(this instanceof Color)) {
    return new Color(object, model);
  }
  if (model && model in skippedModels) {
    model = null;
  }
  if (model && !(model in convert)) {
    throw new Error("Unknown model: " + model);
  }
  let i;
  let channels;
  if (object == null) {
    this.model = "rgb";
    this.color = [0, 0, 0];
    this.valpha = 1;
  } else if (object instanceof Color) {
    this.model = object.model;
    this.color = [...object.color];
    this.valpha = object.valpha;
  } else if (typeof object === "string") {
    const result = colorString.get(object);
    if (result === null) {
      throw new Error("Unable to parse color from string: " + object);
    }
    this.model = result.model;
    channels = convert[this.model].channels;
    this.color = result.value.slice(0, channels);
    this.valpha = typeof result.value[channels] === "number" ? result.value[channels] : 1;
  } else if (object.length > 0) {
    this.model = model || "rgb";
    channels = convert[this.model].channels;
    const newArray = Array.prototype.slice.call(object, 0, channels);
    this.color = zeroArray(newArray, channels);
    this.valpha = typeof object[channels] === "number" ? object[channels] : 1;
  } else if (typeof object === "number") {
    this.model = "rgb";
    this.color = [
      object >> 16 & 255,
      object >> 8 & 255,
      object & 255
    ];
    this.valpha = 1;
  } else {
    this.valpha = 1;
    const keys = Object.keys(object);
    if ("alpha" in object) {
      keys.splice(keys.indexOf("alpha"), 1);
      this.valpha = typeof object.alpha === "number" ? object.alpha : 0;
    }
    const hashedKeys = keys.sort().join("");
    if (!(hashedKeys in hashedModelKeys)) {
      throw new Error("Unable to parse color from object: " + JSON.stringify(object));
    }
    this.model = hashedModelKeys[hashedKeys];
    const { labels } = convert[this.model];
    const color2 = [];
    for (i = 0; i < labels.length; i++) {
      color2.push(object[labels[i]]);
    }
    this.color = zeroArray(color2);
  }
  if (limiters[this.model]) {
    channels = convert[this.model].channels;
    for (i = 0; i < channels; i++) {
      const limit = limiters[this.model][i];
      if (limit) {
        this.color[i] = limit(this.color[i]);
      }
    }
  }
  this.valpha = Math.max(0, Math.min(1, this.valpha));
  if (Object.freeze) {
    Object.freeze(this);
  }
}
Color.prototype = {
  toString() {
    return this.string();
  },
  toJSON() {
    return this[this.model]();
  },
  string(places) {
    let self = this.model in colorString.to ? this : this.rgb();
    self = self.round(typeof places === "number" ? places : 1);
    const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
    return colorString.to[self.model](args);
  },
  percentString(places) {
    const self = this.rgb().round(typeof places === "number" ? places : 1);
    const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
    return colorString.to.rgb.percent(args);
  },
  array() {
    return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
  },
  object() {
    const result = {};
    const { channels } = convert[this.model];
    const { labels } = convert[this.model];
    for (let i = 0; i < channels; i++) {
      result[labels[i]] = this.color[i];
    }
    if (this.valpha !== 1) {
      result.alpha = this.valpha;
    }
    return result;
  },
  unitArray() {
    const rgb = this.rgb().color;
    rgb[0] /= 255;
    rgb[1] /= 255;
    rgb[2] /= 255;
    if (this.valpha !== 1) {
      rgb.push(this.valpha);
    }
    return rgb;
  },
  unitObject() {
    const rgb = this.rgb().object();
    rgb.r /= 255;
    rgb.g /= 255;
    rgb.b /= 255;
    if (this.valpha !== 1) {
      rgb.alpha = this.valpha;
    }
    return rgb;
  },
  round(places) {
    places = Math.max(places || 0, 0);
    return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
  },
  alpha(value) {
    if (value !== void 0) {
      return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
    }
    return this.valpha;
  },
  // Rgb
  red: getset("rgb", 0, maxfn(255)),
  green: getset("rgb", 1, maxfn(255)),
  blue: getset("rgb", 2, maxfn(255)),
  hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (value) => (value % 360 + 360) % 360),
  saturationl: getset("hsl", 1, maxfn(100)),
  lightness: getset("hsl", 2, maxfn(100)),
  saturationv: getset("hsv", 1, maxfn(100)),
  value: getset("hsv", 2, maxfn(100)),
  chroma: getset("hcg", 1, maxfn(100)),
  gray: getset("hcg", 2, maxfn(100)),
  white: getset("hwb", 1, maxfn(100)),
  wblack: getset("hwb", 2, maxfn(100)),
  cyan: getset("cmyk", 0, maxfn(100)),
  magenta: getset("cmyk", 1, maxfn(100)),
  yellow: getset("cmyk", 2, maxfn(100)),
  black: getset("cmyk", 3, maxfn(100)),
  x: getset("xyz", 0, maxfn(95.047)),
  y: getset("xyz", 1, maxfn(100)),
  z: getset("xyz", 2, maxfn(108.833)),
  l: getset("lab", 0, maxfn(100)),
  a: getset("lab", 1),
  b: getset("lab", 2),
  keyword(value) {
    if (value !== void 0) {
      return new Color(value);
    }
    return convert[this.model].keyword(this.color);
  },
  hex(value) {
    if (value !== void 0) {
      return new Color(value);
    }
    return colorString.to.hex(this.rgb().round().color);
  },
  hexa(value) {
    if (value !== void 0) {
      return new Color(value);
    }
    const rgbArray = this.rgb().round().color;
    let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
    if (alphaHex.length === 1) {
      alphaHex = "0" + alphaHex;
    }
    return colorString.to.hex(rgbArray) + alphaHex;
  },
  rgbNumber() {
    const rgb = this.rgb().color;
    return (rgb[0] & 255) << 16 | (rgb[1] & 255) << 8 | rgb[2] & 255;
  },
  luminosity() {
    const rgb = this.rgb().color;
    const lum = [];
    for (const [i, element] of rgb.entries()) {
      const chan = element / 255;
      lum[i] = chan <= 0.04045 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
    }
    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  },
  contrast(color2) {
    const lum1 = this.luminosity();
    const lum2 = color2.luminosity();
    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05);
    }
    return (lum2 + 0.05) / (lum1 + 0.05);
  },
  level(color2) {
    const contrastRatio = this.contrast(color2);
    if (contrastRatio >= 7) {
      return "AAA";
    }
    return contrastRatio >= 4.5 ? "AA" : "";
  },
  isDark() {
    const rgb = this.rgb().color;
    const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 1e4;
    return yiq < 128;
  },
  isLight() {
    return !this.isDark();
  },
  negate() {
    const rgb = this.rgb();
    for (let i = 0; i < 3; i++) {
      rgb.color[i] = 255 - rgb.color[i];
    }
    return rgb;
  },
  lighten(ratio) {
    const hsl = this.hsl();
    hsl.color[2] += hsl.color[2] * ratio;
    return hsl;
  },
  darken(ratio) {
    const hsl = this.hsl();
    hsl.color[2] -= hsl.color[2] * ratio;
    return hsl;
  },
  saturate(ratio) {
    const hsl = this.hsl();
    hsl.color[1] += hsl.color[1] * ratio;
    return hsl;
  },
  desaturate(ratio) {
    const hsl = this.hsl();
    hsl.color[1] -= hsl.color[1] * ratio;
    return hsl;
  },
  whiten(ratio) {
    const hwb = this.hwb();
    hwb.color[1] += hwb.color[1] * ratio;
    return hwb;
  },
  blacken(ratio) {
    const hwb = this.hwb();
    hwb.color[2] += hwb.color[2] * ratio;
    return hwb;
  },
  grayscale() {
    const rgb = this.rgb().color;
    const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
    return Color.rgb(value, value, value);
  },
  fade(ratio) {
    return this.alpha(this.valpha - this.valpha * ratio);
  },
  opaquer(ratio) {
    return this.alpha(this.valpha + this.valpha * ratio);
  },
  rotate(degrees) {
    const hsl = this.hsl();
    let hue = hsl.color[0];
    hue = (hue + degrees) % 360;
    hue = hue < 0 ? 360 + hue : hue;
    hsl.color[0] = hue;
    return hsl;
  },
  mix(mixinColor, weight) {
    if (!mixinColor || !mixinColor.rgb) {
      throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
    }
    const color1 = mixinColor.rgb();
    const color2 = this.rgb();
    const p = weight === void 0 ? 0.5 : weight;
    const w = 2 * p - 1;
    const a = color1.alpha() - color2.alpha();
    const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
    const w2 = 1 - w1;
    return Color.rgb(
      w1 * color1.red() + w2 * color2.red(),
      w1 * color1.green() + w2 * color2.green(),
      w1 * color1.blue() + w2 * color2.blue(),
      color1.alpha() * p + color2.alpha() * (1 - p)
    );
  }
};
for (const model of Object.keys(convert)) {
  if (skippedModels.includes(model)) {
    continue;
  }
  const { channels } = convert[model];
  Color.prototype[model] = function(...args) {
    if (this.model === model) {
      return new Color(this);
    }
    if (args.length > 0) {
      return new Color(args, model);
    }
    return new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);
  };
  Color[model] = function(...args) {
    let color2 = args[0];
    if (typeof color2 === "number") {
      color2 = zeroArray(args, channels);
    }
    return new Color(color2, model);
  };
}
function roundTo(number, places) {
  return Number(number.toFixed(places));
}
function roundToPlace(places) {
  return function(number) {
    return roundTo(number, places);
  };
}
function getset(model, channel, modifier) {
  model = Array.isArray(model) ? model : [model];
  for (const m of model) {
    (limiters[m] || (limiters[m] = []))[channel] = modifier;
  }
  model = model[0];
  return function(value) {
    let result;
    if (value !== void 0) {
      if (modifier) {
        value = modifier(value);
      }
      result = this[model]();
      result.color[channel] = value;
      return result;
    }
    result = this[model]().color[channel];
    if (modifier) {
      result = modifier(result);
    }
    return result;
  };
}
function maxfn(max2) {
  return function(v) {
    return Math.max(0, Math.min(max2, v));
  };
}
function assertArray(value) {
  return Array.isArray(value) ? value : [value];
}
function zeroArray(array, length) {
  for (let i = 0; i < length; i++) {
    if (typeof array[i] !== "number") {
      array[i] = 0;
    }
  }
  return array;
}
var color = Color;
var Color$1 = getDefaultExportFromCjs(color);
var capitalize = (str) => {
  if (!str || str.length === 0)
    return "";
  const lower = str.toLowerCase();
  return lower.substring(0, 1).toUpperCase() + lower.substring(1, lower.length);
};
var dash = (str) => {
  var _a;
  const parts = ((_a = str == null ? void 0 : str.replace(/([A-Z])+/g, capitalize)) == null ? void 0 : _a.split(/(?=[A-Z])|[\.\-\s_]/).map((x) => x.toLowerCase())) ?? [];
  if (parts.length === 0)
    return "";
  if (parts.length === 1)
    return parts[0];
  return parts.reduce((acc, part) => {
    return `${acc}-${part.toLowerCase()}`;
  });
};
var pascal = (str) => {
  const parts = (str == null ? void 0 : str.split(/[\.\-\s_]/).map((x) => x.toLowerCase())) ?? [];
  if (parts.length === 0)
    return "";
  return parts.map((str2) => str2.charAt(0).toUpperCase() + str2.slice(1)).join("");
};
var title = (str) => {
  if (!str)
    return "";
  return str.split(/(?=[A-Z])|[\.\-\s_]/).map((s) => s.trim()).filter((s) => !!s).map((s) => capitalize(s.toLowerCase())).join(" ");
};
function useClasses(options) {
  var _a;
  const instance = getCurrentInstance();
  const instanceProps = (instance == null ? void 0 : instance.props) || {};
  const name = dash(((_a = instance == null ? void 0 : instance.type) == null ? void 0 : _a.name) || "");
  return computed(() => {
    const result = [name];
    const { valueProps = [], nameProps = [], nameValueProps = [] } = options;
    for (const item of valueProps) {
      if (instanceProps[item]) {
        result.push(`${name}--${instanceProps[item]}`);
      }
    }
    for (const item of nameProps) {
      if (instanceProps[item]) {
        result.push(`${name}--${item}`);
      }
    }
    for (const item of nameValueProps) {
      if (instanceProps[item]) {
        result.push(`${name}-${item}--${instanceProps[item]}`);
      }
    }
    return result.join(" ");
  });
}
function useStyles(handler) {
  var _a;
  const instance = getCurrentInstance();
  const instanceProps = (instance == null ? void 0 : instance.props) || {};
  const name = dash(((_a = instance == null ? void 0 : instance.type) == null ? void 0 : _a.name) || "");
  return computed(() => {
    let result = {};
    if (typeof instanceProps.size === "number") {
      const sizeStyles = getComponentSizeStyles(name, instanceProps.size);
      result = sizeStyles;
    }
    if (handler) {
      result = {
        ...result,
        ...(handler == null ? void 0 : handler(result, instanceProps)) || {}
      };
    }
    return result;
  });
}
function useState(defaultValue, onSetState) {
  const state = ref(defaultValue);
  function setState(newValue) {
    state.value = newValue;
    onSetState == null ? void 0 : onSetState(newValue);
  }
  return [state, setState];
}
function useVModel(options) {
  const instance = getCurrentInstance();
  if (!instance) return [];
  const { onSetValue, propName = "value" } = options;
  const { emit, vnode } = instance;
  const vProps = vnode.props || {};
  let changeHandler = () => {
  };
  if (instance.props.onChange) {
    changeHandler = instance.props.onChange;
  }
  if (Object.prototype.hasOwnProperty.call(vProps, "modelValue")) {
    return [
      options.props.modelValue,
      (newValue, ...args) => {
        emit("update:modelValue", newValue);
        emit("change", newValue);
        changeHandler(newValue, ...args);
        onSetValue == null ? void 0 : onSetValue(newValue);
      }
    ];
  }
  if (Object.prototype.hasOwnProperty.call(vProps, propName)) {
    return [
      options.props[propName],
      (newValue, ...args) => {
        emit(`update:${propName}`, newValue);
        emit("change", newValue);
        changeHandler(newValue, ...args);
        onSetValue == null ? void 0 : onSetValue(newValue);
      }
    ];
  }
  const internalValue = ref(options.props.defaultValue.value);
  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue;
      changeHandler(newValue, ...args);
      emit("change", newValue);
      onSetValue == null ? void 0 : onSetValue(newValue);
    }
  ];
}
function getFilterNodes(nodes, allowNodeTypes) {
  return nodes.filter((n) => {
    const type = Object.prototype.toString.call(n.type) === "[object Object]" ? n.type.name : n.type.toString();
    if (type === "Symbol(v-fgt)") return true;
    if (allowNodeTypes.length && !allowNodeTypes.includes(type)) {
      console.warn(
        `[white-block]: Detected invalid child element type: \`${type}\``
      );
      return false;
    }
    return true;
  });
}
function useNode() {
  const instance = getCurrentInstance();
  return function(name, options) {
    var _a, _b;
    if (!instance) return null;
    const { prior = "slots", allowNodeTypes = [] } = options || {};
    let slotNode = null;
    if (instance.slots[name]) {
      const nodes = (_b = (_a = instance.slots)[name]) == null ? void 0 : _b.call(_a, instance.props);
      if (nodes) {
        slotNode = getFilterNodes(nodes, allowNodeTypes);
      }
    }
    if (prior === "slots" && slotNode) return slotNode;
    let propNode = null;
    if (instance.props[name]) {
      propNode = instance.props[name];
    }
    if (typeof propNode === "function") {
      propNode = propNode(h, {});
    }
    return propNode;
  };
}
function useNodes() {
  const renderNode = useNode();
  return function(names, options) {
    for (const name of names) {
      const node = renderNode(name, options);
      if (node) {
        return node;
      }
    }
    return null;
  };
}
function useNodeChildren() {
  var _a, _b;
  const instance = getCurrentInstance();
  if (!(instance == null ? void 0 : instance.slots.default)) return [];
  return (_b = (_a = instance.slots).default) == null ? void 0 : _b.call(_a, instance.props);
}
function usePropEmits() {
  const instance = getCurrentInstance();
  return function(action, ...params) {
    var _a, _b;
    const propsEmitName = `on${pascal(title(action))}`;
    if (instance == null ? void 0 : instance.props[propsEmitName]) {
      (_b = instance == null ? void 0 : (_a = instance.props)[propsEmitName]) == null ? void 0 : _b.call(_a, ...params);
    } else {
      instance == null ? void 0 : instance.emit(action, ...params);
    }
  };
}
var SizeDefault = {
  size: "md"
};
var LoadingDefault = {
  loading: false
};
var DisabledDefault = {
  disabled: false
};
var ReadonlyDefault = {
  readonly: false
};
var ClearableDefault = {
  clearable: false
};
var XDefaultProps$f = {
  content: "",
  type: "base",
  color: "",
  theme: "primary",
  shape: "rectangle",
  block: false,
  tag: "button"
};
var DefaultProps$g = {
  ...SizeDefault,
  ...LoadingDefault,
  ...DisabledDefault,
  ...XDefaultProps$f
};
var _hoisted_1$f = {
  key: 0,
  name: "prefix",
  h: "full",
  flex: "~ row",
  items: "center",
  justify: "center"
};
var _hoisted_2$a = {
  key: 0,
  w: "1em",
  h: "1em",
  i: "svg-spinners-180-ring"
};
var _sfc_main$l = defineComponent({
  ...{ name: "WbButton" },
  __name: "button",
  props: mergeDefaults({
    type: {},
    color: {},
    theme: {},
    shape: {},
    block: { type: Boolean },
    tag: {},
    onClick: { type: Function },
    default: { type: [String, Object, Function] },
    content: { type: [String, Object, Function] },
    prefix: { type: [String, Object, Function] },
    suffix: { type: [String, Object, Function] },
    size: {},
    loading: { type: Boolean },
    disabled: { type: Boolean }
  }, DefaultProps$g),
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const propsClasses = useClasses({
      valueProps: ["type", "theme", "shape", "size"],
      nameProps: ["block", "loading", "disabled"]
    });
    const propsStyles = useStyles(() => {
      if (props.color) {
        const palette = Color$1(props.color);
        const { color: color2, valpha } = palette.rgb();
        return {
          "--wb-button-color-main": `rgb(${color2.join(" ")} / ${valpha})`,
          "--wb-button-vc-main": color2.join(" ")
        };
      }
    });
    const renderNodes = useNodes();
    const ContentNode = () => renderNodes(["content", "default"]);
    const renderNode = useNode();
    const PrefixNode = () => renderNode("prefix");
    const SuffixNode = () => renderNode("suffix");
    const propEmits = usePropEmits();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(_ctx.tag || "button"), mergeProps({
        disabled: _ctx.loading || _ctx.disabled,
        "aria-disabled": _ctx.loading || _ctx.disabled,
        h: "$wb-button-height",
        p: "x-$wb-button-padding",
        bg: "$wb-button-background hover:$wb-button-background-hover active:$wb-button-background-active",
        color: "$wb-button-text hover:$wb-button-text-hover active:$wb-button-text-active",
        ring: "1 inset $wb-button-border hover:$wb-button-border-hover active:$wb-button-border-active",
        rounded: "$wb-button-radius",
        flex: "inline row nowrap",
        justify: "center",
        items: "center",
        gap: "$wb-button-gap",
        cursor: "pointer",
        select: "none",
        outline: "none",
        "focus-visible": "outline outline-2 outline-offset-2 outline-$wb-color-primary",
        transition: "all ease duration-200",
        box: "border"
      }, { ..._ctx.$attrs }, {
        type: _ctx.$attrs["form-type"] || _ctx.tag,
        class: unref(propsClasses),
        style: unref(propsStyles),
        onClick: _cache[0] || (_cache[0] = ($event) => unref(propEmits)("click", $event))
      }), {
        default: withCtx(() => [
          _ctx.prefix || _ctx.$slots.prefix || _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_1$f, [
            _ctx.loading ? (openBlock(), createElementBlock("i", _hoisted_2$a)) : (openBlock(), createBlock(PrefixNode, { key: 1 }))
          ])) : createCommentVNode("v-if", true),
          !(_ctx.loading && ["circle", "square"].includes(_ctx.shape)) ? (openBlock(), createBlock(ContentNode, { key: 1 })) : createCommentVNode("v-if", true),
          createVNode(SuffixNode)
        ]),
        _: 1
        /* STABLE */
      }, 16, ["disabled", "aria-disabled", "type", "class", "style"]);
    };
  }
});
function useButton(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$l, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Button = withInstall(_sfc_main$l);
var XDefaultProps$e = {
  type: "base",
  theme: "primary",
  shape: "rectangle",
  tag: "button",
  separate: false,
  gap: "md",
  allowTypes: ["WbButton"]
};
var DefaultProps$f = {
  ...SizeDefault,
  ...DisabledDefault,
  ...XDefaultProps$e
};
var _hoisted_1$e = ["gap"];
var _sfc_main$k = defineComponent({
  ...{ name: "WbButtonGroup" },
  __name: "button-group",
  props: mergeDefaults({
    options: {},
    buttonProps: {},
    type: {},
    theme: {},
    shape: {},
    separate: { type: Boolean },
    gap: {},
    allowTypes: {},
    tag: {},
    onClick: { type: Function },
    default: { type: [Object, Function] },
    size: {},
    disabled: { type: Boolean }
  }, DefaultProps$f),
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["type", "theme", "size", "shape"],
      nameProps: ["loading", "disabled", "separate"],
      nameValueProps: ["gap"]
    });
    const propsStyles = useStyles((result) => {
      if (props.gap && typeof props.gap === "number") {
        return {
          ...result,
          "--wb-button-group-gap": `calc(${props.gap} / 16 * 1rem)`
        };
      }
    });
    const renderNode = useNode();
    const ContentNode = () => renderNode("default", { allowNodeTypes: props.allowTypes || ["WbButton"] });
    function handleGroupClick(key, e) {
      if (key) {
        emits("click", key, e);
      }
    }
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock("div", mergeProps({
        rounded: "$wb-radio-group-radius",
        flex: "~ row nowrap",
        gap: _ctx.separate ? "$wb-button-group-gap" : ""
      }, _ctx.$attrs, {
        class: unref(propsClasses),
        style: unref(propsStyles),
        onClick: _cache[0] || (_cache[0] = withModifiers(($event) => unref(clickDelegateKey)($event, "wb-button", handleGroupClick), ["stop"]))
      }), [
        !((_a = _ctx.options) == null ? void 0 : _a.length) ? (openBlock(), createBlock(resolveDynamicComponent(ContentNode), { key: 0 })) : (openBlock(true), createElementBlock(
          Fragment,
          { key: 1 },
          renderList(_ctx.options, (item, index2) => {
            return openBlock(), createBlock(_sfc_main$l, mergeProps({
              key: item.key || index2,
              type: _ctx.type,
              theme: _ctx.theme,
              shape: _ctx.shape,
              size: _ctx.size,
              tag: _ctx.tag,
              disabled: _ctx.disabled,
              ref_for: true
            }, { ..._ctx.buttonProps || {}, ...item }, { flex: "1 inline" }), null, 16, ["type", "theme", "shape", "size", "tag", "disabled"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ], 16, _hoisted_1$e);
    };
  }
});
function useButtonGroup(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$k, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var ButtonGroup = withInstall(_sfc_main$k);
var XDefaultProps$d = {
  type: "base",
  placeholder: "",
  shape: "rectangle",
  maxLength: -1,
  align: "start"
};
var DefaultProps$e = {
  ...SizeDefault,
  ...LoadingDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...ClearableDefault,
  ...XDefaultProps$d
};
var _hoisted_1$d = ["value", "maxlength", "readonly", "disabled", "placeholder"];
var _hoisted_2$9 = {
  key: 0,
  tabindex: "-1",
  flex: "~ shrink-0",
  items: "center",
  justify: "center",
  color: "$wb-color-placeholder"
};
var _hoisted_3$2 = {
  key: 0,
  w: "1em",
  h: "1em",
  i: "svg-spinners-180-ring"
};
var _sfc_main$j = defineComponent({
  ...{ name: "WbInput" },
  __name: "input",
  props: mergeDefaults({
    placeholder: {},
    type: {},
    align: {},
    shape: {},
    maxLength: {},
    icon: { type: [String, Object, Function] },
    prefix: { type: [String, Object, Function] },
    suffix: { type: [String, Object, Function] },
    size: {},
    loading: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    clearable: { type: Boolean },
    value: {},
    modelValue: {},
    defaultValue: {},
    onChange: { type: Function }
  }, DefaultProps$e),
  emits: ["clear", "enter", "blur", "change", "update:value", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["type", "align", "shape", "size"],
      nameProps: ["loading", "disabled", "readonly", "clearable"]
    });
    const propsStyles = useStyles();
    const renderNode = useNode();
    const PrefixNode = () => renderNode("prefix");
    const SuffixNode = () => renderNode("suffix");
    const IconNode = () => renderNode("icon");
    const [inputValue, setInputValue] = useVModel({ props: toRefs(props) });
    const InputRef = ref();
    function setFocus() {
      var _a;
      (_a = InputRef.value) == null ? void 0 : _a.focus();
    }
    function handleClear() {
      setInputValue("");
      emits("clear");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          relative: "",
          w: "$wb-input-width",
          h: "$wb-input-height",
          p: "x-$wb-input-padding y-2px",
          bg: "$wb-input-background",
          rounded: "$wb-input-radius",
          ring: "1 $wb-input-border",
          overflow: "hidden",
          "focus-within": "outline outline-2 outline-$wb-color-primary",
          flex: "inline",
          items: "center",
          gap: "$wb-input-gap",
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles)),
          onClick: setFocus
        },
        [
          createVNode(PrefixNode),
          createBaseVNode("input", mergeProps({
            ref_key: "InputRef",
            ref: InputRef
          }, _ctx.$attrs, {
            value: unref(inputValue),
            maxlength: _ctx.maxLength,
            readonly: _ctx.readonly,
            disabled: _ctx.disabled,
            placeholder: _ctx.placeholder ?? "Please input",
            border: "none",
            flex: "1",
            w: "full",
            h: "full",
            color: "$wb-input-text",
            class: "wb-input-content",
            onInput: _cache[0] || (_cache[0] = ($event) => unref(setInputValue)($event.target.value)),
            onEnter: _cache[1] || (_cache[1] = ($event) => emits("enter")),
            onBlur: _cache[2] || (_cache[2] = ($event) => emits("blur"))
          }), null, 16, _hoisted_1$d),
          _ctx.icon || _ctx.$slots.icon || _ctx.loading || _ctx.clearable ? (openBlock(), createElementBlock("button", _hoisted_2$9, [
            _ctx.loading ? (openBlock(), createElementBlock("i", _hoisted_3$2)) : _ctx.clearable && unref(inputValue) ? (openBlock(), createElementBlock("i", {
              key: 1,
              w: "1.25em",
              h: "1.25em",
              i: "mdi-close-circle",
              class: "wb-input-clear",
              onClick: withModifiers(handleClear, ["stop"])
            })) : (openBlock(), createBlock(IconNode, { key: 2 }))
          ])) : createCommentVNode("v-if", true),
          createVNode(SuffixNode)
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function useInput(options) {
  const inputValue = ref("");
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(
        _sfc_main$j,
        {
          "modelValue": inputValue.value,
          "onUpdate:modelValue": (val) => {
            inputValue.value = val;
          },
          ...options || {}
        },
        getRawSlots(slots)
      );
    }
  });
  return { node, value: inputValue };
}
var Input = withInstall(_sfc_main$j);
var DefaultProps$d = {
  vertical: false,
  align: "start",
  gap: "md"
};
var _sfc_main$i = defineComponent({
  ...{ name: "WbSpace" },
  __name: "space",
  props: mergeDefaults({
    vertical: { type: Boolean },
    align: {},
    gap: {},
    default: { type: [String, Object, Function] }
  }, DefaultProps$d),
  setup(__props) {
    const props = __props;
    const propsClasses = useClasses({
      valueProps: ["align", "gap"],
      nameProps: ["vertical"]
    });
    const propsStyles = useStyles(() => {
      if (typeof props.gap === "number") {
        return { "--wb-space-gap": `calc(${props.gap} / 16 * 1rem)` };
      }
    });
    const renderNode = useNode();
    const ContentNode = () => renderNode("default");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          flex: "~ row wrap",
          gap: "$wb-space-gap",
          items: "$wb-space-align",
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles))
        },
        [
          createVNode(ContentNode)
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function useSpace(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$i, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Space = withInstall(_sfc_main$i);
var XDefaultProps$c = {
  theme: "primary",
  shape: "round"
};
var DefaultProps$c = {
  ...SizeDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...XDefaultProps$c
};
var _hoisted_1$c = ["bg"];
var _hoisted_2$8 = ["flex"];
var _sfc_main$h = defineComponent({
  ...{ name: "WbToggle" },
  __name: "toggle",
  props: mergeDefaults({
    theme: {},
    color: {},
    shape: {},
    readonly: { type: Boolean },
    onClick: { type: Function },
    size: {},
    disabled: { type: Boolean },
    value: { type: Boolean },
    modelValue: { type: Boolean },
    defaultValue: { type: Boolean },
    onChange: { type: Function }
  }, DefaultProps$c),
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["theme", "shape", "size"]
    });
    const propsStyles = useStyles(() => {
      if (props.color) {
        const palette = Color$1(props.color);
        const { color: color2, valpha } = palette.rgb();
        return {
          "--wb-toggle-color": `rgb(${color2.join(" ")} / ${valpha})`
        };
      }
    });
    const [toggleValue, setToggleValue] = useVModel({
      props: toRefs(props)
    });
    function toggleActive() {
      setToggleValue(!toggleValue.value);
      emits("click", toggleValue.value);
    }
    watch(
      () => props.value,
      (val) => {
        setToggleValue(val);
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          h: "$wb-toggle-height",
          flex: "~ row",
          items: "center",
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles))
        },
        [
          createBaseVNode("button", {
            w: "[calc(var(--wb-toggle-height-content)*1.8)]",
            h: "$wb-toggle-height-content",
            bg: unref(toggleValue) ? "$wb-toggle-background-active" : "$wb-toggle-background",
            rounded: "$wb-toggle-radius",
            flex: "inline shrink-0",
            border: "2 solid transparent",
            cursor: "disabled:not-allowed",
            op: "disabled:50",
            "focus-visible": "rounded-full outline outline-2 outline-offset-2 outline-$wb-color-primary",
            transition: "colors ease-in-out duration-200",
            onClick: withModifiers(toggleActive, ["stop"])
          }, [
            createBaseVNode("span", {
              flex: unref(toggleValue) ? "1" : "0",
              "pointer-events": "none",
              transition: "all ease-in-out duration-200"
            }, null, 8, _hoisted_2$8),
            _cache[0] || (_cache[0] = createBaseVNode(
              "span",
              {
                "inline-block": "",
                w: "[calc(var(--wb-toggle-height-content)-0.25rem)]",
                h: "full",
                rounded: "$wb-toggle-radius",
                bg: "$wb-toggle-indicator",
                shadow: "md",
                "pointer-events": "none"
              },
              null,
              -1
              /* HOISTED */
            ))
          ], 8, _hoisted_1$c)
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function useToggle(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$h, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Toggle = withInstall(_sfc_main$h);
var XDefaultProps$b = {
  color: "",
  theme: "primary"
};
var DefaultProps$b = {
  ...SizeDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...ClearableDefault,
  ...XDefaultProps$b
};
var _hoisted_1$b = ["color"];
var _hoisted_2$7 = ["disabled", "checked"];
var _hoisted_3$1 = {
  w: "full",
  truncate: "",
  flex: "",
  items: "center",
  gap: "$wb-radio-gap",
  class: "wb-radio-content"
};
var _sfc_main$g = defineComponent({
  ...{ name: "WbRadio" },
  __name: "radio",
  props: mergeDefaults({
    color: {},
    theme: {},
    onClick: { type: Function },
    default: { type: [String, Object, Function] },
    content: { type: [String, Object, Function] },
    size: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    clearable: { type: Boolean },
    value: { type: Boolean },
    modelValue: { type: Boolean },
    defaultValue: { type: Boolean },
    onChange: { type: Function }
  }, DefaultProps$b),
  emits: ["click", "change", "update:value", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["theme", "size"],
      nameProps: ["disabled", "readonly", "clearable"]
    });
    const propsStyles = useStyles(() => {
      if (props.color) {
        const palette = Color$1(props.color);
        const { color: color2, valpha } = palette.rgb();
        return {
          "--wb-radio-text-active": `rgb(${color2.join(" ")} / ${valpha})`
        };
      }
    });
    const renderNodes = useNodes();
    const ContentNode = () => renderNodes(["content", "default"]);
    const [radioValue, setRadioValue] = useVModel({ props: toRefs(props) });
    function onClick(e) {
      if (props.readonly || props.disabled) {
        e.preventDefault();
        return;
      }
      const { checked } = e.target;
      if (props.clearable) {
        setRadioValue(!radioValue.value);
      } else if (checked !== radioValue.value) {
        setRadioValue(checked);
      }
      emits("click", radioValue.value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("label", {
        h: "$wb-radio-height",
        p: "x-$wb-radio-padding",
        rounded: "$wb-radio-radius",
        cursor: "pointer",
        select: "none",
        flex: "inline",
        items: "center",
        gap: "$wb-radio-gap",
        color: unref(radioValue) ? "$wb-radio-text-active" : "$wb-radio-text",
        class: normalizeClass(unref(propsClasses)),
        style: normalizeStyle(unref(propsStyles)),
        tabindex: "0"
      }, [
        createBaseVNode("input", {
          type: "radio",
          tabindex: "-1",
          disabled: _ctx.disabled,
          checked: unref(radioValue),
          w: "$wb-radio-size",
          h: "$wb-radio-size",
          overflow: "hidden",
          m: "0",
          cursor: "pointer",
          onClick: withModifiers(onClick, ["stop"])
        }, null, 8, _hoisted_2$7),
        createBaseVNode("div", _hoisted_3$1, [
          (openBlock(), createBlock(resolveDynamicComponent(ContentNode)))
        ])
      ], 14, _hoisted_1$b);
    };
  }
});
function useRadio(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$g, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Radio = withInstall(_sfc_main$g);
var XDefaultProps$a = {
  type: "base",
  shape: "rectangle",
  tabType: "soft",
  theme: "primary",
  vertical: false,
  options: []
};
var DefaultProps$a = {
  ...SizeDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...ClearableDefault,
  ...XDefaultProps$a
};
var _hoisted_1$a = {
  relative: "",
  flex: "~ row nowrap"
};
var _sfc_main$f = defineComponent({
  ...{ name: "WbRadioGroup" },
  __name: "radio-group",
  props: mergeDefaults({
    options: {},
    type: {},
    tabType: {},
    theme: {},
    shape: {},
    vertical: { type: Boolean },
    radioProps: {},
    onClick: { type: Function },
    default: { type: [String, Object, Function] },
    size: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    clearable: { type: Boolean },
    value: {},
    modelValue: {},
    defaultValue: {},
    onChange: { type: Function }
  }, DefaultProps$a),
  emits: ["click", "change", "update:value", "update:modelValue"],
  setup(__props) {
    const props = __props;
    const propsClasses = useClasses({
      valueProps: ["type", "tabType", "theme", "shape", "size", "disabled"],
      nameProps: ["vertical"]
    });
    const propsStyles = useStyles();
    const [radioGroupValue, setRadioGroupValue] = useVModel({
      props: toRefs(props)
    });
    const valueIndexMap = {};
    if (props.options) {
      for (let i = 0; i < props.options.length; i++) {
        valueIndexMap[props.options[i].value] = i;
      }
    }
    function handleItemChange(checked, value) {
      if (checked) {
        setRadioGroupValue(value);
        return;
      }
      setRadioGroupValue("");
    }
    return (_ctx, _cache) => {
      var _a;
      const _component_wb_radio = resolveComponent("wb-radio");
      return openBlock(), createElementBlock(
        "div",
        {
          p: "$wb-radio-group-padding",
          bg: "$wb-radio-group-background",
          rounded: "$wb-radio-group-radius",
          ring: "1 inset $wb-radio-group-border",
          color: "$wb-radio-group-text",
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles))
        },
        [
          createBaseVNode("div", _hoisted_1$a, [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(_ctx.options, (item) => {
                return openBlock(), createBlock(_component_wb_radio, mergeProps({
                  key: item.value,
                  rounded: "$wb-radio-group-radius",
                  ring: "1 $wb-radio-group-item-border hover:$wb-radio-group-item-border-active",
                  flex: "inline 1",
                  class: { "wb-radio--checked": unref(radioGroupValue) === item.value },
                  size: _ctx.size,
                  type: _ctx.type,
                  shape: _ctx.shape,
                  cancelable: _ctx.clearable,
                  content: item.label,
                  ref_for: true
                }, _ctx.radioProps ?? {}, {
                  value: unref(radioGroupValue) === item.value,
                  checked: unref(radioGroupValue) === item.value,
                  onChange: (checked) => handleItemChange(checked, item.value)
                }), null, 16, ["class", "size", "type", "shape", "cancelable", "content", "value", "checked", "onChange"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            _ctx.type === "tab" && unref(radioGroupValue) ? (openBlock(), createElementBlock(
              "div",
              {
                key: 0,
                absolute: "",
                inset: "0",
                h: "full",
                bg: "$wb-radio-group-indicator",
                rounded: "$wb-radio-group-radius",
                class: "active-indicator",
                style: normalizeStyle({
                  width: `calc(100% / ${(_a = _ctx.options) == null ? void 0 : _a.length})`,
                  transform: `translateX(calc(${100 * valueIndexMap[unref(radioGroupValue)]}%))`,
                  transition: "var(--transition-ease)"
                })
              },
              null,
              4
              /* STYLE */
            )) : createCommentVNode("v-if", true)
          ])
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function useRadioGroup(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$f, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var RadioGroup = withInstall(_sfc_main$f);
var XDefaultProps$9 = {
  type: "line"
};
var DefaultProps$9 = {
  ...SizeDefault,
  ...XDefaultProps$9
};
var _hoisted_1$9 = {
  key: 0,
  w: "full",
  h: "full"
};
var _hoisted_2$6 = {
  key: 1,
  "max-w": "85%",
  "max-h": "85%",
  overflow: "hidden",
  p: "x-$wb-placeholder-padding",
  select: "none"
};
var _sfc_main$e = defineComponent({
  ...{ name: "WbPlaceholder" },
  __name: "placeholder",
  props: mergeDefaults({
    type: {},
    color: {},
    onClick: { type: Function },
    default: { type: [String, Object, Function] },
    size: {}
  }, DefaultProps$9),
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const propsClasses = useClasses({
      valueProps: ["type", "size"],
      nameProps: []
    });
    const propsStyles = useStyles(() => {
      let result = {};
      let lineColor = "%2392ac96";
      if (props.color) {
        const palette = Color$1(props.color);
        const { color: color2 } = palette.rgb();
        lineColor = encodeURIComponent(palette.hex());
        result = {
          ...result,
          "--wb-placeholder-vc": color2.join(" ")
        };
      }
      if (props.type === "line") {
        result = {
          ...result,
          background: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${lineColor}' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`
        };
      }
      return result;
    });
    const renderNodes = useNodes();
    const ContentNode = () => renderNodes(["content", "default"]);
    const PlaceholderRef = ref();
    const paragraphLines = ref(0);
    function setParagraphLines() {
      if (props.type === "paragraph") {
        const { height } = PlaceholderRef.value.getBoundingClientRect();
        let fontSize = 0;
        if (typeof props.size === "string") {
          fontSize = getComponentSize(getComponentSizeValue(props.size)).fontSize;
        } else {
          fontSize = getComponentSize(props.size).fontSize;
        }
        paragraphLines.value = Math.floor(
          (height + fontSize * 1.25) / (fontSize * 2.5)
        );
      }
    }
    onMounted(() => {
      setParagraphLines();
      watch(() => props.type, setParagraphLines);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          ref_key: "PlaceholderRef",
          ref: PlaceholderRef,
          w: "full",
          h: "full",
          overflow: "hidden",
          ring: "1 $wb-placeholder-border",
          rounded: "$wb-placeholder-radius",
          flex: "~ row",
          items: "center",
          justify: "center",
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles))
        },
        [
          _ctx.type === "paragraph" ? (openBlock(), createElementBlock("div", _hoisted_1$9, [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(paragraphLines.value, (item) => {
                return openBlock(), createElementBlock("div", {
                  key: item,
                  class: "wb-placeholder--paragraph-item",
                  h: "[calc(var(--wb-placeholder-font-size)*1.25)]",
                  m: "b-[calc(var(--wb-placeholder-font-size)*1.25)] last:r-20%",
                  bg: "$wb-color-container",
                  rounded: "$wb-placeholder-radius"
                });
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (openBlock(), createElementBlock("div", _hoisted_2$6, [
            createVNode(ContentNode)
          ]))
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function usePlaceholder(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$e, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Placeholder = withInstall(_sfc_main$e);
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x, y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }, getWindow(popper2)) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  );
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = offset2 + overflow[mainSide];
    var max$1 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
          if (state.reset === true) {
            state.reset = false;
            index2 = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref) {
        var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect2 = _ref.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = popperGenerator({
  defaultModifiers
});
var POPUP_SHOW_EVENTS_MAP = {
  hover: "mouseenter",
  press: "mousedown",
  focus: "focusin",
  contextmenu: "contextmenu",
  click: "click"
};
var POPUP_HIDE_EVENTS_MAP = {
  hover: "mouseleave",
  press: "mouseup",
  focus: "focusout",
  contextmenu: "contextmenu",
  click: "click"
};
var XDefaultProps$8 = {
  attach: "body",
  placement: "top",
  trigger: "click",
  arrow: false,
  animate: true,
  zIndex: 1
};
var DefaultProps$8 = {
  ...SizeDefault,
  ...LoadingDefault,
  ...DisabledDefault,
  ...XDefaultProps$8
};
var _hoisted_1$8 = { class: "wb-popup-wrapper" };
var _hoisted_2$5 = {
  relative: "",
  p: "$wb-popup-padding",
  bg: "$wb-popup-background",
  rounded: "$wb-popup-radius",
  ring: "1 $wb-popup-border",
  shadow: "md",
  color: "$wb-popup-color",
  class: "wb-popup-content"
};
var _sfc_main$d = defineComponent({
  ...{ name: "WbPopup" },
  __name: "popup",
  props: mergeDefaults({
    attach: {},
    placement: {},
    trigger: {},
    arrow: { type: Boolean },
    animate: { type: Boolean },
    zIndex: {},
    pure: { type: Boolean },
    disabled: { type: Boolean },
    destroyOnHide: { type: Boolean },
    onShow: { type: Function },
    onHide: { type: Function },
    default: { type: [String, Object, Function] },
    content: { type: [String, Object, Function] },
    size: {},
    loading: { type: Boolean },
    value: { type: Boolean },
    modelValue: { type: Boolean },
    defaultValue: { type: Boolean },
    onChange: { type: Function }
  }, DefaultProps$8),
  emits: ["show", "hide", "change", "update:value", "update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["size"],
      nameProps: ["disabled", "pure", "arrow"]
    });
    const propsStyles = useStyles(() => {
      if (props.zIndex) {
        return { "--wb-popup-z": props.zIndex };
      }
    });
    const renderNode = useNode();
    const TriggerNode = () => renderNode("default");
    const ContentNode = () => renderNode("content");
    const firstRender = ref(false);
    const BodyEvents = GlobalEventCenter.get("body");
    const TriggerRef = ref();
    const TriggerClientRect = ref({ width: 0, height: 0 });
    let TriggerEvents;
    const PopperRef = ref();
    let popper2;
    const [visible, setVisible] = useVModel({
      props: toRefs(props),
      onSetValue: (v) => {
        emits(v ? "show" : "hide");
        if (!v && props.destroyOnHide) {
          firstRender.value = false;
          popper2.destroy();
          popper2 = null;
          firstRender.value = false;
        }
        emits("change", v);
      }
    });
    function updatePopup() {
      popper2 == null ? void 0 : popper2.update();
    }
    function initPopper() {
      popper2 = createPopper(TriggerRef.value, PopperRef.value, {
        placement: props.placement,
        onFirstUpdate: () => {
          popper2.update();
        }
      });
      updatePopup();
    }
    function hidePopup(e) {
      if (!props.trigger) return;
      if (["click", "contextmenu"].includes(props.trigger)) {
        BodyEvents.off("mousedown", hidePopup);
        if (PopperRef.value.contains(e.target) || TriggerRef.value.contains(e.target))
          return;
      } else if (["hover", "focus"].includes(props.trigger)) {
        TriggerEvents.off(POPUP_HIDE_EVENTS_MAP[props.trigger], hidePopup);
      } else if (props.trigger === "press") {
        BodyEvents.off(POPUP_HIDE_EVENTS_MAP[props.trigger], hidePopup);
      }
      setVisible(false);
    }
    function showPopup() {
      if (!firstRender.value) {
        firstRender.value = true;
      }
      TriggerClientRect.value = TriggerRef.value.getBoundingClientRect();
      nextTick(() => {
        setVisible(true);
        if (!popper2) {
          initPopper();
        }
        updatePopup();
      });
    }
    function removeEventListens() {
      TriggerEvents == null ? void 0 : TriggerEvents.clean();
      BodyEvents == null ? void 0 : BodyEvents.off("mousedown", hidePopup);
      BodyEvents == null ? void 0 : BodyEvents.off("mouseup", hidePopup);
    }
    function addEventListens() {
      if (!props.trigger) return;
      TriggerEvents.on(POPUP_SHOW_EVENTS_MAP[props.trigger], (e) => {
        if (!props.trigger) return;
        if (props.disabled) return;
        if (props.trigger === "contextmenu") {
          e.preventDefault();
        }
        if (["click", "contextmenu"].includes(props.trigger)) {
          if (visible.value) {
            setVisible(false);
            BodyEvents.off("mousedown", hidePopup);
            return;
          }
          BodyEvents.on("mousedown", hidePopup);
        } else if (["hover", "focus"].includes(props.trigger)) {
          TriggerEvents.on(POPUP_HIDE_EVENTS_MAP[props.trigger], hidePopup);
        } else if (props.trigger === "press") {
          BodyEvents.on(POPUP_HIDE_EVENTS_MAP[props.trigger], hidePopup);
        }
        showPopup();
      });
    }
    onMounted(() => {
      if (visible.value && (props.modelValue || props.value)) {
        firstRender.value = true;
        nextTick(() => {
          initPopper();
        });
      } else {
        TriggerEvents = new EventCenter(TriggerRef.value, "trigger");
        addEventListens();
        watch(
          () => props.trigger,
          () => {
            removeEventListens();
            addEventListens();
          }
        );
      }
      watch(
        () => props.placement,
        (val) => {
          popper2 == null ? void 0 : popper2.setOptions({ placement: val });
        }
      );
      watch(
        () => [visible.value, props.size],
        () => {
          updatePopup();
        }
      );
    });
    onBeforeUnmount(() => {
      removeEventListens();
      popper2 == null ? void 0 : popper2.destroy();
    });
    __expose({
      updatePopup,
      showPopup,
      hidePopup
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$8, [
        createBaseVNode(
          "div",
          {
            ref_key: "TriggerRef",
            ref: TriggerRef,
            cursor: "pointer",
            select: "none",
            class: "wb-popup-trigger",
            flex: ""
          },
          [
            createVNode(TriggerNode)
          ],
          512
          /* NEED_PATCH */
        ),
        (openBlock(), createBlock(Teleport, {
          disabled: !firstRender.value,
          to: _ctx.attach
        }, [
          firstRender.value ? withDirectives((openBlock(), createElementBlock(
            "div",
            mergeProps({ key: 0 }, _ctx.$attrs, {
              ref_key: "PopperRef",
              ref: PopperRef,
              z: "$wb-popup-z",
              class: unref(propsClasses),
              style: unref(propsStyles),
              onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["stop"]))
            }),
            [
              createVNode(Transition, {
                name: _ctx.animate ? "pop" : "",
                persisted: ""
              }, {
                default: withCtx(() => [
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_2$5,
                    [
                      renderSlot(_ctx.$slots, "content", { trigger: TriggerClientRect.value }, () => [
                        createVNode(ContentNode)
                      ]),
                      _ctx.arrow ? (openBlock(), createElementBlock(
                        "div",
                        {
                          key: 0,
                          absolute: "",
                          top: "0",
                          left: "50%",
                          w: "$wb-popup-padding",
                          h: "$wb-popup-padding",
                          bg: "$wb-popup-background",
                          border: "1 solid transparent",
                          transform: "rotate-45 translate-y--50% translate-x--50%",
                          class: "wb-popup-arrow",
                          style: normalizeStyle({
                            "--trigger-height": `${TriggerClientRect.value.height}px`,
                            "--trigger-width": `${TriggerClientRect.value.width}px`
                          })
                        },
                        null,
                        4
                        /* STYLE */
                      )) : createCommentVNode("v-if", true)
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, unref(visible)]
                  ])
                ]),
                _: 3
                /* FORWARDED */
              }, 8, ["name"])
            ],
            16
            /* FULL_PROPS */
          )), [
            [vShow, unref(visible)]
          ]) : createCommentVNode("v-if", true)
        ], 8, ["disabled", "to"]))
      ]);
    };
  }
});
function usePopup(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$d, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Popup = withInstall(_sfc_main$d);
var XDefaultProps$7 = {
  options: [],
  theme: "soft",
  maxItems: 10,
  icon: true
};
var DefaultProps$7 = {
  ...SizeDefault,
  ...LoadingDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...ClearableDefault,
  ...XDefaultProps$7
};
var _hoisted_1$7 = ["data-index"];
var _hoisted_2$4 = {
  key: 1,
  w: "full",
  p: "1",
  flex: "",
  "justify-center": ""
};
var _sfc_main$c = defineComponent({
  ...{ name: "WbSelect", inheritAttrs: false },
  __name: "select",
  props: mergeDefaults({
    options: {},
    theme: {},
    icon: { type: Boolean },
    maxItems: {},
    inputProps: {},
    popupProps: {},
    onSelect: { type: Function },
    onShow: { type: Function },
    onHide: { type: Function },
    size: {},
    loading: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    clearable: { type: Boolean },
    value: {},
    modelValue: {},
    defaultValue: {},
    onChange: { type: Function }
  }, DefaultProps$7),
  emits: ["select", "show", "hide", "change", "update:value", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["size", "theme"],
      nameProps: ["arrow"]
    });
    const propsStyles = useStyles(() => {
      if (props.maxItems && props.options.length > props.maxItems) {
        return {
          "--wb-select-max-content-height": `calc(var(--wb-select-height) * ${props.maxItems} + var(--wb-select-padding) * 2 + var(--wb-select-gap) * ${props.maxItems - 1})`
        };
      }
    });
    const [selectValue, setSelectValue] = useVModel({
      props: toRefs(props)
    });
    const [showOptions, setShowOptions] = useState(false);
    const optionsDataMap = {};
    const optionsIndexMap = {};
    if (props.options) {
      props.options.forEach((item, index2) => {
        optionsDataMap[item.value] = item;
        optionsIndexMap[item.value] = index2;
      });
    }
    const selectedIndex = ref(optionsIndexMap[selectValue.value] ?? -1);
    const selectedValue = ref(optionsDataMap[selectValue.value]);
    const currentIndex = ref(optionsIndexMap[selectValue.value] ?? -1);
    const currentValue = ref(optionsDataMap[selectValue.value]);
    function setSelectedData(index2, finish = false) {
      var _a;
      if (!props.options) return;
      currentIndex.value = index2;
      currentValue.value = props.options[index2];
      selectedIndex.value = currentIndex.value;
      selectedValue.value = currentValue.value;
      setSelectValue((_a = currentValue.value) == null ? void 0 : _a.value);
      if (finish) {
        setShowOptions(false);
      }
    }
    function handleKeydown(e) {
      if (!props.options) return;
      if (!showOptions.value) return;
      switch (e.code) {
        case "ArrowUp": {
          e.preventDefault();
          if (currentIndex.value <= 0) {
            currentIndex.value = -1;
            return;
          }
          currentIndex.value -= 1;
          emits("select", props.options[currentIndex.value].value);
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          if (currentIndex.value >= props.options.length) {
            currentIndex.value = props.options.length;
            return;
          }
          currentIndex.value += 1;
          emits("select", props.options[currentIndex.value].value);
          break;
        }
        case "Escape":
          setShowOptions(false);
          break;
        case "Tab":
          setShowOptions(false);
          break;
      }
    }
    const BodyEvents = GlobalEventCenter.get("body");
    onMounted(() => {
      BodyEvents.on("keydown", handleKeydown);
    });
    onBeforeUnmount(() => {
      BodyEvents.off("keydown", handleKeydown);
    });
    function handleSelectOptionItem(dataset) {
      const { index: index2 } = dataset;
      if (index2) {
        setSelectedData(index2 - 0, true);
        setShowOptions(false);
      }
    }
    function togglePopup(e) {
      switch (e.code) {
        case "Enter": {
          if (!showOptions.value) {
            setShowOptions(true);
            return;
          }
          selectedIndex.value = currentIndex.value;
          selectedValue.value = currentValue.value;
          setSelectedData(currentIndex.value, true);
          break;
        }
        case "Space": {
          e.preventDefault();
          if (!showOptions.value) {
            setShowOptions(true);
          }
          break;
        }
      }
    }
    function handleHideSelect() {
      if (!props.options) return;
      currentIndex.value = selectedIndex.value;
      currentValue.value = selectedValue.value;
      emits("select", props.options[currentIndex.value].value);
      emits("hide");
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Popup), {
        modelValue: unref(showOptions),
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => isRef(showOptions) ? showOptions.value = $event : null),
        size: _ctx.size,
        placement: "bottom-start",
        pure: "",
        class: normalizeClass(unref(propsClasses)),
        onShow: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("show")),
        onHide: handleHideSelect,
        onKeydown: togglePopup
      }, {
        content: withCtx(({ trigger }) => [
          createBaseVNode(
            "div",
            {
              class: normalizeClass(unref(propsClasses))
            },
            [
              createBaseVNode(
                "ul",
                {
                  "max-h": "$wb-select-max-content-height",
                  p: "$wb-select-padding",
                  bg: "$wb-select-background",
                  rounded: "$wb-select-radius",
                  ring: "1 $wb-select-border",
                  flex: "~ col",
                  gap: "$wb-select-gap",
                  class: "wb-select-content scrollable",
                  style: normalizeStyle({ minWidth: `${trigger.width}px`, ...unref(propsStyles) }),
                  onClick: _cache[0] || (_cache[0] = withModifiers(($event) => unref(clickDelegate)($event, "wb-select-option", handleSelectOptionItem), ["stop"]))
                },
                [
                  _ctx.options.length ? (openBlock(true), createElementBlock(
                    Fragment,
                    { key: 0 },
                    renderList(_ctx.options, (item, index2) => {
                      return openBlock(), createElementBlock("li", {
                        key: item.value,
                        "data-index": index2,
                        relative: "",
                        w: "full",
                        h: "$wb-select-height",
                        bg: "hover:$wb-select-option-hover-background",
                        p: "x-$wb-select-padding",
                        rounded: "$wb-select-radius",
                        flex: "~ none",
                        items: "center",
                        cursor: "pointer",
                        class: normalizeClass(["wb-select-option", {
                          "wb-select-option--hover": currentIndex.value === index2,
                          "wb-select-option--active": selectedIndex.value === index2
                        }])
                      }, [
                        createBaseVNode(
                          "span",
                          null,
                          toDisplayString(item.label),
                          1
                          /* TEXT */
                        )
                      ], 10, _hoisted_1$7);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )) : (openBlock(), createElementBlock("div", _hoisted_2$4, _cache[4] || (_cache[4] = [
                    createBaseVNode(
                      "div",
                      { text: "sm $wb-color-text-5" },
                      "暂无数据",
                      -1
                      /* HOISTED */
                    )
                  ])))
                ],
                4
                /* STYLE */
              )
            ],
            2
            /* CLASS */
          )
        ]),
        default: withCtx(() => {
          var _a;
          return [
            createVNode(unref(Input), mergeProps({ size: _ctx.size }, { ..._ctx.$attrs, ..._ctx.inputProps }, {
              value: (_a = currentValue.value) == null ? void 0 : _a.label,
              readonly: "",
              class: "wb-select-input"
            }), {
              suffix: withCtx(() => [
                _cache[3] || (_cache[3] = createBaseVNode(
                  "i",
                  {
                    w: "$wb-select-arrow",
                    h: "$wb-select-arrow",
                    color: "$wb-color-text-5",
                    i: "heroicons-chevron-down-20-solid"
                  },
                  null,
                  -1
                  /* HOISTED */
                )),
                createCommentVNode(" pointer-events-none ")
              ]),
              _: 1
              /* STABLE */
            }, 16, ["size", "value"])
          ];
        }),
        _: 1
        /* STABLE */
      }, 8, ["modelValue", "size", "class"]);
    };
  }
});
function useSelect(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$c, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Select = withInstall(_sfc_main$c);
var XDefaultProps$6 = {};
var DefaultProps$6 = {
  ...SizeDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...XDefaultProps$6
};
var _hoisted_1$6 = {
  absolute: "",
  inset: "0",
  w: "full",
  h: "full",
  p: "x-2",
  rounded: "full"
};
var _sfc_main$b = defineComponent({
  ...{ name: "WbSlider" },
  __name: "slider",
  props: mergeDefaults({
    max: {},
    min: {},
    popupProps: {},
    size: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    value: {},
    modelValue: {},
    defaultValue: {},
    onChange: { type: Function }
  }, DefaultProps$6),
  emits: ["change", "update:value", "update:modelValue"],
  setup(__props) {
    const props = __props;
    const ColorHueRef = ref();
    const ColorHueContentRef = ref();
    const ColorHueHandlerRef = ref();
    const SliderValuePopupRef = ref();
    let HueBarClientRect = null;
    let isSelecting = false;
    let startX = 0;
    let prevOffsetX = 0;
    let offsetX = 0;
    const offsetXPercent = ref(0);
    const [sliderValue, setSliderValue] = useVModel({
      props: toRefs(props)
    });
    function getLimitOffsetPercent(offset2) {
      if (offset2 < 0) return 0;
      if (offset2 > HueBarClientRect.width) return 100;
      return Math.round(offset2 / HueBarClientRect.width * 100);
    }
    function selectHueColorStart(e) {
      var _a;
      e.stopPropagation();
      isSelecting = true;
      startX = e.clientX;
      offsetX = e.clientX - HueBarClientRect.left;
      prevOffsetX = offsetX;
      offsetXPercent.value = getLimitOffsetPercent(offsetX);
      (_a = SliderValuePopupRef.value) == null ? void 0 : _a.updatePopup();
      setSliderValue(offsetXPercent.value);
      on(document.body, "mousemove", throttleSelectHueChange);
    }
    function selectHueColorChange(e) {
      var _a;
      if (!isSelecting) return;
      isSelecting = true;
      let offset2 = e.clientX - startX + prevOffsetX;
      if (offset2 < 0) {
        offset2 = 0;
      } else if (offset2 > HueBarClientRect.width) {
        offset2 = HueBarClientRect.width;
      }
      offsetX = offset2;
      offsetXPercent.value = getLimitOffsetPercent(offsetX);
      (_a = SliderValuePopupRef.value) == null ? void 0 : _a.updatePopup();
      setSliderValue(offsetXPercent.value);
    }
    const throttleSelectHueChange = throttle(selectHueColorChange, 18);
    function selectHueColorEnd() {
      isSelecting = false;
      prevOffsetX = offsetX;
      off(document.body, "mousemove", throttleSelectHueChange);
    }
    function updateClientRect() {
      HueBarClientRect = ColorHueContentRef.value.getBoundingClientRect();
    }
    const debounceUpdateClientRect = debounce$1(updateClientRect, 300);
    onMounted(() => {
      updateClientRect();
      watch(
        () => sliderValue.value,
        () => {
          var _a;
          if (sliderValue.value) {
            offsetX = HueBarClientRect.width * sliderValue.value / 100;
            offsetXPercent.value = getLimitOffsetPercent(offsetX);
            (_a = SliderValuePopupRef.value) == null ? void 0 : _a.updatePopup();
          }
        },
        { immediate: true }
      );
      on(ColorHueRef.value, "mousedown", selectHueColorStart);
      on(document.body, "mouseup", selectHueColorEnd);
      on(window, "resize", debounceUpdateClientRect);
    });
    onBeforeUnmount(() => {
      off(ColorHueRef.value, "mousedown", selectHueColorStart);
      off(window, "resize", debounceUpdateClientRect);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          ref_key: "ColorHueRef",
          ref: ColorHueRef,
          relative: "",
          w: "full",
          h: "1",
          bg: "$wb-color-layer",
          rounded: "full",
          select: "none"
        },
        [
          createBaseVNode("div", _hoisted_1$6, [
            createBaseVNode(
              "div",
              {
                absolute: "",
                top: "0",
                left: "0",
                h: "full",
                bg: "$wb-color-primary",
                rounded: "full",
                style: normalizeStyle({ width: `${offsetXPercent.value}%` })
              },
              null,
              4
              /* STYLE */
            ),
            createBaseVNode(
              "div",
              {
                ref_key: "ColorHueContentRef",
                ref: ColorHueContentRef,
                w: "full",
                h: "full",
                flex: "1",
                select: "none",
                cursor: "pointer"
              },
              null,
              512
              /* NEED_PATCH */
            )
          ]),
          createBaseVNode(
            "div",
            {
              ref_key: "ColorHueHandlerRef",
              ref: ColorHueHandlerRef,
              absolute: "",
              top: "50%",
              left: "0",
              w: "4",
              h: "4",
              bg: "$wb-color-primary",
              rounded: "full",
              shadow: "sm black",
              cursor: "pointer",
              select: "none",
              transform: "translate-x--50% translate-y--50%",
              style: normalizeStyle({ left: `${offsetXPercent.value}%` })
            },
            [
              createVNode(
                unref(Popup),
                mergeProps({
                  ref_key: "SliderValuePopupRef",
                  ref: SliderValuePopupRef,
                  trigger: "hover",
                  placement: "top"
                }, _ctx.popupProps, { animate: false }),
                {
                  content: withCtx(() => [
                    createBaseVNode(
                      "div",
                      null,
                      toDisplayString(unref(sliderValue)),
                      1
                      /* TEXT */
                    )
                  ]),
                  default: withCtx(() => [
                    _cache[0] || (_cache[0] = createBaseVNode(
                      "div",
                      {
                        w: "4",
                        h: "4",
                        rounded: "full",
                        ring: "2 inset $wb-color-foreground"
                      },
                      null,
                      -1
                      /* HOISTED */
                    ))
                  ]),
                  _: 1
                  /* STABLE */
                },
                16
                /* FULL_PROPS */
              )
            ],
            4
            /* STYLE */
          )
        ],
        512
        /* NEED_PATCH */
      );
    };
  }
});
function useSlider(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$b, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Slider = withInstall(_sfc_main$b);
var XDefaultProps$5 = {
  type: "base",
  theme: "inner",
  step: 1,
  decimal: 0,
  separator: false,
  placeholder: "",
  align: "start",
  readonly: false
};
var DefaultProps$5 = {
  ...SizeDefault,
  ...LoadingDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...ClearableDefault,
  ...XDefaultProps$5
};
var _hoisted_1$5 = ["p", "focus-within"];
var _hoisted_2$3 = ["value", "readonly", "disabled", "step", "placeholder", "ring", "focus-visible"];
var _hoisted_3 = {
  key: 3,
  h: "[calc(var(--wb-input-number-height)-3px)]",
  m: "r-px",
  p: "b-px",
  bg: "$wb-color-soft",
  flex: "~ none col",
  gap: "1px",
  class: "wb-input-number-options"
};
var _sfc_main$a = defineComponent({
  ...{ name: "WbInputNumber" },
  __name: "input-number",
  props: mergeDefaults({
    type: {},
    theme: {},
    placeholder: {},
    align: {},
    max: {},
    min: {},
    step: {},
    decimal: {},
    separator: { type: Boolean },
    format: { type: Function },
    readonly: { type: Boolean },
    prefix: { type: [String, Object, Function] },
    suffix: { type: [String, Object, Function] },
    size: {},
    loading: { type: Boolean },
    disabled: { type: Boolean },
    clearable: { type: Boolean },
    value: {},
    modelValue: {},
    defaultValue: {},
    onChange: { type: Function }
  }, DefaultProps$5),
  emits: ["click", "change", "update:value", "update:modelValue"],
  setup(__props) {
    const props = __props;
    const propsClasses = useClasses({
      valueProps: ["type", "align", "theme", "size"],
      nameProps: ["disabled", "readonly"]
    });
    const propsStyles = useStyles();
    const renderNode = useNode();
    const PrefixNode = () => renderNode("prefix");
    const SuffixNode = () => renderNode("suffix");
    const [inputValue, setInputValue] = useVModel({ props: toRefs(props) });
    function getFormatValue(val) {
      return parseFloat(val.toFixed(props.decimal));
    }
    function getLimitValue(val) {
      if (!val) return val;
      let result = val;
      if (typeof props.max === "number" && result > props.max) {
        result = Math.min(result, props.max);
      }
      if (typeof props.min === "number" && result < props.min) {
        result = Math.max(result, props.min);
      }
      return result;
    }
    const InputRef = ref();
    const isInputFocus = ref(false);
    function changeFocusState(e) {
      isInputFocus.value = e.type === "focus";
    }
    function changeInputValue(e) {
      e.preventDefault();
      let result = inputValue.value || 0;
      switch (e.code) {
        case "ArrowUp": {
          result += props.step;
          break;
        }
        case "ArrowDown": {
          result -= props.step;
          break;
        }
      }
      const value = getLimitValue(result);
      originInputValue.value = value;
      setInputValue(value);
    }
    onMounted(() => {
      if (props.format) {
        on(InputRef.value, "focus", changeFocusState);
        on(InputRef.value, "blur", changeFocusState);
      }
    });
    onBeforeUnmount(() => {
      if (props.format) {
        off(InputRef.value, "focus", changeFocusState);
        off(InputRef.value, "blur", changeFocusState);
      }
    });
    const formatInputValue = ref("");
    const originInputValue = ref(inputValue.value);
    watchEffect(() => {
      var _a, _b;
      if (!originInputValue.value) {
        formatInputValue.value = (_a = originInputValue.value) == null ? void 0 : _a.toString();
        return;
      }
      const toFixedValue = (_b = getLimitValue(originInputValue.value)) == null ? void 0 : _b.toFixed(
        props.decimal
      );
      if (isInputFocus.value) {
        formatInputValue.value = toFixedValue;
        return;
      }
      if (props.format) {
        formatInputValue.value = props.format(
          getLimitValue(originInputValue.value),
          toFixedValue
        );
        return;
      }
      if (props.separator) {
        formatInputValue.value = toFixedValue == null ? void 0 : toFixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      formatInputValue.value = toFixedValue;
    });
    function handleInputChange(e) {
      const target = e.target;
      const resolveTarget = target.value;
      const value = resolveTarget ? parseFloat(resolveTarget) || 0 : void 0;
      originInputValue.value = value;
      setInputValue(getLimitValue(value));
    }
    function handleChangeNumber(dataset) {
      const { key } = dataset;
      let result = inputValue.value || 0;
      switch (key) {
        case "add":
          result += props.step;
          break;
        case "sub": {
          result -= props.step;
          break;
        }
      }
      const value = getFormatValue(getLimitValue(result));
      originInputValue.value = value;
      setInputValue(value);
    }
    return (_ctx, _cache) => {
      const _component_wb_button = resolveComponent("wb-button");
      return openBlock(), createElementBlock("div", {
        relative: "",
        w: "$wb-input-number-width",
        p: _ctx.theme === "side" ? "1px" : "0",
        rounded: "$wb-input-number-radius",
        ring: "1 inset $wb-input-number-border",
        overflow: "hidden",
        "focus-within": _ctx.theme === "side" ? "" : "outline outline-2 outline-$wb-color-primary",
        flex: "~ inline",
        items: "center",
        gap: "$wb-input-number-gap",
        class: normalizeClass(unref(propsClasses)),
        style: normalizeStyle(unref(propsStyles)),
        onClick: _cache[0] || (_cache[0] = withModifiers(($event) => unref(clickDelegate)($event, "wb-button", handleChangeNumber), ["stop"]))
      }, [
        _ctx.theme === "side" ? (openBlock(), createBlock(_component_wb_button, {
          key: 0,
          tabindex: "-1",
          "data-key": "sub",
          type: "outline",
          theme: "default",
          shape: "square",
          size: _ctx.size,
          disabled: _ctx.min !== void 0 && _ctx.min >= unref(inputValue)
        }, {
          default: withCtx(() => _cache[1] || (_cache[1] = [
            createBaseVNode(
              "i",
              { i: "tdesign-minus" },
              null,
              -1
              /* HOISTED */
            )
          ])),
          _: 1
          /* STABLE */
        }, 8, ["size", "disabled"])) : (openBlock(), createBlock(PrefixNode, { key: 1 })),
        createCommentVNode(" TODO: 无法输入 "),
        createBaseVNode("input", {
          ref_key: "InputRef",
          ref: InputRef,
          value: formatInputValue.value,
          readonly: _ctx.readonly,
          disabled: _ctx.disabled,
          step: _ctx.step,
          placeholder: _ctx.placeholder,
          maxlength: "15",
          flex: "1",
          h: "$wb-input-number-height",
          p: "x-$wb-input-number-padding",
          bg: "$wb-input-number-background",
          ring: _ctx.theme === "side" ? "1 inset $wb-input-number-border" : "",
          rounded: "$wb-input-number-radius",
          text: "$wb-input-number-text",
          overflow: "hidden",
          "focus-visible": _ctx.theme === "side" ? "outline outline-2 outline-$wb-color-primary" : "",
          onInput: handleInputChange,
          onKeydown: changeInputValue
        }, null, 40, _hoisted_2$3),
        createVNode(SuffixNode),
        _ctx.theme === "side" ? (openBlock(), createBlock(_component_wb_button, {
          key: 2,
          tabindex: "-1",
          "data-key": "add",
          type: "outline",
          theme: "default",
          shape: "square",
          size: _ctx.size,
          disabled: _ctx.max !== void 0 && _ctx.max <= unref(inputValue)
        }, {
          default: withCtx(() => _cache[2] || (_cache[2] = [
            createBaseVNode(
              "i",
              { i: "tdesign-add" },
              null,
              -1
              /* HOISTED */
            )
          ])),
          _: 1
          /* STABLE */
        }, 8, ["size", "disabled"])) : _ctx.theme === "inner" ? (openBlock(), createElementBlock("div", _hoisted_3, [
          createVNode(_component_wb_button, {
            size: _ctx.size,
            disabled: _ctx.max !== void 0 && _ctx.max <= unref(inputValue),
            theme: "default",
            tabindex: "-1",
            "data-key": "add",
            w: "full",
            h: "[calc(50%)]",
            rounded: "rt-$wb-input-number-radius",
            "focus-visible": "outline-0 bg-$wb-color-primary"
          }, {
            default: withCtx(() => _cache[3] || (_cache[3] = [
              createBaseVNode(
                "i",
                { i: "tdesign-chevron-up" },
                null,
                -1
                /* HOISTED */
              )
            ])),
            _: 1
            /* STABLE */
          }, 8, ["size", "disabled"]),
          createVNode(_component_wb_button, {
            size: _ctx.size,
            theme: "default",
            disabled: _ctx.min !== void 0 && _ctx.min >= unref(inputValue),
            tabindex: "-1",
            "data-key": "sub",
            w: "full",
            h: "[calc(50%)]",
            rounded: "rb-$wb-input-number-radius",
            "focus-visible": "outline-0 bg-$wb-color-primary"
          }, {
            default: withCtx(() => _cache[4] || (_cache[4] = [
              createBaseVNode(
                "i",
                { i: "tdesign-chevron-down" },
                null,
                -1
                /* HOISTED */
              )
            ])),
            _: 1
            /* STABLE */
          }, 8, ["size", "disabled"])
        ])) : createCommentVNode("v-if", true)
      ], 14, _hoisted_1$5);
    };
  }
});
function useInputNumber(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$a, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var InputNumber = withInstall(_sfc_main$a);
var _hoisted_1$4 = {
  absolute: "",
  inset: "0",
  flex: "",
  items: "center"
};
var _sfc_main$9 = defineComponent({
  ...{ name: "ColorPickerAlpha" },
  __name: "color-picker-alpha",
  props: {
    defaultValue: { type: Number, default: 1 },
    selectedColor: { type: String, default: "#ff0000" }
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const ColorAlphaRef = ref();
    const ColorAlphaContentRef = ref();
    const ColorAlphaHandlerRef = ref();
    let AlphaBarClientRect = null;
    let isSelecting = false;
    let startX = 0;
    let prevOffsetX = 0;
    const offsetX = ref(0);
    function selectAlphaColorStart(e) {
      e.stopPropagation();
      isSelecting = true;
      startX = e.clientX;
      offsetX.value = e.clientX - AlphaBarClientRect.left;
      prevOffsetX = offsetX.value;
      emits("change", 1 - offsetX.value / AlphaBarClientRect.width);
      on(document.body, "mousemove", throttleSelectAlphaChange);
    }
    function selectAlphaColorChange(e) {
      if (!isSelecting) return;
      isSelecting = true;
      let offset2 = e.clientX - startX + prevOffsetX;
      if (offset2 < 0) {
        offset2 = 0;
      } else if (offset2 > AlphaBarClientRect.width) {
        offset2 = AlphaBarClientRect.width;
      }
      offsetX.value = offset2;
      emits("change", 1 - offsetX.value / AlphaBarClientRect.width);
    }
    const throttleSelectAlphaChange = throttle(selectAlphaColorChange, 18);
    function selectAlphaColorEnd() {
      isSelecting = false;
      prevOffsetX = offsetX.value;
      off(document.body, "mousemove", throttleSelectAlphaChange);
    }
    function updateClientRect() {
      AlphaBarClientRect = ColorAlphaContentRef.value.getBoundingClientRect();
    }
    const debounceUpdateClientRect = debounce$1(updateClientRect, 300);
    onMounted(() => {
      updateClientRect();
      if (props.defaultValue) {
        offsetX.value = AlphaBarClientRect.width * (1 - props.defaultValue);
        prevOffsetX = offsetX.value;
      }
      on(ColorAlphaRef.value, "mousedown", selectAlphaColorStart);
      on(document.body, "mouseup", selectAlphaColorEnd);
      on(window, "resize", debounceUpdateClientRect);
    });
    onBeforeUnmount(() => {
      off(ColorAlphaRef.value, "mousedown", selectAlphaColorStart);
      off(window, "resize", debounceUpdateClientRect);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          ref_key: "ColorAlphaRef",
          ref: ColorAlphaRef,
          relative: "",
          w: "full",
          h: "2.5",
          select: "none"
        },
        [
          _cache[2] || (_cache[2] = createBaseVNode(
            "div",
            {
              absolute: "",
              inset: "0",
              w: "full",
              h: "full",
              rounded: "full",
              overflow: "hidden",
              style: { "background": "#ffffff66", "background-image": "linear-gradient(\n            45deg,\n            #c5c5c5 25%,\n            transparent 0,\n            transparent 75%,\n            #c5c5c5 0,\n            #c5c5c5\n          ),\n          linear-gradient(\n            45deg,\n            #c5c5c5 25%,\n            transparent 0,\n            transparent 75%,\n            #c5c5c5 0,\n            #c5c5c5\n          )", "background-size": "6px 6px", "background-position": "0 0 3px 3px" }
            },
            null,
            -1
            /* HOISTED */
          )),
          createBaseVNode("div", _hoisted_1$4, [
            createBaseVNode(
              "div",
              {
                w: "2",
                h: "full",
                rounded: "l-2",
                flex: "none",
                style: normalizeStyle({ background: __props.selectedColor })
              },
              null,
              4
              /* STYLE */
            ),
            createBaseVNode(
              "div",
              {
                ref_key: "ColorAlphaContentRef",
                ref: ColorAlphaContentRef,
                w: "full",
                h: "full",
                flex: "1",
                select: "none",
                cursor: "pointer",
                style: normalizeStyle({
                  background: `linear-gradient(90deg, ${__props.selectedColor}ff, ${__props.selectedColor}00)`
                })
              },
              null,
              4
              /* STYLE */
            ),
            _cache[0] || (_cache[0] = createBaseVNode(
              "div",
              {
                w: "2",
                h: "full",
                rounded: "r-2",
                flex: "none"
              },
              null,
              -1
              /* HOISTED */
            ))
          ]),
          createBaseVNode(
            "div",
            {
              ref_key: "ColorAlphaHandlerRef",
              ref: ColorAlphaHandlerRef,
              absolute: "",
              top: "50%",
              left: "0",
              w: "4",
              h: "4",
              rounded: "full",
              shadow: "sm black",
              cursor: "pointer",
              select: "none",
              style: normalizeStyle({
                background: __props.selectedColor,
                transform: `translate3d(${offsetX.value}px, -50%, 0)`
              })
            },
            _cache[1] || (_cache[1] = [
              createBaseVNode(
                "div",
                {
                  w: "full",
                  h: "full",
                  rounded: "full",
                  ring: "2 inset $wb-color-foreground"
                },
                null,
                -1
                /* HOISTED */
              )
            ]),
            4
            /* STYLE */
          )
        ],
        512
        /* NEED_PATCH */
      );
    };
  }
});
var _sfc_main$8 = defineComponent({
  ...{ name: "ColorPickerDropper" },
  __name: "color-picker-dropper",
  setup(__props) {
    async function pickColor() {
      if ("EyeDropper" in window) {
        const eyeDropper = new EyeDropper();
        try {
          const { sRGBHex } = await eyeDropper.open();
          console.log(`Picked color: ${sRGBHex}`);
        } catch (error) {
          console.error("Error picking color:", error);
        }
      } else {
        console.log("EyeDropper API is not supported.");
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        w: "8",
        h: "8",
        color: "hover:$wb-color-foreground",
        rounded: "full",
        flex: "~ none",
        justify: "center",
        items: "center",
        cursor: "pointer",
        select: "none",
        onClick: pickColor
      }, _cache[0] || (_cache[0] = [
        createBaseVNode(
          "i",
          {
            w: "4.5",
            h: "4.5",
            i: "heroicons-eye-dropper-solid"
          },
          null,
          -1
          /* HOISTED */
        )
      ]));
    };
  }
});
var _hoisted_1$3 = {
  absolute: "",
  inset: "0",
  w: "full",
  h: "full",
  rounded: "full",
  flex: "",
  items: "center"
};
var _sfc_main$7 = defineComponent({
  ...{ name: "ColorPickerHue" },
  __name: "color-picker-hue",
  props: {
    defaultValue: { type: Number, default: 1 },
    selectedColor: { type: String, default: "#ff0000" }
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const ColorHueRef = ref();
    const ColorHueContentRef = ref();
    const ColorHueHandlerRef = ref();
    let HueBarClientRect = null;
    let isSelecting = false;
    let startX = 0;
    let prevOffsetX = 0;
    const offsetX = ref(0);
    function selectHueColorStart(e) {
      e.stopPropagation();
      isSelecting = true;
      startX = e.clientX;
      offsetX.value = e.clientX - HueBarClientRect.left;
      prevOffsetX = offsetX.value;
      emits("change", offsetX.value / HueBarClientRect.width * 360);
      on(document.body, "mousemove", throttleSelectHueChange);
    }
    function selectHueColorChange(e) {
      if (!isSelecting) return;
      isSelecting = true;
      let offset2 = e.clientX - startX + prevOffsetX;
      if (offset2 < 0) {
        offset2 = 0;
      } else if (offset2 > HueBarClientRect.width) {
        offset2 = HueBarClientRect.width;
      }
      offsetX.value = offset2;
      emits("change", offsetX.value / HueBarClientRect.width * 360);
    }
    const throttleSelectHueChange = throttle(selectHueColorChange, 18);
    function selectHueColorEnd() {
      isSelecting = false;
      prevOffsetX = offsetX.value;
      off(document.body, "mousemove", throttleSelectHueChange);
    }
    function updateClientRect() {
      HueBarClientRect = ColorHueContentRef.value.getBoundingClientRect();
    }
    const debounceUpdateClientRect = debounce$1(updateClientRect, 300);
    onMounted(() => {
      updateClientRect();
      if (props.defaultValue) {
        offsetX.value = HueBarClientRect.width * props.defaultValue / 360;
        prevOffsetX = offsetX.value;
      }
      on(ColorHueRef.value, "mousedown", selectHueColorStart);
      on(document.body, "mouseup", selectHueColorEnd);
      on(window, "resize", debounceUpdateClientRect);
    });
    onBeforeUnmount(() => {
      off(ColorHueRef.value, "mousedown", selectHueColorStart);
      off(window, "resize", debounceUpdateClientRect);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          ref_key: "ColorHueRef",
          ref: ColorHueRef,
          relative: "",
          w: "full",
          h: "2.5",
          select: "none"
        },
        [
          createBaseVNode("div", _hoisted_1$3, [
            _cache[0] || (_cache[0] = createBaseVNode(
              "div",
              {
                w: "2",
                h: "full",
                bg: "#f00",
                rounded: "l-2",
                flex: "none"
              },
              null,
              -1
              /* HOISTED */
            )),
            createBaseVNode(
              "div",
              {
                ref_key: "ColorHueContentRef",
                ref: ColorHueContentRef,
                w: "full",
                h: "full",
                flex: "1",
                select: "none",
                cursor: "pointer",
                style: { "background": "linear-gradient(\n            90deg,\n            #f00,\n            #ff0 17%,\n            #0f0 33%,\n            #0ff 50%,\n            #00f 67%,\n            #f0f 83%,\n            #f00\n          )" }
              },
              null,
              512
              /* NEED_PATCH */
            ),
            _cache[1] || (_cache[1] = createBaseVNode(
              "div",
              {
                w: "2",
                h: "full",
                bg: "#f00",
                rounded: "r-2",
                flex: "none"
              },
              null,
              -1
              /* HOISTED */
            ))
          ]),
          createBaseVNode(
            "div",
            {
              ref_key: "ColorHueHandlerRef",
              ref: ColorHueHandlerRef,
              absolute: "",
              top: "50%",
              left: "0",
              w: "4",
              h: "4",
              rounded: "full",
              shadow: "sm black",
              cursor: "pointer",
              select: "none",
              style: normalizeStyle({
                background: __props.selectedColor,
                transform: `translate3d(${offsetX.value}px, -50%, 0)`
              })
            },
            _cache[2] || (_cache[2] = [
              createBaseVNode(
                "div",
                {
                  w: "full",
                  h: "full",
                  rounded: "full",
                  ring: "2 inset $wb-color-foreground"
                },
                null,
                -1
                /* HOISTED */
              )
            ]),
            4
            /* STYLE */
          )
        ],
        512
        /* NEED_PATCH */
      );
    };
  }
});
var _hoisted_1$2 = {
  flex: "~ none",
  w: "8",
  h: "8",
  rounded: "full",
  overflow: "hidden",
  select: "none",
  style: { "background": "#ffffff66", "background-image": "linear-gradient(\n          45deg,\n          #c5c5c5 25%,\n          transparent 0,\n          transparent 75%,\n          #c5c5c5 0,\n          #c5c5c5\n        ),\n        linear-gradient(\n          45deg,\n          #c5c5c5 25%,\n          transparent 0,\n          transparent 75%,\n          #c5c5c5 0,\n          #c5c5c5\n        )", "background-size": "6px 6px", "background-position": "0 0 3px 3px" }
};
var _hoisted_2$2 = ["i"];
var _sfc_main$6 = defineComponent({
  ...{ name: "ColorPickerPreview" },
  __name: "color-picker-preview",
  props: {
    selectedColor: { type: String, default: "#ff0000ff" }
  },
  emits: ["copy"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const copyState = ref(false);
    function handleCopyColor() {
      copyState.value = true;
      emits("copy");
      setTimeout(() => {
        copyState.value = false;
      }, 500);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode(
          "div",
          {
            w: "full",
            h: "full",
            overflow: "hidden",
            text: "white",
            style: normalizeStyle({ background: __props.selectedColor }),
            flex: "",
            justify: "center",
            items: "center",
            class: "group",
            cursor: "pointer",
            onClick: handleCopyColor
          },
          [
            createBaseVNode("i", {
              class: "hidden !group-hover:block",
              i: copyState.value ? "tdesign-check" : "mdi-content-copy"
            }, null, 8, _hoisted_2$2)
          ],
          4
          /* STYLE */
        )
      ]);
    };
  }
});
var _sfc_main$5 = defineComponent({
  ...{ name: "ColorPickerSaturation" },
  __name: "color-picker-saturation",
  props: {
    defaultValue: { type: Object, default: () => ({ x: 0, y: 0 }) },
    selectedColor: { type: String, default: "#ff0000" },
    panelColor: { type: String, default: "#ff0000" }
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const ColorSaturationRef = ref();
    const ColorSaturationHandlerRef = ref();
    let HubBarClientRect = null;
    let isSelecting = false;
    let startX = 0;
    let startY = 0;
    let prevOffsetX = 0;
    let prevOffsetY = 0;
    const resolveOffsetX = ref(0);
    const resolveOffsetY = ref(0);
    function selectSaturationColorStart(e) {
      e.stopPropagation();
      isSelecting = true;
      startX = e.clientX;
      startY = e.clientY;
      resolveOffsetX.value = e.clientX - HubBarClientRect.right;
      resolveOffsetY.value = e.clientY - HubBarClientRect.top;
      prevOffsetX = resolveOffsetX.value;
      prevOffsetY = resolveOffsetY.value;
      emits("change", {
        x: -(resolveOffsetX.value / HubBarClientRect.width) * 100,
        y: resolveOffsetY.value / HubBarClientRect.height * 100
      });
      on(document.body, "mousemove", throttleSelectSaturationChange);
    }
    function selectSaturationColorChange(e) {
      if (!isSelecting) return;
      isSelecting = true;
      let offsetX = e.clientX - startX + prevOffsetX;
      let offsetY = e.clientY - startY + prevOffsetY;
      if (offsetX < -HubBarClientRect.width) {
        offsetX = -HubBarClientRect.width;
      } else if (offsetX > 0) {
        offsetX = 0;
      }
      if (offsetY < 0) {
        offsetY = 0;
      } else if (offsetY > HubBarClientRect.height) {
        offsetY = HubBarClientRect.height;
      }
      resolveOffsetX.value = offsetX;
      resolveOffsetY.value = offsetY;
      emits("change", {
        x: -(resolveOffsetX.value / HubBarClientRect.width) * 100,
        y: resolveOffsetY.value / HubBarClientRect.height * 100
      });
    }
    const throttleSelectSaturationChange = throttle(selectSaturationColorChange, 21);
    function selectSaturationColorEnd() {
      isSelecting = false;
      prevOffsetX = resolveOffsetX.value;
      prevOffsetY = resolveOffsetY.value;
      off(document.body, "mousemove", throttleSelectSaturationChange);
    }
    function updateClientRect() {
      HubBarClientRect = ColorSaturationRef.value.getBoundingClientRect();
    }
    const debounceUpdateClientRect = debounce$1(updateClientRect, 300);
    onMounted(() => {
      updateClientRect();
      if (props.defaultValue) {
        resolveOffsetX.value = -HubBarClientRect.width * (props.defaultValue.x / 100);
        prevOffsetX = resolveOffsetX.value;
        resolveOffsetY.value = HubBarClientRect.height * (props.defaultValue.y / 100);
        prevOffsetY = resolveOffsetY.value;
      }
      on(ColorSaturationRef.value, "mousedown", selectSaturationColorStart);
      on(document.body, "mouseup", selectSaturationColorEnd);
      on(window, "resize", debounceUpdateClientRect);
    });
    onBeforeUnmount(() => {
      off(ColorSaturationRef.value, "mousedown", selectSaturationColorStart);
      off(window, "resize", debounceUpdateClientRect);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          ref_key: "ColorSaturationRef",
          ref: ColorSaturationRef,
          relative: "",
          w: "full",
          h: "40",
          rounded: "$comp-radius-sm",
          overflow: "hidden",
          select: "none",
          style: normalizeStyle({ background: __props.panelColor })
        },
        [
          _cache[1] || (_cache[1] = createBaseVNode(
            "div",
            {
              absolute: "",
              inset: "0",
              w: "full",
              h: "full",
              style: { "background": "linear-gradient(90deg, #fff, transparent)" }
            },
            null,
            -1
            /* HOISTED */
          )),
          _cache[2] || (_cache[2] = createBaseVNode(
            "div",
            {
              absolute: "",
              inset: "0",
              w: "full",
              h: "full",
              style: { "background": "linear-gradient(0deg, #000, transparent)" }
            },
            null,
            -1
            /* HOISTED */
          )),
          createBaseVNode(
            "div",
            {
              ref_key: "ColorSaturationHandlerRef",
              ref: ColorSaturationHandlerRef,
              absolute: "",
              top: "-2",
              right: "-2",
              shadow: "sm black",
              rounded: "full",
              select: "none",
              style: normalizeStyle({
                transform: `translate3d(${resolveOffsetX.value}px, ${resolveOffsetY.value}px, 0)`
              })
            },
            _cache[0] || (_cache[0] = [
              createBaseVNode(
                "div",
                {
                  w: "4",
                  h: "4",
                  rounded: "full",
                  ring: "2 inset $wb-color-foreground",
                  cursor: "pointer"
                },
                null,
                -1
                /* HOISTED */
              )
            ]),
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      );
    };
  }
});
var XDefaultProps$4 = {
  pure: false,
  dropper: false
};
var DefaultProps$4 = {
  ...SizeDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...XDefaultProps$4
};
var _hoisted_1$1 = {
  flex: "",
  items: "center",
  gap: "2"
};
var _hoisted_2$1 = {
  w: "44",
  flex: "~ col 1",
  gap: "2.5"
};
var _sfc_main$4 = defineComponent({
  ...{ name: "WbColorPicker" },
  __name: "color-picker",
  props: mergeDefaults({
    pure: { type: Boolean },
    dropper: { type: Boolean },
    onClick: { type: Function },
    size: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    value: {},
    modelValue: {},
    defaultValue: {},
    onChange: { type: Function }
  }, DefaultProps$4),
  emits: ["click", "change", "update:value", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["size"],
      nameProps: ["disabled", "pure"]
    });
    const [colorPickerValue] = useVModel({
      props: toRefs(props)
    });
    const selectedColorHue = ref(0);
    const selectedColorSaturation = ref(100);
    const selectedColorValue = ref(100);
    const selectedColorAlpha = ref(100);
    watch(
      () => colorPickerValue.value,
      () => {
        const color2 = Color$1(colorPickerValue.value);
        selectedColorHue.value = color2.hue();
        selectedColorSaturation.value = color2.saturationv();
        selectedColorValue.value = color2.value();
        selectedColorAlpha.value = color2.alpha();
      },
      {
        immediate: true
      }
    );
    const selectedColor = computed(() => {
      const color2 = Color$1({
        h: selectedColorHue.value,
        s: selectedColorSaturation.value,
        v: selectedColorValue.value
      });
      return {
        color: color2,
        hex: color2.hex(),
        hexAlpha: color2.alpha(),
        hexa: color2.alpha(selectedColorAlpha.value).hexa()
      };
    });
    const saturationBackgroundColor = computed(() => {
      const color2 = Color$1({
        h: selectedColorHue.value,
        s: 100,
        v: 100
      });
      return color2.hex();
    });
    function handleHueChange(hue) {
      selectedColorHue.value = hue;
      emits("change", selectedColor.value.hex);
    }
    function handleAlphaChange(hue) {
      selectedColorAlpha.value = hue;
      emits("change", selectedColor.value.hex);
    }
    function handleSaturationChange(data) {
      selectedColorSaturation.value = 100 - data.x;
      selectedColorValue.value = 100 - data.y;
      emits("change", selectedColor.value.hex);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          w: "$wb-color-picker-width",
          p: "[calc(var(--wb-color-picker-padding)+0.125rem)]",
          bg: "$wb-color-picker-background",
          ring: "1 inset $wb-color-picker-border",
          rounded: "$wb-color-picker-radius",
          flex: "~ col",
          gap: "3",
          select: "none",
          class: normalizeClass(unref(propsClasses))
        },
        [
          createVNode(_sfc_main$5, {
            "default-value": {
              x: 100 - selectedColorSaturation.value,
              y: 100 - selectedColorValue.value
            },
            "selected-color": selectedColor.value.hex,
            "panel-color": saturationBackgroundColor.value,
            onChange: handleSaturationChange
          }, null, 8, ["default-value", "selected-color", "panel-color"]),
          createBaseVNode("div", _hoisted_1$1, [
            createVNode(_sfc_main$6, {
              flex: "none",
              "selected-color": selectedColor.value.hexa,
              onCopy: _cache[0] || (_cache[0] = ($event) => unref(copyToClipboard)(selectedColor.value.hexa))
            }, null, 8, ["selected-color"]),
            createBaseVNode("div", _hoisted_2$1, [
              createVNode(_sfc_main$7, {
                "default-value": selectedColorHue.value,
                "selected-color": selectedColor.value.hex,
                onChange: handleHueChange
              }, null, 8, ["default-value", "selected-color"]),
              createVNode(_sfc_main$9, {
                "default-value": selectedColorAlpha.value,
                "selected-color": selectedColor.value.hex,
                onChange: handleAlphaChange
              }, null, 8, ["default-value", "selected-color"])
            ]),
            _ctx.dropper ? (openBlock(), createBlock(_sfc_main$8, { key: 0 })) : createCommentVNode("v-if", true)
          ]),
          createCommentVNode(' <ColorPickerValue :selected-color="selectedColor" /> ')
        ],
        2
        /* CLASS */
      );
    };
  }
});
function useColorPicker(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$4, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var ColorPicker = withInstall(_sfc_main$4);
var KEY_FORM_PROVIDE = Symbol("FormProvide");
var XDefaultProps$3 = {
  layout: "normal",
  allowTypes: ["WbFormItem"]
};
var DefaultProps$3 = {
  ...SizeDefault,
  ...LoadingDefault,
  ...DisabledDefault,
  ...ReadonlyDefault,
  ...XDefaultProps$3
};
var _sfc_main$3 = defineComponent({
  ...{ name: "WbForm" },
  __name: "form",
  props: mergeDefaults({
    rules: {},
    data: {},
    layout: {},
    labelWidth: {},
    labelAlign: {},
    allowTypes: {},
    onSubmit: { type: Function },
    onReset: { type: Function },
    default: { type: [String, Object, Function] },
    size: {},
    loading: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean }
  }, DefaultProps$3),
  emits: ["submit", "reset", "click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const propsClasses = useClasses({
      valueProps: ["layout"],
      nameValueProps: ["labelAlign"]
    });
    const propsStyles = useStyles();
    const renderNode = useNode();
    const ContentNode = () => renderNode("default", { allowNodeTypes: props.allowTypes || ["WbFormItem"] });
    const nodes = useNodeChildren();
    function initFormRules() {
      var _a;
      const map = {};
      const list = [];
      for (const item of nodes) {
        const itemProps = item.props;
        if (!(itemProps == null ? void 0 : itemProps.name)) continue;
        const resolveRules = [
          ...itemProps.rules || [],
          ...((_a = props.rules) == null ? void 0 : _a[itemProps.name]) || []
        ];
        if (resolveRules.length) {
          list.push({
            ...itemProps,
            rules: resolveRules
          });
          map[itemProps.name] = resolveRules;
        }
      }
      return { map, list };
    }
    const { list: formRulesList } = initFormRules();
    const labelWidth = ref(0);
    const FORM_VALIDATE_RESULT_DEFAULT = { pass: true, errors: [] };
    const formValidate = ref({
      ...FORM_VALIDATE_RESULT_DEFAULT
    });
    provide(KEY_FORM_PROVIDE, {
      labelWidthForm: props.labelWidth,
      labelWidth,
      formValidate
    });
    function handleSubmit(e) {
      e.preventDefault();
      validate();
      cancelValidateWatcher = watchEffect(() => validate());
      emits("submit", { data: props.data, validate: formValidate.value });
    }
    function handleReset(e) {
      e.preventDefault();
      clearValidate();
      emits("reset", { data: props.data });
    }
    let cancelValidateWatcher;
    function validate() {
      const errors = [];
      for (const item of formRulesList) {
        item.rules.some((rule) => {
          var _a;
          if (rule.required && !((_a = props.data) == null ? void 0 : _a[item.name])) {
            errors.push({
              prop: item.name,
              type: rule.type,
              message: rule.message
            });
            return true;
          }
          return false;
        });
      }
      formValidate.value = {
        pass: errors.length === 0,
        errors
      };
    }
    function clearValidate() {
      cancelValidateWatcher == null ? void 0 : cancelValidateWatcher();
      formValidate.value = { ...FORM_VALIDATE_RESULT_DEFAULT };
    }
    __expose({
      validate,
      clearValidate
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "form",
        {
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles)),
          flex: "~ col",
          onSubmit: handleSubmit,
          onReset: handleReset
        },
        [
          renderSlot(_ctx.$slots, "default", { labelWidth: labelWidth.value }, () => [
            createVNode(ContentNode)
          ])
        ],
        38
        /* CLASS, STYLE, NEED_HYDRATION */
      );
    };
  }
});
var XDefaultProps$2 = {
  label: ""
};
var DefaultProps$2 = {
  ...SizeDefault,
  ...XDefaultProps$2
};
var _hoisted_1 = {
  w: "full",
  relative: ""
};
var _hoisted_2 = {
  key: 0,
  absolute: "",
  top: "100%",
  left: "0",
  "un-text": "3 $wb-form-item-color-tip",
  class: "wb-form-item-tip"
};
var _sfc_main$2 = defineComponent({
  ...{ name: "WbFormItem" },
  __name: "form-item",
  props: mergeDefaults({
    name: {},
    label: {},
    labelWidth: {},
    rules: {},
    onClick: { type: Function },
    default: { type: [String, Object, Function] },
    size: {}
  }, DefaultProps$2),
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const propsClasses = useClasses({
      valueProps: [],
      nameProps: []
    });
    const propsStyles = useStyles();
    const renderNode = useNode();
    const ContentNode = () => renderNode("default");
    const FormItemRef = ref();
    const { labelWidthForm, labelWidth, formValidate } = inject(
      KEY_FORM_PROVIDE
    );
    const labelWidthResolve = computed(() => {
      if (props.labelWidth) return props.labelWidth;
      if (labelWidthForm) return labelWidthForm;
      if ((labelWidth == null ? void 0 : labelWidth.value) === 0) return null;
      return labelWidth == null ? void 0 : labelWidth.value;
    });
    const resolveValidateResult = computed(() => {
      const result = { type: "", tip: "" };
      if (!formValidate.value.errors.length || formValidate.value.errors[0].prop !== props.name)
        return result;
      result.type = formValidate.value.errors[0].type;
      result.tip = formValidate.value.errors[0].message;
      return result;
    });
    function setAutoLabelWidth() {
      const { width } = FormItemRef.value.getBoundingClientRect();
      labelWidth.value = Math.max(labelWidth.value, width);
    }
    onMounted(() => {
      if (labelWidthForm || (labelWidth == null ? void 0 : labelWidth.value)) return;
      setAutoLabelWidth();
      const BodyEvents = GlobalEventCenter.get("body");
      BodyEvents == null ? void 0 : BodyEvents.on("resize", setAutoLabelWidth);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          w: "full",
          m: "b-8",
          flex: "",
          items: "center",
          class: normalizeClass(`${unref(propsClasses)} wb-form-item--${resolveValidateResult.value.type}`),
          style: normalizeStyle(unref(propsStyles))
        },
        [
          _ctx.label ? (openBlock(), createElementBlock(
            "div",
            {
              key: 0,
              ref_key: "FormItemRef",
              ref: FormItemRef,
              p: "r-4",
              style: normalizeStyle({ width: `${labelWidthResolve.value}px` })
            },
            toDisplayString(_ctx.label),
            5
            /* TEXT, STYLE */
          )) : createCommentVNode("v-if", true),
          createBaseVNode("div", _hoisted_1, [
            createVNode(ContentNode),
            resolveValidateResult.value.tip ? (openBlock(), createElementBlock(
              "div",
              _hoisted_2,
              toDisplayString(resolveValidateResult.value.tip),
              1
              /* TEXT */
            )) : createCommentVNode("v-if", true)
          ])
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function useForm(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$3, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
function useFormItem(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$2, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Form = withInstall(_sfc_main$3);
var FormItem = withInstall(_sfc_main$2);
var XDefaultProps$1 = {
  default: ""
};
var DefaultProps$1 = {
  ...SizeDefault,
  ...XDefaultProps$1
};
var _sfc_main$1 = defineComponent({
  ...{ name: "WbLoading" },
  __name: "loading",
  props: mergeDefaults({
    onClick: { type: Function },
    default: { type: [String, Object, Function] },
    size: {},
    value: {},
    modelValue: {},
    defaultValue: {},
    onChange: { type: Function }
  }, DefaultProps$1),
  emits: ["click", "change", "update:value", "update:modelValue"],
  setup(__props) {
    const propsClasses = useClasses({
      valueProps: [],
      nameProps: []
    });
    const propsStyles = useStyles();
    const renderNode = useNode();
    const ContentNode = () => renderNode("default");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles))
        },
        [
          _cache[0] || (_cache[0] = createTextVNode(" Loading ")),
          createVNode(ContentNode)
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function useLoading(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main$1, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Loading = withInstall(_sfc_main$1);
var XDefaultProps = {
  default: ""
};
var DefaultProps = {
  ...XDefaultProps
};
var _sfc_main = defineComponent({
  ...{ name: "WbMessage" },
  __name: "message",
  props: mergeDefaults({
    onClick: { type: Function },
    default: { type: [String, Object, Function] }
  }, DefaultProps),
  emits: ["click"],
  setup(__props) {
    const propsClasses = useClasses({
      valueProps: [],
      nameProps: []
    });
    const propsStyles = useStyles();
    const renderNode = useNode();
    const ContentNode = () => renderNode("default");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(
        "div",
        {
          class: normalizeClass(unref(propsClasses)),
          style: normalizeStyle(unref(propsStyles))
        },
        [
          _cache[0] || (_cache[0] = createTextVNode(" Message ")),
          createVNode(ContentNode)
        ],
        6
        /* CLASS, STYLE */
      );
    };
  }
});
function useMessage(options) {
  const node = defineComponent({
    setup(_, { slots }) {
      return () => h(_sfc_main, { ...options || {} }, getRawSlots(slots));
    }
  });
  return { node };
}
var Message = withInstall(_sfc_main);
var components = Object.freeze(Object.defineProperty({
  __proto__: null,
  Button,
  ButtonGroup,
  ColorPicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Loading,
  Message,
  Placeholder,
  Popup,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Space,
  Toggle,
  useButton,
  useButtonGroup,
  useColorPicker,
  useForm,
  useFormItem,
  useInput,
  useInputNumber,
  useLoading,
  useMessage,
  usePlaceholder,
  usePopup,
  useRadio,
  useRadioGroup,
  useSelect,
  useSlider,
  useSpace,
  useToggle
}, Symbol.toStringTag, { value: "Module" }));
function install(app) {
  for (const key in components) {
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  }
}
var index = {
  install,
  version: "0.0.36-alpha.0"
};

// ../node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/index.js
import "D:/Kythuen/ephemeras/node_modules/.pnpm/white-block@0.0.36-alpha.0_vue@3.5.13_typescript@5.0.2_/node_modules/white-block/dist/styles/index.css";
import Layout from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/Layout.vue";
import WBIconButton from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBIconButton.vue";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/vars.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/base.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/icons.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/utils.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/components/custom-block.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code-group.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/vitepress@1.5.0_@algolia+client-search@5.15.0_@types+node@20.4.5_less@4.2.0_postcss@8.4.49_se_4lvdoe4ocapz2k3aae5wiqlh6q/node_modules/vitepress/dist/client/theme-default/styles/components/vp-sponsor.css";
import "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/styles/index.less";
import WBDocumentAside from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBDocumentAside.vue";
import WBDocumentAsideMenu from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBDocumentAsideMenu.vue";
import WBDocumentHeader from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBDocumentHeader.vue";
import WBHeader from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBHeader.vue";
import WBHome from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBHome.vue";
import WBSidebar from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBSidebar.vue";
import WBSidebarMenu from "D:/Kythuen/ephemeras/node_modules/.pnpm/@white-block+vitepress@0.0.1-alpha.3_postcss@8.4.49_rollup@4.24.4_typescript@5.0.2_vite@5.4.1_wzx4jtwhn42cexiwxtx4abccja/node_modules/@white-block/vitepress/dist/client/theme/components/WBSidebarMenu.vue";
var Theme = {
  Layout,
  enhanceApp({ app, router }) {
    app.use(index);
    app.component("WBIconButton", WBIconButton);
    router.onBeforePageLoad = () => {
      var _a;
      if (!import.meta.env.SSR) {
        (_a = document.getElementById("layoutRoot")) == null ? void 0 : _a.scrollTo(0, 0);
      }
    };
  }
};
export {
  Layout,
  Theme,
  WBDocumentAside,
  WBDocumentAsideMenu,
  WBDocumentHeader,
  WBHeader,
  WBHome,
  WBIconButton,
  WBSidebar,
  WBSidebarMenu
};
//# sourceMappingURL=@white-block_vitepress.js.map
