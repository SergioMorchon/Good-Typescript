/// <reference path="future.ts" />
/**
 * This module contains functionalities for managing parallelizable tasks reusing the concept of the Future pattern.
 */
module Good.Patterns.Parallel {

    /**
     * A callbak for a Task instance, represents the main business logical process.
     * It will be called when the run method is called.
     * @param async The task will inject an async instance which should be completed within this function.
     * @param args The arguments that will be piped from the run call.
     */
    export type AsyncCallback = <TResult, TProgress, TException>(async: Future.IAsync<TResult, TProgress, TException>, ...args: any[]) => void;

    /**
     * This is a Task class which can execute functions deferring its execution result with the Async-Await Future Pattern.
     */
    export class Task<TResult, TProgress, TException> {

        private _callback: AsyncCallback;
        private _async: Future.Async<TResult, TProgress, TException>;
        private _thisArg: any;

        /**
         * @param callback The main function of this task.
         * @param thisArg the this value for the callback function (via apply).
         */
        constructor(callback: AsyncCallback, thisArg: any = null) {
            this._callback = callback;
            this._async = new Future.Async<TResult, TProgress, TException>();
            this._thisArg = thisArg;
        }

        /**
         * Gets the await representation of this task.
         * @returns An await object which will be completed when the task is finished.
         */
        await() {
            return this._async.await();
        }

        /**
         * Starts the execution by calling the inner callback with those arguments.
         * @param args Arrguments to pass to the execute function.
         * @returns An await object.
         */
        run(...args: any[]): Future.IAwait<TResult, TProgress, TException> {
            setTimeout(() => {
                try {
                    (<Future.IAwait<TResult, TProgress, TException>>this._callback.apply(this._thisArg, [this._async].concat(args))).done(this._async.resolve).fail(this._async.reject);
                } catch (e) {
                    this._async.reject(e);
                }
            });
            return this.await();
        }
    }
}