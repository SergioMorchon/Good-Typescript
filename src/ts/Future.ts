module Good.Patterns.Future {

    export interface IEndListener<TResult> {
        (result?: TResult): any;
    }
    export interface IProgressListener<TProgress> {
        (value?: TProgress): any;
    }
    export interface IFailListener<TException> {
        (error?: TException): any;
    }

    export interface IAwait<TResult, TProgress, TException> {
        done(...listeners: IEndListener<TResult>[]): IAwait<TResult, TProgress, TException>;
        progress(...listeners: IProgressListener<TProgress>[]): IAwait<TResult, TProgress, TException>;
        fail(...listeners: IFailListener<TException>[]): IAwait<TResult, TProgress, TException>;
        always(...listeners: Function[]): IAwait<TResult, TProgress, TException>;
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

    export interface IAsync<TResult, TProgress, TException> {
        state(): Async.State;
        await(): IAwait<TResult, TProgress, TException>;
        resolve(result?: TResult): void;
        reject(exception?: TException): void;
        notify(progress?: TProgress): void;
    }

    export class Async<TResult, TProgress, TException> implements IAsync<TResult, TProgress, TException> {

        private _doneListeners = <IEndListener<TResult>[]>[];
        private _failListeners = <IFailListener<TException>[]>[];
        private _progressListeners = <IProgressListener<TProgress>[]>[];
        private _alwaysListeners = <Function[]>[];
        private _state = Async.State.Active;
        private _endResult: TResult;
        private _errorResult: TException;
        private _failed = false;
        private _hasError = false;
        private _hasResult = false;

        state() {
            return this._state;
        }

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

        await() {
            return this._await;
        }
    }

    export module Async {
        export enum State {
            Active,
            Completed
        }
    }

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