// Tournament Data Integration Module
// Handles Google Sheets data, real-time updates, and table management

class TournamentDataManager {
    constructor(config = {}) {
        this.config = {
            sheetyUrl: config.sheetyUrl || null,
            googleSheetsId: config.googleSheetsId || null,
            apiKey: config.apiKey || null,
            updateInterval: config.updateInterval || 30000, // 30 seconds
            ...config
        };
        
        this.data = {
            standings: [],
            schedule: [],
            results: []
        };
        
        this.filters = {
            division: 'all',
            series: 'prs'
        };
        
        this.lastUpdate = null;
        this.updateTimer = null;
    }
    
    // Initialize the data manager
    async init() {
        try {
            // Load initial data
            await this.loadAllData();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start auto-updates
            this.startAutoUpdate();
            
            // Render initial view
            this.renderCurrentView();
            
        } catch (error) {
            console.error('Failed to initialize tournament data:', error);
            this.showError('Unable to load tournament data. Please try again later.');
        }
    }
    
    // Load all data from the configured source
    async loadAllData() {
        const loading = this.showLoading();
        
        try {
            if (this.config.sheetyUrl) {
                await this.loadFromSheety();
            } else if (this.config.googleSheetsId) {
                await this.loadFromGoogleSheets();
            } else {
                // Use demo data if no source configured
                this.loadDemoData();
            }
            
            this.lastUpdate = new Date();
            this.updateLastUpdateTime();
            
        } finally {
            loading.remove();
        }
    }
    
    // Load data from Sheety API
    async loadFromSheety() {
        const [standings, schedule, results] = await Promise.all([
            fetch(`${this.config.sheetyUrl}/standings`).then(r => r.json()),
            fetch(`${this.config.sheetyUrl}/schedule`).then(r => r.json()),
            fetch(`${this.config.sheetyUrl}/results`).then(r => r.json())
        ]);
        
        this.data.standings = standings.standings || [];
        this.data.schedule = schedule.schedule || [];
        this.data.results = results.results || [];
    }
    
    // Load data from Google Sheets API
    async loadFromGoogleSheets() {
        const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
        const ranges = ['Standings!A2:H100', 'Schedule!A2:G50', 'Results!A2:F50'];
        
        const responses = await Promise.all(
            ranges.map(range => 
                fetch(`${baseUrl}/${this.config.googleSheetsId}/values/${range}?key=${this.config.apiKey}`)
                    .then(r => r.json())
            )
        );
        
        // Parse the raw data into structured format
        this.data.standings = this.parseStandingsData(responses[0].values || []);
        this.data.schedule = this.parseScheduleData(responses[1].values || []);
        this.data.results = this.parseResultsData(responses[2].values || []);
    }
    
    // Parse raw standings data
    parseStandingsData(rows) {
        return rows.map((row, index) => ({
            rank: index + 1,
            name: row[0],
            division: row[1],
            match1: parseFloat(row[2]) || 0,
            match2: parseFloat(row[3]) || 0,
            match3: parseFloat(row[4]) || 0,
            total: parseFloat(row[5]) || 0,
            average: parseFloat(row[6]) || 0
        }));
    }
    
    // Parse raw schedule data
    parseScheduleData(rows) {
        return rows.map(row => ({
            date: row[0],
            match: row[1],
            location: row[2],
            series: row[3],
            status: row[4],
            maxSlots: parseInt(row[5]) || 0,
            registered: parseInt(row[6]) || 0
        }));
    }
    
    // Parse raw results data
    parseResultsData(rows) {
        return rows.map(row => ({
            match: row[0],
            date: row[1],
            winner: row[2],
            division: row[3],
            score: row[4],
            link: row[5]
        }));
    }
    
