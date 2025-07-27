const searchUser = document.querySelector('.search-form');

const userRepoContent = document.querySelector('.repo-data');

// Adicione estas constantes no topo do arquivo
const usernameInput = document.querySelector('#username_input');
const suggestionList = document.querySelector('#suggestion-list');

// Função de debounce para evitar múltiplas requisições
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para buscar sugestões
async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://api.github.com/search/users?q=${query}&per_page=5`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        return [];
    }
}

// Função para mostrar os resultados
async function showResults(username) {
    resetForm();
    const userData = await getUserData(username);
    const userRepo = await getUserRepo(username);
    showUserData(userData, userRepo);
    suggestionList.classList.add('hidden');
}

// Função para renderizar as sugestões
function renderSuggestions(users) {
    suggestionList.innerHTML = '';
    
    if (users.length === 0) {
        suggestionList.classList.add('hidden');
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" class="suggestion-avatar">
            <span class="suggestion-username">${user.login}</span>
        `;
        
        li.addEventListener('click', () => {
            usernameInput.value = user.login;
            showResults(user.login);
        });
        
        suggestionList.appendChild(li);
    });
    
    suggestionList.classList.remove('hidden');
}

// Handler do input com debounce
const handleInput = debounce(async (e) => {
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        suggestionList.classList.add('hidden');
        return;
    }
    
    const users = await fetchSuggestions(query);
    renderSuggestions(users);
}, 300);

// Event Listeners
usernameInput.addEventListener('input', handleInput);

// Fechar sugestões quando clicar fora
document.addEventListener('click', (e) => {
    if (!suggestionList.contains(e.target) && e.target !== usernameInput) {
        suggestionList.classList.add('hidden');
    }
});

// Função para buscar dados do usuário na API do GitHub
async function getUserData(username) {
    const response = await fetch(`https://api.github.com/users/${username}`)
    const data_profile = await response.json();
    return data_profile;
}

// Função para buscar repositórios do usuário na API do GitHub
async function getUserRepo(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
    const data_profile_repo = await response.json();
    return data_profile_repo;
}

// Função para exibir os dados do usuário e repositórios na interface
function showUserData(userData, userRepo) {
    document.querySelector('.container-data').classList.remove('hidden');
    document.querySelector('.profile-image').src = userData.avatar_url;
    document.querySelector('.profile-image').alt = userData.name;
    document.querySelector('.profile-name').textContent = userData.name || userData.login;
    document.querySelector('.profile-username').textContent = `@${userData.login}`;
    document.querySelector('.profile-bio').textContent = userData.bio || "Este usuário não possui uma biografia.";
    document.querySelector('.profile-followers').textContent = userData.followers || "0";
    document.querySelector('.profile-location').textContent = userData.location || "Localização não informada";
    document.querySelector('.profile-email').textContent = userData.email || "E-mail não informado";
    document.querySelector('.profile-link').textContent = userData.blog || "Blog não informado";

    userRepo.forEach(repo => {
        
        const userRepodiv = document.createElement('div')
        userRepodiv.classList.add('repo-info')

        const header = document.createElement('div')
        header.classList.add('header-repo')
        userRepodiv.appendChild(header)

        const iconRepo = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconRepo.setAttribute("aria-hidden", "true");
        iconRepo.setAttribute("height", "16");
        iconRepo.setAttribute("viewBox", "0 0 16 16");
        iconRepo.setAttribute("version", "1.1");
        iconRepo.setAttribute("width", "16");
        iconRepo.setAttribute("data-view-component", "true");
        iconRepo.setAttribute("fill", "#9198a1");
        iconRepo.classList.add('icon-repo');

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z");

        iconRepo.appendChild(path);
        header.appendChild(iconRepo)

        const repo_title = document.createElement('a')
        repo_title.classList.add('repo-name')
        repo_title.textContent = repo.name
        repo_title.href = repo.html_url
        repo_title.target = "_blank"
        header.appendChild(repo_title)

        const repo_visibility = document.createElement('span')
        repo_visibility.classList.add('repo-visibility')
        repo_visibility.textContent = repo.private ? "Privado" : "Público"
        header.appendChild(repo_visibility)

        const repo_description = document.createElement('p')
        repo_description.classList.add('repo-description')
        repo_description.textContent = repo.description || "Descrição do repositório"
        userRepodiv.appendChild(repo_description)

        const repo_Language = document.createElement('span');repo_Language.classList.add('repo-language')
        repo_Language.textContent = repo.language || "Linguagem não informada"
        userRepodiv.appendChild(repo_Language)
        userRepoContent.appendChild(userRepodiv);
        });

}
    function resetForm () {
        while (userRepoContent.firstChild) {
            userRepoContent.removeChild(userRepoContent.firstChild);
        }
    }

