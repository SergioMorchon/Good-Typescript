/*!
 * Good 0.5.0
 */
var Good;!function(a){"use strict";var b=function(){function a(a){this.message=a}return a.prototype.toString=function(){return this.message},a}();a.Error=b}(Good||(Good={}));var __extends=this.__extends||function(a,b){function c(){this.constructor=a}for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);c.prototype=b.prototype,a.prototype=new c},Good;!function(a){var b;!function(b){var c;!function(b){var c=function(a){function b(){a.apply(this,arguments)}return __extends(b,a),b}(a.Error);b.InvocationError=c;var d=function(){function a(a){this._data=a}return a.prototype.execute=function(a){for(var b=[],d=1;d<arguments.length;d++)b[d-1]=arguments[d];if("function"!=typeof this._data[a])throw new c("No such method "+a);return this._data[a].apply(this._data,b)},a}();b.Invoker=d}(c=b.Command||(b.Command={}))}(b=a.Patterns||(a.Patterns={}))}(Good||(Good={}));var Good;!function(a){var b;!function(b){var c;!function(b){"use strict";function c(a,b){if(void 0===b&&(b="Contract pre-condition violation"),!a)throw new f(b)}function d(a,b){if(void 0===b&&(b="Contract post-condition violation"),!a)throw new g(b)}var e=function(a){function b(){a.apply(this,arguments)}return __extends(b,a),b}(a.Error);b.Error=e;var f=function(a){function b(){a.apply(this,arguments)}return __extends(b,a),b}(e);b.PreConditionError=f;var g=function(a){function b(){a.apply(this,arguments)}return __extends(b,a),b}(e);b.PostConditionError=g,b.requires=c,b.ensures=d}(c=b.Contract||(b.Contract={}))}(b=a.Patterns||(a.Patterns={}))}(Good||(Good={}));var Good;!function(a){var b;!function(a){var b;!function(a){"use strict";function b(a,b){for(var c=0;c<a.length;c++)arguments.length>=2?a[c](b):a[c]()}function c(a,b){for(var c=0;c<a.length;c++)b.push(a[c])}function d(){function a(){return 0===i.state()}function b(){a()&&i.resolve()}function c(){j++,i.notify([j,f.length])}function d(b){a()&&i.reject(b)}for(var f=[],g=0;g<arguments.length;g++)f[g-0]=arguments[g];for(var h,i=new e,j=0,k=0;k<f.length;k++)h=f[k],h.progress(c).done(b).fail(d);return i.await()}var e=function(){function a(){var a=this;this._doneListeners=[],this._failListeners=[],this._progressListeners=[],this._alwaysListeners=[],this._state=0,this._failed=!1,this._hasError=!1,this._hasResult=!1,this._await={done:function(){for(var d=[],e=0;e<arguments.length;e++)d[e-0]=arguments[e];return c(d,a._doneListeners),1!==a._state||a._failed||(a._hasResult?b(d,a._endResult):b(d)),a._await},fail:function(){for(var d=[],e=0;e<arguments.length;e++)d[e-0]=arguments[e];return c(d,a._failListeners),1===a._state&&a._failed&&(a._hasError?b(d,a._errorResult):b(d)),a._await},progress:function(){for(var b=[],d=0;d<arguments.length;d++)b[d-0]=arguments[d];return c(b,a._progressListeners),a._await},always:function(){for(var d=[],e=0;e<arguments.length;e++)d[e-0]=arguments[e];return c(d,a._alwaysListeners),1===a._state&&b(d),a._await},state:function(){return a._state}}}return a.prototype.state=function(){return this._state},a.prototype.resolve=function(a){0===this._state&&(this._state=1,this._endResult=a,arguments.length>=1?(this._hasResult=!0,b(this._doneListeners,a)):(this._hasResult=!1,b(this._doneListeners)),b(this._alwaysListeners))},a.prototype.reject=function(a){0===this._state&&(this._failed=!0,this._state=1,this._errorResult=a,arguments.length>=1?(this._hasError=!0,b(this._failListeners,a)):(this._hasError=!1,b(this._failListeners)),b(this._alwaysListeners))},a.prototype.notify=function(a){0===this._state&&(arguments.length>=1?b(this._progressListeners,a):b(this._progressListeners))},a.prototype.await=function(){return this._await},a}();a.Async=e;var e;!function(a){!function(a){a[a.Active=0]="Active",a[a.Completed=1]="Completed"}(a.State||(a.State={}));a.State}(e=a.Async||(a.Async={})),a.await=d}(b=a.Future||(a.Future={}))}(b=a.Patterns||(a.Patterns={}))}(Good||(Good={}));var Good;!function(a){var b;!function(b){var c;!function(c){"use strict";var d=function(){function c(){this._hub={}}return c.prototype.subscribe=function(a,c,d){void 0===d&&(d=null),b.Contract.requires(a),b.Contract.requires(c),this._hub[a]||(this._hub[a]=[]),this._hub[a].push({callback:c,context:d})},c.prototype.publish=function(b){for(var c=[],d=1;d<arguments.length;d++)c[d-1]=arguments[d];var e,f;if(!this._hub[b])throw new a.Error("No such channel "+b);for(f=this._hub[b],e=0;e<f.length;e++)f[e].callback.apply(f[e].context,c)},c.prototype.attachTo=function(a){b.Contract.requires(a),b.Contract.requires(!a.subscribe),b.Contract.requires(!a.publish),a.subscribe=this.subscribe.bind(this),a.publish=this.publish.bind(this)},c}();c.Group=d}(c=b.Mediator||(b.Mediator={}))}(b=a.Patterns||(a.Patterns={}))}(Good||(Good={}));var Good;!function(a){var b;!function(a){var b;!function(a){"use strict";function b(a,b){for(var c="string"==typeof b?b.split(/\./):b,d=a,e=0;e<c.length&&d;e++)d.hasOwnProperty(c[e])||(d[c[e]]={}),d=d[c[e]];return d}a.extend=b}(b=a.Namespace||(a.Namespace={}))}(b=a.Patterns||(a.Patterns={}))}(Good||(Good={}));var Good;!function(a){var b;!function(a){var b;!function(b){"use strict";var c=function(){function b(b,c){void 0===c&&(c=null),this._callback=b,this._async=new a.Future.Async,this._thisArg=c}return b.prototype.await=function(){return this._async.await()},b.prototype.run=function(){for(var a=this,b=[],c=0;c<arguments.length;c++)b[c-0]=arguments[c];return setTimeout(function(){try{a._callback.apply(a._thisArg,[a._async].concat(b)).done(a._async.resolve).fail(a._async.reject)}catch(c){a._async.reject(c)}}),this.await()},b}();b.Task=c}(b=a.Parallel||(a.Parallel={}))}(b=a.Patterns||(a.Patterns={}))}(Good||(Good={}));