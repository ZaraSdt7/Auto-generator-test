import { readFileSync } from "fs";
import { glob } from "glob";


export function scanController() 
{
    
    const files = glob.sync("**/*.controller.ts", {ignore:"node_modules/**"});

    console.log(`💡 found ${files.length} cotrollers(s)`);
    return files.map((file) => {
        const content = readFileSync(file, "utf-8");
    
        // Extracting methods from a file
        const methodRegex = /@(Get|Post|Put|Delete)\(['"]?([\w/-]*)['"]?\)\s+async\s+(\w+)/g;
        const methods: { method: string; route: string; functionName: string }[] = [];
    
        let match: RegExpExecArray | null;
        while ((match = methodRegex.exec(content)) !== null) {
          methods.push({
            method: match[1],  // Get, Post, Put, Delete
            route: match[2] || "/",  // router API
            functionName: match[3],  // method name
          });
        }
    
        return {
          filePath: file,
          className: file.split("/").pop()?.replace(".controller.ts", "Controller") || "UnknownController",
          methods,
        };
      });
}