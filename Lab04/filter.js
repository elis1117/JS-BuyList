const searchInput = document.getElementById('search');
const resultsCountEl = document.getElementById('results-count');
const cards = document.querySelectorAll('.card');
const noResultsEl = document.getElementById('no-results');

const totalCards = cards.length;

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('p');
        
        const originalTitle = card.dataset.title; 
        const description = descEl.textContent;

        const hasTitleMatch = originalTitle.toLowerCase().includes(query);
        const hasDescMatch = description.toLowerCase().includes(query);

        if (hasTitleMatch || hasDescMatch) {
            card.classList.remove('hidden');
            visibleCount++;

        if (query !== '' && hasTitleMatch) {
                const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                titleEl.innerHTML = originalTitle.replace(regex, '<mark>$1</mark>');
        } else {
                titleEl.textContent = originalTitle;
        }

        } else {
            card.classList.add('hidden');
            titleEl.textContent = originalTitle;
        }
    });

    resultsCountEl.textContent = `Знайдено: ${visibleCount} з ${totalCards}`;

    if (visibleCount === 0) {
        noResultsEl.classList.remove('hidden');
    } else {
        noResultsEl.classList.add('hidden');
    }
}

const debouncedFilter = debounce(filterCards, 200);
searchInput.addEventListener('input', debouncedFilter);