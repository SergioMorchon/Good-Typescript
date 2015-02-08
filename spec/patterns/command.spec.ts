/// <reference path="../../dist/good.d.ts" />
/// <reference path="../libs/jasmine.d.ts" />
describe("Command",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Patterns.Command).toBeDefined();
    });
});