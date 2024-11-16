// Modal Functions
function abrirModal() {
    document.getElementById('categoriaModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('categoriaModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('categoriaModal');
    if (event.target === modal) {
        fecharModal();
    }
}

// Filter content by category
function filtrarPorCategoria() {
    const categoria = document.getElementById('categoriaSelectModal').value;
    fecharModal();
    carregarConteudos(categoria);
}

// Render content card
function renderConteudo(conteudo) {
    const categoryIcons = {
        'videos': 'fa-video',
        'exercicios': 'fa-pencil-alt',
        'materia': 'fa-book',
        'avisos': 'fa-bell'
    };

    const icon = categoryIcons[conteudo.categoria] || 'fa-file';
    
    const conteudoHTML = `
        <div class="content-card" id="conteudo-${conteudo._id}">
            <div class="card-header">
                <i class="fas ${icon}"></i>
                <h2>${conteudo.titulo}</h2>
            </div>
            <p>${conteudo.descricao}</p>
            <a href="${conteudo.link}" target="_blank" class="content-link">
                <i class="fas fa-external-link-alt"></i> Acessar Conteúdo
            </a>
        </div>`;
    
    document.getElementById("conteudos").insertAdjacentHTML('beforeend', conteudoHTML);
}

// Clear content area
function limparConteudos() {
    document.getElementById("conteudos").innerHTML = "";
}

// Load and filter content
async function carregarConteudos(categoria = 'todas') {
    try {
        const response = await fetch('/conteudos');
        if (response.ok) {
            const conteudos = await response.json();
            limparConteudos();

            const conteudosFiltrados = categoria === 'todas' 
                ? conteudos 
                : conteudos.filter(conteudo => conteudo.categoria === categoria);

            if (conteudosFiltrados.length === 0) {
                document.getElementById("conteudos").innerHTML = `
                    <div class="no-content">
                        <i class="fas fa-search"></i>
                        <p>Nenhum conteúdo encontrado para esta categoria.</p>
                    </div>`;
                return;
            }

            conteudosFiltrados.forEach(conteudo => renderConteudo(conteudo));
        } else {
            console.error('Erro ao carregar conteúdos');
            document.getElementById("conteudos").innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Erro ao carregar os conteúdos. Por favor, tente novamente mais tarde.</p>
                </div>`;
        }
    } catch (error) {
        console.error('Erro ao carregar conteúdos:', error);
        document.getElementById("conteudos").innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Erro ao carregar os conteúdos. Por favor, verifique sua conexão e tente novamente.</p>
            </div>`;
    }
}

// Load content when page loads
window.onload = () => carregarConteudos();