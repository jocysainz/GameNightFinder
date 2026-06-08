export function renderGameCards(games, containerId, isDeal = false) {
    const container = document.querySelector(containerId);
    container.innerHTML = ''; // Clear out the static placeholders

    games.forEach(game => {
        const title = isDeal ? game.title : game.name;
        const price = isDeal ? `$${game.salePrice}` : 'Check Stores';
        const image = isDeal ? game.thumb : game.background_image;

        const article = document.createElement('article');
        article.className = 'game-card';
        article.innerHTML = `
            <img src="${image || 'https://via.placeholder.com/300x150'}" alt="${title}">
            <div class="card-content">
                <h2>${title}</h2>
                <p class="price">${price}</p>
                <button class="details-btn" data-id="${isDeal ? game.dealID : game.id}">View Details</button>
            </div>
        `;
        container.appendChild(article);
    });
}

export function toggleModal(show) {
    const modal = document.getElementById('gameModal');
    modal.style.display = show ? 'flex' : 'none';
}