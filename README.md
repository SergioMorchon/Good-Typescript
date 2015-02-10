[![Build Status](https://travis-ci.org/SergioMorchon/Good-Typescript.svg?branch=master)](https://travis-ci.org/SergioMorchon/Good-Typescript)

# Good

Some good and useful implementations for TypeScript or JavaScript projects.

## Async & Await tasks
``` typescript
var task: Good.Patterns.Parallel.Task<string, void, string>,
    p1 = "task", p2 = "must", p3 = ["w", "o", "r", "k"];

task = new Good.Patterns.Parallel.Task<string, void, string>((async: Good.Patterns.Future.Async<string, void, string>, r1: string, r2: string, r3: string[]) => {
    async.resolve([r1, r2, r3.join("")].join(" "));
});

task.run(p1, p2, p3).done((result: string) => {
    console.log(result);// "task must work"
});
```
