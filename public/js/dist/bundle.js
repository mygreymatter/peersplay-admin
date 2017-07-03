webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19).Buffer))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(89)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(45),
  /* template */
  null,
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/event-bus.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a36298fc", Component.options)
  } else {
    hotAPI.reload("data-v-a36298fc", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(82)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(51),
  /* template */
  __webpack_require__(72),
  /* scopeId */
  "data-v-207d218e",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/profile-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] profile-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-207d218e", Component.options)
  } else {
    hotAPI.reload("data-v-207d218e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(83)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(54),
  /* template */
  __webpack_require__(76),
  /* scopeId */
  "data-v-6ad545b1",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/vocabulary-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vocabulary-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6ad545b1", Component.options)
  } else {
    hotAPI.reload("data-v-6ad545b1", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(46),
  /* template */
  __webpack_require__(73),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/help-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] help-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-246611e8", Component.options)
  } else {
    hotAPI.reload("data-v-246611e8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(88)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(47),
  /* template */
  __webpack_require__(81),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/login.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] login.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e9ef7ac4", Component.options)
  } else {
    hotAPI.reload("data-v-e9ef7ac4", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(48),
  /* template */
  __webpack_require__(74),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/main-content.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] main-content.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-361b7680", Component.options)
  } else {
    hotAPI.reload("data-v-361b7680", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(86)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(50),
  /* template */
  __webpack_require__(79),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/navigation.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] navigation.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c89e80a2", Component.options)
  } else {
    hotAPI.reload("data-v-c89e80a2", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(84)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(52),
  /* template */
  __webpack_require__(77),
  /* scopeId */
  "data-v-812f51c0",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/quiz-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] quiz-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-812f51c0", Component.options)
  } else {
    hotAPI.reload("data-v-812f51c0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(53),
  /* template */
  __webpack_require__(71),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/title-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] title-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-187bc186", Component.options)
  } else {
    hotAPI.reload("data-v-187bc186", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_cookie__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_cookie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_login_vue__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_login_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_login_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_navigation_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_navigation_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_navigation_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_main_content_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_main_content_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_main_content_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_title_component_vue__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_title_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_title_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_profile_component_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_profile_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_profile_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_vocabulary_component_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_vocabulary_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__components_vocabulary_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_quiz_component_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_quiz_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__components_quiz_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_help_component_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_help_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__components_help_component_vue__);





__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_cookie___default.a);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]);










const paths = ['/home', '/profile', '/vocabulary', '/quiz', '/help'];

const routes = [{ path: paths[0], name: 'home-view', component: __WEBPACK_IMPORTED_MODULE_4__components_login_vue___default.a }, { path: paths[1], name: 'profile-view', component: __WEBPACK_IMPORTED_MODULE_8__components_profile_component_vue___default.a }, { path: paths[2], name: 'vocabulary-view', component: __WEBPACK_IMPORTED_MODULE_9__components_vocabulary_component_vue___default.a }, { path: paths[3], name: 'quiz-view', component: __WEBPACK_IMPORTED_MODULE_10__components_quiz_component_vue___default.a }, { path: paths[4], name: 'help-view', component: __WEBPACK_IMPORTED_MODULE_11__components_help_component_vue___default.a }];
const router = new __WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]({ mode: 'history', routes });

let isSigningOut;

new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
    el: "#app",
    data: {
        msg: 'Welcome To PlanetMentor',
        isAuthenticating: true
    },
    router,
    components: { Login: __WEBPACK_IMPORTED_MODULE_4__components_login_vue___default.a, TitleComponent: __WEBPACK_IMPORTED_MODULE_7__components_title_component_vue___default.a, Navigation: __WEBPACK_IMPORTED_MODULE_5__components_navigation_vue___default.a, MainContent: __WEBPACK_IMPORTED_MODULE_6__components_main_content_vue___default.a, Profile: __WEBPACK_IMPORTED_MODULE_8__components_profile_component_vue___default.a, Vocabulary: __WEBPACK_IMPORTED_MODULE_9__components_vocabulary_component_vue___default.a, Quiz: __WEBPACK_IMPORTED_MODULE_10__components_quiz_component_vue___default.a, Help: __WEBPACK_IMPORTED_MODULE_11__components_help_component_vue___default.a },
    created() {
        isSigningOut = false;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('User: ' + user.displayName);
                this.isAuthenticating = false;
                router.replace(paths[2]);
            } else {
                if (isSigningOut) {
                    window.cookie.set('remember_me', 0);
                    var url = "/";
                    __WEBPACK_IMPORTED_MODULE_3_jquery___default()(location).attr('href', url);
                }
                console.log('User is not signed in.');
                this.isAuthenticating = true;
                router.replace(paths[0]);
            }
        });
    },
    mounted() {
        window.cookie = this.$cookie;
        console.log('Current Path: ' + router.currentRoute.path);
        console.log('Cookie: ' + window.cookie);

        let currentPath;
        switch (router.currentRoute.path) {
            case paths[0]:
                currentPath = paths[0];
                break;
            case paths[1]:
                currentPath = paths[1];
                break;
            case paths[2]:
                currentPath = paths[2];
                break;
            case paths[3]:
                currentPath = paths[3];
                break;
            case paths[4]:
                currentPath = paths[4];
                break;
            default:
                currentPath = paths[0];
                break;
        }
        console.log('New Path: ' + currentPath);
        router.replace(currentPath);
    },
    methods: {
        logout() {
            console.log('Logout');

            if (firebase.auth().currentUser) {
                isSigningOut = true;

                firebase.auth().signOut();
            }
        }
    }
});

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);


const EventBus = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a();
/* harmony export (immutable) */ __webpack_exports__["EventBus"] = EventBus;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            title: 'Help Component'
        };
    }
});

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_cookie__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue_cookie__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_3_vue_cookie___default.a);

