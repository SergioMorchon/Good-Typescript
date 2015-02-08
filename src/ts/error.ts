module Good {
    "use strict";

    /**
     * A basic Error class to inherit from.
     */
    export class Error {

        /**
         * The message for this error.
         */
        message: string;

        constructor(message: string) {
            this.message = message;
        }

        toString() {
            return this.message;
        }
    }
}