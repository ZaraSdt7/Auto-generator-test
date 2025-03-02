import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { scanService } from '../scanner/service.scanner';

export function generateTestsService() {
  const services = scanService();

  services.forEach(({ filePath, className, methods, dependencies }) => {
    const templatePath = readFileSync(
      path.join(__dirname, '../templates/service.test.template'),
      'utf-8'
    );

    const mockProviders = dependencies.map((dep) => {
      const mockMethod = methods.length ? methods[0] : 'execute';
      return `{
      provide: ${dep},
      useValue: {
        ${mockMethod}: jest.fn().mockResolvedValue({ success: true })
      }
    }`;
    });

    const fixedFilePath = filePath.replace(/\\/g, '/').replace('.ts', '');
    const testFilePathFull = path.join(process.cwd(), `${fixedFilePath}.spec.ts`);
    const testFileDir = path.dirname(testFilePathFull);
    const serviceFileDir = path.dirname(path.join(process.cwd(), filePath));
    const relativePath = path.relative(testFileDir, serviceFileDir).replace(/\\/g, '/');
    
    const servicePath = relativePath ? 
      `${relativePath}/${path.basename(fixedFilePath)}` : 
      `./${path.basename(fixedFilePath)}`;
    
    const dependencyPath = relativePath || './';

    const dependencyImports = dependencies
      .map((dep) => `import { ${dep} } from '${dependencyPath}';`)
      .join('\n');

    const testCases = methods
      .map(
        (method) => {
          let params = '{}';
          if (method.includes('find') || method.includes('get') || method.includes('read')) {
            params = '{ id: "test-id" }';
          } else if (method.includes('create') || method.includes('update') || method.includes('save')) {
            params = '{ name: "test", value: "data" }';
          } else if (method.includes('delete') || method.includes('remove')) {
            params = '"test-id"';
          } else if (method.includes('analyze') || method.includes('process')) {
            params = '"data", 1000, 2000';
          }
          
          return `
  it('should call ${method}()', async () => {
    const result = await service.${method}(${params});
    expect(result).toBeDefined();
  });`;
        }
      )
      .join('\n');

    const failingMethod = methods.length ? methods[0] : 'execute';
    
    let failingMethodParams = '{}';
    if (failingMethod.includes('find') || failingMethod.includes('get') || failingMethod.includes('read')) {
      failingMethodParams = '{ id: "test-id" }';
    } else if (failingMethod.includes('create') || failingMethod.includes('update') || failingMethod.includes('save')) {
      failingMethodParams = '{ name: "test", value: "data" }';
    } else if (failingMethod.includes('delete') || failingMethod.includes('remove')) {
      failingMethodParams = '"test-id"';
    } else if (failingMethod.includes('analyze') || failingMethod.includes('process')) {
      failingMethodParams = '"data", 1000, 2000';
    }

    const testFile = templatePath
      .replace(/<%= serviceName %>/g, className)
      .replace(/<%= servicePath %>/g, servicePath)
      .replace(/<%= dependencyImports %>/g, dependencyImports)
      .replace(/<%= mockProvidersArray %>/g, mockProviders.join(',\n    '))
      .replace(/<%= testCases %>/g, testCases)
      .replace(/<%= failingMethod %>/g, failingMethod)
      .replace(/<%= failingMethodParams %>/g, failingMethodParams)
      .replace(/<%= dependencyPath %>/g, dependencyPath);

    writeFileSync(testFilePathFull, testFile);
    console.log(`✅ Service test generated: ${testFilePathFull}`);
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