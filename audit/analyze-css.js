// CSS Deep Analysis Script
// Run with: node audit/analyze-css.js

const fs = require('fs');
const path = require('path');

class CSSAnalyzer {
    constructor() {
        this.results = {
            files: [],
            variables: new Map(),
            selectors: new Map(),
            properties: new Map(),
            imports: [],
            duplicates: {
                variables: [],
                selectors: [],
                properties: []
            },
            stats: {
                totalFiles: 0,
                totalLines: 0,
                totalSelectors: 0,
                totalVariables: 0,
                totalProperties: 0,
                commentedLines: 0
            }
        };
    }

    analyzeDirectory(dirPath) {
        const cssDir = path.join(dirPath, 'css');
        const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
        
        this.results.stats.totalFiles = files.length;
        
        files.forEach(file => {
            this.analyzeFile(path.join(cssDir, file), file);
        });
        
        this.findDuplicates();
        this.generateReport();
    }

    analyzeFile(filePath, fileName) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        const fileInfo = {
            name: fileName,
            path: filePath,
            lines: lines.length,
            selectors: new Set(),
            variables: new Map(),
            properties: new Map(),
            imports: [],
            commentedLines: 0
        };
        
        this.results.stats.totalLines += lines.length;
        
        lines.forEach(line => {
            // Count commented lines
            if (line.trim().startsWith('/*') || line.trim().startsWith('//')) {
                fileInfo.commentedLines++;
                this.results.stats.commentedLines++;
            }
            
            // Find @import statements
            const importMatch = line.match(/@import\s+['"]([^'"]+)['"]/);
            if (importMatch) {
                fileInfo.imports.push(importMatch[1]);
                this.results.imports.push({ file: fileName, imports: importMatch[1] });
            }
            
            // Find CSS variables
            const varMatches = line.matchAll(/(--[\w-]+):\s*([^;]+);/g);
            for (const match of varMatches) {
                const varName = match[1];
                const varValue = match[2].trim();
                fileInfo.variables.set(varName, varValue);
                
                if (!this.results.variables.has(varName)) {
                    this.results.variables.set(varName, []);
                }
                this.results.variables.get(varName).push({ file: fileName, value: varValue });
            }
        });
        
        // Extract selectors using regex
        const selectorRegex = /([^{]+)\s*{[^}]*}/g;
        const matches = content.matchAll(selectorRegex);
        
        for (const match of matches) {
            const selector = match[1].trim();
            if (selector && !selector.startsWith('@') && !selector.includes('/*')) {
                fileInfo.selectors.add(selector);
                
                if (!this.results.selectors.has(selector)) {
                    this.results.selectors.set(selector, []);
                }
                this.results.selectors.get(selector).push(fileName);
            }
        }
        
        this.results.stats.totalSelectors += fileInfo.selectors.size;
        this.results.stats.totalVariables += fileInfo.variables.size;
        
        this.results.files.push(fileInfo);
    }

    findDuplicates() {
        // Find duplicate variables
        this.results.variables.forEach((definitions, varName) => {
            if (definitions.length > 1) {
                const uniqueValues = [...new Set(definitions.map(d => d.value))];
                if (uniqueValues.length > 1) {
                    this.results.duplicates.variables.push({
                        name: varName,
                        definitions: definitions
                    });
                }
            }
        });
        
        // Find duplicate selectors
        this.results.selectors.forEach((files, selector) => {
            if (files.length > 1) {
                this.results.duplicates.selectors.push({
                    selector: selector,
                    files: files
                });
            }
        });
    }

    generateReport() {
        const report = [];
        
        report.push('=== CSS ANALYSIS REPORT ===');
        report.push(`Generated: ${new Date().toISOString()}\n`);
        
        report.push('SUMMARY STATISTICS:');
        report.push(`- Total CSS Files: ${this.results.stats.totalFiles}`);
        report.push(`- Total Lines: ${this.results.stats.totalLines}`);
        report.push(`- Commented Lines: ${this.results.stats.commentedLines} (${Math.round(this.results.stats.commentedLines / this.results.stats.totalLines * 100)}%)`);
        report.push(`- Total Selectors: ${this.results.stats.totalSelectors}`);
        report.push(`- Total CSS Variables: ${this.results.variables.size}`);
        report.push(`- Duplicate Variables: ${this.results.duplicates.variables.length}`);
        report.push(`- Duplicate Selectors: ${this.results.duplicates.selectors.length}\n`);
        
        report.push('IMPORT CHAIN (from main.css):');
        const mainImports = this.results.imports.filter(i => i.file === 'main.css');
        mainImports.forEach(imp => {
            report.push(`  → ${imp.imports}`);
        });
        report.push('');
        
        report.push('DUPLICATE CSS VARIABLES (with different values):');
        this.results.duplicates.variables.slice(0, 10).forEach(dup => {
            report.push(`\n  ${dup.name}:`);
            dup.definitions.forEach(def => {
                report.push(`    - ${def.file}: ${def.value}`);
            });
        });
        if (this.results.duplicates.variables.length > 10) {
            report.push(`  ... and ${this.results.duplicates.variables.length - 10} more\n`);
        }
        
        report.push('\nTOP DUPLICATE SELECTORS:');
        this.results.duplicates.selectors
            .sort((a, b) => b.files.length - a.files.length)
            .slice(0, 10)
            .forEach(dup => {
                report.push(`  ${dup.selector} (${dup.files.length} files)`);
                report.push(`    Files: ${dup.files.join(', ')}`);
            });
        
        report.push('\nFILE ANALYSIS:');
        this.results.files
            .sort((a, b) => b.lines - a.lines)
            .forEach(file => {
                report.push(`\n  ${file.name}:`);
                report.push(`    - Lines: ${file.lines}`);
                report.push(`    - Selectors: ${file.selectors.size}`);
                report.push(`    - Variables: ${file.variables.size}`);
                report.push(`    - Comments: ${file.commentedLines}`);
                if (file.imports.length > 0) {
                    report.push(`    - Imports: ${file.imports.join(', ')}`);
                }
            });
        
        // Write report to file
        const reportPath = path.join(__dirname, 'css-analysis-report.txt');
        fs.writeFileSync(reportPath, report.join('\n'));
        console.log(report.join('\n'));
        console.log(`\nReport saved to: ${reportPath}`);
        
        // Also save JSON for programmatic use
        const jsonPath = path.join(__dirname, 'css-analysis-data.json');
        fs.writeFileSync(jsonPath, JSON.stringify({
            stats: this.results.stats,
            duplicates: this.results.duplicates,
            files: this.results.files.map(f => ({
                name: f.name,
                lines: f.lines,
                selectors: f.selectors.size,
                variables: f.variables.size,
                imports: f.imports
            }))
        }, null, 2));
        console.log(`JSON data saved to: ${jsonPath}`);
    }
}

// Run the analyzer
const analyzer = new CSSAnalyzer();
analyzer.analyzeDirectory(path.join(__dirname, '..'));
