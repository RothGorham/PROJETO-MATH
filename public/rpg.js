const phases = [
    {
        name: 'Linha Azul',
        subtitle: 'Os Desafios dos Trilhos Subterrâneos',
        icon: 'fa-binary',
        color: '#0066cc',
        missions: [
            {
                title: 'Sistemas de Numeração',
                description: 'Converta números entre sistemas diferentes para corrigir a numeração das plataformas.'
            },
            {
                title: 'Operações com Números Inteiros',
                description: 'Resolva problemas de operações básicas para liberar as áreas obstruídas.'
            }
        ]
    },
    {
        name: 'Linha Verde',
        subtitle: 'A Conexão Perdida',
        icon: 'fa-divide',
        color: '#00994d',
        missions: [
            {
                title: 'Frações e Suas Operações',
                description: 'Resolva problemas com frações para consertar as catracas das estações.'
            },
            {
                title: 'Números Decimais',
                description: 'Calcule corretamente os valores das passagens usando números decimais.'
            }
        ]
    },
    {
        name: 'Linha Amarela',
        subtitle: 'O Enigma do Tempo',
        icon: 'fa-clock',
        color: '#ffcc00',
        missions: [
            {
                title: 'Múltiplos e Divisores',
                description: 'Sincronize os horários dos trens calculando múltiplos e divisores.'
            },
            {
                title: 'Potenciação e Radiciação',
                description: 'Restaure o sistema elétrico resolvendo problemas de potências.'
            }
        ]
    },
    {
        name: 'Linha Vermelha',
        subtitle: 'A Crise da Energia',
        icon: 'fa-bolt',
        color: '#cc0000',
        missions: [
            {
                title: 'Transformação de Unidades',
                description: 'Converta unidades de energia para estabilizar o sistema.'
            },
            {
                title: 'Expressões Algébricas',
                description: 'Resolva expressões para restaurar o fornecimento de energia.'
            }
        ]
    },
    {
        name: 'Linha Lilás',
        subtitle: 'A Geometria dos Trilhos',
        icon: 'fa-shapes',
        color: '#9933cc',
        missions: [
            {
                title: 'Equações do 1º e 2º Grau',
                description: 'Alinhe as curvas dos trilhos resolvendo equações.'
            },
            {
                title: 'Sistema de Equações',
                description: 'Ajuste as interseções entre linhas usando sistemas de equações.'
            }
        ]
    },
    {
        name: 'Linha Prata',
        subtitle: 'O Labirinto Numérico',
        icon: 'fa-percentage',
        color: '#666666',
        missions: [
            {
                title: 'Razão, Proporção e Regra de Três',
                description: 'Redistribua os passageiros usando proporções.'
            },
            {
                title: 'Porcentagem',
                description: 'Ajuste as tarifas calculando variações percentuais.'
            }
        ]
    },
    {
        name: 'Linha Sacomã',
        subtitle: 'A Batalha Final nos Trilhos',
        icon: 'fa-trophy',
        color: '#ff9900',
        missions: [
            {
                title: 'Juros',
                description: 'Libere os fundos resolvendo problemas de juros.'
            },
            {
                title: 'O Desafio Final',
                description: 'Enfrente o último desafio combinando todos os conhecimentos.'
            }
        ]
    }
];

function createPhaseCard(phase) {
    return `
        <div class="phase-card">
            <div class="phase-header">
                <div class="phase-icon" style="background: ${phase.color}">
                    <i class="fas ${phase.icon}"></i>
                </div>
                <div class="phase-title">
                    <h3>${phase.name}</h3>
                    <p>${phase.subtitle}</p>
                </div>
            </div>
            <div class="phase-content">
                ${phase.missions.map(mission => `
                    <div class="mission">
                        <h4>${mission.title}</h4>
                        <p>${mission.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const phasesGrid = document.getElementById('phasesGrid');
    phasesGrid.innerHTML = phases.map(phase => createPhaseCard(phase)).join('');

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});