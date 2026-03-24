document.addEventListener('DOMContentLoaded', () => {
    const salesTableBody = document.getElementById('sales-tbody');
    const modal = document.getElementById('view-sale-modal');
    const modalContent = document.getElementById('sale-details-content');
    const closeBtn = document.getElementById('close-view-modal');

    // Elementos de las tarjetas
    const totalRevenueElem = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const ticketsSoldElem = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const activeMarketsElem = document.querySelector('.active-markets-value');

    const sales = JSON.parse(localStorage.getItem('tickethub_sales')) || [];

    function updateStats() {
        let total = 0;
        sales.forEach(sale => {
            const price = parseFloat(sale.monto.replace(/[$,]/g, '')) || 0;
            total += price;
        });
        if (totalRevenueElem) totalRevenueElem.innerText = `$${total.toLocaleString()}`;
        if (ticketsSoldElem) ticketsSoldElem.innerText = sales.length;
        if (activeMarketsElem) activeMarketsElem.innerText = "1 Region (Online)";
    }

    function renderTable() {
        if (!salesTableBody) return;
        salesTableBody.innerHTML = '';

        sales.forEach((sale, index) => {
            const initials = sale.cliente ? sale.cliente.substring(0, 2).toUpperCase() : '??';
            const rowHTML = `
                <tr>
                    <td>
                        <p class="date-primary">${sale.fecha}</p>
                        <p class="date-secondary">${sale.hora}</p>
                    </td>
                    <td>Online Store</td>
                    <td>
                        <div class="customer-cell">
                            <div class="customer-avatar">${initials}</div>
                            <div class="customer-info">
                                <p class="date-primary">${sale.cliente}</p>
                                <p class="customer-email">${sale.email}</p>
                            </div>
                        </div>
                    </td>
                    <td><span class="status-badge completed">Completed</span></td>
                    <td class="amount-cell">${sale.monto}</td>
                    <td class="action-cell">
                        <button class="action-btn view-btn" data-index="${index}">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                    </td>
                </tr>`;
            salesTableBody.insertAdjacentHTML('afterbegin', rowHTML);
        });
    }

    // Abrir Modal
    salesTableBody?.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-btn');
        if (btn) {
            const sale = sales[btn.dataset.index];
            
modalContent.innerHTML = `
    <div style="line-height: 1.6; color: white;">
        <p><strong style="color: var(--primary);">Customer:</strong> ${sale.cliente}</p>
        <p><strong style="color: var(--primary);">Email:</strong> ${sale.email}</p>
        <p><strong style="color: var(--primary);">Address:</strong> ${sale.direccion || 'N/A'}</p>
        <p><strong style="color: var(--primary);">Phone:</strong> ${sale.telefono || 'N/A'}</p>
        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #333;">
        <p style="font-size: 1.2em;"><strong>Total Amount:</strong> <span style="color: var(--secondary);">${sale.monto}</span></p>
    </div>
`;
            modal.style.display = 'flex';
        }
    });

    closeBtn?.addEventListener('click', () => modal.style.display = 'none');
    
    updateStats();
    renderTable();
});