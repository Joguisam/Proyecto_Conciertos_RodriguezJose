document.addEventListener('DOMContentLoaded', () => {
    const eventGrid = document.getElementById('event-grid');
    const searchInput = document.getElementById('event-search');
    const cityFilter = document.getElementById('city-filter');
    const categoryPills = document.getElementById('category-pills');
    const priceFilter = document.getElementById('price-filter');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');
    const resultsCount = document.getElementById('results-count');
    const sidebarNav = document.getElementById('sidebar-categories');

    // 1. CARGA DE DATOS INICIALES
    if (!localStorage.getItem('tickethub_local_events')) {
        const demoEvents = [
            { id: 1, name: "Neon Horizon Festival", date: "2026-10-24", city: "New York", category: "Music", price: 149, image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4" },
            { id: 2, name: "Tech Summit 2026", date: "2026-11-15", city: "London", category: "Tech", price: 299, image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678" },
            { id: 3, name: "Midnight Sonata (VIP)", date: "2026-12-01", city: "Madrid", category: "Music", price: 85.50, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4" },
            { id: 4, name: "Art Expo Noir", date: "2027-01-10", city: "Paris", category: "Art", price: 45, image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b" }
        ];
        const demoCats = [
            { name: "Music", icon: "music_note" },
            { name: "Tech", icon: "devices" },
            { name: "Art", icon: "palette" }
        ];
        localStorage.setItem('tickethub_local_events', JSON.stringify(demoEvents));
        localStorage.setItem('tickethub_local_cats', JSON.stringify(demoCats));
    }

    const localEvents = JSON.parse(localStorage.getItem('tickethub_local_events'));
    const localCats = JSON.parse(localStorage.getItem('tickethub_local_cats'));

    // 2. RENDERIZAR CATEGORÍAS LATERALES
    if (sidebarNav && localCats) {
        localCats.forEach(cat => {
            const catLink = document.createElement('a');
            catLink.className = 'sidebar-link';
            catLink.href = "#"; 
            catLink.innerHTML = `<span class="material-symbols-outlined">${cat.icon}</span> ${cat.name}`;
            sidebarNav.appendChild(catLink);
        });
    }

    // 3. FUNCIÓN RENDERIZAR EVENTOS EN EL GRID
    function renderEvents(events) {
        eventGrid.innerHTML = '';
        resultsCount.textContent = `(${events.length} events found)`;
        
        if (events.length === 0) {
            eventGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #cbc3d9; padding: 3rem; font-size: 1.1rem;">No events found with these filters.</p>`;
            return;
        }

        events.forEach(ev => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${ev.image}" alt="${ev.name}" class="card-img">
                    <span class="card-category ${ev.category.toLowerCase()}-category">${ev.category}</span>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${ev.name}</h3>
                        <span class="card-price">$${parseFloat(ev.price).toFixed(2)}</span>
                    </div>
                    <div class="card-meta">
                        <div class="meta-item"><span class="material-symbols-outlined">calendar_today</span><span>${ev.date}</span></div>
                        <div class="meta-item"><span class="material-symbols-outlined">location_on</span><span>${ev.city}</span></div>
                    </div>
                    <button class="card-btn add-to-cart-btn" data-name="${ev.name}" data-price="${ev.price}" data-image="${ev.image}">
                        <span class="material-symbols-outlined">shopping_cart</span> Add to Cart
                    </button>
                </div>`;
            eventGrid.appendChild(card);
        });
    }

    // 4. LÓGICA DE FILTRADO UNIFICADA
    function applyFilters() {
        const text = searchInput.value.toLowerCase();
        const city = cityFilter.value;
        const maxPrice = priceFilter.value ? parseFloat(priceFilter.value) : Infinity;
        const start = dateStart.value ? new Date(dateStart.value) : null;
        const end = dateEnd.value ? new Date(dateEnd.value) : null;
        
        const activePill = document.querySelector('.pill.active');
        const cat = activePill ? activePill.dataset.category : 'all';

        const filtered = localEvents.filter(ev => {
            const matchesText = ev.name.toLowerCase().includes(text);
            const matchesCity = city === 'all' || ev.city === city;
            const matchesCat = cat === 'all' || ev.category === cat;
            const matchesPrice = ev.price <= maxPrice;

            const eventDate = new Date(ev.date);
            let matchesDate = true;
            if (start && eventDate < start) matchesDate = false;
            if (end && eventDate > end) matchesDate = false;

            return matchesText && matchesCity && matchesCat && matchesPrice && matchesDate;
        });

        renderEvents(filtered);
    }

    // 5. EVENT LISTENERS
    searchInput.addEventListener('input', applyFilters);
    cityFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('input', applyFilters);
    dateStart.addEventListener('change', applyFilters);
    dateEnd.addEventListener('change', applyFilters);
    
    if (categoryPills) {
        categoryPills.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                applyFilters();
            }
        });
    }

    renderEvents(localEvents);
});