start
  = query

query
  = left:predicate " " right:query {return {op:"and", children: [left,right]};}
  / predicate:predicate

predicate
  = "-" simple_predicate:simple_predicate {return {op:"not",child:simple_predicate}}
  / simple_predicate

simple_predicate
  = field:field op:operator text:text {return {field: field, op:op, pattern: text};}
  / text:text {return {field:"*", op:"contains", pattern:text};}

operator
  = ":" {return "contains";}
  / "=" {return "equals";}
  / "~" {return "resembles";}
  / "<" {return "smaller";}
  / ">" {return "greater";}


field
  = letters:[^ :=~<>]+ {return letters.join('');}

text
  = '"' letters:([^"]*) '"' {return letters.join('');}
  / letters:[^ :=~<>]+ {return letters.join('');}
