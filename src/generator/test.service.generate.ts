import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { glob } from "glob";

export function generateTestsService() {
  const files = glob.sync("**/*.service.ts", { ignore: "node_modules/**" });

  console.log(`💡 Found ${files.length} service(s)`);

  files.forEach((filePath) => {
    const content = readFileSync(filePath, "utf-8");

    // Extract service class name
    const classNameRegex = /export\s+class\s+(\w+Service)\s+/;
    const classMatch = content.match(classNameRegex);
    const className = classMatch
      ? classMatch[1]
      : filePath.split("/").pop()?.replace(".service.ts", "Service") ||
        "UnknownService";

    // Extract method names
    const methodRegex = /\s+async\s+(\w+)\s*\([^)]*\)/g;
    const methods = [];
    let methodMatch;

    while ((methodMatch = methodRegex.exec(content)) !== null) {
      methods.push(methodMatch[1]);
    }

    if (!methods.length) {
      console.warn(`⚠️ No methods found in ${filePath}`);
    }

    // Create test cases
    const testCases = methods
      .map(
        (methodName) => {
          return `
    it('should call ${methodName}()', async () => {
      const result = await service.${methodName}();
      expect(result).toBeDefined();
    });`;
        },
      )
      .join("\n");

    // Generate test file content
    const testFile = `import { Test, TestingModule } from '@nestjs/testing';
import { ${className} } from './${
      filePath.split("/").pop()?.replace(".ts", "")
    }';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('${className} Service', () => {
  let service: ${className};

  const mockProviders = [
    {
      provide: ${className},
      useValue: {
${
      methods.map((method) =>
        `        ${method}: jest.fn().mockResolvedValue({ success: true })`
      ).join(",\n")
    }
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${className},
        ...mockProviders,
      ],
    }).compile();

    service = module.get<${className}>(${className});
  });

  describe('Service Methods', () => {
    ${testCases}
  });

  describe('Error Handling', () => {
    it('should throw an error if dependency fails', async () => {
      const testMethod = '${methods.length ? methods[0] : "getData"}';
      jest.spyOn(mockProviders[0].useValue, testMethod).mockRejectedValue(
        new HttpException('Dependency Error', HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(service[testMethod]()).rejects.toThrow(HttpException);
    });
  });
});
`;

    // Write the test file
    const testFilePath = path.join(
      process.cwd(),
      filePath.replace(".ts", ".spec.ts"),
    );

    try {
      // Create directory if it doesn't exist
      const testDir = path.dirname(testFilePath);
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
      }

      writeFileSync(testFilePath, testFile);
      console.log(`✅ Service test generated: ${testFilePath}`);
    } catch (error) {
      console.error(`❌ Error generating test for ${filePath}:`, error);
    }
  });
}
