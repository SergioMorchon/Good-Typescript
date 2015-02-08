declare module Good {
    /**
     * A basic Error class to inherit from.
     */
    class Error {
        /**
         * The message for this error.
         */
        message: string;
        constructor(message: string);
        toString(): string;
    }
}
/**
 * This module implements a light-weight Contract pattern.
 * It will help to ensure that the specified conditions are correctly satisfied at the start and/or the end of some execution.
 */
declare module Good.Patterns.Contract {
    class Error extends Good.Error {
    }
    class PreConditionError extends Error {
    }
    class PostConditionError extends Error {
    }
    /**
     * You can express a pre-condition by requiring a valid value. If not, will throw an error.
     * This line should be at the top of a function body to ensure a correct start state.
     */
    function requires(valid: boolean, error?: string): void;
    /**
     * You can express a post-condition by requiring a valid value. If not, will throw an error.
     * This line should be at the bottom of a function body to ensure a correct end state.
     */
    function ensures(valid: boolean, error?: string): void;
}
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
        /**
         * It represents the current state of the async.
         */
        state(): Async.State;
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
        private _await;
        /**
         * It returns an await from this async instance.
         */
        await(): IAwait<TResult, TProgress, TException>;
    }
    module Async {
        /**
         * It represents the state of an async.
         */
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
     * This function merge all the given awaits into a unique one, notifying the progress.
     * It will fail if at least one of the input awaits receives the fail event.
     * @param awaits A list of await objects to await for.
     */
    function await(...awaits: IAwait<any, any, any>[]): IAwait<void, [number, number], void>;
}
/**
 * This module is dedicated for the Namespace pattern.
 * It helps to create depp namespaces allocated into objects.
 */
declare module Good.Patterns.Namespace {
    /**
     * Extends the parent object with the given namespace.
     * @param path The path to add to the parent, splitted by dots (.).
     * @returns The last path object of the namespace.
     */
    function extend(parent: Object, path: string): Object;
    /**
     * Extends the parent object with the given namespace.
     * @param path The paths to add to the parent.
     * @returns The last path object of the namespace.
     */
    function extend(parent: Object, path: string[]): Object;
}
/**
 * This module contains functionalities for managing parallelizable tasks reusing the concept of the Future pattern.
 */
declare module Good.Patterns.Parallel {
    /**
     * A callbak for a Task instance, represents the main business logical process.
     * It will be called when the run method is called.
     * @param async The task will inject an async instance which should be completed within this function.
     * @param args The arguments that will be piped from the run call.
     */
    type AsyncCallback = <TResult, TProgress, TException>(async: Future.IAsync<TResult, TProgress, TException>, ...args: any[]) => void;
    /**
     * This is a Task class which can execute functions deferring its execution result with the Async-Await Future Pattern.
     */
    class Task<TResult, TProgress, TException> {
        private _callback;
        private _async;
        private _thisArg;
        /**
         * @param callback The main function of this task.
         * @param thisArg the this value for the callback function (via apply).
         */
        constructor(callback: AsyncCallback, thisArg?: any);
        /**
         * Gets the await representation of this task.
         * @returns An await object which will be completed when the task is finished.
         */
        await(): Future.IAwait<TResult, TProgress, TException>;
        /**
         * Starts the execution by calling the inner callback with those arguments.
         * @param args Arrguments to pass to the execute function.
         * @returns An await object.
         */
        run(...args: any[]): Future.IAwait<TResult, TProgress, TException>;
    }
}
