/// <reference path="../error.ts" />
/**
 * This module implements a light-weight Contract pattern.
 * It will help to ensure that the specified conditions are correctly satisfied at the start and/or the end of some execution.
 */
module Good.Patterns.Contract {
    "use strict";

    export class Error extends Good.Error {
    }
    export class PreConditionError extends Error {
    }
    export class PostConditionError extends Error {
    }

    /**
     * You can express a pre-condition by requiring a valid value. If not, will throw an error.
     * This line should be at the top of a function body to ensure a correct start state.
     */
    export function requires(valid: boolean, error: string = "Contract pre-condition violation") {
        if (!valid) {
            throw new PreConditionError(error);
        }
    }

    /**
     * You can express a post-condition by requiring a valid value. If not, will throw an error.
     * This line should be at the bottom of a function body to ensure a correct end state.
     */
    export function ensures(valid: boolean, error: string = "Contract post-condition violation") {
        if (!valid) {
            throw new PostConditionError(error);
        }
    }
}