const router = new __WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]({
    mode: 'history'
});

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            msg: 'Welcome To PlanetMentor',
            title: 'Login Component',
            isLoginSelected: true,
            isSigningUp: false,
            isLogging: false,
            user: {
                username: '',
                password: '',
                confirmPassword: ''
            },
            authToken: null,
            canShowViews: false,
            progressStatus: ''
        };
    },
    router,
    created() {
        //isSigningUp = false;
        var rememberMe = this.$cookie.get('remember_me');
        //console.log('Remember Me: ' + rememberMe);

        if (rememberMe === null || rememberMe === undefined) this.$cookie.set('remember_me', 0);

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('User: ' + user.displayName + " " + rememberMe);

                if (!this.isLogging && !this.isSigningUp) {
                    if (rememberMe === '0') {
                        firebase.auth().signOut();
                    } else if (rememberMe === '1') {
                        var url = "/vocabulary";
                        $(location).attr('href', url);
                    }
                } else if (this.isSigningUp) {
                    this.user.username = '';
                    this.user.password = '';
                    this.user.confirmPassword = '';
                    this.isLoginSelected = true;

                    //this.isSigningUp = false;
                } else if (this.isLogging) {
                    var url = "/vocabulary";
                    $(location).attr('href', url);
                    //this.isLogging = false;
                }
            } else {
                console.log('User is not signed in.');
                this.canShowViews = true;
            }
        });
    },
    mounted() {
        //console.log('Cookie onMounted:' + this.$cookie.get('auth-token'));
    },
    methods: {
        showLogin() {
            this.isLoginSelected = true;
        }, showSignup() {
            this.isLoginSelected = false;
        }, signup() {

            if (this.user.password !== this.user.confirmPassword) {
                alert('The passwords must be same.');
                return;
            }

            this.isSigningUp = true;
            this.progressStatus = "Please wait while signing up...";
            firebase.auth().createUserWithEmailAndPassword(this.user.username, this.user.password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                this.isSigningUp = false;
            });
        }, login() {
            console.log('Login');

            this.isLogging = true;
            this.progressStatus = "Please wait while logging...";
            firebase.auth().signInWithEmailAndPassword(this.user.username, this.user.password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                this.isLogging = false;
            });
        }, rememberMe() {
            switch (this.$cookie.get('remember_me')) {
                case '1':
                    this.$cookie.set('remember_me', '0');
                    break;
                case '0':
                    this.$cookie.set('remember_me', '1');
                    break;
            }
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_component_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__profile_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vocabulary_component_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vocabulary_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__vocabulary_component_vue__);
//
//
//
//
//
//
//



__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]);




const routes = [{ path: '/dashboard/profile', name: 'profile-view', component: __WEBPACK_IMPORTED_MODULE_2__profile_component_vue___default.a }, { path: '/dashboard/vocabulary', name: 'vocabulary-view', component: __WEBPACK_IMPORTED_MODULE_3__vocabulary_component_vue___default.a }];
const router = new __WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]({ mode: 'history', routes });

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            title: 'Main Content'
        };
    },
    router,
    components: { Profile: __WEBPACK_IMPORTED_MODULE_2__profile_component_vue___default.a, Vocabulary: __WEBPACK_IMPORTED_MODULE_3__vocabulary_component_vue___default.a },
    mounted() {
        console.log('MainContent Created');
        router.replace('/dashboard/profile');
    }
});

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_bus_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_bus_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__event_bus_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['word'], data() {
    return {
      isSaving: false,
      isMeaningRequired: false,
      isTypeRequired: false,
      isExampleRequired: false
    };
  }, created() {
    if (this.word.id === '') {
      this.word.id = new Date().getTime().toString();
    }

    __WEBPACK_IMPORTED_MODULE_0__event_bus_vue__["EventBus"].$on('word-title', title => {
      this.word.title = title;
    });
  }, methods: {
    save() {

      this.isWordRequired = this.word.title === '';
      this.isMeaningRequired = this.word.meaning === '';
      this.isTypeRequired = this.word.type === '';
      this.isExampleRequired = this.word.exampleOne === '';

      if (!this.isWordRequired && !this.isMeaningRequired && !this.isExampleRequired && !this.isTypeRequired) {

        var instance = this;
        this.isSaving = true;

        if (this.word.exampleTwo !== '') this.word.exampleTwo = this.word.exampleTwo.toLowerCase();

        var item = {
          'title': this.word.title.toLowerCase(),
          'type': this.word.type.toLowerCase(),
          'meaning': this.word.meaning.toLowerCase(),
          'exampleOne': this.word.exampleOne.toLowerCase(),
          'exampleTwo': this.word.exampleTwo.toLowerCase()
        };

        var ref = firebase.database().ref('words/' + this.word.title + '/' + this.word.id);
        ref.once('value').then(function (snapshot) {

          ref.set(item);
          ref.once('value', function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val().title === instance.word.title) {
              instance.isSaving = false;
              Materialize.toast('It has been saved.', 2000);
              instance.wordPhrasal = instance.meaning = instance.exampleOne = instance.exampleTwo = '';
            }
          });
        });
      }
    }
  }
});

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//



__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]);

const router = new __WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]({ mode: 'history' });

