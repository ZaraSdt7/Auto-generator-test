"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanController = scanController;
const fs_1 = require("fs");
const glob_1 = require("glob");
function scanController() {
    const files = glob_1.glob.sync("**/*.controller.ts", { ignore: "node_modules/**" });
    console.log(`💡 Found ${files.length} controller(s)`);
    return files.map((file) => {
        const content = (0, fs_1.readFileSync)(file, "utf-8");
        const methodRegex = /@(Get|Post|Put|Patch|Delete)\(['"]?([\w/-]*)['"]?\)?\s*\n\s*(?:async\s+)?(\w+)/g;
        const methods = [];
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
            methods.push({
                method: match[1], // Get, Post, Put, Patch, Delete
                route: match[2] || "/", // API route
                functionName: match[3], // method name
            });
        }
        const serviceRegex = /constructor\s*\(\s*(?:(?:private|public|protected)?\s*(?:readonly\s*)?(\w+):\s*(\w+)(?:,\s*)?)+/g;
        const serviceParams = [];
        let serviceMatch;
        const simpleServiceRegex = /(?:private|public|protected)?\s*(?:readonly\s*)?(\w+):\s*(\w+)/g;
        const constructorSection = content.match(/constructor\s*\([^)]*\)/)?.[0] || '';
        while ((serviceMatch = simpleServiceRegex.exec(constructorSection)) !== null) {
            serviceParams.push({
                paramName: serviceMatch[1],
                serviceName: serviceMatch[2]
            });
        }
        const controllerBaseName = file.split("/").pop()?.replace(".controller.ts", "") || "Unknown";
        const primaryService = serviceParams.find(s => s.serviceName.toLowerCase().includes(controllerBaseName.toLowerCase() + 'service'));
        const serviceName = primaryService ? primaryService.serviceName :
            serviceParams.length > 0 ? serviceParams[0].serviceName : null;
        const classRegex = /export\s+class\s+(\w+Controller)\s+/;
        const classMatch = content.match(classRegex);
        const className = classMatch ? classMatch[1] : file.split("/").pop()?.replace(".controller.ts", "Controller") || "UnknownController";
        return {
            filePath: file.replace(/\\/g, "/"),
            className,
            methods,
            serviceName,
        };
    });
}
//# sourceMappingURL=controller.scanner.js.map