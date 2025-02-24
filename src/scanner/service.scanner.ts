import { readFileSync } from "fs";
import { glob } from "glob";

export function scanService() {
    const files = glob.sync("**/*.service.ts", { ignore: "node_modules/**" });
    console.log(`💡 found ${files.length} services(s)`);

    return files.map((file) => {
        const content = readFileSync(file, "utf-8");
        // Extracting methods from a file
        const methodRegex = /\async\s+(\w+)\s*\(/g;
        const methods: string[] = [];

        let match: any;
        while ((match = methodRegex.exec(content)) !== null) {
            methods.push(
                match[1], //methods
            );
        }
        return {
            filePath: file,
            className:
                file.split("/").pop()?.replace(".service.ts", "Service") ||
                "UnknownService",
            methods,
        };
    });
}
