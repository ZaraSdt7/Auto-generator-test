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
exports.generateTestsService = generateTestsService;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const service_scanner_1 = require("../scanner/service.scanner");
function generateTestsService() {
    const services = (0, service_scanner_1.scanService)();
    services.forEach(({ filePath, className, methods, dependencies }) => {
        const templatePath = (0, fs_1.readFileSync)(path.join(__dirname, '../templates/service.test.template'), 'utf-8');
        const mockProviders = dependencies.map((dep) => `{
      provide: ${dep},
      useValue: {
        ${methods.length ? methods[0] : 'execute'}: jest.fn()
      }
    }`);
        const dependencyImports = dependencies
            .map((dep) => `import { ${dep} } from '<%= dependencyPath %>';`)
            .join('\n');
        const testCases = methods
            .map((method) => `
  it('should call ${method}()', async () => {
    const result = await service.${method}();
    expect(result).toBeDefined();
  });`)
            .join('\n');
        const failingMethod = methods.length ? methods[0] : 'execute';
        const fixedFilePath = filePath.replace(/\\/g, '/').replace('.ts', '');
        const testFile = templatePath
            .replace(/<%= serviceName %>/g, className)
            .replace(/<%= servicePath %>/g, fixedFilePath)
            .replace(/<%= dependencyImports %>/g, dependencyImports)
            .replace(/<%= mockProvidersArray %>/g, mockProviders.join(',\n    '))
            .replace(/<%= testCases %>/g, testCases)
            .replace(/<%= failingMethod %>/g, failingMethod);
        const testFilePath = path.join(process.cwd(), `${fixedFilePath}.spec.ts`);
        (0, fs_1.writeFileSync)(testFilePath, testFile);
        console.log(`✅ Service test generated: ${testFilePath}`);
    });
}
// import { readFileSync, writeFileSync } from "fs";
// import * as path from "path";
// import { scanService } from "../scanner/service.scanner";
// export function generateTestsService() {
//   const services = scanService();
//   services.forEach(({ filePath, className, methods }) => {
//     const templatePath = readFileSync(
//       path.join(__dirname, "../templates/service.test.template"),
//       "utf-8"
//     );
//     const dependencies = extractDependencies(filePath);
//     const mockProviders = dependencies.map((dep) => `{
//       provide: ${dep},
//       useValue: {
//         <%= failedMethod %>: jest.fn()
//       }
//     }`);
//     let tests = methods.length
//       ? methods
//           .map(
//             (method) => `
// it('should call ${method}()', async () => {
//   const result = await service.${method}();
//   expect(result).toBeDefined();
// });`
//           )
//           .join("\n")
//       : "// No methods found";
//     const fixedFilePath = filePath.replace(/\\/g, "/").replace(".ts", "");
//     const testFile = templatePath
//       .replace(/<%= serviceName %>/g, className)
//       .replace(/<%= servicePath %>/g, fixedFilePath)
//       .replace(/<%= dependencyNames %>/g, dependencies.join(", "))
//       .replace(/<%= dependencyPaths %>/g, dependencies.map((dep) => `'../${dep.toLowerCase()}'`).join(", "))
//       .replace(/<%= mockProviders %>/g, mockProviders.join(",\n    "))
//       .replace(/<%= testCases %>/g, tests)
//       .replace(/<%= failedMethod %>/g, "getData")
//       .replace(/<%= serviceMethod %>/g, methods[0] || "execute");
//     const testFilePath = path.join(process.cwd(), `${fixedFilePath}.spec.ts`);
//     writeFileSync(testFilePath, testFile);
//     console.log(`✅ Service test generated: ${testFilePath}`);
//   });
// }
// function extractDependencies(filePath: string): string[] {
//   const content = readFileSync(filePath, "utf-8");
//   const dependencyRegex = /constructor\s*\(\s*private\s+readonly\s+(\w+):\s*(\w+)/g;
//   let match: RegExpExecArray | null;
//   const dependencies: string[] = [];
//   while ((match = dependencyRegex.exec(content)) !== null) {
//     dependencies.push(match[2]); 
//   }
//   return dependencies;
// }
//# sourceMappingURL=test.service.generator.js.map