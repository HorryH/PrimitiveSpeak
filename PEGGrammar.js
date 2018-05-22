// Ooga grammar to be parsed into Java

StatementList = statements: Statement* {
  return statements.join("\r\n");
}

Statement = LineStatement / BlockStatement;

BlockStatement = LoopStatement;

LineStatement = head: StatementBody tail:("." _) {
  return head + ";";
}

StatementBody = (PrintStatement / VariableDeclaration / VariableAssignment);

LoopStatement = Forloop
Forloop = "me repeat" _ newVar: VariableName _ "in" _ listVar: VariableName _ ":" _ sList: StatementList _ "me stop repeating." _ {
  return "for (" + newVar + " : " + listVar + ") {\r\n" +
      sList +
      "}";
}

PrintStatement = _ line: ("me say fast" / "me say") _ val: VariableValue {
  return (line != "me say fast" ? "System.out.println(" : "System.out.print(") + val + ")";
}

VariableAssignment = head: VariableName (_"is"_) tail: VariableValue? {
  return head + " = " + tail;
}

VariableDeclaration = head: VariableName (_"is"_) middle: (VariableType) init:Initializer? {
  if (!init) return middle[1] + " " + head[0];
return middle[1] + " " + head[0] + " = " + init;
}

Initializer = _ "with value of" _ body: VariableValue {
  return body;
}

Integer = val: ([0-9]+) { return val.join("") }
Decimal = val: ([0-9]+ "." [0-9]+) { return val.join("") }
Character = val: ("'" . "'") { return val.join("") };
Boolean = fal: ("no" _)? tru: "good" { return fal ? "false" : "true" }
String = val: [^'"']* { return val.join("") }
VariableName = val: ([a-zA-Z_$0-9]*) { return val.join("") }

Literal = StringLiteral;
StringLiteral = '"' val: String '"' { return '"' + val + '"' }

VariableType = (_ ("int"/"boolean"/"byte"/"long"/"char"/"short"/"String") _);

VariableValue = Literal / Decimal / Integer / Character / Boolean / VariableName;

_ "whitespace"
    = [ '\t''\n''\r']*
