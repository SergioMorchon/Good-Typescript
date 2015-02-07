declare module Good.Patterns.Future {
    interface IEndListener<TResult> {
        (result?: TResult): any;
    }
    interface IProgressListener<TProgress> {
        (value?: TProgress): any;
    }
    interface IFailListener<TException> {
        (error?: TException): any;
    }
    interface IAwait<TResult, TProgress, TException> {
        done(...listeners: IEndListener<TResult>[]): IAwait<TResult, TProgress, TException>;
        progress(...listeners: IProgressListener<TProgress>[]): IAwait<TResult, TProgress, TException>;
        fail(...listeners: IFailListener<TException>[]): IAwait<TResult, TProgress, TException>;
        always(...listeners: Function[]): IAwait<TResult, TProgress, TException>;
        state(): Async.State;
    }
    interface IAsync<TResult, TProgress, TException> {
        state(): Async.State;
        await(): IAwait<TResult, TProgress, TException>;
        resolve(result?: TResult): void;
        reject(exception?: TException): void;
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
            Active = 0,
            Completed = 1,
        }
    }
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
