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
        const classRegex = /export\s+class\s+(\w+Service)\s+/;
        const classMatch = content.match(classRegex);
        const className = classMatch ? classMatch[1] : file.split("/").pop()?.replace(".service.ts", "Service") || "UnknownService";
        const methodRegex = /\b(?:async\s+)?(\w+)\s*\(/g;
        const methods = [];
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
            if (match[1] !== "constructor") {
                methods.push(match[1]);
            }
        }
        return {
            filePath: file.replace(/\\/g, "/"),
            className,
            methods,
        };
    });
}
//# sourceMappingURL=service.scanner.js.map