// PRS Iceland Data Configuration
// This file contains mappings for various Google Docs/Sheets used by the site

const PRS_DATA_SOURCES = {
    // Annual Schedule
    arsyfirlit: {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJ5WzDN2v2gU1y7Vp-l2G19iNDC8zA1uBNTbCx9Vv8Ph4A3zgE_-6k6Vh-3yib3X_47kzyqf-Gt0-V/pubhtml?gid=0&single=true',
        type: 'googleSheets',
        fallbackEmbed: true,
        columns: [
            { key: 'date', label: 'Dagsetning', type: 'date' },
            { key: 'event', label: 'Viðburður', type: 'text' },
            { key: 'type', label: 'Tegund', type: 'category' },
            { key: 'location', label: 'Staðsetning', type: 'text' },
            { key: 'info', label: 'Upplýsingar', type: 'text' }
        ]
    },
    
    // Competition Results 2024
    urslit2024: {
        url: 'YOUR_GOOGLE_SHEET_URL_HERE',
        type: 'googleSheets',
        fallbackEmbed: true,
        columns: [
            { key: 'competition', label: 'Mót', type: 'text' },
            { key: 'date', label: 'Dagsetning', type: 'date' },
            { key: 'winner', label: 'Sigurvegari', type: 'text' },
            { key: 'participants', label: 'Þátttakendur', type: 'number' }
        ]
    },
    
    // Member Directory
    members: {
        url: 'YOUR_GOOGLE_SHEET_URL_HERE',
        type: 'googleSheets',
        fallbackEmbed: false,
        columns: [
            { key: 'name', label: 'Nafn', type: 'text' },
            { key: 'club', label: 'Félag', type: 'text' },
            { key: 'category', label: 'Flokkur', type: 'category' }
        ]
    }
};

// Helper function to get data source configuration
function getDataSource(key) {
    return PRS_DATA_SOURCES[key] || null;
}

// Helper function to create a table from data
function createDataTable(data, columns, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create table
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.label;
        th.dataset.key = col.key;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        
        columns.forEach(col => {
            const td = document.createElement('td');
            const value = row[col.key] || '';
            
            // Format based on type
            switch (col.type) {
                case 'date':
                    td.textContent = formatIcelandicDate(value);
                    td.className = 'date-cell';
                    break;
                case 'category':
                    const span = document.createElement('span');
                    span.className = `category-badge ${value.toLowerCase().replace(/\s+/g, '-')}`;
                    span.textContent = value;
                    td.appendChild(span);
                    break;
                case 'number':
                    td.textContent = value;
                    td.className = 'number-cell';
                    break;
                default:
                    td.textContent = value;
            }
            
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    // Clear container and add table
    container.innerHTML = '';
    container.appendChild(table);
}

// Format date in Icelandic format
function formatIcelandicDate(dateStr) {
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