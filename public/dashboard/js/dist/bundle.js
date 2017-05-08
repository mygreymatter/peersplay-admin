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
/* 4 */,
/* 5 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17).Buffer))

/***/ }),
/* 6 */,
/* 7 */
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

var listToStyles = __webpack_require__(69)

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
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(68)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(46),
  /* template */
  __webpack_require__(63),
  /* scopeId */
  "data-v-79f7138d",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/pipeline/public/dashboard/js/components/profile-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] profile-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79f7138d", Component.options)
  } else {
    hotAPI.reload("data-v-79f7138d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(66)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(49),
  /* template */
  __webpack_require__(61),
  /* scopeId */
  "data-v-3e84c15c",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/pipeline/public/dashboard/js/components/vocabulary-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vocabulary-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3e84c15c", Component.options)
  } else {
    hotAPI.reload("data-v-3e84c15c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(43),
  /* template */
  __webpack_require__(60),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/pipeline/public/dashboard/js/components/help-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] help-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-28dd5d6d", Component.options)
  } else {
    hotAPI.reload("data-v-28dd5d6d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(44),
  /* template */
  __webpack_require__(64),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/pipeline/public/dashboard/js/components/main-content.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] main-content.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-800a613e", Component.options)
  } else {
    hotAPI.reload("data-v-800a613e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(67)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(45),
  /* template */
  __webpack_require__(62),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/pipeline/public/dashboard/js/components/navigation.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] navigation.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-52ed7e90", Component.options)
  } else {
    hotAPI.reload("data-v-52ed7e90", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(65)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(47),
  /* template */
  __webpack_require__(58),
  /* scopeId */
  "data-v-0b0e84fe",
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/pipeline/public/dashboard/js/components/quiz-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] quiz-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b0e84fe", Component.options)
  } else {
    hotAPI.reload("data-v-0b0e84fe", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(48),
  /* template */
  __webpack_require__(59),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/mayo/Workspace/geekmonk/pipeline/public/dashboard/js/components/title-component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] title-component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1abe84fc", Component.options)
  } else {
    hotAPI.reload("data-v-1abe84fc", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 25 */,
/* 26 */,
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
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_cookie__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_cookie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_router__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_navigation_vue__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_navigation_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_navigation_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_main_content_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_main_content_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_main_content_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_title_component_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_title_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_title_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_profile_component_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_profile_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_profile_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_vocabulary_component_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_vocabulary_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_vocabulary_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_quiz_component_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_quiz_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_quiz_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_help_component_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_help_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__components_help_component_vue__);




__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_cookie___default.a);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]);










const paths = ['/dashboard/profile', '/dashboard/vocabulary', '/dashboard/quiz', '/dashboard/help'];

const routes = [{ path: paths[0], name: 'profile-view', component: __WEBPACK_IMPORTED_MODULE_6__components_profile_component_vue___default.a }, { path: paths[1], name: 'vocabulary-view', component: __WEBPACK_IMPORTED_MODULE_7__components_vocabulary_component_vue___default.a }, { path: paths[2], name: 'quiz-view', component: __WEBPACK_IMPORTED_MODULE_8__components_quiz_component_vue___default.a }, { path: paths[3], name: 'help-view', component: __WEBPACK_IMPORTED_MODULE_9__components_help_component_vue___default.a }];
const router = new __WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]({ mode: 'history', routes });

let isSigningOut;

