// Toggle post creation modal
function mostrarFormulario() {
    const modal = document.getElementById("postModal");
    modal.style.display = modal.style.display === "none" ? "flex" : "none";
    if (modal.style.display === "none") {
        document.getElementById("titulo").value = "";
        document.getElementById("conteudo").value = "";
    }
}

// Toggle reply modal
function mostrarFormularioResposta(id = null) {
    postIdParaResponder = id;
    const modal = document.getElementById("respostaModal");
    modal.style.display = modal.style.display === "none" ? "flex" : "none";
    if (modal.style.display === "none") {
        document.getElementById("respostaConteudo").value = "";
    }
}

// Create new post
async function criarPost(event) {
    event.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const conteudo = document.getElementById("conteudo").value;

    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, conteudo })
        });

        if (response.ok) {
            const post = await response.json();
            renderPost(post);
            mostrarFormulario();
        } else {
            showError('Erro ao criar post');
        }
    } catch (error) {
        console.error('Erro ao criar post:', error);
        showError('Erro ao criar post. Tente novamente mais tarde.');
    }
}

// Render a post
function renderPost(post) {
    const respostasHTML = post.respostas.map(resposta => `
        <div class="resposta">
            <p>${resposta.conteudo}</p>
        </div>
    `).join('');

    const postHTML = `
        <div class="post" id="post-${post._id}">
            <h2>${post.titulo}</h2>
            <div class="post-content">${post.conteudo}</div>
            <div class="post-actions">
                <button onclick="mostrarFormularioResposta('${post._id}')" class="btn btn-primary">
                    <i class="fas fa-reply"></i> Responder
                </button>
            </div>
            <div id="respostas-${post._id}" class="respostas-container">
                ${respostasHTML}
            </div>
        </div>`;

    document.getElementById("posts").insertAdjacentHTML('afterbegin', postHTML);
}

// Submit reply
async function enviarResposta(event) {
    event.preventDefault();
    const conteudo = document.getElementById("respostaConteudo").value;

    if (postIdParaResponder && conteudo) {
        try {
            const response = await fetch(`/posts/${postIdParaResponder}/responder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ conteudo })
            });

            if (response.ok) {
                const respostaData = await response.json();
                const respostaHTML = `
                    <div class="resposta">
                        <p>${respostaData.conteudo}</p>
                    </div>`;
                document.getElementById(`respostas-${postIdParaResponder}`).insertAdjacentHTML('beforeend', respostaHTML);
                mostrarFormularioResposta();
            } else {
                showError('Erro ao responder post');
            }
        } catch (error) {
            console.error('Erro ao responder post:', error);
            showError('Erro ao enviar resposta. Tente novamente mais tarde.');
        }
    }
}

// Load posts
async function carregarPosts() {
    try {
        const response = await fetch('/posts');
        if (response.ok) {
            const posts = await response.json();
            posts.forEach(post => renderPost(post));
        } else {
            showError('Erro ao carregar posts');
        }
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        showError('Erro ao carregar posts. Verifique sua conexão.');
    }
}

// Show error message
function showError(message) {
    alert(message);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const postModal = document.getElementById("postModal");
    const respostaModal = document.getElementById("respostaModal");
    
    if (event.target === postModal) {
        mostrarFormulario();
    }
    if (event.target === respostaModal) {
        mostrarFormularioResposta();
    }
}

// Initialize
window.onload = carregarPosts;