/// <reference path="../../dist/good.d.ts" />
/// <reference path="../libs/jasmine.d.ts" />
describe("Contract",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Patterns.Contract).toBeDefined();
    });

    describe("requires",() => {

        it("must be defined",() => {
            expect(Good.Patterns.Contract.requires).toBeDefined();
        });

        it("must verify that the given condition is true",() => {
            expect(() => {
                Good.Patterns.Contract.requires(true);
            }).not.toThrow();
            expect(() => {
                Good.Patterns.Contract.requires(false, "contract violation");
            }).toThrow();
        });
    });

    describe("ensures",() => {

        it("must be defined",() => {
            expect(Good.Patterns.Contract.ensures).toBeDefined();
        });

        it("must verify that the given condition is true",() => {
            expect(() => {
                Good.Patterns.Contract.ensures(true);
            }).not.toThrow();
            expect(() => {
                Good.Patterns.Contract.ensures(false, "contract violation");
            }).toThrow();
        });
    });
});