/* harmony default export */ __webpack_exports__["default"] = ({

    data() {
        return {
            title: "Navigation Race"
        };
    }, router,
    methods: {}
});

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            isEditMode: false,
            modeLabel: 'Edit',
            user: {
                name: '',
                emailaddress: ''
            }
        };
    }, methods: {
        editProfile() {
            this.isEditMode = !this.isEditMode;
            this.modeLabel = this.isEditMode ? "Save" : "Edit";
        }, cancel() {
            this.isEditMode = false;
        }, save() {
            this.isEditMode = false;
        }
    }
});

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            hasAnswered: false,
            isQuizBeginning: true,
            yourAnswer: '',
            questionIndex: 0,
            isQuizProgress: false,
            questions: [{
                questionType: 'mcq',
                instruction: 'Find out the meaning of the word "Ace"?',
                choices: ['outdo someone in a competitive situation', 'achieve high marks in (a test or exam)', 'score an ace on (a hole) or with (a shot)', '(in tennis and similar games) serve an ace against (an opponent)'],
                questionPart: ['', ''],
                hasAnswered: false,
                answer: ''
            }, {
                questionType: 'descriptive',
                instruction: 'Fill in the correct word.',
                questionPart: ['Nandal banged down eight ', ' in the set.'],
                hasAnswered: false,
                answer: ''
            }]
        };
    }, filters: {
        titleCase: function (value) {
            if (!value) return '';
            return value.substr(0, 1).toUpperCase() + value.substr(1);
        }
    }, methods: {
        showQuiz(n) {
            console.log('Quiz selected: ' + n);
            this.isQuizProgress = true;
        },
        showQuizList() {
            this.isQuizProgress = false;
        },
        next() {
            console.log('yourAnswer: ' + this.yourAnswer);
            if (this.hasAnswered && this.questionIndex < this.questions.length - 1) {
                this.questionIndex++;
                this.yourAnswer = this.questions[this.questionIndex].answer;
            }
        },
        previous() {
            if (this.questionIndex > 0) {
                this.questionIndex--;
                this.yourAnswer = this.questions[this.questionIndex].answer;
            }
        }, chosen(value) {
            this.yourAnswer = value;
        }
    }, watch: {
        yourAnswer: function (yourAnswer) {
            if (yourAnswer.length === 0) {
                this.hasAnswered = false;
                this.isQuizBeginning = this.questionIndex === 0;
                return yourAnswer;
            }
            this.hasAnswered = true;
            this.isQuizBeginning = this.questionIndex === 0;
            this.questions[this.questionIndex].answer = yourAnswer;
            console.log('yourAnswer: ' + this.questions[this.questionIndex].answer);
            return yourAnswer;
        }
    }
});

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            msg: ''
        };
    }, methods: {
        goHome() {
            console.log('Go Home');
            var url = "/";
            $(location).attr('href', url);
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__event_bus_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__event_bus_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__event_bus_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__meaning_component_vue__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__meaning_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__meaning_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__word_component_vue__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__word_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__word_component_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




__WEBPACK_IMPORTED_MODULE_1_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]);





/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            isLoading: false,
            isWordRequired: false,
            canShowWords: true,
            //0 - query; 1 - editing; 2 - detail
            mode: 0,
            wordPhrasal: '',
            query: '',
            wordSelected: {},
            resultWordsList: [],
            userWordsList: [],
            words: [{
                id: '',
                title: this.wordPhrasal,
                index: 1,
                meaning: '',
                type: 'noun',
                exampleOne: '',
                exampleTwo: ''
            }]
        };
    }, components: {
        Meaning: __WEBPACK_IMPORTED_MODULE_4__meaning_component_vue___default.a, Word: __WEBPACK_IMPORTED_MODULE_5__word_component_vue___default.a
    }, created() {

        __WEBPACK_IMPORTED_MODULE_3__event_bus_vue__["EventBus"].$on('go-back', mode => {
            this.showEditor();
        });

        __WEBPACK_IMPORTED_MODULE_3__event_bus_vue__["EventBus"].$on('edit-word', index => {
            this.mode = 1;
            this.wordSelected = this.userWordsList[index];
            this.wordSelected['index'] = index;
            this.words = [];
            this.words.push(this.wordSelected);
            this.wordPhrasal = this.wordSelected.title;
        });

        var words = firebase.database().ref('words/');
        var instance = this;

        words.orderByKey().once('value').then(function (snapshot) {

            if (snapshot.hasChildren()) {
                var o = snapshot.val();

                instance.userWordsList = [];
                let index = 0;

                Object.keys(o).forEach(function (key) {
                    var w = snapshot.val()[key];
                    Object.keys(w).forEach(function (k) {
                        w[k]['index'] = index++;
                        w[k]['id'] = k;
                        instance.userWordsList.push(w[k]);
                    });
                });
            }
        });
    }, mounted() {
        // Extension materialize.css

    }, watch: {
        query: function (val) {
            if (val.length >= 2) {
                this.isLoading = true;
                this.queryFirebase(val);
            } else {
                this.isLoading = false;
                this.resultWordsList = [];
                this.canShowWords = true;
            }
        }, wordPhrasal: function (word) {
            this.isWordRequired = word.length === 0;

            if (word.length > 0) __WEBPACK_IMPORTED_MODULE_3__event_bus_vue__["EventBus"].$emit('word-title', word);
        }
    }, methods: {
        showEditor() {
            this.mode = this.mode === 1 || this.mode === 2 ? 0 : 1;
            this.isSaving = false;
            console.log("Edit Mode: " + this.mode === 1);
        }, addMeaning() {
            let word = {
                id: '',
                title: this.wordPhrasal,
                index: this.words.length + 1,
                meaning: '',
                type: 'noun',
                exampleOne: '',
                exampleTwo: ''
            };

            this.words.push(word);
        }, queryFirebase(val) {

            var words = firebase.database().ref('words/');
            var instance = this;

            words.orderByKey().once('value').then(function (snapshot) {

                if (snapshot.hasChildren()) {
                    var o = snapshot.val();
                    Object.keys(snapshot.val()).forEach(function (key) {

                        if (key.indexOf(val) === -1) {
                            delete o[key];
                        }
                    });

                    instance.resultWordsList = [];
                    Object.keys(o).forEach(function (key) {
                        var w = snapshot.val()[key];
                        Object.keys(w).forEach(function (k) {
                            instance.resultWordsList.push(w[k]);
                        });
                    });
                }
            });
        }
    }
});

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_bus_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_bus_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__event_bus_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
	props: ['word', 'index'],
	data() {
		return {};
	}, methods: {
		editWord() {
			console.log('Edit Word: ' + this.word.title + " " + this.index);
			__WEBPACK_IMPORTED_MODULE_0__event_bus_vue__["EventBus"].$emit('edit-word', this.index);
		}
	}
});

