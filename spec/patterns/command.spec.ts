/// <reference path="../../dist/good.d.ts" />
/// <reference path="../libs/jasmine.d.ts" />
describe("Command",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Patterns.Command).toBeDefined();
    });

    describe("Invoker",() => {
        it("must be defined",() => {
            expect(Good.Patterns.Command.Invoker).toBeDefined();
        });

        it("must execute methods over the data",() => {
            var data = {
                add: function (s1: number, s2: number) {
                    return s1 + s2;
                }
            }, command = new Good.Patterns.Command.Invoker(data);

            expect(command.execute("add", 4, 6)).toBe(10);
            expect(() => {
                command.execute("notExists");
            }).toThrow();
        });
    });
});