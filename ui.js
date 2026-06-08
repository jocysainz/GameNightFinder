export function renderGameCards(games, containerId, isDeal = false) {
    const container = document.querySelector(containerId);
    container.innerHTML = ''; 

    // Check localStorage for saved games
    const wishlist = JSON.parse(localStorage.getItem('gamenight_wishlist') || '[]');

    if (games.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%;">No games found.</p>';
        return;
    }

    games.forEach(game => {
        const title = isDeal ? game.title : game.name;
        const price = isDeal ? `$${game.salePrice}` : 'Check Stores';
        const image = isDeal ? game.thumb : game.background_image;
        
        // Check if this specific game is already saved
        const isSaved = wishlist.some(item => item.title === title);

        const article = document.createElement('article');
        article.className = 'game-card';
        article.innerHTML = `
            ${isDeal && parseFloat(game.savings) > 50 ? '<span class="deal-badge">50%+ OFF!</span>' : ''}
            <button class="wishlist-btn" data-title="${title}" data-price="${price}" data-image="${image}" aria-label="Save to wishlist">
                ${isSaved ? '★ Remove' : '☆ Save'}
            </button>
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