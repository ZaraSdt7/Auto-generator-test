import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { scanController } from "../scanner/controller.scanner";
import { scanService } from "../scanner/service.scanner";

export function generateTestsCotroller() {
  const controllers = scanController();

  controllers.forEach(({ filePath, className, methods }) => {
    const template = readFileSync(
      path.join(__dirname, "../templates/controller.test.template"),
      "utf-8",
    );
    let serviceDependcy: string[] = [];
    const mockService = serviceDependcy
      ? `{ provide: ${serviceDependcy}, useValue: {
    ${methods.map((method) => `${method}: jest.fn()`).join(",\n")}
  } }`
      : "";

    let tests = methods.length
      ? methods
        .map(
          (method) => `
it('should call ${method}()', async () => {
const result = await controller.${method}();
expect(result).toBeDefined();
});`,
        )
        .join("\n")
      : "// No methods found";

    const testFile = template
      .replace(/<%= controllerName %>/g, className)
      .replace(/<%= filePath %>/g, filePath.replace(".ts", ""))
      .replace("// <%= serviceDependency %>", mockService)
      .replace("// <%= testCases %>", tests);

    const testFilePath = path.join(
      process.cwd(),
      `${filePath.replace(".ts", ".spec.ts")}`,
    );
    writeFileSync(testFilePath, testFile);
    console.log(`✅ Controller test generated: ${testFilePath}`);
  });
}

export function generateTestsService() {
  const services = scanService();

  services.forEach(({ filePath, className, methods }) => {
    const templatePath = readFileSync(
      path.join(__dirname, "../templates/service.test.template"),
      "utf-8",
    );

    let dependencies: string[] = [];
    const mockProviders = dependencies.length
      ? dependencies
        .map((dep: string) => `{provide:${dep}, useValue:{} }`)
        .join("\n   ")
      : "";

    let tests = methods.length
      ? methods
        .map(
          (method) => `
it('should call ${method}()', async () => {
  const result = await service.${method}();
  expect(result).toBeDefined();
});`,
        )
        .join("\n")
      : "// No methods found";

    const testFile = templatePath
      .replace(/<%= serviceName %>/g, className)
      .replace(/<%= filePath %>/g, filePath.replace(".ts", ""))
      .replace("// <%= dependencies %>", mockProviders)
      .replace("// <%= testCases %>", tests);

    const testFilePath = path.join(
      process.cwd(),
      `${filePath.replace(".ts", ".spec.ts")}`,
    );
    writeFileSync(testFilePath, testFile);
    console.log(`✅Service test  generated: ${testFilePath}`);
  });
}
