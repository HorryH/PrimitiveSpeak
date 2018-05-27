// Ooga grammar to be parsed into Java

StatementList = _ statements: Statement* {
  return statements.join("\r\n");
}

Statement = LineStatement / BlockStatement;

BlockStatement = LoopStatement / IfBlock;

LineStatement = head: StatementBody ("." _) {
  return head + ";";
}

StatementBody = (PrintStatement / VariableDeclaration / VariableAssignment);

LoopStatement = Forloop

IfBlock = "me check if" _ cond: Condition _ "then:" _ sList: StatementList _ nextBlock: (ElseIfBlock / ElseBlock / _)? _ "me stop checking." _ {
  return "if (" + cond + ") {\r\n" + sList + "\r\n}" + nextBlock;
}
ElseBlock = "otherwise, me do:" _ sList: StatementList {
  return " else {\r\n" + sList + "\r\n}";
}
ElseIfBlock = "me also check" _ cond: Condition _ "then:" _ sList: StatementList _ tailBlock: (ElseIfBlock / ElseBlock / _) {
  return " else if (" + cond + ") {\r\n" + sList + "\r\n}" + tailBlock;
}
Condition = Expression;

Forloop = "me repeat" _ newVar: VariableName _ "in" _ listVar: VariableName _ ":" _ sList: StatementList _ "me stop repeating." _ {
  return "for (" + newVar + " : " + listVar + ") {\r\n" +
      sList +
      "\r\n}";
}

PrintStatement = _ line: ("me say fast" / "me say") _ val: VariableValue {
  return (line != "me say fast" ? "System.out.println(" : "System.out.print(") + val + ")";
}

VariableAssignment = head: VariableName _ "is" _ tail: (MathematicalExpression / VariableValue)? {
  return head + " = " + tail;
}

VariableDeclaration = head: VariableName _ "is" _ middle: (VariableType) init:Initializer? {
  if (!init) return middle + " " + head;
return middle + " " + head + " = " + init;
}

Initializer = _ "with value of" _ body: VariableValue {
  return body;
}

Expression = OrExpression;
OrExpression = head: AndExpression _ tail: ("or" _ AndExpression)* {
  return head + tail.map(e => " || " + e[2]).join("");
}
AndExpression = head: EqualsExpression _ tail: ("and" _ EqualsExpression)* {
  return head + tail.map(e => " && " + e[2]).join("");
}
EqualsExpression = head: VariableValue _ tail: ("is" _ VariableValue)? {
  return head + (tail ? " == " + tail[2] : "");
}

MathematicalExpression = Sum;
Sum = head: Product _ tail: (("plus" / "take away") _ Product)* {
  return head[0] + tail.map(e => (e[0] === "plus" ? " + " : " - ") + e[2]).join("");
}
Product = head: VariableValue _ tail: (("times" / "split by") _ VariableValue)* {
  return head[0] + tail.map(e => (e[0] === "times" ? " * " : " / ") + e[2]).join("");
}

Integer = val: ([0-9]+) { return val.join("") }
Decimal = val: ([0-9]+ "." [0-9]+) { return val.join("") }
Character = val: ("'" . "'") { return val.join("") };
Boolean = fal: ("no" _)? tru: "good" { return fal ? "false" : "true" }
String = val: [^'"']* { return val.join("") }
VariableName = val: ([a-zA-Z_$0-9]*) arr: (_ "at" _ VariableName)? { return val.join("") + (arr ? "[" + arr[3] + "]": "") }

Literal = StringLiteral / ArrayLiteral;
StringLiteral = '"' val: String '"' (_ "+" _ StringLiteral)* { return '"' + val + '"' }
ArrayLiteral = "{" head: VariableValue tail: ("," _ VariableValue)* "}" {
  return "{" + head + tail.map(e => { return ", " + e[2] }).join("") + "}";
}

VariableType = head: ("int"/"boolean"/"byte"/"long"/"char"/"short"/"String") tail:(" array")? {
  return head + (tail ? "[]" : "");
};

VariableValue = Literal / Decimal / Integer / Character / Boolean / VariableName;

_ "whitespace"
    = [ '\t''\n''\r']*
