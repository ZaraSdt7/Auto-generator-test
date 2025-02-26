#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const test_generator_1 = require("./generator/test.generator");
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("Nest Auto Test Generator")
    .command("generate")
    .option("--controllers", "Generate tests for controllers")
    .option("--services", "Generate tests for services")
    .action((options) => {
    if (options.controllers) {
        (0, test_generator_1.generateTestsCotroller)();
    }
    if (options.services) {
        (0, test_generator_1.generateTestsService)();
    }
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map