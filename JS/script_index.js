document.addEventListener('DOMContentLoaded', () => {
    const eventGrid = document.getElementById('event-grid');
    const categoryPills = document.getElementById('category-pills');
    const sidebarNav = document.getElementById('sidebar-categories');
    
    // Datos de LocalStorage
    let events = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    let categories = JSON.parse(localStorage.getItem('tickethub_local_cats')) || [];
    let activeCategory = 'all';

    function renderUI() {
        // 1. Renderizar Categorías
        if (categoryPills) {
            categoryPills.innerHTML = '<button class="pill active" data-category="all">All Events</button>';
            categories.forEach(cat => {
                categoryPills.innerHTML += `<button class="pill" data-category="${cat.name}">${cat.name}</button>`;
            });
        }

        // 2. Renderizar Eventos
        renderEvents(events);
    }

    function renderEvents(eventsToDisplay) {
        if (!eventGrid) return;
        eventGrid.innerHTML = '';

        eventsToDisplay.forEach(ev => {
            const card = document.createElement('article');
            card.className = 'card'; // Asegúrate de que esta clase esté en tu CSS
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${ev.image || 'https://via.placeholder.com/400x300'}" class="card-img">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${ev.name}</h3>
                        <span class="card-price">$${ev.price}</span>
                    </div>
                    <div class="card-meta">
                        <span>${ev.city}</span> | <span>${ev.date}</span>
                    </div>
                    <button class="card-btn" onclick="window.handleAddToCart('${ev.id}')">
                        <span class="material-symbols-outlined">add_shopping_cart</span> Get Tickets
                    </button>
                </div>
            `;
            eventGrid.appendChild(card);
        });
    }

    // Filtros
    document.getElementById('event-search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = events.filter(ev => ev.name.toLowerCase().includes(term));
        renderEvents(filtered);
    });

    // Delegación de eventos para categorías
    categoryPills.addEventListener('click', (e) => {
        if (e.target.classList.contains('pill')) {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            const cat = e.target.dataset.category;
            const filtered = cat === 'all' ? events : events.filter(ev => ev.category === cat);
            renderEvents(filtered);
        }
    });

    renderUI();
    if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
});

// PUENTE AL CARRITO
window.handleAddToCart = (id) => {
    if (typeof window.agregarAlCarrito === 'function') {
        window.agregarAlCarrito(id);
    } else {
        console.error("El script del carrito no está cargado.");
    }
};

// ... (Todo tu código anterior de renderEvents y filtros) ...

// ESTA ES LA FUNCIÓN QUE CONECTA EL HTML CON EL CARRITO
window.handleAddToCart = (id) => {
    // Verificamos si la función del otro script existe
    if (typeof window.agregarAlCarrito === 'function') {
        window.agregarAlCarrito(id);
    } else {
        console.error("Error: El archivo script_carrito.js no se ha cargado correctamente.");
    }
};