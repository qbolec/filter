# filter.js


This is is a small library which is intended to be used for parsing a query a user has entered into a search box into a function which accepts or rejects objects.
For example if user has entered `from=qbolec@gmail.com to:mama date<"2015-10-21" my dog -cat` then it would be parsed and interpreted as a predicate which accepts object x if and only if all the conditions below hold:
* `x.from` is exactly equal to "qbolec@gmail.com"
* `x.to` contains substring "mama" (search is case insensitive and does not check word boundaries)
* `x.date` is smaller than 20151021 (all nondigit characters are removed)
* words "my" and "dog" appear in any field of the object
* word "cat" does not appear

For the syntax of expressions check file src/filter.pegjs (which, thanks to http://pegjs.org/ is converted into bin/filter_parser.js).
For semantic refer to src/filter_compiler.ts (which, thanks to tsc is converted to bin/filter_compiler.js).

Fill free to modify the gramar and/or semantics to suit your needs (for example, you could add support for brackets in queries, or change the semantics for `contains` or `greater`).

# Usage

Make sure you have underscore.js or lodash.js available.
Link bin/filter_parser.js and bin/filter_compiler.js (in that order).
This will expose FilterCompiler class with a single public method `compile(query)` which returns a record with following fields:
* `condition` - is the Abstract Syntax Tree of the `query`. It is `{op:"never"}` in case parsing failed. (Not the best way for handling errors, I guess, but I think it is semantically valid)
* `predicate` - is the function which accepts or rejects an object according to the query

So you can use this like this:
`var matching_objects = _.filter(all_objects, new FilterCompiler().compile($('input').val()).predicate);`


