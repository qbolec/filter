# filter.js

This is is a small library which is intended to be used for parsing a query a user has entered into a search box into a function which accepts or rejects objects (think: search results).
It is supposed to be similar to Gmail's or Elastic Search's interface.
For example if the user has entered 
```
from=qbolec@gmail.com to:mama date<"2015-10-21" my dog -cat
``` 
as a query, then it would be parsed and interpreted as a predicate which accepts an object `x` if and only if all the conditions below hold:
* `x.from` is exactly equal to `"qbolec@gmail.com"`
* `x.to` contains substring `"mama"` (search is case insensitive and does not check word boundaries)
* `x.date` is smaller than `20151021` (all non-digit characters are removed before comparison)
* words `"my"` and `"dog"` appear in any field of the object (`_.values(x).join(' ')` to be precise)
* word `"cat"` does not appear

For the syntax of expressions check file src/filter.pegjs (which, thanks to http://pegjs.org/ is converted into bin/filter_parser.js).

For the semantic refer to src/filter_compiler.ts (which, thanks to tsc is converted to bin/filter_compiler.js).

Fill free to modify the gramar and/or semantics to suit your needs (for example, you could add support for brackets in queries, or change the semantics for `contains` or `greater`).

# Usage

Make sure you have [underscore.js](http://underscorejs.org/) or [lodash](https://lodash.com) available.
Link bin/filter_parser.js and bin/filter_compiler.js (in that order).
Feel free to concat and minify them:)

This will expose FilterCompiler class with a single public method `compile(query)` which returns a record with following fields:
* `condition` - is the Abstract Syntax Tree of the `query`. It is `{op:"never"}` in case parsing failed. (Not the best way for handling errors, I guess, but I think it is semantically valid)
* `predicate` - is the function which accepts or rejects an object according to the query

So you can use this like this:
```
var matching_objects = _.filter(all_objects, new FilterCompiler().compile($('input').val()).predicate);
```

