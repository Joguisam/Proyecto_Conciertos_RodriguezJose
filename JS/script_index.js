document.addEventListener('DOMContentLoaded', () => {
    const eventGrid = document.getElementById('event-grid');
    const categoryPills = document.getElementById('category-pills');
    const eventSearch = document.getElementById('event-search');
    
    // 1. CARGA DE DATOS
    let events = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    let categories = JSON.parse(localStorage.getItem('tickethub_local_cats')) || [];

    // 2. FUNCIÓN DE RENDERIZADO (Grid Corregido y Botones Modernos)
    function renderEvents(eventsToDisplay) {
        if (!eventGrid) return;
        eventGrid.innerHTML = '';

        if (eventsToDisplay.length === 0) {
            eventGrid.innerHTML = `<p style="color: #666; grid-column: 1/-1; text-align: center; margin-top: 40px; font-family: 'Inter', sans-serif;">No events found.</p>`;
            return;
        }

        eventsToDisplay.forEach(ev => {
            const card = document.createElement('article');
            card.className = 'card'; 
            
            // Usamos las nuevas clases .btn-modern, .btn-add-cart-modern y .btn-details-modern
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${ev.image || 'https://via.placeholder.com/400x300'}" alt="${ev.name}" class="event-image">
                    <div class="card-badge">${ev.category || 'Event'}</div>
                </div>
                <div class="card-content">
                    <h3 class="event-title">${ev.name}</h3>
                    <div class="event-info">
                        <span class="price">$${ev.price}</span>
                    </div>
                    
                    <div class="card-footer">
                        
                        <button class="btn-modern btn-add-cart-modern" onclick="window.handleAddToCart('${ev.id}')" title="Add to Cart">
                            <span class="material-symbols-outlined">shopping_cart</span>
                        </button>

                        <a href="descripcion.html?id=${ev.id}" class="btn-modern btn-details-modern">
                            View Details
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
        categoryPills.innerHTML = '<button class="pill active" data-category="all">All Events</button>';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'pill';
            btn.dataset.category = cat.name;
            btn.textContent = cat.name;
            categoryPills.appendChild(btn);
        });
    }

    // 4. LÓGICA DE FILTROS Y BÚSQUEDA
    if (eventSearch) {
        eventSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = events.filter(ev => ev.name.toLowerCase().includes(term));
            renderEvents(filtered);
        });
    }

    if (categoryPills) {
        categoryPills.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                
                const cat = e.target.dataset.category;
                const filtered = cat === 'all' ? events : events.filter(ev => ev.category === cat);
                renderEvents(filtered);
            }
        });
    }

    // 5. INICIALIZACIÓN
    renderCategories();
    renderEvents(events);
    if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
});

// 6. PUENTE GLOBAL AL CARRITO
window.handleAddToCart = (id) => {
    if (typeof window.agregarAlCarrito === 'function') {
        window.agregarAlCarrito(id);
    } else {
        console.error("El script del carrito no está cargado.");
    }
};