import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export const findDependencies = (code: string) => {
  const ast = parse(code);

  const dependencies: string[] = [];
  const visitor = {
    CallExpression(path) {
      const { node } = path;
      if (node.callee.type === "Identifier" && node.callee.name === "require") {
        // TODO: Solidify this
        dependencies.push(node.arguments[0].value);
      }
    },
  };

  traverse(ast, visitor);

  return dependencies;
};
