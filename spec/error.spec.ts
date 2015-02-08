/// <reference path="../dist/good.d.ts" />
/// <reference path="libs/jasmine.d.ts" />
describe("Error",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Error).toBeDefined();
    });

    it("must have a message attribute shown in toString",() => {
        var error = new Good.Error("message");
        expect(error.message).toBe("message");
        expect(error.toString()).toBe(error.message);
    });
});
