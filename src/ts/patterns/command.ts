/// <reference path="../error.ts" />
/**
 * This module contains a basic Command pattern implementation.
 */
module Good.Patterns.Command {

    export class InvocationError extends Error {
    }

    /**
     * An Invoker object is able to execute actions over some data.
     */
    export class Invoker<T> {
        private _data: T;

        /**
         * @param data This is the data object whose methods will be executed.
         */
        constructor(data: T) {
            this._data = data;
        }

        /**
         * Executes a method with the given arguments.
         * @param method The method name.
         * @param args The arguments for the execution.
         * @returns The execution result.
         */
        execute<Y>(method: string, ...args: any[]): Y {
            if (typeof this._data[method] !== "function") {
                throw new InvocationError(`No such method ${method}`);
            }
            return this._data[method].apply(this._data, args);
        }
    }
}