/**
 * This function is used to read the contents of a text file.
 * @param filePath The full path of the file
 * @returns The contents of the file as a string
 */
export declare const readFileContent: (filePath: string) => string;
/**
 * This function checks whether a file or directory exists.
 * @param filePath The file or directory path
 * @returns true if it exists, false otherwise
 */
export declare const checkIfFileExists: (filePath: string) => boolean;
/**
 * This function retrieves a list of files from a specific directory.
 * @param dirPath The directory path
 * @returns An array of file names
 */
export declare const getFilesInDirectory: (dirPath: string) => string[];
