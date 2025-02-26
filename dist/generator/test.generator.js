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
exports.generateTestsService = generateTestsService;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const controller_scanner_1 = require("../scanner/controller.scanner");
const service_scanner_1 = require("../scanner/service.scanner");
function generateTestsCotroller() {
    const controllers = (0, controller_scanner_1.scanController)();
    controllers.forEach(({ filePath, className, methods }) => {
        const template = (0, fs_1.readFileSync)(path.join(__dirname, "../templates/controller.test.template"), "utf-8");
        let serviceDependcy = [];
        const mockService = serviceDependcy
            ? `{ provide: ${serviceDependcy}, useValue: {
    ${methods.map((method) => `${method}: jest.fn()`).join(",\n")}
  } }`
            : "";
        let tests = methods.length
            ? methods
                .map((method) => `
it('should call ${method}()', async () => {
const result = await controller.${method}();
expect(result).toBeDefined();
});`)
                .join("\n")
            : "// No methods found";
        const testFile = template
            .replace(/<%= controllerName %>/g, className)
            .replace(/<%= filePath %>/g, filePath.replace(".ts", ""))
            .replace("// <%= serviceDependency %>", mockService)
            .replace("// <%= testCases %>", tests);
        const testFilePath = path.join(process.cwd(), `${filePath.replace(".ts", ".spec.ts")}`);
        (0, fs_1.writeFileSync)(testFilePath, testFile);
        console.log(`✅ Controller test generated: ${testFilePath}`);
    });
}
function generateTestsService() {
    const services = (0, service_scanner_1.scanService)();
    services.forEach(({ filePath, className, methods }) => {
        const templatePath = (0, fs_1.readFileSync)(path.join(__dirname, "../templates/service.test.template"), "utf-8");
        let dependencies = [];
        const mockProviders = dependencies.length
            ? dependencies
                .map((dep) => `{provide:${dep}, useValue:{} }`)
                .join("\n   ")
            : "";
        let tests = methods.length
            ? methods
                .map((method) => `
it('should call ${method}()', async () => {
  const result = await service.${method}();
  expect(result).toBeDefined();
});`)
                .join("\n")
            : "// No methods found";
        const testFile = templatePath
            .replace(/<%= serviceName %>/g, className)
            .replace(/<%= filePath %>/g, filePath.replace(".ts", ""))
            .replace("// <%= dependencies %>", mockProviders)
            .replace("// <%= testCases %>", tests);
        const testFilePath = path.join(process.cwd(), `${filePath.replace(".ts", ".spec.ts")}`);
        (0, fs_1.writeFileSync)(testFilePath, testFile);
        console.log(`✅Service test  generated: ${testFilePath}`);
    });
}
//# sourceMappingURL=test.generator.js.map