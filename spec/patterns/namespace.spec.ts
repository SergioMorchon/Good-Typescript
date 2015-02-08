/// <reference path="../../dist/good.d.ts" />
/// <reference path="../libs/jasmine.d.ts" />
describe("Contract",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Patterns.Namespace).toBeDefined();
    });

    describe("extends",() => {

        it("must be defined",() => {
            expect(Good.Patterns.Namespace.extend).toBeDefined();
        });

        it("must extend a module using a string namespace",() => {
            var myModule: any = {},
                path: Object;

            path = Good.Patterns.Namespace.extend(myModule, "with.a.namespace");
            expect(myModule.with.a.namespace).toBeDefined();
            expect(myModule.with.a.namespace).toBe(path);
        });

        it("must extend a module using a string[] namespace",() => {
            var myModule: any = {},
                path: Object;

            path = Good.Patterns.Namespace.extend(myModule, ["with", "a", "namespace", "v.1"]);
            expect(myModule.with.a.namespace["v.1"]).toBeDefined();
            expect(myModule.with.a.namespace["v.1"]).toBe(path);
        });
    });
});
