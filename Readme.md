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

4. Import the module and configure:
After installation, import the AutoTestGeneratorModule into your NestJS application.
```
import { AutoTestGeneratorModule } from 'auto-test-generator';

@Module({
  imports: [AutoTestGeneratorModule],
})
export class AppModule {}
```

5. Generate Tests:
To automatically generate tests for your services and modules, you can call the relevant service from AutoTestGeneratorService in your project.

For example:

```
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

