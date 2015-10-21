///<reference path="filter_parser.d.ts"/>
///<reference path="../vendor/lodash/lodash.d.ts"/>
var FilterCompiler = (function () {
    function FilterCompiler() {
    }
    FilterCompiler.prototype.compile = function (text) {
        var condition;
        try  {
            condition = FilterParser.parse(text.replace(/^\s+|\s+$/gm, ''));
        } catch (e) {
            condition = { op: "never" };
        }

        function doesObjectMeetCondition(object, condition) {
            switch (condition.op) {
                case 'always':
                    return true;
                case 'never':
                    return false;
                case 'not':
                    return !doesObjectMeetCondition(object, condition.child);
                case 'and':
                    return _.all(condition.children, function (child) {
                        return doesObjectMeetCondition(object, child);
                    });
                case 'contains':
                    return 0 <= (object[condition.field] || '').toLowerCase().indexOf(condition.pattern.toLowerCase());
                case 'equals':
                    return object[condition.field] == condition.pattern;
                case 'resembles':
                    return (object[condition.field] || '').toLowerCase() == condition.pattern.toLowerCase();
                case 'smaller':
                    return +((object[condition.field] || '').replace(/[^0-9]/g, '') || 0) < +(condition.pattern);
                case 'greater':
                    return +((object[condition.field] || '').replace(/[^0-9]/g, '') || 0) > +(condition.pattern);
            }
        }
        return {
            condition: condition,
            predicate: function (object) {
                var obj = _.extend({ '*': _.values(object).join(' ') }, object);
                return doesObjectMeetCondition(obj, condition);
            }
        };
    };
    return FilterCompiler;
})();
