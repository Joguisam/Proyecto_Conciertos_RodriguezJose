document.addEventListener('DOMContentLoaded', () => {
    const salesTableBody = document.getElementById('sales-tbody');
    const modal = document.getElementById('view-sale-modal');
    const modalContent = document.getElementById('sale-details-content');
    const closeBtn = document.getElementById('close-view-modal');

    // Elementos de las tarjetas de estadísticas
    const totalRevenueElem = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const ticketsSoldElem = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const activeMarketsElem = document.querySelector('.active-markets-value');

    // 1. CARGAR DATOS
    // Se asegura de usar la misma llave que el carrito: 'tickethub_sales'
    let sales = JSON.parse(localStorage.getItem('tickethub_sales')) || [];

    // 2. ACTUALIZAR ESTADÍSTICAS (Tarjetas superiores)
    function updateStats() {
        let total = 0;
        sales.forEach(sale => {
            // Quitamos el "$" y comas para poder sumar el monto
            const price = parseFloat(sale.monto.replace(/[$,]/g, '')) || 0;
            total += price;
        });

        if (totalRevenueElem) totalRevenueElem.innerText = `$${total.toLocaleString()}`;
        if (ticketsSoldElem) ticketsSoldElem.innerText = sales.length;
        if (activeMarketsElem) activeMarketsElem.innerText = "1 Region (Online)";
    }

    // 3. RENDERIZAR TABLA DE VENTAS
    function renderTable() {
        if (!salesTableBody) return;
        salesTableBody.innerHTML = '';

        // Invertimos el array para que las ventas más recientes salgan arriba
        const displaySales = [...sales].reverse();

        displaySales.forEach((sale, index) => {
            const initials = sale.cliente ? sale.cliente.substring(0, 2).toUpperCase() : '??';
            
            const rowHTML = `
                <tr>
                    <td>${sale.fecha}</td>
                    <td>
                        <div class="location-cell">
                            <span class="city-name">Online Store</span>
                            <span class="region-tag">${sale.id}</span> 
                        </div>
                    </td>
                    <td>
                        <div class="customer-cell">
                            <div class="avatar">${initials}</div>
                            <div class="customer-info">
                                <span class="customer-name">${sale.cliente}</span>
                                <span class="customer-email">${sale.email}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="status-badge confirmed">Confirmed</span></td>
                    <td class="text-right amount-cell">${sale.monto}</td>
                    <td class="text-center">
                        <button class="action-btn view-btn" onclick="verDetalle(${sales.length - 1 - index})">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                    </td>
                </tr>`;
            salesTableBody.innerHTML += rowHTML;
        });
    }

    // 4. FUNCIÓN PARA VER DETALLES (MODAL)
    window.verDetalle = function(index) {
        const sale = sales[index];
        if (!sale || !modalContent) return;

        modalContent.innerHTML = `
            <div style="display: grid; gap: 15px; color: white;">
                <p><strong>Ticket ID:</strong> <span style="color: var(--secondary);">${sale.id}</span></p>
                <p><strong>Customer:</strong> ${sale.cliente}</p>
                <p><strong>Email:</strong> ${sale.email}</p>
                <p><strong>Phone:</strong> ${sale.telefono || 'N/A'}</p>
                <p><strong>Address:</strong> ${sale.direccion || 'N/A'}</p>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1);">
                <p><strong>Date:</strong> ${sale.fecha}</p>
                <p><strong>Total Paid:</strong> <span style="font-size: 1.2rem; color: var(--primary);">${sale.monto}</span></p>
            </div>
        `;
        modal.style.display = 'flex';
    };

    // 5. CERRAR MODAL
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Cerrar modal si se hace clic fuera del contenido
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // INICIALIZACIÓN
    updateStats();
    renderTable();
});