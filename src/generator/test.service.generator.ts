import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { scanService } from "../scanner/service.scanner";

export function generateTestsService() {
  const services = scanService();

  services.forEach(({ filePath, className, methods }) => {
    const templatePath = readFileSync(
      path.join(__dirname, "../templates/service.test.template"),
      "utf-8"
    );

    const dependencies = extractDependencies(filePath);
    const mockProviders = dependencies.map((dep) => `{
      provide: ${dep},
      useValue: {
        <%= failedMethod %>: jest.fn()
      }
    }`);

    let tests = methods.length
      ? methods
          .map(
            (method) => `
it('should call ${method}()', async () => {
  const result = await service.${method}();
  expect(result).toBeDefined();
});`
          )
          .join("\n")
      : "// No methods found";

    const fixedFilePath = filePath.replace(/\\/g, "/").replace(".ts", "");

    const testFile = templatePath
      .replace(/<%= serviceName %>/g, className)
      .replace(/<%= servicePath %>/g, fixedFilePath)
      .replace(/<%= dependencyNames %>/g, dependencies.join(", "))
      .replace(/<%= dependencyPaths %>/g, dependencies.map((dep) => `'../${dep.toLowerCase()}'`).join(", "))
      .replace(/<%= mockProviders %>/g, mockProviders.join(",\n    "))
      .replace(/<%= testCases %>/g, tests)
      .replace(/<%= failedMethod %>/g, "getData")
      .replace(/<%= serviceMethod %>/g, methods[0] || "execute");

    const testFilePath = path.join(process.cwd(), `${fixedFilePath}.spec.ts`);
    writeFileSync(testFilePath, testFile);
    console.log(`✅ Service test generated: ${testFilePath}`);
  });
}

function extractDependencies(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  const dependencyRegex = /constructor\s*\(\s*private\s+readonly\s+(\w+):\s*(\w+)/g;
  let match: RegExpExecArray | null;
  const dependencies: string[] = [];

  while ((match = dependencyRegex.exec(content)) !== null) {
    dependencies.push(match[2]); 
  }

  return dependencies;
}