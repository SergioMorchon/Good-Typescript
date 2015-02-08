/// <reference path="../dist/good.d.ts" />
/// <reference path="libs/jasmine.d.ts" />
describe("Parallel",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Patterns.Parallel).toBeDefined();
    });

    describe("Task",() => {

        it("must be defined",() => {
            expect(Good.Patterns.Parallel.Task).toBeDefined();
        });

        it("must execute a callback passing parameters",(done: Function) => {
            var task: Good.Patterns.Parallel.Task<string, void, string>,
                p1 = "task", p2 = "must", p3 = ["w", "o", "r", "k"];

            task = new Good.Patterns.Parallel.Task<string, void, string>((r1: string, r2: string, r3: string[]) => {
                expect(r1).toBe(p1);
                expect(r2).toBe(p2);
                expect(r3).toBe(p3);
                return [r1, r2, r3.join("")].join(" ");
            });

            task.run(p1, p2, p3).done((result: string) => {
                expect(result).toBe("task must work");
                done();
            });
        });
    });
});
