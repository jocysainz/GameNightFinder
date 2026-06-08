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

    // 3. Connect dynamic DOM rendering for the game detail modal
    document.querySelector('.grid-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('details-btn')) {
            // In Week 7, this will fetch specific details. For now, it opens the modal.
            toggleModal(true);
        }
    });

    // Close modal logic
    document.querySelector('.close-btn').addEventListener('click', () => toggleModal(false));
});