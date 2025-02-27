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
        const moduleName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "common";
        const fileName = pathParts.pop()?.replace(".ts", "") || "unknown";
        const serviceName = `${className.replace("Controller", "Service")}`;
        const serviceFileName = `${serviceName.replace("Service", "").toLowerCase()}.service`;
        if (!methods.length) {
            console.warn(`⚠️ No methods found in ${filePath}`);
        }
        const testCases = methods
            .map(({ functionName }) => `
    it('should call ${functionName}()', async () => {
      const result = await controller.${functionName}();
      expect(result).toBeDefined();
    });`)
            .join("\n");
        const failedMethod = methods.length ? methods[0].functionName : "getData";
        const testFile = template
            .replace(/<%= className %>/g, className)
            .replace(/<%= moduleName %>/g, moduleName)
            .replace(/<%= fileName %>/g, fileName)
            .replace(/<%= serviceName %>/g, serviceName)
            .replace(/<%= serviceFileName %>/g, serviceFileName)
            .replace(/<%= serviceMethod %>/g, failedMethod)
            .replace(/<%= testCases %>/g, testCases);
        const testFilePath = path.join(process.cwd(), filePath.replace(".ts", ".spec.ts"));
        (0, fs_1.writeFileSync)(testFilePath, testFile);
        console.log(`✅ Controller test generated: ${testFilePath}`);
    });
}
// import { readFileSync, writeFileSync } from "fs";
// import * as path from "path";
// import { scanController } from "../scanner/controller.scanner";
// export function generateTestsCotroller() {
//   const controllers = scanController();
//   controllers.forEach(({ filePath, className, methods, serviceName }) => {
//     const templatePath = path.join(
//       __dirname,
//       "../templates/controller.test.template",
//     );
//     const template = readFileSync(templatePath, "utf-8");
//     const serviceDependency = serviceName ? serviceName : "UnknownService";
//     const mockService = serviceName
//       ? `{ provide: ${serviceDependency}, useValue: {
//     ${methods.map((method) => `${method}: jest.fn()`).join(",\n")}
//   } }`
//       : "// No service found";
//     const tests = methods.length
//       ? methods
//         .map(
//           (method) => `
// it('should call ${method}()', async () => {
//   const result = await controller.${method}();
//   expect(result).toBeDefined();
// });`,
//         )
//         .join("\n")
//       : "// No methods found";
//     const testFile = template
//       .replace(/<%= controllerName %>/g, className)
//       .replace(
//         /<%= filePath %>/g,
//         filePath.replace(/\\/g, "/").replace(".ts", ""),
//       )
//       .replace("// <%= serviceDependency %>", mockService)
//       .replace("// <%= testCases %>", tests);
//     const testFilePath = path.join(
//       process.cwd(),
//       filePath.replace(/\\/g, "/").replace(".ts", ".spec.ts"),
//     );
//     writeFileSync(testFilePath, testFile);
//     console.log(`✅ Controller test generated: ${testFilePath}`);
//   });
// }
// // import { readFileSync, writeFileSync } from "fs";
// // import * as path from "path";
// // import { scanController } from "../scanner/controller.scanner";
// // export function generateTestsCotroller() {
// //   const controllers = scanController();
// //   controllers.forEach(({ filePath, className, methods }) => {
// //     const template = readFileSync(
// //       path.join(__dirname, "../templates/controller.test.template"),
// //       "utf-8",
// //     );
// //     let serviceDependcy: string[] = [];
// //     const mockService = serviceDependcy
// //       ? `{ provide: ${serviceDependcy}, useValue: {
// //     ${methods.map((method) => `${method}: jest.fn()`).join(",\n")}
// //   } }`
// //       : "";
// //     let tests = methods.length
// //       ? methods
// //         .map(
// //           (method) => `
// // it('should call ${method}()', async () => {
// // const result = await controller.${method}();
// // expect(result).toBeDefined();
// // });`,
// //         )
// //         .join("\n")
// //       : "// No methods found";
// //     const testFile = template
// //       .replace(/<%= controllerName %>/g, className)
// //       .replace(/<%= filePath %>/g, filePath.replace(".ts", ""))
// //       .replace("// <%= serviceDependency %>", mockService)
// //       .replace("// <%= testCases %>", tests);
// //     const testFilePath = path.join(
// //       process.cwd(),
// //       `${filePath.replace(".ts", ".spec.ts")}`,
// //     );
// //     writeFileSync(testFilePath, testFile);
// //     console.log(`✅ Controller test generated: ${testFilePath}`);
// //   });
// // }
//# sourceMappingURL=test.controller.generate.js.map