document.addEventListener('DOMContentLoaded', () => {
    const eventGrid = document.getElementById('event-grid');
    const categoryPills = document.getElementById('category-pills');
    const eventSearch = document.getElementById('event-search');
    
    // Elementos de filtros adicionales
    const cityFilter = document.getElementById('city-filter');
    const priceFilter = document.getElementById('price-filter');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');
    const resultsCount = document.getElementById('results-count');

    // 1. CARGA DE DATOS
    let events = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    let categories = JSON.parse(localStorage.getItem('tickethub_local_cats')) || [];

    // 2. FUNCIÓN DE RENDERIZADO
    function renderEvents(eventsToDisplay) {
        if (!eventGrid) return;
        eventGrid.innerHTML = '';
        
        // Actualizar contador
        if (resultsCount) resultsCount.textContent = `${eventsToDisplay.length} events found`;

        if (eventsToDisplay.length === 0) {
            eventGrid.innerHTML = `<p style="color: #666; grid-column: 1/-1; text-align: center; margin-top: 40px; font-family: 'Inter', sans-serif;">No events found with these filters.</p>`;
            return;
        }

        eventsToDisplay.forEach(ev => {
            const card = document.createElement('article');
            card.className = 'card'; 
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${ev.image || 'https://via.placeholder.com/400x300'}" alt="${ev.name}" class="event-image">
                    <div class="card-badge">${ev.category || 'Event'}</div>
                </div>
                <div class="card-content">
                    <h3 class="event-title">${ev.name}</h3>
                    <div class="event-info">
                        <span class="price">$${ev.price}</span>
                        <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">
                            <div><span class="material-symbols-outlined" style="font-size: 14px">location_on</span> ${ev.city}</div>
                            <div><span class="material-symbols-outlined" style="font-size: 14px">calendar_today</span> ${ev.date}</div>
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <button class="btn-modern btn-add-cart-modern" onclick="window.handleAddToCart('${ev.id}')" title="Add to Cart">
                            <span class="material-symbols-outlined">shopping_cart</span>
                        </button>
                        <a href="descripcion.html?id=${ev.id}" class="btn-modern btn-details-modern">
                            Details
                            <span class="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                </div>
            `;
            eventGrid.appendChild(card);
        });
    }

    // 3. RENDERIZAR PILLS DE CATEGORÍAS
    function renderCategories() {
        if (!categoryPills) return;
        // Mantenemos el botón "All"
        categoryPills.innerHTML = '<button class="pill active" data-category="all">All Events</button>';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'pill';
            btn.dataset.category = cat.name;
            btn.textContent = cat.name;
            categoryPills.appendChild(btn);
        });
    }

    // 4. LÓGICA DE FILTRADO INTEGRAL
    function applyFilters() {
        const searchTerm = eventSearch.value.toLowerCase();
        const selectedCity = cityFilter.value;
        const maxPrice = parseFloat(priceFilter.value) || Infinity;
        const startDate = dateStart.value;
        const endDate = dateEnd.value;
        const activePill = document.querySelector('.pill.active');
        const selectedCategory = activePill ? activePill.dataset.category : 'all';

        const filtered = events.filter(ev => {
            const matchesSearch = ev.name.toLowerCase().includes(searchTerm);
            const matchesCategory = (selectedCategory === 'all' || ev.category === selectedCategory);
            const matchesCity = (selectedCity === 'all' || ev.city === selectedCity);
            const matchesPrice = parseFloat(ev.price) <= maxPrice;
            
            // Filtro de fechas
            let matchesDate = true;
            if (startDate && ev.date < startDate) matchesDate = false;
            if (endDate && ev.date > endDate) matchesDate = false;

            return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesDate;
        });

        renderEvents(filtered);
    }

    // 5. LISTENERS
    if (eventSearch) eventSearch.addEventListener('input', applyFilters);
    if (cityFilter) cityFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('input', applyFilters);
    if (dateStart) dateStart.addEventListener('change', applyFilters);
    if (dateEnd) dateEnd.addEventListener('change', applyFilters);

    if (categoryPills) {
        categoryPills.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                applyFilters();
            }
        });
    }

    // 6. INICIALIZACIÓN
    renderCategories();
    renderEvents(events);
    if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
});

// PUENTE GLOBAL AL CARRITO
window.handleAddToCart = (id) => {
    if (typeof window.agregarAlCarrito === 'function') {
        window.agregarAlCarrito(id);
    } else {
        alert("Event added to cart!"); // Fallback si no hay script_carrito
    }
};