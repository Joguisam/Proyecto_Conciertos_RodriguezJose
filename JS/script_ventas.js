document.addEventListener('DOMContentLoaded', () => {
    const salesTableBody = document.getElementById('sales-tbody');
    const modal = document.getElementById('view-sale-modal');
    const modalContent = document.getElementById('sale-details-content');
    const closeBtn = document.getElementById('close-view-modal');

    // Seleccionamos los cuadros de estadísticas para que se actualicen
    const totalRevenueElem = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const ticketsSoldElem = document.querySelector('.stat-card:nth-child(2) .stat-value');

    // 1. CARGAR DATOS (Conexión directa con tickethub_sales generada en el carrito)
    let sales = JSON.parse(localStorage.getItem('tickethub_sales')) || [];

    // 2. FUNCIÓN PARA ACTUALIZAR LOS CUADROS (Revenue y Tickets Sold)
    function updateStats() {
        let totalMoney = 0;
        let totalTickets = 0;

        sales.forEach(sale => {
            // Limpiamos el monto (ej: "$150.00" -> 150.00)
            const cleanAmount = parseFloat(sale.monto.replace(/[$,]/g, '')) || 0;
            totalMoney += cleanAmount;
            
            // Sumamos la cantidad de tickets dentro de esta venta
            if (sale.tickets && Array.isArray(sale.tickets)) {
                totalTickets += sale.tickets.length;
            } else {
                totalTickets += 1; // Fallback por si hay datos viejos
            }
        });

        // Inyectamos los valores en los cuadros de la interfaz
        if (totalRevenueElem) {
            totalRevenueElem.innerText = `$${totalMoney.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }
        if (ticketsSoldElem) {
            ticketsSoldElem.innerText = totalTickets;
        }
    }

    // 3. FUNCIÓN DE RENDERIZADO DE LA TABLA
    function renderSales() {
        if (!salesTableBody) return;
        salesTableBody.innerHTML = '';
        
        // Renderizamos de la más reciente a la más antigua
        [...sales].reverse().forEach((sale, index) => {
            // Corregimos el índice para que el "ojito" abra la venta correcta al estar invertida la lista
            const originalIndex = sales.length - 1 - index;

            // Obtenemos la ciudad del primer ticket para la columna "City"
            const city = sale.tickets && sale.tickets.length > 0 ? sale.tickets[0].city : 'N/A';

            const row = `
                <tr>
                    <td>${sale.fecha}</td>
                    <td>${city}</td>
                    <td>
                        <div style="display:flex; flex-direction:column;">
                            <strong>${sale.cliente}</strong>
                            <span style="font-size:0.75rem; opacity:0.6;">${sale.email}</span>
                        </div>
                    </td>
                    <td><span class="status-pill">${sale.status || 'Confirmed'}</span></td>
                    <td class="text-right"><strong>${sale.monto}</strong></td>
                    <td class="text-center">
                        <button class="action-btn" onclick="verDetalle(${originalIndex})">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                    </td>
                </tr>`;
            salesTableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // 4. FUNCIÓN PARA EL "OJITO" (DETALLES ACUMULADOS)
    window.verDetalle = function(index) {
        const sale = sales[index];
        if (!sale || !modalContent) return;

        // Creamos la lista visual de tickets comprados en esa boleta
        let ticketsHTML = '';
        if (sale.tickets && sale.tickets.length > 0) {
            ticketsHTML = sale.tickets.map(t => `
                <div style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px; border-left: 3px solid var(--secondary); display: flex; justify-content: space-between;">
                    <span>🎟️ ${t.name}</span>
                    <strong>$${t.price}</strong>
                </div>
            `).join('');
        } else {
            ticketsHTML = `<p style="opacity:0.5;">No item details available</p>`;
        }

        modalContent.innerHTML = `
            <div style="display: grid; gap: 15px; color: white; font-family: 'Inter', sans-serif;">
                <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 15px;">
                    <h3 style="color: var(--primary); margin:0;">${sale.id}</h3>
                    <small style="opacity: 0.5;">${sale.fecha}</small>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                    <p><strong>Customer:</strong><br>${sale.cliente}</p>
                    <p><strong>ID:</strong><br>${sale.identificacion || 'N/A'}</p>
                    <p><strong>Email:</strong><br>${sale.email}</p>
                    <p><strong>Phone:</strong><br>${sale.telefono || 'N/A'}</p>
                </div>
                <div style="margin-top: 10px;">
                    <p style="margin-bottom: 10px; font-weight: 700;">Purchase Breakdown:</p>
                    <div style="max-height: 200px; overflow-y: auto; padding-right: 5px;">
                        ${ticketsHTML}
                    </div>
                </div>
                <div style="text-align: right; border-top: 1px solid #333; padding-top: 15px;">
                    <span style="font-size: 1rem; opacity: 0.7;">TOTAL AMOUNT:</span>
                    <h2 style="color: var(--secondary); margin: 0;">${sale.monto}</h2>
                </div>
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

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // INICIALIZACIÓN
    updateStats();
    renderSales();
});