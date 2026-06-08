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