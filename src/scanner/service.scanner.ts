import { readFileSync, readdirSync } from "fs";
import { glob } from "glob";


export function scanService() {
      const files = glob.sync("**/*.service.ts", { ignore: "node_modules/**" });
    console.log(`💡 Found ${files.length} service(s)`);

    return files.map((file) => {
        const content = readFileSync(file, "utf-8");


        const classRegex = /export\s+class\s+(\w+Service)\s+/;
        const classMatch = content.match(classRegex);
        const className = classMatch ? classMatch[1] : file.split("/").pop()?.replace(".service.ts", "Service") || "UnknownService";


        const methodRegex = /\b(?:async\s+)?(\w+)\s*\(/g;
        const methods: string[] = [];
        let match: RegExpExecArray | null;

        while ((match = methodRegex.exec(content)) !== null) {
            if (match[1] !== "constructor") {
                methods.push(match[1]);
            }
        }

        return {
            filePath: file.replace(/\\/g, "/"),
            className,
            methods,
        };
    });
}



