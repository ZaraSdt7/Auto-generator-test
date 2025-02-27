#!/usr/bin/env node

import { Command } from "commander";
import { generateTestsCotroller } from "./generator/test.controller.generate";
import { generateTestsService } from "./generator/test.service.generator";


const program = new Command();

program
    .version("1.0.0")
    .description("Nest Auto Test Generator")
    .command("generate")
    .option("--controllers", "Generate tests for controllers")
    .option("--services", "Generate tests for services")
    .action((options) => {
        if (options.controllers) {
            generateTestsCotroller();
        }
        if (options.services) {
            generateTestsService();
        }
    });

program.parse(process.argv);
