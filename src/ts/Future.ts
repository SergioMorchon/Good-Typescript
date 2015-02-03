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
        end(...listeners: IEndListener<TResult>[]): IAwait<TResult, TProgress, TException>;
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
        end(value?: TResult): void;
        fail(error?: TException): void;
        progress(value?: TProgress): void;
    }

    export class Async<TResult, TProgress, TException> {

        state: () => Async.State;
        await: () => IAwait<TResult, TProgress, TException>;
        end: (value?: TResult) => void;
        fail: (error?: TException) => void;
        progress: (value?: TProgress) => void;

        constructor() {
            var endListeners = <IEndListener<TResult>[]>[],
                failListeners = <IFailListener<TException>[]>[],
                progressListeners = <IProgressListener<TProgress>[]>[],
                alwaysListeners = <Function[]>[],
                await: IAwait<TResult, TProgress, TException>,
                state = Async.State.Active,
                errorResult: TException,
                failed = false,
                hasError: boolean,
                hasResult: boolean,
                endResult: TResult;

            await = {
                end: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                    dump(listeners, endListeners);
                    if (state === Async.State.Completed && !failed) {
                        if (hasResult) {
                            notifyListeners(listeners, endResult);
                        } else {
                            notifyListeners(listeners);
                        }
                    }
                    return await;
                },
                fail: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                    dump(listeners, failListeners);
                    if (state === Async.State.Completed && failed) {
                        if (hasError) {
                            notifyListeners(listeners, errorResult);
                        } else {
                            notifyListeners(listeners);
                        }
                    }
                    return await;
                },
                progress: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                    dump(listeners, progressListeners);
                    return await;
                },
                always: (...listeners: Function[]): IAwait<TResult, TProgress, TException> => {
                    dump(listeners, alwaysListeners);
                    if (state === Async.State.Completed) {
                        notifyListeners(listeners);
                    }
                    return await;
                },
                state: (): Async.State => {
                    return state;
                }
            };

            this.state = () => {
                return state;
            };

            this.await = () => {
                return await;
            };

            this.end = (result?: TResult): void => {
                if (state === Async.State.Active) {
                    state = Async.State.Completed;
                    endResult = result;
                    if (arguments.length >= 1) {
                        hasResult = true;
                        notifyListeners(endListeners, result);
                    } else {
                        hasResult = false;
                        notifyListeners(endListeners);
                    }
                    notifyListeners(alwaysListeners);
                }
            };

            this.fail = (error?: TException): void => {
                if (state === Async.State.Active) {
                    failed = true;
                    state = Async.State.Completed;
                    errorResult = error;
                    if (arguments.length >= 1) {
                        hasError = true;
                        notifyListeners(failListeners, error);
                    } else {
                        hasError = false;
                        notifyListeners(failListeners);
                    }
                    notifyListeners(alwaysListeners);
                }
            };

            this.progress = (value?: TProgress): void => {
                if (state === Async.State.Active) {
                    if (arguments.length >= 1) {
                        notifyListeners(progressListeners, value);
                    } else {
                        notifyListeners(progressListeners);
                    }
                }
            };
        }
    }

    export module Async {
        export enum State {
            Active,
            Completed
        }
    }
}