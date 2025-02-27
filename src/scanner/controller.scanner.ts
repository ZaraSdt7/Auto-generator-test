import { readFileSync } from "fs";
import { glob } from "glob";


export function scanController() {
  const files = glob.sync("**/*.controller.ts", { ignore: "node_modules/**" });

  console.log(`💡 Found ${files.length} controller(s)`);

  return files.map((file) => {
    const content = readFileSync(file, "utf-8");

    const methodRegex = /@(Get|Post|Put|Delete)\(['"]?([\w/-]*)['"]?\)?\s*\n\s*(?:async\s+)?(\w+)/g;
    const methods: { method: string; route: string; functionName: string }[] = [];

    let match: RegExpExecArray | null;
    while ((match = methodRegex.exec(content)) !== null) {
      methods.push({
        method: match[1], // Get, Post, Put, Delete
        route: match[2] || "/", // API route
        functionName: match[3], // method name
      });
    }

    const serviceRegex = /constructor\s*\(\s*(?:private|public|protected)?\s*(?:readonly\s*)?(\w+):\s*(\w+)/;
    const serviceMatch = content.match(serviceRegex);
    const serviceName = serviceMatch ? serviceMatch[2] : null;


    const classRegex = /export\s+class\s+(\w+Controller)\s+/;
    const classMatch = content.match(classRegex);
    const className = classMatch ? classMatch[1] : file.split("/").pop()?.replace(".controller.ts", "Controller") || "UnknownController";

    return {
      filePath: file.replace(/\\/g, "/"),
      className,
      methods,
      serviceName,
    };
  });
}