/**
 * This module holds the Async-Await implementation of the Future pattern.
 * Basically, an Await represents a promise of a result which we don't know when it will end, and the Async is the notifier for the awaitable object.
 */
module Good.Patterns.Future {

    /**
     * The listener for a done event.
     */
    export interface IDoneListener<TResult> {
        /**
         * @param result The result value.
         */
        (result?: TResult): any;
    }

    /**
     * The listener for a progress event.
     */
    export interface IProgressListener<TProgress> {
        /**
         * @param progress The progress value.
         */
        (progress?: TProgress): any;
    }

    /**
     * The listener for a fail event.
     */
    export interface IFailListener<TException> {
        /**
         * @param error The error value.
         */
        (error?: TException): any;
    }

    /**
     * This is an awaitable interface.
     */
    export interface IAwait<TResult, TProgress, TException> {
        /**
         * Subscribe as many done listeners as you want, and they will be called when the resolve event is triggered.
         */
        done(...listeners: IDoneListener<TResult>[]): IAwait<TResult, TProgress, TException>;
        /**
         * Subscribe as many progress listeners as you want, and they will be called when the notify event is triggered.
         */
        progress(...listeners: IProgressListener<TProgress>[]): IAwait<TResult, TProgress, TException>;
        /**
         * Subscribe as many fail listeners as you want, and they will be called when the reject event is triggered.
         */
        fail(...listeners: IFailListener<TException>[]): IAwait<TResult, TProgress, TException>;
        /**
         * Subscribe as many always listeners as you want, and they will be called when the resolve or reject events are triggered.
         */
        always(...listeners: Function[]): IAwait<TResult, TProgress, TException>;
        /**
         * It represents the current state of the awaitable.
         */
        state(): Async.State;
    }

    export interface IAwaitable<TResult, TProgress, TException> {
        /**
         * It returns an await from this async instance.
         */
        await(): IAwait<TResult, TProgress, TException>;
        /**
         * It represents the current state of the async.
         */
        state(): Async.State;
    }

    function notifyListeners<T>(listeners: Function[], result?: T) {
        for (var i = 0; i < listeners.length; i++) {
            if (arguments.length >= 2) {
                listeners[i](result);
            } else {
                listeners[i]();
            }
        }
    }

    function dump<T>(origin: T[], target: T[]) {
        for (var i = 0; i < origin.length; i++) {
            target.push(origin[i]);
        }
    }

    /**
     * This is an Async interface.
     */
    export interface IAsync<TResult, TProgress, TException> extends IAwaitable<TResult, TProgress, TException> {
        /**
         * This method resolves the current async.
         * @param result The result tha will be received at the await done callbacks,
         */
        resolve(result?: TResult): void;
        /**
         * This method rejects the current async.
         * @param exception THe error that will be catched at the await fail callbacks.
         */
        reject(exception?: TException): void;
        /**
         * This method notifies progress within the current async.
         * @param progress THe progress value that will be received at the progress callbacks.
         */
        notify(progress?: TProgress): void;
    }

    export class Async<TResult, TProgress, TException> implements IAsync<TResult, TProgress, TException> {

        private _doneListeners = <IDoneListener<TResult>[]>[];
        private _failListeners = <IFailListener<TException>[]>[];
        private _progressListeners = <IProgressListener<TProgress>[]>[];
        private _alwaysListeners = <Function[]>[];
        private _state = Async.State.Active;
        private _endResult: TResult;
        private _errorResult: TException;
        private _failed = false;
        private _hasError = false;
        private _hasResult = false;

        /**
         * It represents the current state of the async.
         */
        state() {
            return this._state;
        }

        /**
         * This method resolves the current async.
         * @param result The result tha will be received at the await done callbacks,
         */
        resolve(result?: TResult) {
            if (this._state === Async.State.Active) {
                this._state = Async.State.Completed;
                this._endResult = result;
                if (arguments.length >= 1) {
                    this._hasResult = true;
                    notifyListeners(this._doneListeners, result);
                } else {
                    this._hasResult = false;
                    notifyListeners(this._doneListeners);
                }
                notifyListeners(this._alwaysListeners);
            }
        }

        /**
         * This method rejects the current async.
         * @param exception THe error that will be catched at the await fail callbacks.
         */
        reject(exception?: TException) {
            if (this._state === Async.State.Active) {
                this._failed = true;
                this._state = Async.State.Completed;
                this._errorResult = exception;
                if (arguments.length >= 1) {
                    this._hasError = true;
                    notifyListeners(this._failListeners, exception);
                } else {
                    this._hasError = false;
                    notifyListeners(this._failListeners);
                }
                notifyListeners(this._alwaysListeners);
            }
        }

        /**
         * This method notifies progress within the current async.
         * @param progress THe progress value that will be received at the progress callbacks.
         */
        notify(progress?: TProgress) {
            if (this._state === Async.State.Active) {
                if (arguments.length >= 1) {
                    notifyListeners(this._progressListeners, progress);
                } else {
                    notifyListeners(this._progressListeners);
                }
            }
        }

        private _await = {
            done: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                dump(listeners, this._doneListeners);
                if (this._state === Async.State.Completed && !this._failed) {
                    if (this._hasResult) {
                        notifyListeners(listeners, this._endResult);
                    } else {
                        notifyListeners(listeners);
                    }
                }
                return this._await;
            },
            fail: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                dump(listeners, this._failListeners);
                if (this._state === Async.State.Completed && this._failed) {
                    if (this._hasError) {
                        notifyListeners(listeners, this._errorResult);
                    } else {
                        notifyListeners(listeners);
                    }
                }
                return this._await;
            },
            progress: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                dump(listeners, this._progressListeners);
                return this._await;
            },
            always: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                dump(listeners, this._alwaysListeners);
                if (this._state === Async.State.Completed) {
                    notifyListeners(listeners);
                }
                return this._await;
            },
            state: (): Async.State => {
                return this._state;
            }
        };

        /**
         * It returns an await from this async instance.
         */
        await() {
            return this._await;
        }
    }

    export module Async {

        /**
         * It represents the state of an async.
         */
        export enum State {
            /**
             * The async is active.
             */
            Active,
            /**
             * The async is completed.
             */
            Completed
        }
    }

    /**
     * This function merge all the given awaits into a unique one, notifying the progress.
     * It will fail if at least one of the input awaits receives the fail event.
     * @param awaits A list of await objects to await for.
     */
    export function await(...awaits: IAwait<any, any, any>[]) {
        var async = new Async<void, [number, number], void>(),
            await: IAwait<any, any, any>,
            completedCount = 0,
            i = 0;

        function currentActive() {
            return async.state() === Async.State.Active;
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

        function onFailed(error: any) {
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
}