/***/ }),
/* 56 */,
/* 57 */,
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.row[data-v-207d218e]{\n    margin-bottom:0;\n}\n.profile[data-v-207d218e]{\n    padding:10px;\n}\n.profile-card[data-v-207d218e]{\n    padding:10px 10px 10px 10px;\n}\n.profile[data-v-207d218e],.profile>.col.s9[data-v-207d218e]{\n    height:170px;\n}\n.name-label[data-v-207d218e]{\n    font-size:larger;\n}\nspan.name[data-v-207d218e]{\n    padding-top: 2px;\n    padding-left: 10px;\n    color:#FF5722;\n}\n.subscription-change[data-v-207d218e]{\n    margin-left:10px;\n}\n.subscription-change[data-v-207d218e]:hover{\n    cursor:pointer;\n}\ninput[type=date][data-v-207d218e]{\n    width:100%;\n    margin-bottom:0;\n}\ninput[type=date][data-v-207d218e]::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    display: none;\n}\n.datepick>.input-field.col.s9[data-v-207d218e]{\n    margin-top:0;\n}\n\n", ""]);

// exports


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\nbutton#back[data-v-6ad545b1]{\n    padding: 0 15px 0 15px;\n    margin-top: 10px;\n    width:15%;\n}\n.row[data-v-6ad545b1]{\n    margin-bottom:0;\n}\n#search-input[data-v-6ad545b1]{\n    color: #CCC;\n    font-size:26px;\n    font-weight:lighter;\n}\n#search-input[data-v-6ad545b1]:focus{\n  color:#000;\n}\n.card[data-v-6ad545b1]{\n    margin-bottom:5px;\n}\n.box[data-v-6ad545b1],.card-content[data-v-6ad545b1]{\n    padding:1rem;\n}\n.words-container[data-v-6ad545b1]{\n    margin: 0 20px 0 10px;\n    width:100%;\n}\np.control.back-control[data-v-6ad545b1]{\n    margin-bottom:20px;\n}\n.word-input-container[data-v-6ad545b1]{width:70%;\n}\nspan.icon.plus.is-large[data-v-6ad545b1]{\n    margin-right: 10px;\n    font-weight: lighter;\n    font-size: x-large;\n    margin-left:82%;\n}\nspan.icon.plus.is-large[data-v-6ad545b1]:hover{\n    cursor:pointer;\n}\n.example-input[data-v-6ad545b1]{\n    margin-bottom:10px;\n}\n.icon.is-large[data-v-6ad545b1]{\n    height:1.5rem;\n}\ndiv#search-bar[data-v-6ad545b1]{\n    margin-bottom:5px;\n}\n", ""]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.quiz-container[data-v-812f51c0]{\n    padding:10px;\n    width:100%;\n}\n.quiz-card[data-v-812f51c0]{\n    width:250px;\n    height:250px;\n    float:left;\n    margin-left:15%;\n    margin-bottom:10%;\n}\n.quiz-card[data-v-812f51c0]:hover{\n    cursor:pointer;\n}\n.quiz-card-content[data-v-812f51c0]{\n    height:200px;\n}\n.attempts[data-v-812f51c0],.success[data-v-812f51c0],.type-label[data-v-812f51c0],.status-label[data-v-812f51c0]{\n    font-weight:200;\n}\n.attempts-count[data-v-812f51c0],.success-count[data-v-812f51c0],.type-value[data-v-812f51c0],.status-value[data-v-812f51c0]{\n    padding-left:5px;\n    font-weight:500;\n}\n.attempts[data-v-812f51c0]{\n    color:orange;\n}\n.success[data-v-812f51c0]{\n    color:green;\n}\n.type-label[data-v-812f51c0],.type-value[data-v-812f51c0],.status-label[data-v-812f51c0],.status-value[data-v-812f51c0]{\n    font-size: larger;\n}\n.quiz-question-container[data-v-812f51c0]{\n    width:70%;\n}\n.prev[data-v-812f51c0],.next[data-v-812f51c0],input[type=radio][data-v-812f51c0]{\n    cursor: pointer;\n    color:#4A4A4A;\n}\n.disabled[data-v-812f51c0]{\n    color:#AEAEAE;\n    cursor:not-allowed;\n}\n.choice>label[data-v-812f51c0]{\n    cursor:pointer;\n    font-weight:lighter;\n}\n.question[data-v-812f51c0],.your-answer[data-v-812f51c0]{\n    font-weight:500;\n}\n.description[data-v-812f51c0]{\n    font-weight:lighter;\n}\np.control.back-control[data-v-812f51c0]{\n    margin-bottom:20px;\n}\n", ""]);

// exports


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.word-card[data-v-a7c3c9d6]:hover{\n    cursor: pointer;\n}\n.word[data-v-a7c3c9d6]{\n    font-weight:lighter;\n    font-size:36px;\n    font-family: robotoLight;\n}\n.word-definition[data-v-a7c3c9d6]{\n    font-size:16px;\n    font-family: robotoLight;\n}\n.word-example-title[data-v-a7c3c9d6]{\n    font-weight:lighter;\n    color:#616161;\n    font-family: robotoLight;\n    line-height:40px;\n}\n.word-example[data-v-a7c3c9d6]{\n    font-weight:lighter;\n    color:#000000;\n    font-family: robotoLight;\n}\n.word-more-examples[data-v-a7c3c9d6]{\n    font-weight:300;\n    font-style:italic;\n    float:right;\n    line-height:40px;\n}\n.word-more-examples[data-v-a7c3c9d6]:hover{\n    cursor:pointer;\n    color:#AEAEAE;\n}\n.search-result>.add-word[data-v-a7c3c9d6]{\n    float:right;\n}\n.word-type[data-v-a7c3c9d6]{\n    font-weight:bold;\n    color:#03A9F4;\n    font-style:italic;\n    font-size:18px;\n    font-family: robotoThin;\n}\nul[data-v-a7c3c9d6],ul li[data-v-a7c3c9d6]{ \n\tlist-style-type: disc;\n\tmargin-left:10px;\n}\n\n\t\n", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Do not set the style to scoped. This style belongs to the side bar in the index.html of dashboard*/\n\n/* The side navigation menu */\n.sidenav {\n    height: 100%;\n    /* 100% Full-height */\n    width: 270px;\n    /* 0 width - change this with JavaScript */\n    position: fixed;\n    /* Stay in place */\n    z-index: 1;\n    /* Stay on top */\n    top: 0;\n    left: 0;\n    background-color: #111;\n    /* Black*/\n    overflow-x: hidden;\n    /* Disable horizontal scroll */\n    padding-top: 30px;\n    /* Place content 60px from the top */\n    transition: 0.5s;\n    /* 0.5 second transition effect to slide in the sidenav */\n}\n\n\n/* The navigation menu links */\n.sidenav a {\n    padding: 8px 8px 8px 32px;\n    text-decoration: none;\n    font-size: 25px;\n    color: #818181;\n    display: block;\n    transition: 0.3s\n}\n.sidenav a#logout:hover{\n    cursor:pointer;\n}\n.sidenav a.router-link-active{\n    color:#FFFFFF;\n    font-size:40px;\n}\n\n/* When you mouse over the navigation links, change their color */\n.sidenav a:hover,\n.offcanvas a:focus {\n    color: #f1f1f1;\n}\n\n/* Style page content - use this if you want to push the page content to the right when you open the side navigation */\n#main {\n    transition: margin-left .5s;\n    padding-left: 20px;\n    padding-right: 20px;\n    padding-top: 10px;\n    margin-left: 250px;\n}\n\n/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */\n@media screen and (max-height: 450px) {\n.sidenav {\n        padding-top: 15px;\n}\n.sidenav a {\n        font-size: 18px;\n}\n}\n", ""]);

// exports


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\na#save[data-v-d8dab23c]{\n    width:15%;\n}\ninput.editor-input[data-v-d8dab23c]{\n    margin-bottom:5px;\n}\n.error[data-v-d8dab23c]{\n    font-size: 10px;\n    color:red;\n}\ninput.error[data-v-d8dab23c]{\n    border-bottom: 1px solid red;\n    box-shadow: 0 1px 0 0 red;\n}\ninput.error-input[data-v-d8dab23c]{\n    border-bottom: 1px solid red;\n    box-shadow: 0 1px 0 0 red;\n}\nbutton#save[data-v-d8dab23c]{\n    padding: 0 15px 0 15px;\n    margin-top: 10px;\n    width:15%;\n}\n.meaning-header[data-v-d8dab23c]{\n    background: #7986CB;\n    height: 50px;\n    padding: 12px;\n    color: ghostwhite;\n    margin:0;\n    font-size: large;\n}\n.card-content.meaning[data-v-d8dab23c]{\n  padding:0;\n}\n.card-content.meaning>form[data-v-d8dab23c]{\n  padding: 10px 24px 10px 24px;\n}\n\n", ""]);

// exports


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.card-content .row,.row.auth-header{\n    margin-bottom:0;\n}\n.card-content i.material-icons.prefix{\n    margin-top:5px;\n}\n.auth-header{\n    padding:10px;\n}\n.auth-button>a.waves-effect.waves-light{\n    padding:5px;\n    font-size:larger;\n    width:100%;\n    color: #AEAEAE;\n}\n.auth-button>a.waves-effect.waves-light:hover{\n    color: #5E5E5E;\n}\n.auth-button>a.waves-effect.waves-light.isActive{\n    border-bottom:1px solid #5E5E5E;\n    color: #5E5E5E;\n}\n@media only screen and (min-width: 768px){\n.main-container{\n        margin-top:4%;\n        padding:2%;\n}\n}\n\n", ""]);

// exports


/***/ }),
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(87)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(49),
  /* template */
  __webpack_require__(80),
  /* scopeId */
  "data-v-d8dab23c",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/meaning-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] meaning-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d8dab23c", Component.options)
  } else {
    hotAPI.reload("data-v-d8dab23c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(85)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(55),
  /* template */
  __webpack_require__(78),
  /* scopeId */
  "data-v-a7c3c9d6",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/planetmentor/admin/public/js/components/word-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] word-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a7c3c9d6", Component.options)
  } else {
    hotAPI.reload("data-v-a7c3c9d6", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 70 */,
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h1', [_vm._v(_vm._s(_vm.msg))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-187bc186", module.exports)
  }
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col l1"
  }), _vm._v(" "), _c('div', {
    staticClass: "col l10"
  }, [_c('div', {
    staticClass: "card hoverable profile-card"
  }, [_c('div', {
    staticClass: "right-align"
  }, [_c('a', {
    staticClass: "waves-light waves-effect btn",
    on: {
      "click": _vm.editProfile
    }
  }, [_vm._v(_vm._s(_vm.modeLabel))])]), _vm._v(" "), _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "row profile"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s9 valign-wrapper"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.user.name),
      expression: "user.name"
    }],
    staticClass: "input-field",
    attrs: {
      "type": "text",
      "placeholder": "Your Name",
      "tabindex": "1"
    },
    domProps: {
      "value": (_vm.user.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.user.name = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v("Your Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.user.emailaddress),
      expression: "user.emailaddress"
    }],
    staticClass: "input-field",
    attrs: {
      "type": "email",
      "placeholder": "Email Address",
      "tabindex": "2"
    },
    domProps: {
      "value": (_vm.user.emailaddress)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.user.emailaddress = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v("Email Address")])])])])]), _vm._v(" "), _vm._m(1)]), _vm._v(" "), _vm._m(2)])]), _vm._v(" "), _c('div', {
    staticClass: "col l1"
  })])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s3"
  }, [_c('img', {
    staticClass: "circle responsive-img",
    attrs: {
      "src": "images/yuna.jpg",
      "alt": ""
    }
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "row datepick"
  }, [_c('div', {
    staticClass: "input-field col s3"
  }, [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Date of Birth:")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s9"
  }, [_c('input', {
    attrs: {
      "type": "date",
      "required": ""
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12 input-field"
  }, [_c('p', [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Subscription:")]), _vm._v(" "), _c('span', {
    staticClass: "name"
  }, [_vm._v("Not subscribed")]), _vm._v(" "), _c('span', {
    staticClass: "subscription-change"
  }, [_c('a', {
    staticClass: "waves-light"
  }, [_vm._v("Change")])])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row top-border"
  }, [_c('div', {
    staticClass: "col s6"
  }, [_c('p', {
    staticClass: "center-align"
  }, [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Quizes Played:")]), _vm._v(" "), _c('span', {
    staticClass: "name"
  }, [_vm._v("5")])])]), _vm._v(" "), _c('div', {
    staticClass: "col s6"
  }, [_c('p', {
    staticClass: "center-align"
  }, [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Quizes Won:")]), _vm._v(" "), _c('span', {
    staticClass: "name"
  }, [_vm._v("5")])])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-207d218e", module.exports)
  }
}

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h1', [_vm._v(_vm._s(_vm.title))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-246611e8", module.exports)
  }
}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h1', [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c('router-view', {
    attrs: {
      "default": "{name:'profile-view'}"
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-361b7680", module.exports)
  }
}

/***/ }),
/* 75 */,
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.mode === 0),
      expression: "mode === 0"
    }],
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('form', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s12 valign-wrapper"
  }, [_c('div', {
    staticClass: "fixed-action-btn"
  }, [_c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light red",
    on: {
      "click": _vm.showEditor
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("add")])])])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col l12",
    attrs: {
      "id": "search-bar"
    }
  }, [_c('i', {
    staticClass: "material-icons prefix"
  }, [_vm._v("search")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.query),
      expression: "query"
    }],
    staticClass: "input",
    attrs: {
      "id": "search-input",
      "type": "text",
      "placeholder": "Type word"
    },
    domProps: {
      "value": (_vm.query)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.query = $event.target.value
      }
    }
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col l12"
  }, [_c('ul', _vm._l((_vm.resultWordsList), function(word, index) {
    return _c('li', [_c('Word', {
      attrs: {
        "word": word,
        "index": index
      }
    })], 1)
  }))])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.resultWordsList.length == 0),
      expression: "resultWordsList.length == 0"
    }],
    staticClass: "col s12",
    attrs: {
      "id": "list-words-container"
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.canShowWords),
      expression: "canShowWords"
    }],
    staticClass: "words-container"
  }, [_c('ul', _vm._l((_vm.userWordsList), function(word, index) {
    return _c('li', [_c('Word', {
      attrs: {
        "word": word,
        "index": index
      }
    })], 1)
  }))])])])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.mode === 1),
      expression: "mode === 1"
    }],
    staticClass: "container word-input-container",
    attrs: {
      "id": "Editor"
    }
  }, [_c('button', {
    staticClass: "waves-effect waves-light btn left-align button",
    attrs: {
      "id": "back"
    },
    on: {
      "click": _vm.showEditor
    }
  }, [_c('i', {
    staticClass: "material-icons left"
  }, [_vm._v("keyboard_arrow_left")]), _vm._v("\n            Back\n        ")]), _vm._v(" "), _c('div', {
    staticClass: "col s12 valign-wrapper"
  }, [_c('div', {
    staticClass: "fixed-action-btn"
  }, [_c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light button",
    on: {
      "click": _vm.addMeaning
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("add")])])])]), _vm._v(" "), _c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.wordPhrasal),
      expression: "wordPhrasal"
    }],
    staticClass: "validate editor-input",
    class: {
      'error-input': _vm.isWordRequired
    },
    attrs: {
      "id": "word-phrase",
      "type": "text"
    },
    domProps: {
      "value": (_vm.wordPhrasal)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.wordPhrasal = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    class: {
      'active': (_vm.wordPhrasal !== '')
    },
    attrs: {
      "for": "word-phrase"
    }
  }, [_vm._v("Word/Phrasal Verb")])])]), _vm._v(" "), _c('div', {
    staticClass: "row",
    class: {
      'hide': !_vm.isWordRequired
    }
  }, [_vm._m(0)])])]), _vm._v(" "), _vm._l((_vm.words), function(word) {
    return _c('div', [_c('Meaning', {
      attrs: {
        "word": word
      }
    })], 1)
  })], 2)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('span', {
    staticClass: "error"
  }, [_vm._v("Word or phrasal verb is required.")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6ad545b1", module.exports)
  }
}

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.isQuizProgress),
      expression: "!isQuizProgress"
    }],
    staticClass: "container quiz-container"
  }, _vm._l((4), function(n) {
    return _c('div', {
      staticClass: "card quiz-card"
    }, [_c('div', {
      staticClass: "card-content quiz-card-content",
      on: {
        "click": function($event) {
          _vm.showQuiz(n)
        }
      }
    }, [_vm._m(0, true), _vm._v(" "), _vm._m(1, true), _vm._v(" "), _vm._m(2, true)]), _vm._v(" "), _vm._m(3, true)])
  })), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isQuizProgress),
      expression: "isQuizProgress"
    }],
    staticClass: "container quiz-question-container"
  }, [_c('p', {
    staticClass: "control back-control"
  }, [_c('a', {
    staticClass: "button is-medium",
    on: {
      "click": _vm.showQuizList
    }
  }, [_vm._m(4), _vm._v(" "), _c('span', [_vm._v("Back To Quizes")])])]), _vm._v(" "), _c('div', {
    staticClass: "card question-card"
  }, [_c('header', {
    staticClass: "card-header"
  }, [_c('p', {
    staticClass: "card-header-title is-unselectable question"
  }, [_vm._v("\n                     " + _vm._s(_vm.questions[_vm.questionIndex].instruction) + "\n                 ")])]), _vm._v(" "), _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.questions[_vm.questionIndex].questionType === 'mcq'),
      expression: "questions[questionIndex].questionType === 'mcq'"
    }],
    staticClass: "question-mcq"
  }, [_c('ul', _vm._l((_vm.questions[_vm.questionIndex].choices), function(choice) {
    return _c('li', {
      staticClass: "choice"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.yourAnswer),
        expression: "yourAnswer"
      }],
      attrs: {
        "type": "radio",
        "name": "choice"
      },
      domProps: {
        "value": choice,
        "checked": choice === _vm.questions[_vm.questionIndex].answer,
        "checked": _vm._q(_vm.yourAnswer, choice)
      },
      on: {
        "__c": function($event) {
          _vm.yourAnswer = choice
        }
      }
    }), _vm._v(" "), _c('label', {
      staticClass: " is-unselectable",
      attrs: {
        "for": "choice"
      },
      on: {
        "click": function($event) {
          _vm.chosen(choice)
        }
      }
    }, [_vm._v(_vm._s(_vm._f("titleCase")(choice)))])])
  }))]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.questions[_vm.questionIndex].questionType === 'descriptive'),
      expression: "questions[questionIndex].questionType === 'descriptive'"
    }],
    staticClass: "question-fill-blank"
  }, [_c('p', {
    staticClass: "description"
  }, [_vm._v("\n                         " + _vm._s(_vm.questions[_vm.questionIndex].questionPart[0])), _c('span', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.yourAnswer),
      expression: "yourAnswer"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.yourAnswer)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.yourAnswer = $event.target.value
      }
    }
  })]), _vm._v("\n                         " + _vm._s(_vm.questions[_vm.questionIndex].questionPart[1]) + "\n                     ")]), _vm._v(" "), _c('p', [_c('span', {
    staticClass: "your-answer"
  }, [_vm._v("Your Answer:")]), _vm._v(" " + _vm._s(_vm.yourAnswer))])])]), _vm._v(" "), _c('footer', {
    staticClass: "card-footer"
  }, [_c('span', {
    staticClass: "card-footer-item prev is-unselectable",
    class: {
      disabled: _vm.isQuizBeginning
    },
    on: {
      "click": _vm.previous
    }
  }, [_vm._v("Prev")]), _vm._v(" "), _c('span', {
    staticClass: "card-footer-item next is-unselectable",
    class: {
      disabled: !_vm.hasAnswered
    },
    on: {
      "click": _vm.next
    }
  }, [_vm._v("Next")])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "title is-3 has-text-centered"
  }, [_c('strong', [_vm._v("Quiz")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "quiz-type has-text-centered"
  }, [_c('span', {
    staticClass: "type-label"
  }, [_vm._v("Type:")]), _c('span', {
    staticClass: "type-value"
  }, [_vm._v("MCQ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "quiz-status has-text-centered"
  }, [_c('span', {
    staticClass: "status-label"
  }, [_vm._v("Status:")]), _c('span', {
    staticClass: "status-value"
  }, [_vm._v("Not Attempted")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card-footer"
  }, [_c('div', {
    staticClass: "card-footer-item has-text-centered"
  }, [_c('span', {
    staticClass: "attempts"
  }, [_vm._v("Attempts:")]), _c('span', {
    staticClass: "attempts-count"
  }, [_vm._v("5")])]), _vm._v(" "), _c('div', {
    staticClass: "card-footer-item has-text-centered"
  }, [_c('span', {
    staticClass: "success"
  }, [_vm._v("Success:")]), _c('span', {
    staticClass: "success-count"
  }, [_vm._v("5")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fa fa-arrow-left"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-812f51c0", module.exports)
  }
}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "word-card card hoverable"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "search-result"
  }, [_c('span', {
    staticClass: "word"
  }, [_vm._v(_vm._s(_vm.word.title))]), _vm._v(" "), _c('span', {
    staticClass: "word-type"
  }, [_vm._v(_vm._s(_vm.word.type))]), _vm._v(" "), _c('span', {
    staticClass: "add-word",
    on: {
      "click": _vm.editWord
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("edit")])]), _vm._v(" "), _c('p', {
    staticClass: "word-definition"
  }, [_vm._v(_vm._s(_vm.word.meaning))]), _vm._v(" "), _c('p', [_c('span', {
    staticClass: "word-example-title"
  }, [_vm._v("Example:")]), _vm._v(" "), _c('ul', [_c('li', {
    staticClass: "word-example"
  }, [_vm._v("\n                    \t\t" + _vm._s(_vm.word.exampleOne) + "\n                    \t")]), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.word.exampleTwo !== ''),
      expression: " word.exampleTwo !== '' "
    }],
    staticClass: "word-example"
  }, [_vm._v("\n                    \t\t" + _vm._s(_vm.word.exampleTwo) + "\n                    \t")])])])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-a7c3c9d6", module.exports)
  }
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "sidenav",
    attrs: {
      "id": "mySidenav"
    }
  }, [_c('router-link', {
    attrs: {
      "to": "/profile"
    }
  }, [_vm._v("Profile")]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": "/vocabulary"
    }
  }, [_vm._v("Vocabulary")]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": "/quiz"
    }
  }, [_vm._v("Quiz")]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": "/help"
    }
  }, [_vm._v("Help")]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": "/logout"
    }
  }, [_vm._v("Logout")])], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-c89e80a2", module.exports)
  }
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content meaning"
  }, [_c('div', {
    staticClass: "meaning-header"
  }, [_c('span', {
    staticClass: "left"
  }, [_vm._v("Meaning " + _vm._s(_vm.word.index))]), _vm._v(" "), _c('span', {
    staticClass: "right"
  }, [_vm._v(_vm._s(_vm.word.id))])]), _vm._v(" "), _c('form', {
    staticClass: "col s12",
    attrs: {
      "id": "form",
      "novalidate": "novalidate"
    },
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.save($event)
      }
    }
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.word.meaning),
      expression: "word.meaning"
    }],
    staticClass: "validate editor-input",
    class: {
      'error-input': _vm.isMeaningRequired
    },
    attrs: {
      "id": "word-phrase-meaning",
      "type": "text"
    },
    domProps: {
      "value": (_vm.word.meaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.word.meaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    class: {
      'active': (_vm.word.meaning !== '')
    },
    attrs: {
      "for": "word-phrase-meaning"
    }
  }, [_vm._v("Meaning")])])]), _vm._v(" "), _c('div', {
    staticClass: "row",
    class: {
      'hide': !_vm.isMeaningRequired
    }
  }, [_vm._m(0)]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.word.type),
      expression: "word.type"
    }],
    staticClass: "validate editor-input",
    class: {
      'error-input': _vm.isTypeRequired
    },
    attrs: {
      "id": "word-phrase-type",
      "type": "text"
    },
    domProps: {
      "value": (_vm.word.type)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.word.type = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    class: {
      'active': (_vm.word.type !== '')
    },
    attrs: {
      "for": "word-phrase-label"
    }
  }, [_vm._v("Type")])])]), _vm._v(" "), _c('div', {
    staticClass: "row",
    class: {
      'hide': !_vm.isTypeRequired
    }
  }, [_vm._m(1)]), _vm._v(" "), _c('h5', {
    staticClass: "left-align"
  }, [_vm._v("Examples")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.word.exampleOne),
      expression: "word.exampleOne"
    }],
    staticClass: "input example-input editor-input",
    class: {
      'error-input': _vm.isExampleRequired
    },
    attrs: {
      "id": "example-one",
      "type": "text"
    },
    domProps: {
      "value": (_vm.word.exampleOne)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.word.exampleOne = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    class: {
      'active': (_vm.word.exampleOne !== '')
    },
    attrs: {
      "for": "example-one"
    }
  }, [_vm._v("Example 1")])])]), _vm._v(" "), _c('div', {
    staticClass: "row",
    class: {
      'hide': !_vm.isExampleRequired
    }
  }, [_vm._m(2)]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.word.exampleTwo),
      expression: "word.exampleTwo"
    }],
    staticClass: "input example-input editor-input",
    attrs: {
      "id": "example-two",
      "type": "text"
    },
    domProps: {
      "value": (_vm.word.exampleTwo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.word.exampleTwo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    class: {
      'active': (_vm.word.exampleTwo !== '')
    },
    attrs: {
      "for": "example-two"
    }
  }, [_vm._v("Example 2")])])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12 right-align"
  }, [_c('button', {
    staticClass: "waves-effect waves-light btn right-align",
    class: {
      'is-loading': _vm.isSaving
    },
    attrs: {
      "id": "save",
      "type": "submit"
    }
  }, [_vm._v("Save")])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('span', {
    staticClass: "error"
  }, [_vm._v("The meaning of the word is required.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('span', {
    staticClass: "error"
  }, [_vm._v("The label of the word is required.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('span', {
    staticClass: "error"
  }, [_vm._v("At least one example is required.")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d8dab23c", module.exports)
  }
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col l12 center-align"
  }, [_c('h3', {
    staticClass: "title"
  }, [_c('strong', [_vm._v(_vm._s(_vm.msg))])])])])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isSigningUp | _vm.isLogging),
      expression: "isSigningUp|isLogging"
    }],
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col l4"
  }), _vm._v(" "), _c('div', {
    staticClass: "col l4 center-align"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "progress-status"
  }, [_vm._v("\n            " + _vm._s(_vm.progressStatus) + "\n          ")])]), _vm._v(" "), _c('div', {
    staticClass: "col l4"
  })])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.canShowViews && !(_vm.isSigningUp || _vm.isLogging)),
      expression: "canShowViews && !(isSigningUp || isLogging)"
    }],
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col l3"
  }), _vm._v(" "), _c('div', {
    staticClass: "col l6 center-align"
  }, [_c('div', {
    staticClass: "card hoverable"
  }, [_c('div', {
    staticClass: "car-action"
  }, [_c('div', {
    staticClass: "row auth-header"
  }, [_c('div', {
    staticClass: "col s6 center-align auth-button"
  }, [_c('a', {
    staticClass: "waves-effect waves-light",
    class: {
      isActive: _vm.isLoginSelected
    },
    on: {
      "click": _vm.showLogin
    }
  }, [_vm._v("Login")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 center-align auth-button"
  }, [_c('a', {
    staticClass: "waves-effect waves-light",
    class: {
      isActive: !_vm.isLoginSelected
    },
    on: {
      "click": _vm.showSignup
    }
  }, [_vm._v("Signup")])])])]), _vm._v(" "), _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('form', {
    staticClass: "col s12",
    attrs: {
      "action": ""
    }
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('i', {
    staticClass: "material-icons prefix"
  }, [_vm._v("email")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.user.username),
      expression: "user.username"
    }],
    staticClass: "validate",
    attrs: {
      "placeholder": "Email address",
      "id": "emailaddress",
      "name": "emailaddress",
      "type": "email",
      "tabindex": "1"
    },
    domProps: {
      "value": (_vm.user.username)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.user.username = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "emailaddress"
    }
  }, [_vm._v("Email address")])])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('i', {
    staticClass: "material-icons prefix"
  }, [_vm._v("vpn_key")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.user.password),
      expression: "user.password"
    }],
    attrs: {
      "placeholder": "Password",
      "id": "password",
      "name": "password",
      "type": "password",
      "tabindex": "2"
    },
    domProps: {
      "value": (_vm.user.password)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.user.password = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "password"
    }
  }, [_vm._v("Password")])])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.isLoginSelected),
      expression: "!isLoginSelected"
    }],
    staticClass: "row"
  }, [_c('div', {
    staticClass: "input-field col s12"
  }, [_c('i', {
    staticClass: "material-icons prefix"
  }, [_vm._v("vpn_key")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.user.confirmPassword),
      expression: "user.confirmPassword"
    }],
    attrs: {
      "placeholder": "Confirm Password",
      "id": "confirm-password",
      "name": "confirm-password",
      "type": "password",
      "tabindex": "3"
    },
    domProps: {
      "value": (_vm.user.confirmPassword)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.user.confirmPassword = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "password"
    }
  }, [_vm._v("Confirm Password")])])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_vm._m(1), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isLoginSelected),
      expression: "isLoginSelected"
    }],
    staticClass: "col s6 center-align"
  }, [_c('a', {
    staticClass: "waves-effect waves-light btn",
    on: {
      "click": _vm.login
    }
  }, [_vm._v("Login")])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.isLoginSelected),
      expression: "!isLoginSelected"
    }],
    staticClass: "col s6 center-align"
  }, [_c('a', {
    staticClass: "waves-effect waves-light btn",
    on: {
      "click": _vm.signup
    }
  }, [_vm._v("Signup")])])])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col l3"
  })])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "preloader-wrapper big active"
  }, [_c('div', {
    staticClass: "spinner-layer spinner-blue-only"
  }, [_c('div', {
    staticClass: "circle-clipper left"
  }, [_c('div', {
    staticClass: "circle"
  })]), _vm._v(" "), _c('div', {
    staticClass: "gap-patch"
  }, [_c('div', {
    staticClass: "circle"
  })]), _vm._v(" "), _c('div', {
    staticClass: "circle-clipper right"
  }, [_c('div', {
    staticClass: "circle"
  })])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s6 center-align"
  }, [_c('a', {
    staticClass: "waves-effect waves-light btn"
  }, [_vm._v("Cancel")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e9ef7ac4", module.exports)
  }
}

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("2e7997fc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-207d218e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./profile-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-207d218e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./profile-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("42fc7418", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6ad545b1\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vocabulary-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-6ad545b1\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vocabulary-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("0c15ef3b", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-812f51c0\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./quiz-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-812f51c0\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./quiz-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("eff12aa4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-a7c3c9d6\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./word-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-a7c3c9d6\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./word-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("7884cd79", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-c89e80a2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./navigation.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-c89e80a2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./navigation.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(63);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("0542c322", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-d8dab23c\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./meaning-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-d8dab23c\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./meaning-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("6d506078", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-e9ef7ac4\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-e9ef7ac4\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 89 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ })
],[44]);