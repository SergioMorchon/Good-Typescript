/**
 * This module is dedicated for the Namespace pattern.
 * It helps to create depp namespaces allocated into objects.
 */
module Good.Patterns.Namespace {
    "use strict";

    /**
     * Extends the parent object with the given namespace.
     * @param path The path to add to the parent, splitted by dots (.).
     * @returns The last path object of the namespace.
     */
    export function extend(parent: Object, path: string): Object;

    /**
     * Extends the parent object with the given namespace.
     * @param path The paths to add to the parent.
     * @returns The last path object of the namespace.
     */
    export function extend(parent: Object, path: string[]): Object;

    export function extend(parent: Object, path: string | string[]) {
        var paths = typeof path === "string" ? path.split(/\./) : path,
            currentPath = parent,
            i = 0;

        for (; i < paths.length && currentPath; i++) {
            if (!currentPath.hasOwnProperty(paths[i])) {
                currentPath[paths[i]] = {};
            }
            currentPath = currentPath[paths[i]];
        }
        return currentPath;
    }
}