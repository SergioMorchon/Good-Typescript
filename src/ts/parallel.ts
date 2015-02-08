/// <reference path="future.ts" />
module Good.Patterns.Parallel {

    export class Task<TResult, TProgress, TException> {

        private _callback: (...args: any[]) => Future.IAwait<TResult, TProgress, TException>;
        private _async: Future.Async<TResult, TProgress, TException>;
        private _thisArg: any;

        constructor(callback: (...args: any[]) => Future.IAwait<TResult, TProgress, TException>, thisArg: any = null) {
            this._callback = callback;
            this._async = new Future.Async<TResult, TProgress, TException>();
            this._thisArg = thisArg;
        }

        await() {
            return this._async.await();
        }

        run(...args: any[]): Future.IAwait<TResult, TProgress, TException> {
            setTimeout(() => {
                try {
                    (<Future.IAwait<TResult, TProgress, TException>>this._callback.apply(this._thisArg, args)).done(this._async.resolve).fail(this._async.reject);
                } catch (e) {
                    this._async.reject(e);
                }
            });
            return this.await();
        }
    }
}