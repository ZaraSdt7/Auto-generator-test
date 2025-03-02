import { readFileSync } from "fs";
import { glob } from "glob";

export function scanService() {
  const files = glob.sync("**/*.service.ts", { ignore: "node_modules/**" });
  console.log(`💡 Found ${files.length} service(s)`);

  return files.map((file) => {
    const content = readFileSync(file, "utf-8");

    const classRegex = /export\s+(?:default\s+)?class\s+(\w+Service)\s+/;
    const classMatch = content.match(classRegex);
    const className = classMatch ? classMatch[1] : file.split("/").pop()?.replace(".service.ts", "Service") || "UnknownService";

    const methodsRegex = /(?:public|private|protected)?\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\w+)?\s*{/g;
    const methods: string[] = [];
    let methodMatch: RegExpExecArray | null;

    while ((methodMatch = methodsRegex.exec(content)) !== null) {
      const methodName = methodMatch[1];
      // Skip constructor, getters, setters, and JavaScript reserved words/built-ins
      const reservedWords = ['constructor', 'catch', 'then', 'finally', 'throw', 'delete', 'return', 'break', 'continue', 'for', 'switch', 
        'if', 'else', 'case', 'default', 'try', 'new', 'this', 'function', 'async', 'await', 'class', 'extends',
        'get', 'set', 'toString', 'valueOf', 'apply', 'call', 'bind'];
      
      if (!reservedWords.includes(methodName) && !methodName.startsWith('get') && !methodName.startsWith('set')) {
        methods.push(methodName);
      }
    }

    const dependencyRegex = /constructor\s*\([^)]*\)/;
    const paramRegex = /(?:private|public|protected)?\s+(?:readonly)?\s+(\w+)\s*:\s*(\w+)/g;
    const constructorMatch = content.match(dependencyRegex);
    let dependencies: string[] = [];

    if (constructorMatch) {
      const constructorStr = constructorMatch[0];
      let paramMatch: RegExpExecArray | null;
      
      while ((paramMatch = paramRegex.exec(constructorStr)) !== null) {
        dependencies.push(paramMatch[2]);
      }
    }

    return {
      filePath: file.replace(/\\/g, "/"),
      className,
      methods,
      dependencies,
    };
  });
}

























// import { readFileSync, readdirSync } from "fs";
// import { glob } from "glob";


// export function scanService() {
//       const files = glob.sync("**/*.service.ts", { ignore: "node_modules/**" });
//     console.log(`💡 Found ${files.length} service(s)`);

//     return files.map((file) => {
//         const content = readFileSync(file, "utf-8");


//         const classRegex = /export\s+class\s+(\w+Service)\s+/;
//         const classMatch = content.match(classRegex);
//         const className = classMatch ? classMatch[1] : file.split("/").pop()?.replace(".service.ts", "Service") || "UnknownService";


//         const methodRegex = /\b(?:async\s+)?(\w+)\s*\(/g;
//         const methods: string[] = [];
//         let match: RegExpExecArray | null;

//         while ((match = methodRegex.exec(content)) !== null) {
//             if (match[1] !== "constructor") {
//                 methods.push(match[1]);
//             }
//         }

//         return {
//             filePath: file.replace(/\\/g, "/"),
//             className,
//             methods,
//         };
//     });
// }



