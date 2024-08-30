
// Install ts-morph: npm install ts-morph
import { Project, SourceFile } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

type TestFunction = (input: string) => boolean;

// Initialize a project
const project = new Project();

// Function to get all TypeScript files excluding node_modules
function getAllFiles(dirPath: string, {
    arrayOfFiles = [],
    includeTest,
    excludeTest
}: { includeTest?: TestFunction, excludeTest?: TestFunction, arrayOfFiles: string[] }): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        if (excludeTest && excludeTest(file)) {
            console.log('Excluding file:', file);
            return [];
        }
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, { arrayOfFiles, includeTest, excludeTest });
        } else {
            if (includeTest && includeTest(dirPath + '/' + file)) {
                console.log('Including file:', file);
                arrayOfFiles.push(path.join(dirPath, '/', file));
            }
        }
    });

    return arrayOfFiles;
}

function executeAllFiles(folder: string, {
    callback, exclude,
    include
}: {
    include?: RegExp,
    exclude?: RegExp,
    callback: (sourceFile: SourceFile) => void
}) {

    folder = folder ? folder : process.cwd();

    // Get all TypeScript files in the current directory
    const tsFiles = getAllFiles(folder, { 
        arrayOfFiles: [], 
        includeTest: include ? file => include.test(file) : (file) => (file.endsWith('.ts') || file.endsWith('.tsx')), 
        excludeTest: (file) => exclude?.test(file) || false
    });

    // Add source files to the project
    tsFiles.forEach((file) => {
        project.addSourceFileAtPath(file);
    });

    // Organize imports in each file
    project.getSourceFiles().forEach((sourceFile) => {
        callback(sourceFile);
    });
}

export {
    executeAllFiles
};