const RAWG_API_KEY = '452ddf18ca864f459fef8ddb99851963'; 

export async function fetchTopDeals() {
    try {
        // Fetches deals from CheapShark (Store 1 is Steam as an example)
        const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15');
        const data = await response.json();
        return data.slice(0, 8); // Return top 8 deals for the grid
    } catch (error) {
        console.error("Error fetching deals:", error);
        return [];
    }
}

export async function searchRawgGames(query) {
    try {
        // Fetches game data from RAWG based on user search
        const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${query}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error searching games:", error);
        return [];
    }
}

export async function fetchGameDescription(title) {
    try {
        // 1. Search RAWG for the game by its title
        const searchRes = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${title}`);
        const searchData = await searchRes.json();
        
        if (searchData.results.length > 0) {
            const gameId = searchData.results[0].id;
            // 2. Fetch the specific game details using its ID to get the description
            const detailsRes = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`);
            const detailsData = await detailsRes.json();
            return detailsData.description_raw || "No description available.";
        }
        return "Game description not found.";
    } catch (error) {
        console.error("Error fetching description:", error);
        return "Could not load description.";
    }
}