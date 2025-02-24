import * as fs from 'fs';
import * as path from 'path';

/**
 * This function is used to read the contents of a text file.
 * @param filePath The full path of the file
 * @returns The contents of the file as a string
 */
export const readFileContent = (filePath: string): string => {
  try {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

/**
 * This function checks whether a file or directory exists.
 * @param filePath The file or directory path
 * @returns true if it exists, false otherwise
 */
export const checkIfFileExists = (filePath: string): boolean => {
  try {
    const fullPath = path.resolve(filePath);
    return fs.existsSync(fullPath);
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};

/**
 * This function retrieves a list of files from a specific directory.
 * @param dirPath The directory path
 * @returns An array of file names
 */
export const getFilesInDirectory = (dirPath: string): string[] => {
  try {
    const fullPath = path.resolve(dirPath);
    const files = fs.readdirSync(fullPath);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};
