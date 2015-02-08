/*!
 * Good 0.2.0
 */
/**
 * This module holds the Async-Await implementation of the Future pattern.
 * Basically, an Await represents a promise of a result which we don't know when it will end, and the Async is the notifier for the awaitable object.
 */
var Good;
(function (Good) {
    var Patterns;
    (function (Patterns) {
        var Future;
        (function (Future) {
            function notifyListeners(listeners, result) {
                for (var i = 0; i < listeners.length; i++) {
                    if (arguments.length >= 2) {
                        listeners[i](result);
                    }
                    else {
                        listeners[i]();
                    }
                }
            }
            function dump(origin, target) {
                for (var i = 0; i < origin.length; i++) {
                    target.push(origin[i]);
                }
            }
            var Async = (function () {
                function Async() {
                    var _this = this;
                    this._doneListeners = [];
                    this._failListeners = [];
                    this._progressListeners = [];
                    this._alwaysListeners = [];
                    this._state = 0 /* Active */;
                    this._failed = false;
                    this._hasError = false;
                    this._hasResult = false;
                    this._await = {
                        done: function () {
                            var listeners = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                listeners[_i - 0] = arguments[_i];
                            }
                            dump(listeners, _this._doneListeners);
                            if (_this._state === 1 /* Completed */ && !_this._failed) {
                                if (_this._hasResult) {
                                    notifyListeners(listeners, _this._endResult);
                                }
                                else {
                                    notifyListeners(listeners);
                                }
                            }
                            return _this._await;
                        },
                        fail: function () {
                            var listeners = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                listeners[_i - 0] = arguments[_i];
                            }
                            dump(listeners, _this._failListeners);
                            if (_this._state === 1 /* Completed */ && _this._failed) {
                                if (_this._hasError) {
                                    notifyListeners(listeners, _this._errorResult);
                                }
                                else {
                                    notifyListeners(listeners);
                                }
                            }
                            return _this._await;
                        },
                        progress: function () {
                            var listeners = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                listeners[_i - 0] = arguments[_i];
                            }
                            dump(listeners, _this._progressListeners);
                            return _this._await;
                        },
                        always: function () {
                            var listeners = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                listeners[_i - 0] = arguments[_i];
                            }
                            dump(listeners, _this._alwaysListeners);
                            if (_this._state === 1 /* Completed */) {
                                notifyListeners(listeners);
                            }
                            return _this._await;
                        },
                        state: function () {
                            return _this._state;
                        }
                    };
                }
                Async.prototype.state = function () {
                    return this._state;
                };
                Async.prototype.resolve = function (result) {
                    if (this._state === 0 /* Active */) {
                        this._state = 1 /* Completed */;
                        this._endResult = result;
                        if (arguments.length >= 1) {
                            this._hasResult = true;
                            notifyListeners(this._doneListeners, result);
                        }
                        else {
                            this._hasResult = false;
                            notifyListeners(this._doneListeners);
                        }
                        notifyListeners(this._alwaysListeners);
                    }
                };
                Async.prototype.reject = function (exception) {
                    if (this._state === 0 /* Active */) {
                        this._failed = true;
                        this._state = 1 /* Completed */;
                        this._errorResult = exception;
                        if (arguments.length >= 1) {
                            this._hasError = true;
                            notifyListeners(this._failListeners, exception);
                        }
                        else {
                            this._hasError = false;
                            notifyListeners(this._failListeners);
                        }
                        notifyListeners(this._alwaysListeners);
                    }
                };
                Async.prototype.notify = function (progress) {
                    if (this._state === 0 /* Active */) {
                        if (arguments.length >= 1) {
                            notifyListeners(this._progressListeners, progress);
                        }
                        else {
                            notifyListeners(this._progressListeners);
                        }
                    }
                };
                Async.prototype.await = function () {
                    return this._await;
                };
                return Async;
            })();
            Future.Async = Async;
            var Async;
            (function (Async) {
                (function (State) {
                    /**
                     * The async is active.
                     */
                    State[State["Active"] = 0] = "Active";
                    /**
                     * The async is completed.
                     */
                    State[State["Completed"] = 1] = "Completed";
                })(Async.State || (Async.State = {}));
                var State = Async.State;
            })(Async = Future.Async || (Future.Async = {}));
            /**
             *
             */
            function await() {
                var awaits = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    awaits[_i - 0] = arguments[_i];
                }
                var async = new Async(), await, completedCount = 0, i = 0;
                function currentActive() {
                    return async.state() === 0 /* Active */;
                }
                function onCompleted() {
                    if (currentActive()) {
                        async.resolve();
                    }
                }
                function onProgress() {
                    completedCount++;
                    async.notify([completedCount, awaits.length]);
                }
                function onFailed(error) {
                    if (currentActive()) {
                        async.reject(error);
                    }
                }
                for (; i < awaits.length; i++) {
                    await = awaits[i];
                    await.progress(onProgress).done(onCompleted).fail(onFailed);
                }
                return async.await();
            }
            Future.await = await;
        })(Future = Patterns.Future || (Patterns.Future = {}));
    })(Patterns = Good.Patterns || (Good.Patterns = {}));
})(Good || (Good = {}));
/// <reference path="future.ts" />
var Good;
(function (Good) {
    var Patterns;
    (function (Patterns) {
        var Parallel;
        (function (Parallel) {
            var Task = (function () {
                function Task(callback, thisArg) {
                    if (thisArg === void 0) { thisArg = null; }
                    this._callback = callback;
                    this._async = new Patterns.Future.Async();
                    this._thisArg = thisArg;
                }
                Task.prototype.await = function () {
                    return this._async.await();
                };
                Task.prototype.run = function () {
                    var _this = this;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    setTimeout(function () {
                        try {
                            _this._async.resolve(_this._callback.apply(_this._thisArg, args));
                        }
                        catch (e) {
                            _this._async.reject(e);
                        }
                    });
                    return this.await();
                };
                return Task;
            })();
            Parallel.Task = Task;
        })(Parallel = Patterns.Parallel || (Patterns.Parallel = {}));
    })(Patterns = Good.Patterns || (Good.Patterns = {}));
})(Good || (Good = {}));
