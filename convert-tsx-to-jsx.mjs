import fs from "fs";
import path from "path";

const directory = "./src/components"; // change this path if needed

function convertFile(filePath) {
  let code = fs.readFileSync(filePath, "utf8");

  // Remove all TypeScript type annotations
  code = code
    .replace(/: *[A-Za-z0-9_<>{}\[\]\| ,?]+(?=[)=,;])/g, "") // props, args, etc.
    .replace(/interface [^{]+{[^}]+}/g, "") // remove interfaces
    .replace(/type [^=]+=[^;]+;/g, "") // remove type aliases
    .replace(/import type [^;]+;/g, "") // remove import type
    .replace(/<[^>]+>(?=\()/g, ""); // remove generics like React.FC<Props>

  const newPath = filePath.replace(/\.tsx$/, ".jsx");
  fs.writeFileSync(newPath, code, "utf8");
  console.log(`✅ Converted: ${filePath} → ${newPath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith(".tsx")) {
      convertFile(fullPath);
    }
  });
}

walkDir(directory);
console.log("\n✨ Conversion complete! All .tsx files now have .jsx copies.");
