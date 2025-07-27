const searchUser = document.querySelector('.search-form');

const userRepoContent = document.querySelector('.repo-data');

searchUser.addEventListener('submit', async (event) => {
    //Previne o comportamento padrão do formulário
    event.preventDefault()
    //Reseta o conteúdo dos repositórios
    resetForm()
    //Seleciona o input de username e busca os dados do usuário
    const username = event.target.querySelector('#username_input').value;
    const userData = await getUserData(username);
    const userRepo = await getUserRepo(username);
    //Exibe os dados do usuário e os repositórios
    showUserData(userData, userRepo);
    //Reseta o formulário
    console.log(userData);
    console.log(userRepo);
});

async function getUserData(username) {
    //Busca os dados do usuário na API do GitHub
    const response = await fetch(`https://api.github.com/users/${username}`)
    //Extrai os dados do usuário em formato JSON
    const data_profile = await response.json();
    return data_profile;
}

async function getUserRepo(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
    const data_profile_repo = await response.json();
    return data_profile_repo;
}

function showUserData(userData, userRepo) {
    //Removendo a classe 'hidden' para exibir os dados do usuário
    document.querySelector('.container-data').classList.remove('hidden');
    //Recolhendo os dados relevantes do usuário
    document.querySelector('.profile-image').src = userData.avatar_url;
    document.querySelector('.profile-image').alt = userData.name;
    document.querySelector('.profile-name').textContent = userData.name || userData.login;
    document.querySelector('.profile-username').textContent = `@${userData.login}`;
    document.querySelector('.profile-bio').textContent = userData.bio || "Este usuário não possui uma biografia.";
    document.querySelector('.profile-followers').textContent = userData.followers || "0";
    document.querySelector('.profile-location').textContent = userData.location || "Localização não informada";
    document.querySelector('.profile-email').textContent = userData.email || "E-mail não informado";
    document.querySelector('.profile-link').textContent = userData.blog || "Blog não informado";

    //Criando a estrutura para exibir os repositórios do usuário
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