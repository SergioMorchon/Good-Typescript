/**
 * This module holds the Async-Await implementation of the Future pattern.
 * Basically, an Await represents a promise of a result which we don't know when it will end, and the Async is the notifier for the awaitable object.
 */
declare module Good.Patterns.Future {
    /**
     * The listener for a done event.
     */
    interface IDoneListener<TResult> {
        /**
         * @param result The result value.
         */
        (result?: TResult): any;
    }
    /**
     * The listener for a progress event.
     */
    interface IProgressListener<TProgress> {
        /**
         * @param progress The progress value.
         */
        (progress?: TProgress): any;
    }
    /**
     * The listener for a fail event.
     */
    interface IFailListener<TException> {
        /**
         * @param error The error value.
         */
        (error?: TException): any;
    }
    /**
     * This is an awaitable interface.
     */
    interface IAwait<TResult, TProgress, TException> {
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
    interface IAwaitable<TResult, TProgress, TException> {
        /**
         * It returns an await from this async instance.
         */
        await(): IAwait<TResult, TProgress, TException>;
        /**
         * It represents the current state of the async.
         */
        state(): Async.State;
    }
    /**
     * This is an Async interface.
     */
    interface IAsync<TResult, TProgress, TException> extends IAwaitable<TResult, TProgress, TException> {
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
    class Async<TResult, TProgress, TException> implements IAsync<TResult, TProgress, TException> {
        private _doneListeners;
        private _failListeners;
        private _progressListeners;
        private _alwaysListeners;
        private _state;
        private _endResult;
        private _errorResult;
        private _failed;
        private _hasError;
        private _hasResult;
        state(): Async.State;
        resolve(result?: TResult): void;
        reject(exception?: TException): void;
        notify(progress?: TProgress): void;
        private _await;
        await(): {
            done: (...listeners: Function[]) => IAwait<TResult, TProgress, TException>;
            fail: (...listeners: Function[]) => IAwait<TResult, TProgress, TException>;
            progress: (...listeners: Function[]) => IAwait<TResult, TProgress, TException>;
            always: (...listeners: Function[]) => IAwait<TResult, TProgress, TException>;
            state: () => Async.State;
        };
    }
    module Async {
        enum State {
            /**
             * The async is active.
             */
            Active = 0,
            /**
             * The async is completed.
             */
            Completed = 1,
        }
    }
    /**
     *
     */
    function await(...awaits: IAwait<any, any, any>[]): {
        done: (...listeners: Function[]) => IAwait<void, [number, number], void>;
        fail: (...listeners: Function[]) => IAwait<void, [number, number], void>;
        progress: (...listeners: Function[]) => IAwait<void, [number, number], void>;
        always: (...listeners: Function[]) => IAwait<void, [number, number], void>;
        state: () => Async.State;
    };
}
declare module Good.Patterns.Parallel {
    class Task<TResult, TProgress, TException> {
        private _callback;
        private _async;
        private _thisArg;
        constructor(callback: (...args: any[]) => TResult, thisArg?: any);
        await(): {
            done: (...listeners: Function[]) => Future.IAwait<TResult, TProgress, TException>;
            fail: (...listeners: Function[]) => Future.IAwait<TResult, TProgress, TException>;
            progress: (...listeners: Function[]) => Future.IAwait<TResult, TProgress, TException>;
            always: (...listeners: Function[]) => Future.IAwait<TResult, TProgress, TException>;
            state: () => Future.Async.State;
        };
        run(...args: any[]): Future.IAwait<TResult, TProgress, TException>;
    }
}
