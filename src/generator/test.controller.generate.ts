import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { scanController } from "../scanner/controller.scanner";


export function generateTestsCotroller() {
  const controllers = scanController();

  controllers.forEach(({ filePath, className, methods }) => {
    const templatePath = path.join(
      __dirname,
      "../templates/controller.test.template",
    );
    const template = readFileSync(templatePath, "utf-8");

    const pathParts = filePath.split("/");
    const moduleName = pathParts.length > 2
      ? pathParts[pathParts.length - 2]
      : "";
    const fileName = pathParts.pop()?.replace(".ts", "") || "unknown";
    const serviceName = `${className.replace("Controller", "Service")}`;
    const serviceFileName = `${
      serviceName.replace("Service", "").toLowerCase()
    }.service`;
    
    // Create proper import path without double slashes
    const importPath = moduleName 
      ? `../src/${moduleName}` 
      : `./`;

    if (!methods.length) {
      console.warn(`⚠️ No methods found in ${filePath}`);
    }

    const testCases = methods
      .map(
        ({ functionName }) => `
    it('should call ${functionName}()', async () => {
      const result = await controller.${functionName}();
      expect(result).toBeDefined();
    });`,
      )
      .join("\n");

    const failedMethod = methods.length ? methods[0].functionName : "getData";

    const testFile = template
      .replace(/<%= className %>/g, className)
      .replace(/<%= moduleName %>/g, moduleName)
      .replace(/<%= fileName %>/g, fileName)
      .replace(/<%= serviceName %>/g, serviceName)
      .replace(/<%= serviceFileName %>/g, serviceFileName)
      .replace(/<%= serviceMethod %>/g, failedMethod)
      .replace(/<%= testCases %>/g, testCases)
      .replace(/<%= importPath %>/g, importPath);

    const testFilePath = path.join(
      process.cwd(),
      filePath.replace(".ts", ".spec.ts"),
    );
    writeFileSync(testFilePath, testFile);

    console.log(`✅ Controller test generated: ${testFilePath}`);
  });
}
