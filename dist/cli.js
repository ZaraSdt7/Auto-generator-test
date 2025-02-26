"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const controller_scanner_1 = require("./scanner/controller.scanner");
const test_generator_1 = require("./generator/test.generator");
const service_scanner_1 = require("./scanner/service.scanner");
const dto_scanner_1 = require("./scanner/dto.scanner");
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("Nest Auto Test Generator")
    .command("generate")
    .option("--controllers", "Generate tests for controllers")
    .option("--services", "Generate tests for services")
    .action((options) => {
    new dto_scanner_1.ScannerDTO('', options.controllers ? "controllers" : "services");
    if (options.controllers) {
        (0, controller_scanner_1.scanController)();
    }
    if (options.services) {
        (0, service_scanner_1.scanService)();
    }
    (0, test_generator_1.generateTestsCotroller)();
    (0, test_generator_1.generateTestsService)();
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map