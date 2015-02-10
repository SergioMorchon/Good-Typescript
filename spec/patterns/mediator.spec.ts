/// <reference path="../../dist/good.d.ts" />
/// <reference path="../libs/jasmine.d.ts" />
describe("Mediator",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Patterns.Mediator).toBeDefined();
    });

    describe("Group",() => {

        var group: Good.Patterns.Mediator.Group;

        beforeEach(() => {
            group = new Good.Patterns.Mediator.Group();
        });

        it("must be defined",() => {
            expect(Good.Patterns.Mediator.Group).toBeDefined();
            expect(group).toBeDefined();
        });

        it("must register subscriptions",(done: Function) => {
            var error = "Some core error";

            group.subscribe("core-error",(value: any) => {
                expect(value).toBe(error);
                done();
            });

            group.publish("core-error", error);
        });

        it("must be able to attach to objects",(done: Function) => {
            var error = "Some core error",
                myObject: Good.Patterns.Mediator.IMediator = <any>{};

            group.attachTo(myObject);

            myObject.subscribe("core-error",(value: any) => {
                expect(value).toBe(error);
                done();
            });

            myObject.publish("core-error", error);
        });
    });
});