"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanController = scanController;
const fs_1 = require("fs");
const glob_1 = require("glob");
function scanController() {
    const files = glob_1.glob.sync("**/*.controller.ts", { ignore: "node_modules/**" });
    console.log(`💡 found ${files.length} cotrollers(s)`);
    return files.map((file) => {
        const content = (0, fs_1.readFileSync)(file, "utf-8");
        // Extracting methods from a file
        const methodRegex = /@(Get|Post|Put|Delete)\(['"]?([\w/-]*)['"]?\)\s+async\s+(\w+)/g;
        const methods = [];
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
            methods.push({
                method: match[1], // Get, Post, Put, Delete
                route: match[2] || "/", // router API
                functionName: match[3], // method name
            });
        }
        return {
            filePath: file,
            className: file.split("/").pop()?.replace(".controller.ts", "Controller") || "UnknownController",
            methods,
        };
    });
}
//# sourceMappingURL=controller.scanner.js.map