new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
    el: "#app",
    data: {
        msg: 'Dashboard'
    },
    router,
    components: { TitleComponent: __WEBPACK_IMPORTED_MODULE_5__components_title_component_vue___default.a, Navigation: __WEBPACK_IMPORTED_MODULE_3__components_navigation_vue___default.a, MainContent: __WEBPACK_IMPORTED_MODULE_4__components_main_content_vue___default.a, Profile: __WEBPACK_IMPORTED_MODULE_6__components_profile_component_vue___default.a, Vocabulary: __WEBPACK_IMPORTED_MODULE_7__components_vocabulary_component_vue___default.a, Quiz: __WEBPACK_IMPORTED_MODULE_8__components_quiz_component_vue___default.a, Help: __WEBPACK_IMPORTED_MODULE_9__components_help_component_vue___default.a },
    created() {
        isSigningOut = false;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('User: ' + user.displayName);
                // if (!isSigningOut) {
                //     var url = "/dashboard";
                //     $(location).attr('href', url);
                // }
            } else {
                if (isSigningOut) {
                    window.cookie.set('remember_me', 0);
                    var url = "/";
                    $(location).attr('href', url);
                }
                console.log('User is not signed in.');
            }
        });
    },
    mounted() {
        console.log('Dashboard Mounted: ' + router.currentRoute.path);
        window.cookie = this.$cookie;
        console.log('Current Path: ' + router.currentRoute.path);

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
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(4)))

/***/ }),
/* 43 */
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
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_component_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__profile_component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vocabulary_component_vue__ = __webpack_require__(11);
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
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(2);
//
//
//
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
/* 46 */
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
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            isEditMode: false
        };
    }, methods: {
        editProfle() {
            this.isEditMode = true;
        }, cancel() {
            this.isEditMode = false;
        }, save() {
            this.isEditMode = false;
        }
    }
});

/***/ }),
/* 47 */
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
/* 48 */
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
            msg: 'Dashboard'
        };
    }, methods: {
        goHome() {
            console.log('Go Home');
            var url = "/";
            $(location).attr('href', url);
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(4)))

/***/ }),
/* 49 */
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

/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            query: '',
            isLoading: false,
            names: [],
            canShowWords: true
        };
    }, watch: {
        query: function (val) {
            if (val.length >= 2) {
                this.isLoading = true;
                console.log('Changed :' + val);
                this.names.push('rekha');
                this.names.push('Itihaas');
                this.canShowWords = false;
            } else {
                this.isLoading = false;
                this.names = [];
                this.canShowWords = true;
            }
        }
    }
});

