/// <reference path="../dist/good.d.ts" />
/// <reference path="libs/jasmine.d.ts" />
describe("Future",() => {
    "use strict";

    it("must be defined",() => {
        expect(Good.Patterns.Future).toBeDefined();
    });

    describe("Async",() => {
        var async: Good.Patterns.Future.Async<any, any, any>,
            await: Good.Patterns.Future.IAwait<any, any, any>;

        beforeEach(() => {
            async = new Good.Patterns.Future.Async();
            await = async.await();
        });

        it("must be defined",() => {
            expect(Good.Patterns.Future.Async).toBeDefined();
        });

        describe("State",() => {
            it("must be defined",() => {
                expect(Good.Patterns.Future.Async.State).toBeDefined();
            });
        });

        it("must be able to create an await handler",() => {
            expect(await).toBeDefined();
        });

        it("must return always the same instance",() => {
            expect(await).toBe(async.await());
        });

        it("must notify the progress event",(done: Function) => {
            var progressResult = 0,
                progressValue = 2,
                progressTimes = 7,
                i: number;

            await.progress((value: number) => {
                progressResult += value;
            }).always(() => {
                expect(progressResult).toBe(progressTimes * progressValue);
                expect(async.state()).toBe(Good.Patterns.Future.Async.State.Completed);
                done();
            });

            for (i = 0; i < progressTimes; i++) {
                async.progress(progressValue);
            }
            async.end();
        });

        it("must notify the fail event",(done: Function) => {
            await.fail(() => {
                done();
            }).always(() => {
                expect(async.state()).toBe(Good.Patterns.Future.Async.State.Completed);
                done();
            });

            expect(async.state()).toBe(Good.Patterns.Future.Async.State.Active);
            async.fail();
        });

        it("must notify the end even after ended, inmediatly",(done: Function) => {
            var ended = false;
            async.end();
            await.end(() => {
                ended = true;
            }).end(() => {
                expect(ended).toBe(true);
                done();
            });
        });

        it("must notify the fail even after ended, inmediatly",(done: Function) => {
            var errorToThrow = {};
            async.fail(errorToThrow);
            await.fail((errorThrown: any) => {
                expect(errorThrown).toBe(errorToThrow);
                done();
            });
        });
    });
});
