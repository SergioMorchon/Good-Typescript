[![Build Status](https://travis-ci.org/SergioMorchon/Good-Typescript.svg?branch=master)](https://travis-ci.org/SergioMorchon/Good-Typescript)
# Good
Some good and useful implementations for TypeScript or JavaScript projects.
## Download
Directly from the master branch _dist_ folder: https://github.com/SergioMorchon/Good-Typescript/tree/master/dist
## Patterns
Here are some examples of the main patterns here.
### Future
``` typescript
var async = new Good.Patterns.Future.Async<number, string, string>();

async.await().done((result: number) => {
	console.log(`done: ${result}`);
}).progress((value: string) => {
	console.log(`progress: ${value}`);
}).fail((error: string) => {
	console.log(`error: ${error}`);
}).always(() => {
	console.log("always");
});

async.notify("1");// "progress: 1"
async.notify("3");// "progress: 3"
async.notify("duck!");// "progress: duck!"

async.resolve(4);// "done: 4"
                 // "always"
```
### Parallel Tasks
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
### Contract
``` typescript
Good.Patterns.Contract.requires(true);// ok
Good.Patterns.Contract.requires(false, "contract violation");// throws a PreConditionError
Good.Patterns.Contract.ensures(true);// ok
Good.Patterns.Contract.ensures(false, "contract violation");// throws a PostConditionError
```
### Namespace
``` typescript
var myModule: any = {},
    path: Object;

path = Good.Patterns.Namespace.extend(myModule, "with.a.namespace");
typeof myModule.with.a.namespace !== "undefined";// true
```
### Command
``` typescript
var data = {
	add: function (s1: number, s2: number) {
		return s1 + s2;
	}
}, command = new Good.Patterns.Command.Invoker(data);

console.log(command.execute("add", 4, 6));// 10
command.execute("notExists");// throws an InvocationError
```
