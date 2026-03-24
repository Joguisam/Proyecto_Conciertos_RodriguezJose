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

    // 1. CARGA DE DATOS DESDE LOCALSTORAGE (Tus datos de Admin)
    let localEvents = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    let localCats = JSON.parse(localStorage.getItem('tickethub_local_cats')) || [];

    // 2. GENERAR MENÚS DE CATEGORÍAS DINÁMICAMENTE
    function setupMenus() {
        // Cargar Sidebar
        if (sidebarNav) {
            // Mantener solo el botón Discover
            const discoverBtn = document.getElementById('btn-discover');
            sidebarNav.innerHTML = '';
            sidebarNav.appendChild(discoverBtn);

            localCats.forEach(cat => {
                const a = document.createElement('a');
                a.className = 'sidebar-link';
                a.href = "#";
                a.dataset.category = cat.name;
                a.innerHTML = `<span class="material-symbols-outlined">${cat.icon}</span> ${cat.name}`;
                sidebarNav.appendChild(a);
            });
        }

        // Cargar Pills superiores
        if (categoryPills) {
            categoryPills.innerHTML = '<button class="pill active" data-category="all">All Events</button>';
            localCats.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'pill';
                btn.dataset.category = cat.name;
                btn.textContent = cat.name;
                categoryPills.appendChild(btn);
            });
        }
    }

    // 3. RENDERIZAR CARTAS DE EVENTOS
    function renderEvents(events) {
        eventGrid.innerHTML = '';
        resultsCount.textContent = `(${events.length} events found)`;
        
        if (events.length === 0) {
            eventGrid.innerHTML = `<div class="no-results">No events found with the selected filters.</div>`;
            return;
        }

        events.forEach(ev => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${ev.image || 'https://via.placeholder.com/400x250'}" alt="${ev.name}" class="card-img">
                    <span class="card-category">${ev.category}</span>
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

    // 4. MOTOR DE FILTRADO UNIFICADO
    function applyFilters() {
        const text = searchInput.value.toLowerCase().trim();
        const city = cityFilter.value;
        const priceVal = priceFilter.value;
        const maxPrice = priceVal ? parseFloat(priceVal) : Infinity;
        const start = dateStart.value ? new Date(dateStart.value) : null;
        const end = dateEnd.value ? new Date(dateEnd.value) : null;

        const activePill = document.querySelector('.pill.active');
        const activeCat = activePill ? activePill.dataset.category : 'all';

        const filtered = localEvents.filter(ev => {
            // Búsqueda inteligente: Nombre, Categoría o Ciudad
            const matchesText = ev.name.toLowerCase().includes(text) || 
                               ev.category.toLowerCase().includes(text) ||
                               ev.city.toLowerCase().includes(text);
            
            const matchesCity = city === 'all' || ev.city === city;
            const matchesCat = activeCat === 'all' || ev.category === activeCat;
            const matchesPrice = priceVal === "" || ev.price <= maxPrice;

            // Filtro de fecha
            const evDate = new Date(ev.date);
            let matchesDate = true;
            if (start && evDate < start) matchesDate = false;
            if (end && evDate > end) matchesDate = false;

            return matchesText && matchesCity && matchesCat && matchesPrice && matchesDate;
        });

        renderEvents(filtered);
    }

    // 5. SINCRONIZACIÓN DE UI
    function updateActiveCategory(categoryName) {
        document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.category === categoryName));
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.category === categoryName));
        applyFilters();
    }

    // 6. EVENT LISTENERS
    searchInput.addEventListener('input', applyFilters);
    cityFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('input', applyFilters);
    dateStart.addEventListener('change', applyFilters);
    dateEnd.addEventListener('change', applyFilters);

    categoryPills.addEventListener('click', (e) => {
        if (e.target.classList.contains('pill')) updateActiveCategory(e.target.dataset.category);
    });

    sidebarNav.addEventListener('click', (e) => {
        const link = e.target.closest('.sidebar-link');
        if (link) {
            e.preventDefault();
            updateActiveCategory(link.dataset.category || 'all');
        }
    });

    // Iniciar
    setupMenus();
    renderEvents(localEvents);
});