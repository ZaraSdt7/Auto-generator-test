"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestsCotroller = generateTestsCotroller;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const controller_scanner_1 = require("../scanner/controller.scanner");
function generateTestsCotroller() {
    const controllers = (0, controller_scanner_1.scanController)();
    controllers.forEach(({ filePath, className, methods }) => {
        const templatePath = path.join(__dirname, "../templates/controller.test.template");
        const template = (0, fs_1.readFileSync)(templatePath, "utf-8");
        const pathParts = filePath.split("/");
        const moduleName = pathParts.length > 2
            ? pathParts[pathParts.length - 2]
            : "";
        const fileName = pathParts.pop()?.replace(".ts", "") || "unknown";
        const serviceName = `${className.replace("Controller", "Service")}`;
        const serviceFileName = `${serviceName.replace("Service", "").toLowerCase()}.service`;
        // Create proper import path without double slashes
        const importPath = moduleName
            ? `../src/${moduleName}`.replace(/\/+/g, '/')
            : `./`.replace(/\/+/g, '/');
        if (!methods.length) {
            console.warn(`⚠️ No methods found in ${filePath}`);
        }
        const testCases = methods
            .map(({ functionName, method, route }) => {
            // Generate appropriate test parameters based on HTTP method and function name
            let params = '';
            const lowerName = functionName.toLowerCase();
            // Determine parameters based on method type and function name
            if (method === 'Post' || method === 'Put' || method === 'Patch') {
                params = '{ name: "test", value: "data" }';
            }
            else if (method === 'Delete' || lowerName.includes('delete') || lowerName.includes('remove')) {
                params = '"test-id"';
            }
            else if (lowerName.includes('byid') || lowerName.includes('getone') || lowerName.includes('findone')) {
                params = '"test-id"';
            }
            else if (lowerName.includes('search') || lowerName.includes('filter')) {
                params = '{ query: "test" }';
            }
            else if (route && route.includes(':')) {
                // If route has parameters like /users/:id
                params = '"test-id"';
            }
            return `
    it('should call ${functionName}()', async () => {
      const result = await controller.${functionName}(${params});
      expect(result).toBeDefined();
    });`;
        })
            .join("\n");
        // Select a suitable method for error testing
        const methodsForErrorTesting = methods.filter(m => m.method === 'Get' || m.method === 'Post');
        const failedMethod = methodsForErrorTesting.length
            ? methodsForErrorTesting[0].functionName
            : methods.length
                ? methods[0].functionName
                : "getData";
        const testFile = template
            .replace(/<%= className %>/g, className)
            .replace(/<%= moduleName %>/g, moduleName)
            .replace(/<%= fileName %>/g, fileName)
            .replace(/<%= serviceName %>/g, serviceName)
            .replace(/<%= serviceFileName %>/g, serviceFileName)
            .replace(/<%= serviceMethod %>/g, failedMethod)
            .replace(/<%= testCases %>/g, testCases)
            .replace(/<%= importPath %>/g, importPath)
            .replace(/\/\//g, '/');
        const testFilePath = path.join(process.cwd(), filePath.replace(".ts", ".spec.ts"));
        try {
            // Create directory if it doesn't exist
            const testDir = path.dirname(testFilePath);
            if (!(0, fs_1.existsSync)(testDir)) {
                (0, fs_1.mkdirSync)(testDir, { recursive: true });
            }
            (0, fs_1.writeFileSync)(testFilePath, testFile);
            // Check if service file exists and create stub if needed
            const servicePath = path.join(testDir, serviceFileName + '.ts');
            if (!(0, fs_1.existsSync)(servicePath)) {
                console.log(`⚠️ Service file not found, creating stub: ${servicePath}`);
                // Create stub service file with methods that match controller methods
                const methodImplementations = methods.map(({ functionName }) => {
                    return `
  async ${functionName}(...args: any[]) {
    return { message: 'Stub service method', methodName: '${functionName}', args };
  }`;
                }).join('\n');
                const stubService = `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${serviceName} {${methodImplementations || `
  async ${failedMethod}() {
    return { message: 'Stub service method' };
  }`}
}
`;
                (0, fs_1.writeFileSync)(servicePath, stubService);
            }
            console.log(`✅ Controller test generated: ${testFilePath}`);
        }
        catch (error) {
            console.error(`❌ Error generating test for ${filePath}:`, error);
        }
    });
}
//# sourceMappingURL=test.controller.generate.js.map