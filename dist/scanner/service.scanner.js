"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanService = scanService;
const fs_1 = require("fs");
const glob_1 = require("glob");
function scanService() {
    const files = glob_1.glob.sync("**/*.service.ts", { ignore: "node_modules/**" });
    console.log(`💡 Found ${files.length} service(s)`);
    return files.map((file) => {
        const content = (0, fs_1.readFileSync)(file, "utf-8");
        const classRegex = /export\s+(?:default\s+)?class\s+(\w+Service)\s+/;
        const classMatch = content.match(classRegex);
        const className = classMatch ? classMatch[1] : file.split("/").pop()?.replace(".service.ts", "Service") || "UnknownService";
        const methodsRegex = /(?:public|private|protected)?\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\w+)?\s*{/g;
        const methods = [];
        let methodMatch;
        while ((methodMatch = methodsRegex.exec(content)) !== null) {
            if (methodMatch[1] !== "constructor" && !methodMatch[1].startsWith("get") && !methodMatch[1].startsWith("set")) {
                methods.push(methodMatch[1]);
            }
        }
        const dependencyRegex = /constructor\s*\([^)]*\)/;
        const paramRegex = /(?:private|public|protected)?\s+(?:readonly)?\s+(\w+)\s*:\s*(\w+)/g;
        const constructorMatch = content.match(dependencyRegex);
        let dependencies = [];
        if (constructorMatch) {
            const constructorStr = constructorMatch[0];
            let paramMatch;
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
//# sourceMappingURL=service.scanner.js.map