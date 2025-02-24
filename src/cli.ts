import { Command } from "commander";
import { scanController } from './scanner/controller.scanner';
import { generateTestsCotroller, generateTestsService } from './generator/test.generator';
import { scanService } from "./scanner/service.scanner";
import { ScannerDTO } from "./scanner/dto.scanner";


const program = new Command();

program
    .version("1.0.0")
    .description("Nest Auto Test Generator")
    .command("generate")
    .option("--controllers", "Generate tests for controllers")
    .option("--services", "Generate tests for services")
    .action((options) => {

        new ScannerDTO('',options.controllers ? "controllers" : "services");
        
        if (options.controllers) {
            scanController();
        }
        if (options.services) {
            scanService();
        }
        generateTestsCotroller();
        generateTestsService();
       
     
    });

program.parse(process.argv);
