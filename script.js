// Dados simulados de partidas de futebol
const sampleMatches = [
    {
        id: 1,
        league: "Brasileirão Série A",
        homeTeam: "Flamengo",
        awayTeam: "Palmeiras",
        homeScore: 2,
        awayScore: 1,
        status: "live",
        minute: 78,
        events: [
            { type: "goal", minute: 23, team: "home", player: "Gabriel" },
            { type: "goal", minute: 45, team: "away", player: "Rony" },
            { type: "goal", minute: 67, team: "home", player: "Pedro" },
            { type: "card", minute: 34, team: "away", player: "Gustavo Gómez" },
        ]
    },
    {
        id: 2,
        league: "Premier League",
        homeTeam: "Manchester City",
        awayTeam: "Liverpool",
        homeScore: 0,
        awayScore: 0,
        status: "live",
        minute: 23,
        events: [
            { type: "card", minute: 18, team: "home", player: "Rodri" },
        ]
    },
    {
        id: 3,
        league: "La Liga",
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        homeScore: 3,
        awayScore: 1,
        status: "finished",
        minute: 90,
        events: [
            { type: "goal", minute: 12, team: "home", player: "Benzema" },
            { type: "goal", minute: 28, team: "away", player: "Lewandowski" },
            { type: "goal", minute: 56, team: "home", player: "Vinícius Jr." },
            { type: "goal", minute: 89, team: "home", player: "Modric" },
            { type: "card", minute: 45, team: "away", player: "Busquets" },
            { type: "red-card", minute: 78, team: "away", player: "Araujo" },
        ]
    },
    {
        id: 4,
        league: "Brasileirão Série A",
        homeTeam: "São Paulo",
        awayTeam: "Corinthians",
        homeScore: 1,
        awayScore: 1,
        status: "finished",
        minute: 90,
        events: [
            { type: "goal", minute: 34, team: "home", player: "Calleri" },
            { type: "goal", minute: 67, team: "away", player: "Yuri Alberto" },
            { type: "card", minute: 23, team: "home", player: "Igor Gomes" },
            { type: "card", minute: 78, team: "away", player: "Fausto Vera" },
        ]
    },
    {
        id: 5,
        league: "Serie A",
        homeTeam: "Juventus",
        awayTeam: "Inter Milan",
        homeScore: null,
        awayScore: null,
        status: "scheduled",
        minute: null,
        scheduledTime: "20:45",
        events: []
    },
    {
        id: 6,
        league: "Bundesliga",
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        homeScore: null,
        awayScore: null,
        status: "scheduled",
        minute: null,
        scheduledTime: "16:30",
        events: []
    }
];

// Estado da aplicação
let currentTab = 'live';
let lastUpdateTime = new Date();

// Elementos DOM
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const lastUpdateElement = document.getElementById('last-update-time');
const refreshIcon = document.getElementById('refresh-icon');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadMatches();
    startAutoRefresh();
    updateLastUpdateTime();
});

// Configuração das abas
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Atualizar botões
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Atualizar conteúdo
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabId}-content`).classList.add('active');
    
    currentTab = tabId;
    renderMatches();
}

// Carregamento de dados
function loadMatches() {
    showLoading(true);
    hideError();
    
    // Simular delay de carregamento
    setTimeout(() => {
        try {
            renderMatches();
            showLoading(false);
            lastUpdateTime = new Date();
            updateLastUpdateTime();
        } catch (error) {
            showError();
            showLoading(false);
        }
    }, 1000);
}

function renderMatches() {
    const container = document.getElementById(`${currentTab}-matches`);
    const filteredMatches = filterMatchesByTab(currentTab);
    
    if (filteredMatches.length === 0) {
        container.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-futbol"></i>
                <h3>Nenhuma partida encontrada</h3>
                <p>Não há jogos ${getTabDescription(currentTab)} no momento.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredMatches.map(match => createMatchCard(match)).join('');
}

function filterMatchesByTab(tab) {
    switch (tab) {
        case 'live':
            return sampleMatches.filter(match => match.status === 'live');
        case 'today':
            return sampleMatches.filter(match => match.status === 'scheduled');
        case 'finished':
            return sampleMatches.filter(match => match.status === 'finished');
        default:
            return sampleMatches;
    }
}

function getTabDescription(tab) {
    switch (tab) {
        case 'live': return 'ao vivo';
        case 'today': return 'agendados para hoje';
        case 'finished': return 'finalizados';
        default: return '';
    }
}

function createMatchCard(match) {
    const statusClass = match.status === 'live' ? 'live' : match.status === 'finished' ? 'finished' : '';
    const statusText = getStatusText(match);
    const scoreDisplay = getScoreDisplay(match);
    const timeDisplay = getTimeDisplay(match);
    const eventsHtml = createEventsHtml(match.events);
    
    return `
        <div class="match-card ${statusClass}">
            <div class="match-header">
                <div class="league-info">
                    <i class="fas fa-trophy"></i> ${match.league}
                </div>
                <div class="match-status ${getStatusClass(match.status)}">
                    ${statusText}
                </div>
            </div>
            
            <div class="match-teams">
                <div class="team home">
                    <div class="team-logo">
                        ${getTeamInitials(match.homeTeam)}
                    </div>
                    <div class="team-name">${match.homeTeam}</div>
                </div>
                
                <div class="score-container">
                    <div class="score">${scoreDisplay}</div>
                    <div class="match-time">${timeDisplay}</div>
                </div>
                
                <div class="team away">
                    <div class="team-name">${match.awayTeam}</div>
                    <div class="team-logo">
                        ${getTeamInitials(match.awayTeam)}
                    </div>
                </div>
            </div>
            
            ${eventsHtml ? `<div class="match-events">${eventsHtml}</div>` : ''}
        </div>
    `;
}

function getStatusText(match) {
    switch (match.status) {
        case 'live': return `${match.minute}'`;
        case 'finished': return 'Finalizado';
        case 'scheduled': return match.scheduledTime || 'Agendado';
        default: return '';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'live': return 'status-live';
        case 'finished': return 'status-finished';
        case 'scheduled': return 'status-scheduled';
        default: return '';
    }
}

