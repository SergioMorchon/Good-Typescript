/// <reference path="future.ts" />
module Patterns.Parallel {

    export class Task<TResult, TProgress, TException> {

        private _callback: (...args: any[]) => TResult;
        private _async: Future.Async<TResult, TProgress, TException>;
        private _thisArg: any;

        constructor(callback: (...args: any[]) => TResult, thisArg: any = null) {
            this._callback = callback;
            this._async = new Future.Async();
            this._thisArg = thisArg;
        }

        await() {
            return this._async.await();
        }

        startAsync(...args: any[]): Future.IAwait<TResult, TProgress, TException> {
            setTimeout(() => {
                try {
                    this._async.end(this._callback.apply(this._thisArg, args));
                } catch (e) {
                    this._async.fail(e);
                }
            });
            return this.await();
        }
    }
}