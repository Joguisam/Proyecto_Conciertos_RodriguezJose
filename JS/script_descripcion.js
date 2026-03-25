document.addEventListener('DOMContentLoaded', () => {
    // 1. Capturar el ID desde la URL (ej: descripcion.html?id=172839)
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Obtener los eventos guardados por el admin
    const events = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    const event = events.find(e => e.id == eventId);

    if (!event) {
        console.error("Evento no encontrado en LocalStorage");
        document.body.innerHTML = `<h2 style="color:white; text-align:center; margin-top:100px;">Evento no encontrado</h2>`;
        return;
    }

    // 3. Inyectar datos dinámicamente
    document.title = `TOKETHUB | ${event.name}`;
    
    // Banner
    const banner = document.getElementById('event-banner');
    banner.src = event.image || 'https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=No+Image';

    // Información textual
    document.getElementById('event-title').innerText = event.name;
    document.getElementById('event-category').innerText = event.category || 'General';
    document.getElementById('event-description').innerText = event.description || 'No hay una descripción detallada para este evento.';
    document.getElementById('event-price').innerText = `$${event.price}`;
    
    // Fecha y Ubicación (Si el admin los puso en el form)
    if(event.date) document.getElementById('event-date').innerText = event.date;
    if(event.location) document.getElementById('event-location').innerText = event.location;

    // 4. Lógica del Botón "Añadir al Carrito"
    const btnAdd = document.getElementById('btn-add-detail');
    if (btnAdd) {
        btnAdd.onclick = () => {
            // Llamamos a la función global que ya tienes en script_carrito.js
            if (window.agregarAlCarrito) {
                window.agregarAlCarrito(event.id);
            } else {
                alert("Error: El sistema de carrito no está cargado.");
            }
        };
    }
});