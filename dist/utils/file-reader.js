"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesInDirectory = exports.checkIfFileExists = exports.readFileContent = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * This function is used to read the contents of a text file.
 * @param filePath The full path of the file
 * @returns The contents of the file as a string
 */
const readFileContent = (filePath) => {
    try {
        const fullPath = path.resolve(filePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        return content;
    }
    catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
};
exports.readFileContent = readFileContent;
/**
 * This function checks whether a file or directory exists.
 * @param filePath The file or directory path
 * @returns true if it exists, false otherwise
 */
const checkIfFileExists = (filePath) => {
    try {
        const fullPath = path.resolve(filePath);
        return fs.existsSync(fullPath);
    }
    catch (error) {
        console.error('Error checking file existence:', error);
        return false;
    }
};
exports.checkIfFileExists = checkIfFileExists;
/**
 * This function retrieves a list of files from a specific directory.
 * @param dirPath The directory path
 * @returns An array of file names
 */
const getFilesInDirectory = (dirPath) => {
    try {
        const fullPath = path.resolve(dirPath);
        const files = fs.readdirSync(fullPath);
        return files;
    }
    catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
};
exports.getFilesInDirectory = getFilesInDirectory;
//# sourceMappingURL=file-reader.js.map