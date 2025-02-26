# Auto Generator Test

Auto Generator Test is a project designed to help automate the generation of unit and integration tests for NestJS services, modules, and more. The tool can analyze existing code and create boilerplate test files based on the structure and methods of your services and modules. This can save developers time and improve test coverage across the codebase.

## Features

- **Automatic Test Generation**: Generates boilerplate unit tests for NestJS services and modules.
- **Support for E2E Tests**: Supports creating end-to-end tests for NestJS applications.
- **File Reader Utility**: Includes helper functions to read files and check for file existence.
- **Customizable Test Templates**: Allows for easy modifications to test templates and configurations.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version >= 14.x)
- **NestJS** (latest version recommended)
- **TypeScript** (configured in your project)
- **Jest** (for testing)
- **npm** or **yarn** (for managing dependencies)

## Utility Functions

The following utility functions are provided in `utils/file-reader.ts` for interacting with files in your project:

###  Read File Content

1. Reads the content of a text file.

```typescript
import { FileReader } from 'auto-generator-test/utils/file-reader';

const content = FileReader.readFileContent('path/to/your/file.ts');
console.log(content);
```

2. Check If File Exists
Checks whether a file or directory exists.

```typescript
import { FileReader } from 'auto-generator-test/utils/file-reader';

const exists = FileReader.checkIfFileExists('path/to/your/file.ts');
console.log(exists);  // true or false
```

3. Get Files in Directory
Returns a list of files in a given directory.

```typescript
import { FileReader } from 'auto-generator-test/utils/file-reader';

const files = FileReader.getFilesInDirectory('path/to/your/directory');
console.log(files);  // Array of file names
```




## DTOs

### ScannerDTO

The `ScannerDTO` is used to represent data for scanning files.

#### Properties:

- `filePath`: The path of the file to be scanned.
- `scanType`: The type of scan (e.g., syntax check, file existence, etc.).
- `options`: Optional configurations for the scan.

#### Example Usage:

```typescript
import { ScannerDTO } from 'auto-generator-test/dto/scanner.dto';

const scannerRequest = new ScannerDTO('path/to/file.ts', 'syntax-check');
console.log(scannerRequest.filePath);  // path/to/file.ts
console.log(scannerRequest.scanType);  // syntax-check
```





## Installation

To install the project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/ZaraSdt7/Auto-generator-test
```

2. Install,dependencies:
Navigate to the project directory and run the following command to install the required dependencies.

Using npm:

```bash
npm install
```
Using yarn:

```bash
yarn install
```

3. Install the package into your NestJS project:
To use the Auto Generator Test in your NestJS project, install it via npm or yarn.

Using npm:

```bash
npm install auto-test-generator
```

Usage

Run the CLI tool with the following command:

```bash
npx auto-generator-test generate  --controllers --services
```
Options:

🔋 --controllers: Generate tests for controllers.

🔋 --services: Generate tests for services.


Example Project

This package includes a simple example to demonstrate how it works.

Sample Controller

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { SampleService } from './sample.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Get('/')
  getData() {
    return this.sampleService.getData();
  }

  @Post()
  createData(@Body() data: any) {
    return { ...data, message: "Sample data successfully created" };
  }
}
```

Sample Service

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleService {
  private data: any[] = [];

  getData() {
    return this.data;
  }

  createData(data: any) {
    this.data.push(data);
    return data;
  }
}
```




4. Import the module and configure:
After installation, import the AutoTestGeneratorModule into your NestJS application.

```typescript
import { AutoTestGeneratorModule } from 'auto-test-generator';

@Module({
  imports: [AutoTestGeneratorModule],
})
export class AppModule {}
```

5. Generate Tests:
To automatically generate tests for your services and modules, you can call the relevant service from AutoTestGeneratorService in your project.

For example:

```typescript
import { AutoTestGeneratorService } from 'auto-test-generator';

@Injectable()
export class SampleService {
  constructor(private readonly autoTestGenerator: AutoTestGeneratorService) {}

  generateTest() {
    this.autoTestGenerator.generateTestForService('SampleService');
  }
}
```

6. Run Tests:
Once your tests are generated, you can run them using Jest.

Using npm:

```bash
npm run test
```

Using yarn:
```bash
yarn test
```

7. Optional: Configure Jest
Make sure you have Jest configured properly in your project for running unit tests. You can customize the Jest setup in your jest.config.js file, including adding paths and test environments if necessary.

Usage
- Automatic Test Generation: This tool will automatically generate unit tests for your services and modules based on their structure.
- Customization: You can customize the generated tests by modifying the templates or adjusting settings in the configuration file.
- E2E Test Generation: This tool also supports generating boilerplate end-to-end tests.
