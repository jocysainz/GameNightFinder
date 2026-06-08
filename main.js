import { fetchTopDeals, searchRawgGames, fetchGameDescription } from './api.js';
import { renderGameCards, toggleModal } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Initial Load & Home Button Logic
    const loadHomePage = async () => {
        document.getElementById('gameSearch').value = ''; // Clears the search bar
        const topDeals = await fetchTopDeals();
        renderGameCards(topDeals, '.grid-container', true);
    };

    // Run it immediately when the page loads
    await loadHomePage();

    // Run it again whenever someone clicks the main "GameNight Finder" title
    document.querySelector('.site-header h1').addEventListener('click', loadHomePage);

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
    document.querySelector('.grid-container').addEventListener('click', async (e) => {
        // Handle Modal
        if (e.target.classList.contains('details-btn')) {
            const card = e.target.closest('.game-card');
            const title = card.querySelector('h2').innerText;
            const price = card.querySelector('.price').innerText;

            const modalTitle = document.querySelector('.modal-content h2');
            const modalDesc = document.querySelector('.modal-content p:nth-of-type(1)');
            const modalLow = document.querySelector('.modal-content p:nth-of-type(2)');
            const modalStores = document.querySelector('.modal-content p:nth-of-type(3)');

            modalTitle.innerText = title;
            modalDesc.innerHTML = `<strong>Description:</strong> Fetching details...`;
            modalLow.innerHTML = `<strong>Current Price:</strong> ${price}`;
            modalStores.style.display = 'block'; 
            modalStores.innerHTML = `<strong>Historical Low:</strong> Checking...`; 

            toggleModal(true);

            // Fetch Description from RAWG
            const description = await fetchGameDescription(title);
            modalDesc.innerHTML = `<strong>Description:</strong> ${description}`;

            // Fetch Historical Low from CheapShark
            try {
                const searchRes = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${title}&limit=1`);
                const searchData = await searchRes.json();
                if (searchData.length > 0) {
                    modalStores.innerHTML = `<strong>Historical Low:</strong> $${searchData[0].cheapest}`;
                } else {
                    modalStores.innerHTML = `<strong>Historical Low:</strong> Data unavailable`;
                }
            } catch (err) {
                modalStores.innerHTML = `<strong>Historical Low:</strong> Data unavailable`;
            }
        }
        
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