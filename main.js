import { fetchTopDeals, searchRawgGames } from './api.js';
import { renderGameCards, toggleModal } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load initial top deals on page load
    const topDeals = await fetchTopDeals();
    renderGameCards(topDeals, '.grid-container', true);

    // 2. Connect search bar input to RAWG API fetch function
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('gameSearch');

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
            const searchResults = await searchRawgGames(query);
            renderGameCards(searchResults, '.grid-container', false);
        }
    });

    // 3. UI Interactions (Modal & Wishlist)
    document.querySelector('.grid-container').addEventListener('click', (e) => {
        // Handle Modal
        if (e.target.classList.contains('details-btn')) toggleModal(true);
        
        // Handle Wishlist Save/Remove
        if (e.target.classList.contains('wishlist-btn')) {
            const btn = e.target;
            const gameData = {
                title: btn.dataset.title,
                salePrice: btn.dataset.price.replace('$', ''),
                thumb: btn.dataset.image
            };
            toggleWishlist(gameData, btn);
        }
    });

    // 4. View Wishlist UI
    document.getElementById('viewWishlistBtn').addEventListener('click', () => {
        const wishlist = JSON.parse(localStorage.getItem('gamenight_wishlist') || '[]');
        renderGameCards(wishlist, '.grid-container', true);
        document.querySelector('.grid-container').insertAdjacentHTML('afterbegin', '<h2 style="grid-column: 1/-1; color: var(--text-main);">My Saved Games</h2>');
    });

    document.querySelector('.close-btn').addEventListener('click', () => toggleModal(false));
});

// localStorage Logic
function toggleWishlist(game, btnElement) {
    let wishlist = JSON.parse(localStorage.getItem('gamenight_wishlist') || '[]');
    const existsIndex = wishlist.findIndex(item => item.title === game.title);

    if (existsIndex > -1) {
        wishlist.splice(existsIndex, 1); // Remove
        btnElement.innerHTML = '☆ Save';
    } else {
        wishlist.push(game); // Add
        btnElement.innerHTML = '★ Remove';
    }
    localStorage.setItem('gamenight_wishlist', JSON.stringify(wishlist));
}