/***/ }),
/* 50 */,
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "\n.quiz-container[data-v-0b0e84fe]{\n    padding:10px;\n    width:100%;\n}\n.quiz-card[data-v-0b0e84fe]{\n    width:250px;\n    height:250px;\n    float:left;\n    margin-left:15%;\n    margin-bottom:10%;\n}\n.quiz-card[data-v-0b0e84fe]:hover{\n    cursor:pointer;\n}\n.quiz-card-content[data-v-0b0e84fe]{\n    height:200px;\n}\n.attempts[data-v-0b0e84fe],.success[data-v-0b0e84fe],.type-label[data-v-0b0e84fe],.status-label[data-v-0b0e84fe]{\n    font-weight:200;\n}\n.attempts-count[data-v-0b0e84fe],.success-count[data-v-0b0e84fe],.type-value[data-v-0b0e84fe],.status-value[data-v-0b0e84fe]{\n    padding-left:5px;\n    font-weight:500;\n}\n.attempts[data-v-0b0e84fe]{\n    color:orange;\n}\n.success[data-v-0b0e84fe]{\n    color:green;\n}\n.type-label[data-v-0b0e84fe],.type-value[data-v-0b0e84fe],.status-label[data-v-0b0e84fe],.status-value[data-v-0b0e84fe]{\n    font-size: larger;\n}\n.quiz-question-container[data-v-0b0e84fe]{\n    width:70%;\n}\n.prev[data-v-0b0e84fe],.next[data-v-0b0e84fe],input[type=radio][data-v-0b0e84fe]{\n    cursor: pointer;\n    color:#4A4A4A;\n}\n.disabled[data-v-0b0e84fe]{\n    color:#AEAEAE;\n    cursor:not-allowed;\n}\n.choice>label[data-v-0b0e84fe]{\n    cursor:pointer;\n    font-weight:lighter;\n}\n.question[data-v-0b0e84fe],.your-answer[data-v-0b0e84fe]{\n    font-weight:500;\n}\n.description[data-v-0b0e84fe]{\n    font-weight:lighter;\n}\np.control.back-control[data-v-0b0e84fe]{\n    margin-bottom:20px;\n}\n", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "\n#search-input[data-v-3e84c15c]{\n    padding:10px;\n    width:100%;\n    height:40px;\n    background-color: transparent;\n    border: 1px solid;\n    color: #CCC;\n    font-size:20px;\n}\n#search-input[data-v-3e84c15c]:focus{\n  outline:none;\n  color:#000;\n  border: 1px #ccc solid;\n}\n.search-result[data-v-3e84c15c]{\n    border-bottom: 1px #AEAEAE solid;\n    border-right: 1px #AEAEAE solid;\n    border-left: 1px #AEAEAE solid;\n    padding: 5px;\n    font-weight:lighter;\n}\n.card[data-v-3e84c15c]{\n    margin-bottom:5px;\n}\n.box[data-v-3e84c15c],.card-content[data-v-3e84c15c]{\n    padding:1rem;\n}\n.word[data-v-3e84c15c]{\n    font-weight:bold;\n    font-size:24px;\n}\n.word-type[data-v-3e84c15c]{\n    font-weight:lighter;\n    color:blueviolet;\n    font-style:italic;\n    font-size:18px;\n}\n.words-container[data-v-3e84c15c]{\n    margin: 0 20px 0 10px;\n    width:100%;\n}\n.word-card[data-v-3e84c15c]:hover{\n    cursor: pointer;\n}\n.word-example-title[data-v-3e84c15c]{\n    font-weight:lighter;\n    color:#616161;\n}\n.word-example[data-v-3e84c15c]{\n    font-weight:lighter;\n    color:#000000;\n}\n.word-more-examples[data-v-3e84c15c]{\n    font-weight:300;\n    font-style:italic;\n}\n.word-more-examples[data-v-3e84c15c]:hover{\n    cursor:pointer;\n    color:#AEAEAE;\n}\n", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Do not set the style to scoped. This style belongs to the side bar in the index.html of dashboard*/\n\n/* The side navigation menu */\n.sidenav {\n    height: 100%;\n    /* 100% Full-height */\n    width: 270px;\n    /* 0 width - change this with JavaScript */\n    position: fixed;\n    /* Stay in place */\n    z-index: 1;\n    /* Stay on top */\n    top: 0;\n    left: 0;\n    background-color: #111;\n    /* Black*/\n    overflow-x: hidden;\n    /* Disable horizontal scroll */\n    padding-top: 30px;\n    /* Place content 60px from the top */\n    transition: 0.5s;\n    /* 0.5 second transition effect to slide in the sidenav */\n}\n\n\n/* The navigation menu links */\n.sidenav a {\n    padding: 8px 8px 8px 32px;\n    text-decoration: none;\n    font-size: 25px;\n    color: #818181;\n    display: block;\n    transition: 0.3s\n}\n.sidenav a#logout:hover{\n    cursor:pointer;\n}\n.sidenav a.router-link-active{\n    color:#FFFFFF;\n    font-size:40px;\n}\n\n/* When you mouse over the navigation links, change their color */\n.sidenav a:hover,\n.offcanvas a:focus {\n    color: #f1f1f1;\n}\n\n/* Style page content - use this if you want to push the page content to the right when you open the side navigation */\n#main {\n    transition: margin-left .5s;\n    padding-left: 20px;\n    padding-right: 20px;\n    padding-top: 10px;\n    margin-left: 250px;\n}\n\n/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */\n@media screen and (max-height: 450px) {\n.sidenav {\n        padding-top: 15px;\n}\n.sidenav a {\n        font-size: 18px;\n}\n}\n", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "\n.profile-container[data-v-79f7138d],.profile-edit-container[data-v-79f7138d]{\n    width:60%;\n}\n.name-label[data-v-79f7138d]{\n    font-size:larger;\n}\n.edit-profile[data-v-79f7138d],.profile-image-change[data-v-79f7138d],.cancel[data-v-79f7138d],.save[data-v-79f7138d]{\n    cursor:pointer;\n}\n.cancel[data-v-79f7138d]:hover,.save[data-v-79f7138d]:hover{\n    color:#AEAEAE;\n}\n.profile-image-change[data-v-79f7138d]:hover{\n    color:#AEAEAE;\n}\n.profile-image-change[data-v-79f7138d]{\n    background:cadetblue;\n}\nspan.name[data-v-79f7138d]{\n    padding-top: 2px;\n    padding-left: 10px;\n}\n.profile-input-content[data-v-79f7138d]{\n    margin-top:10px;\n}\n", ""]);

// exports


/***/ }),
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */
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
     require("vue-hot-reload-api").rerender("data-v-0b0e84fe", module.exports)
  }
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h1', [_vm._v(_vm._s(_vm.msg))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1abe84fc", module.exports)
  }
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h1', [_vm._v(_vm._s(_vm.title))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-28dd5d6d", module.exports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-half is-offset-one-quarter"
  }, [_c('div', [_c('p', {
    staticClass: "control has-icons-right",
    class: {
      'is-loading': _vm.isLoading
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.query),
      expression: "query"
    }],
    staticClass: "input",
    attrs: {
      "type": "text",
      "id": "search-input",
      "placeholder": "Search here..."
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
  })])]), _vm._v(" "), _c('div', {
    staticClass: "results"
  }, [_c('ul', _vm._l((_vm.names), function(name) {
    return _c('li', [_c('div', {
      staticClass: "search-result"
    }, [_vm._v("\n                              " + _vm._s(name) + "\n                        ")])])
  }))])])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.canShowWords),
      expression: "canShowWords"
    }],
    staticClass: "container words-container"
  }, _vm._l((20), function(n) {
    return _c('div', {
      staticClass: "word-card card"
    }, [_vm._m(0, true)])
  }))])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card-content"
  }, [_c('div', [_c('span', {
    staticClass: "word"
  }, [_vm._v("Ace")]), _vm._v(" "), _c('span', {
    staticClass: "word-type"
  }, [_vm._v("figurative")]), _vm._v(" "), _c('p', {
    staticClass: "word-definition"
  }, [_vm._v("\n                            A playing card with a single spot on it, ranked as the highest card in its suit in most card games.\n                        ")]), _vm._v(" "), _c('p', [_c('span', {
    staticClass: "word-example-title"
  }, [_vm._v("\n                                Example:\n                            ")]), _vm._v(" "), _c('span', {
    staticClass: "word-example"
  }, [_vm._v("\n                                He picked up his cards, finding the ace of diamonds he tossed it on the pile.\n                            ")]), _vm._v(" "), _c('span', {
    staticClass: "word-more-examples is-pulled-right"
  }, [_vm._v("\n                                More examples...\n                            ")])])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3e84c15c", module.exports)
  }
}

/***/ }),
/* 62 */
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
     require("vue-hot-reload-api").rerender("data-v-52ed7e90", module.exports)
  }
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.isEditMode),
      expression: "!isEditMode"
    }],
    staticClass: "container profile-container"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "edit-profile is-medium is-pulled-right",
    on: {
      "click": _vm.editProfle
    }
  }, [_vm._v("\n                    Edit\n                ")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1)]), _vm._v(" "), _vm._m(2)])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isEditMode),
      expression: "isEditMode"
    }],
    staticClass: "container profile-edit-container"
  }, [_c('div', {
    staticClass: "card"
  }, [_vm._m(3), _vm._v(" "), _c('footer', {
    staticClass: "card-footer"
  }, [_c('span', {
    staticClass: "card-footer-item has-text-centered cancel",
    on: {
      "click": _vm.cancel
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('span', {
    staticClass: "card-footer-item has-text-centered save",
    on: {
      "click": _vm.save
    }
  }, [_vm._v("Save")])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "media"
  }, [_c('div', {
    staticClass: "media-left"
  }, [_c('figure', {
    staticClass: "image is-96x96"
  }, [_c('img', {
    attrs: {
      "src": "http://bulma.io/images/placeholders/128x128.png",
      "alt": "Image"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "media-content"
  }, [_c('p', {
    staticClass: "title is-4"
  }, [_vm._v("Mahayogi Lakshmipathi")]), _vm._v(" "), _c('p', {
    staticClass: "subtitle is-6"
  }, [_vm._v("mygreymatter@gmail.com")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "content"
  }, [_c('p', [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Date Of Birth:")]), _vm._v(" "), _c('span', {
    staticClass: "name"
  }, [_vm._v("06-04-1985")])]), _vm._v(" "), _c('p', [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Subscription:")]), _vm._v(" "), _c('span', {
    staticClass: "name"
  }, [_vm._v("Not subscribed")]), _vm._v(" "), _c('span', {
    staticClass: "subscription-change button is-small"
  }, [_vm._v("Change")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('footer', {
    staticClass: "card-footer"
  }, [_c('p', {
    staticClass: "card-footer-item has-text-centered"
  }, [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Quizes Played:")]), _vm._v(" "), _c('span', {
    staticClass: "name"
  }, [_vm._v("5")])]), _vm._v(" "), _c('p', {
    staticClass: "card-footer-item has-text-centered"
  }, [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Quizes Won:")]), _vm._v(" "), _c('span', {
    staticClass: "name"
  }, [_vm._v("5")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "media"
  }, [_c('div', {
    staticClass: "media-left has-text-centered profile-image-change"
  }, [_c('figure', {
    staticClass: "image is-96x97"
  }, [_c('img', {
    attrs: {
      "src": "http://bulma.io/images/placeholders/128x128.png",
      "alt": "Image"
    }
  })]), _vm._v(" "), _c('span', {}, [_vm._v("change")])]), _vm._v(" "), _c('div', {
    staticClass: "media-content profile-input-content"
  }, [_c('div', {
    staticClass: "field"
  }, [_c('p', {
    staticClass: "control profile-input"
  }, [_c('input', {
    staticClass: "input",
    attrs: {
      "type": "text",
      "placeholder": "First Name"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "field"
  }, [_c('p', {
    staticClass: "control profile-input"
  }, [_c('input', {
    staticClass: "input",
    attrs: {
      "type": "text",
      "placeholder": "Middle Name(optional)"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "field"
  }, [_c('p', {
    staticClass: "control profile-input"
  }, [_c('input', {
    staticClass: "input",
    attrs: {
      "type": "text",
      "placeholder": "Last Name"
    }
  })])])])]), _vm._v(" "), _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "field"
  }, [_c('p', {
    staticClass: "control"
  }, [_c('span', {
    staticClass: "name-label"
  }, [_vm._v("Date Of Birth: ")]), _vm._v(" "), _c('input', {
    staticClass: "input",
    attrs: {
      "type": "date",
      "name": "bday"
    }
  })])])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-79f7138d", module.exports)
  }
}

/***/ }),
/* 64 */
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
     require("vue-hot-reload-api").rerender("data-v-800a613e", module.exports)
  }
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(7)("60feaa0f", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-0b0e84fe\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./quiz-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-0b0e84fe\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./quiz-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(7)("1d778676", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-3e84c15c\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vocabulary-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-3e84c15c\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vocabulary-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(7)("0ceeb9b0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-52ed7e90\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./navigation.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-52ed7e90\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./navigation.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(7)("92c38b74", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-79f7138d\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./profile-component.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-79f7138d\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./profile-component.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 69 */
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
],[42]);