    // Load demo data for development
    loadDemoData() {
        this.data.standings = [
            { rank: 1, name: 'Jón Gunnarsson', division: 'Open', match1: 97.5, match2: 95.25, match3: 98, total: 290.75, average: 96.92 },
            { rank: 2, name: 'Ólafur Þórsson', division: 'Open', match1: 94, match2: 96.5, match3: 94.75, total: 285.25, average: 95.08 },
            { rank: 3, name: 'Guðrún Sigurðardóttir', division: 'Production', match1: 92.75, match2: 93, match3: 95.5, total: 281.25, average: 93.75 },
            { rank: 4, name: 'Magnús Stefánsson', division: 'Tactical', match1: 91.5, match2: 92.25, match3: 93, total: 276.75, average: 92.25 },
            { rank: 5, name: 'Sigríður Jónsdóttir', division: 'Production', match1: 89.75, match2: 91, match3: 92.5, total: 273.25, average: 91.08 }
        ];
        
        this.data.schedule = [
            { date: '15. mars 2025', match: 'Spring Classic', location: 'Akureyri Shooting Range', series: 'PRS', status: 'open', maxSlots: 60, registered: 24 },
            { date: '12. apríl 2025', match: 'Northern Challenge', location: 'Reykjavík Range', series: 'PRS/PR22', status: 'upcoming', maxSlots: 80, registered: 0 },
            { date: '10. maí 2025', match: 'Midnight Sun Match', location: 'Westfjords Range', series: 'PRS', status: 'upcoming', maxSlots: 50, registered: 0 }
        ];
        
        this.data.results = [
            { match: 'Winter Series Final', date: '20. janúar 2025', winner: 'Jón Gunnarsson', division: 'Open', score: '184/200', link: '#' },
            { match: 'New Year Precision', date: '6. janúar 2025', winner: 'Ólafur Þórsson', division: 'Open', score: '176/200', link: '#' }
        ];
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.data-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target));
        });
        
        // Filter changes
        const divisionFilter = document.getElementById('division-filter');
        const seriesFilter = document.getElementById('series-filter');
        
        if (divisionFilter) {
            divisionFilter.addEventListener('change', (e) => {
                this.filters.division = e.target.value;
                this.renderStandings();
            });
        }
        
        if (seriesFilter) {
            seriesFilter.addEventListener('change', (e) => {
                this.filters.series = e.target.value;
                this.renderStandings();
            });
        }
    }
    
    // Switch between data tabs
    switchTab(tabElement) {
        // Update tab states
        document.querySelectorAll('.data-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        tabElement.classList.add('active');
        
        // Update content visibility
        document.querySelectorAll('.data-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabName = tabElement.getAttribute('data-tab');
        const contentElement = document.getElementById(`${tabName}-content`);
        if (contentElement) {
            contentElement.classList.add('active');
            
            // Render appropriate content
            switch (tabName) {
                case 'standings':
                    this.renderStandings();
                    break;
                case 'schedule':
                    this.renderSchedule();
                    break;
                case 'results':
                    this.renderResults();
                    break;
            }
        }
    }
    
    // Render current view based on active tab
    renderCurrentView() {
        const activeTab = document.querySelector('.data-tab.active');
        if (activeTab) {
            this.switchTab(activeTab);
        }
    }
    
    // Render standings table
    renderStandings() {
        const tbody = document.getElementById('standings-tbody');
        if (!tbody) return;
        
        // Filter data
        let filteredData = this.data.standings;
        if (this.filters.division !== 'all') {
            filteredData = filteredData.filter(row => 
                row.division.toLowerCase() === this.filters.division.toLowerCase()
            );
        }
        
        // Generate HTML
        tbody.innerHTML = filteredData.map(row => `
            <tr>
                <td class="rank ${this.getRankClass(row.rank)}">${row.rank}</td>
                <td>${this.escapeHtml(row.name)}</td>
                <td>${this.escapeHtml(row.division)}</td>
                <td class="numeric">${row.match1.toFixed(3)}</td>
                <td class="numeric">${row.match2.toFixed(3)}</td>
                <td class="numeric">${row.match3.toFixed(3)}</td>
                <td class="numeric points">${row.total.toFixed(3)}</td>
                <td class="numeric">${row.average.toFixed(2)}%</td>
            </tr>
        `).join('');
    }
    
    // Render schedule table
    renderSchedule() {
        const scheduleContent = document.getElementById('schedule-content');
        const table = scheduleContent.querySelector('tbody');
        if (!table) return;
        
        table.innerHTML = this.data.schedule.map(event => `
            <tr>
                <td>${this.escapeHtml(event.date)}</td>
                <td>${this.escapeHtml(event.match)}</td>
                <td>${this.escapeHtml(event.location)}</td>
                <td>${this.escapeHtml(event.series)}</td>
                <td>${this.getStatusBadge(event.status)}</td>
                <td class="numeric">${event.registered}/${event.maxSlots}</td>
            </tr>
        `).join('');
    }
    
    // Render results table
    renderResults() {
        const resultsContent = document.getElementById('results-content');
        const table = resultsContent.querySelector('tbody');
        if (!table) return;
        
        table.innerHTML = this.data.results.map(result => `
            <tr>
                <td>${this.escapeHtml(result.match)}</td>
                <td>${this.escapeHtml(result.date)}</td>
                <td>${this.escapeHtml(result.winner)}</td>
                <td>${this.escapeHtml(result.division)}</td>
                <td class="numeric">${this.escapeHtml(result.score)}</td>
                <td><a href="${this.escapeHtml(result.link)}" style="color: #4CAF50;">View Results</a></td>
            </tr>
        `).join('');
    }
    
    // Get rank class for styling
    getRankClass(rank) {
        switch (rank) {
            case 1: return 'gold';
            case 2: return 'silver';
            case 3: return 'bronze';
            default: return '';
        }
    }
    
    // Get status badge HTML
    getStatusBadge(status) {
        const badges = {
            open: '<span class="status-badge open">Registration Open</span>',
            closed: '<span class="status-badge closed">Registration Closed</span>',
            upcoming: '<span class="status-badge upcoming">Upcoming</span>'
        };
        return badges[status] || status;
    }
    
    // Start auto-update timer
    startAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        this.updateTimer = setInterval(() => {
            this.checkForUpdates();
        }, this.config.updateInterval);
    }
    
    // Check for data updates
    async checkForUpdates() {
        try {
            const oldData = JSON.stringify(this.data);
            await this.loadAllData();
            const newData = JSON.stringify(this.data);
            
            if (oldData !== newData) {
                this.showUpdateNotification();
                this.renderCurrentView();
            }
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    }
    
    // Update last update time display
    updateLastUpdateTime() {
        const element = document.getElementById('last-update');
        if (!element) return;
        
        const now = new Date();
        const diff = Math.floor((now - this.lastUpdate) / 1000 / 60); // minutes
        
        if (diff < 1) {
            element.textContent = 'Just now';
        } else if (diff === 1) {
            element.textContent = '1 minute ago';
        } else {
            element.textContent = `${diff} minutes ago`;
        }
    }
    
    // Show update notification
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Standings updated</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Show loading indicator
    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'table-loading';
        loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading tournament data...';
        
        const activeContent = document.querySelector('.data-content.active');
        if (activeContent) {
            const table = activeContent.querySelector('.standings-table');
            if (table) {
                table.appendChild(loading);
            }
        }
        
        return loading;
    }
    
    // Show error message
    showError(message) {
        const error = document.createElement('div');
        error.className = 'data-error';
        error.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        const activeContent = document.querySelector('.data-content.active');
        if (activeContent) {
            activeContent.appendChild(error);
        }
    }
    
    // Escape HTML for security
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.toString().replace(/[&<>"']/g, m => map[m]);
    }
    
    // Destroy and cleanup
    destroy() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
    }
}

// Export for use
window.TournamentDataManager = TournamentDataManager;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with tournament data
    if (document.querySelector('.data-section')) {
        // Initialize with configuration
        const dataManager = new TournamentDataManager({
            // Configure based on your setup
            // sheetyUrl: 'https://api.sheety.co/YOUR_PROJECT_ID',
            // googleSheetsId: 'YOUR_SHEET_ID',
            // apiKey: 'YOUR_API_KEY',
            updateInterval: 30000 // 30 seconds
        });
        
        // Start the data manager
        dataManager.init();
        
        // Make it globally accessible for debugging
        window.tournamentData = dataManager;
    }
});
