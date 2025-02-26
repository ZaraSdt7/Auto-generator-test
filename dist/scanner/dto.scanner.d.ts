export declare class ScannerDTO {
    /**
     * The file path to be scanned.
     */
    filePath: string;
    /**
     * The type of scan to perform (e.g., syntax check, file existence, etc.)
     */
    scanType: string;
    /**
     * Any optional configurations for the scan process.
     */
    options?: Record<string, any>;
    constructor(filePath: string, scanType: string, options?: Record<string, any>);
}
