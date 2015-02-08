/// <reference path="../../dist/good.d.ts" />
/// <reference path="../libs/jasmine.d.ts" />
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
                async.notify(progressValue);
            }
            async.resolve();
        });

        it("must notify the fail event",(done: Function) => {
            await.fail(() => {
                done();
            }).always(() => {
                expect(async.state()).toBe(Good.Patterns.Future.Async.State.Completed);
                done();
            });

            expect(async.state()).toBe(Good.Patterns.Future.Async.State.Active);
            async.reject();
        });

        it("must notify the end even after ended, inmediatly",(done: Function) => {
            async.resolve(3);
            await.done((result: number) => {
                expect(result).toBe(3);
                done();
            });
        });

        it("must notify the fail even after ended, inmediatly",(done: Function) => {
            var errorToThrow = {};
            async.reject(errorToThrow);
            await.fail((errorThrown: any) => {
                expect(errorThrown).toBe(errorToThrow);
                done();
            });
        });
    });

    describe("When", () => {
        var max = 2,
            asyncs = <Good.Patterns.Future.Async<void, void, void>[]>[],
            awaits = <Good.Patterns.Future.IAwait<void, void, void>[]>[];

        beforeEach(() => {
            var i = 0;

            for (; i < max; i++) {
                asyncs.push(new Good.Patterns.Future.Async<void, void, void>());
                awaits.push(asyncs[i].await());
            }
        });

        it("must await for all the given awaitables", (done: Function) => {
            var count = 0,
                i = 0;

            function inc() {
                count++;
            }

            for (; i < asyncs.length; i++) {
                asyncs[i].resolve();
                awaits[i].done(inc);
            }

            Good.Patterns.Future.await.apply(null, awaits).done(() => {
                expect(count).toBe(max);
                done();
            });
        });
    });
});