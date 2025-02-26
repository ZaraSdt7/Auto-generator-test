"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanService = scanService;
const fs_1 = require("fs");
const glob_1 = require("glob");
function scanService() {
    const files = glob_1.glob.sync("**/*.service.ts", { ignore: "node_modules/**" });
    console.log(`💡 found ${files.length} services(s)`);
    return files.map((file) => {
        const content = (0, fs_1.readFileSync)(file, "utf-8");
        // Extracting methods from a file
        const methodRegex = /\async\s+(\w+)\s*\(/g;
        const methods = [];
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
            methods.push(match[1]);
        }
        return {
            filePath: file,
            className: file.split("/").pop()?.replace(".service.ts", "Service") ||
                "UnknownService",
            methods,
        };
    });
}
//# sourceMappingURL=service.scanner.js.map