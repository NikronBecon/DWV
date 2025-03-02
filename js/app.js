// Global variables
let films = [];
let filteredFilms = [];

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Load films data
async function loadFilms() {
    try {
        const response = await fetch('.data/movies.json');
        films = await response.json();
        filteredFilms = [...films];
        
        // Populate year filter
        const years = [...new Set(films.map(film => film.release_year))].sort((a, b) => b - a);
        const yearFilter = document.getElementById('yearFilter');
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        displayFilms(films);
    } catch (error) {
        console.error('Error loading films:', error);
        const container = document.getElementById('filmsContainer');
        container.innerHTML = '<div class="error-message">Error loading film data. Please try again later.</div>';
    }
}

// Display films
function displayFilms(filmsToDisplay) {
    const container = document.getElementById('filmsContainer');
    const template = document.getElementById('filmCardTemplate');
    container.innerHTML = '';
    
    filmsToDisplay.forEach(film => {
        const card = template.content.cloneNode(true);
        
        card.querySelector('.film-title').textContent = film.title;
        card.querySelector('.year').textContent = `Year: ${film.release_year}`;
        card.querySelector('.director').textContent = `Director: ${film.director}`;
        card.querySelector('.box-office').textContent = `Box Office: ${formatCurrency(film.box_office)}`;
        card.querySelector('.country').textContent = `Country: ${film.country}`;
        
        container.appendChild(card);
    });
}

// Filter films
function filterFilms() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedYear = document.getElementById('yearFilter').value;
    
    filteredFilms = films.filter(film => {
        const matchesSearch = film.title.toLowerCase().includes(searchTerm) ||
                            film.director.toLowerCase().includes(searchTerm) ||
                            film.country.toLowerCase().includes(searchTerm);
        const matchesYear = !selectedYear || film.release_year.toString() === selectedYear;
        
        return matchesSearch && matchesYear;
    });
    
    displayFilms(filteredFilms);
}

// Sort films
function sortFilms(key) {
    filteredFilms.sort((a, b) => {
        if (key === 'box_office') {
            return b[key] - a[key];
        }
        if (key === 'release_year') {
            return b[key] - a[key];
        }
        return a[key].localeCompare(b[key]);
    });
    
    displayFilms(filteredFilms);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadFilms();
    
    document.getElementById('searchInput').addEventListener('input', filterFilms);
    document.getElementById('yearFilter').addEventListener('change', filterFilms);
    
    document.getElementById('sortTitle').addEventListener('click', () => sortFilms('title'));
    document.getElementById('sortYear').addEventListener('click', () => sortFilms('release_year'));
    document.getElementById('sortRevenue').addEventListener('click', () => sortFilms('box_office'));
}); 
