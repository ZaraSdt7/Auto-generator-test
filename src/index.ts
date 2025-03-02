import { generateTestsCotroller } from './generator/test.controller.generate';
import { generateTestsService } from './generator/test.service.generate';

// Execute generators
generateTestsCotroller();
generateTestsService();

console.log('✅ All tests generated successfully!'); 