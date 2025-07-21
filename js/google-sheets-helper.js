// Google Sheets Data Fetcher Utility
// This utility helps fetch and parse data from published Google Sheets

class GoogleSheetsHelper {
    constructor() {
        this.corsProxy = 'https://corsproxy.io/?'; // Public CORS proxy
    }
    
    // Extract sheet ID from various Google Sheets URL formats
    extractSheetId(url) {
        const patterns = [
            /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
            /\/d\/([a-zA-Z0-9-_]+)/,
            /spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        
        return null;
    }
    
    // Convert published URL to CSV export URL
    getCSVUrl(publishedUrl) {
        // For published sheets with 2PACX IDs, we need a different approach
        if (publishedUrl.includes('2PACX')) {
            // Try to convert to CSV export format
            return publishedUrl
                .replace('/pubhtml', '/pub')
                .replace('?gid=', '?format=csv&gid=')
                .replace('&single=true', '');
        }
        
        // For regular sheet IDs
        const sheetId = this.extractSheetId(publishedUrl);
        if (sheetId) {
            const gidMatch = publishedUrl.match(/[#&]gid=([0-9]+)/);
            const gid = gidMatch ? gidMatch[1] : '0';
            return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        }
        
        return null;
    }
    
    // Parse CSV data into array of objects
    parseCSV(csvText, hasHeaders = true) {
        const lines = csvText.split(/\r?\n/);
        const result = [];
        let headers = [];
        
        // Simple CSV parser (handles basic cases)
        const parseLine = (line) => {
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            
            values.push(current.trim());
            return values;
        };
        
        lines.forEach((line, index) => {
            if (!line.trim()) return;
            
            const values = parseLine(line);
            
            if (index === 0 && hasHeaders) {
                headers = values;
            } else if (hasHeaders) {
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header] = values[i] || '';
                });
                result.push(obj);
            } else {
                result.push(values);
            }
        });
        
        return result;
    }
    
    // Fetch data from Google Sheets
    async fetchSheetData(url, options = {}) {
        const csvUrl = this.getCSVUrl(url);
        if (!csvUrl) {
            throw new Error('Could not parse Google Sheets URL');
        }
        
        try {
            // Try direct fetch first
            let response = await fetch(csvUrl);
            
            // If CORS error, try with proxy
            if (!response.ok) {
                response = await fetch(this.corsProxy + encodeURIComponent(csvUrl));
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            return this.parseCSV(text, options.hasHeaders !== false);
            
        } catch (error) {
            console.error('Error fetching sheet data:', error);
            throw error;
        }
    }
    
    // Format date for display (Icelandic format)
    formatDate(dateStr) {
        if (!dateStr) return '';
        
        const months = [
            'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
            'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
        ];
        
        try {
            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr;
            
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            
            return `${day}. ${month} ${year}`;
        } catch {
            return dateStr;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheetsHelper;
}