function getScoreDisplay(match) {
    if (match.homeScore !== null && match.awayScore !== null) {
        return `${match.homeScore} - ${match.awayScore}`;
    }
    return 'vs';
}

function getTimeDisplay(match) {
    if (match.status === 'live') {
        return 'AO VIVO';
    } else if (match.status === 'scheduled') {
        return match.scheduledTime || '';
    }
    return '';
}

function getTeamInitials(teamName) {
    return teamName.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 3)
        .toUpperCase();
}

function createEventsHtml(events) {
    if (!events || events.length === 0) return '';
    
    return events.map(event => {
        const icon = getEventIcon(event.type);
        const eventClass = event.type === 'red-card' ? 'red-card' : event.type;
        
        return `
            <div class="event ${eventClass}">
                <i class="${icon}"></i>
                <span>${event.minute}' ${event.player}</span>
            </div>
        `;
    }).join('');
}

function getEventIcon(eventType) {
    switch (eventType) {
        case 'goal': return 'fas fa-futbol';
        case 'card': return 'fas fa-square';
        case 'red-card': return 'fas fa-square';
        default: return 'fas fa-circle';
    }
}

// Utilitários de UI
function showLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
}

function showError() {
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
        loadMatches(); // Tentar novamente
    }, 3000);
}

function hideError() {
    errorElement.style.display = 'none';
}

function updateLastUpdateTime() {
    const timeString = lastUpdateTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    lastUpdateElement.textContent = `Atualizado às ${timeString}`;
}

// Auto-refresh
function startAutoRefresh() {
    setInterval(() => {
        refreshIcon.classList.add('spinning');
        loadMatches();
        
        setTimeout(() => {
            refreshIcon.classList.remove('spinning');
        }, 1000);
    }, 60000); // Atualizar a cada 60 segundos
}

// Simular mudanças nos dados (para demonstração)
function simulateDataChanges() {
    setInterval(() => {
        // Atualizar minutos dos jogos ao vivo
        sampleMatches.forEach(match => {
            if (match.status === 'live' && match.minute < 90) {
                match.minute += Math.floor(Math.random() * 3) + 1;
                
                // Simular gols ocasionais
                if (Math.random() < 0.1) { // 10% de chance
                    const team = Math.random() < 0.5 ? 'home' : 'away';
                    if (team === 'home') {
                        match.homeScore++;
                    } else {
                        match.awayScore++;
                    }
                    
                    match.events.push({
                        type: 'goal',
                        minute: match.minute,
                        team: team,
                        player: 'Jogador ' + Math.floor(Math.random() * 11 + 1)
                    });
                }
                
                // Finalizar jogo se passou dos 90 minutos
                if (match.minute >= 90) {
                    match.status = 'finished';
                    match.minute = 90;
                }
            }
        });
        
        // Re-renderizar se estiver na aba ativa
        if (currentTab === 'live') {
            renderMatches();
        }
    }, 30000); // A cada 30 segundos
}

// Iniciar simulação de mudanças
simulateDataChanges();

