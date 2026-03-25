document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos de los otros scripts (LocalStorage)
    const sales = JSON.parse(localStorage.getItem('tickethub_sales')) || [];
    const events = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    const categories = JSON.parse(localStorage.getItem('tickethub_local_cats')) || [];

    // 2. Ejecutar actualizaciones
    updateSummaryStats(sales, events, categories);
    renderRecentTransactions(sales);
});

/**
 * Calcula y muestra las estadísticas principales
 */
function updateSummaryStats(sales, events, categories) {
    const totalSalesElem = document.getElementById('total-gross-sales');
    const totalEventsElem = document.getElementById('active-events-count');
    const totalCatsElem = document.getElementById('active-cats-count');

    // Calcular Gross Sales sumando los montos de ventas
    let totalGross = 0;
    sales.forEach(sale => {
        // Limpiamos el string "$150.00" para convertirlo a número
        const cleanAmount = parseFloat(sale.monto.replace(/[$,]/g, '')) || 0;
        totalGross += cleanAmount;
    });

    // Inyectar valores con formato
    if (totalSalesElem) {
        totalSalesElem.innerText = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(totalGross);
    }

    if (totalEventsElem) totalEventsElem.innerText = events.length;
    if (totalCatsElem) totalCatsElem.innerText = categories.length;
}

/**
 * Renderiza las últimas 5 ventas en la tabla del dashboard
 */
function renderRecentTransactions(sales) {
    const tableBody = document.getElementById('recent-tickets-tbody');
    if (!tableBody) return;

    // Limpiar tabla
    tableBody.innerHTML = '';

    // Tomar las últimas 5 ventas (las más recientes arriba)
    const recent = sales.slice(-5).reverse();

    if (recent.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; opacity:0.5; padding: 2rem;">No recent transactions found</td></tr>`;
        return;
    }

    recent.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 700; color: var(--primary);">${sale.id}</span>
                    <span style="font-size: 0.7rem; color: var(--outline);">${sale.fecha.split(',')[0]}</span>
                </div>
            </td>
            <td>
                <span style="font-weight: 500;">${sale.cliente}</span>
            </td>
            <td>
                <span class="status-pill">${sale.status || 'Confirmed'}</span>
            </td>
            <td class="text-right">
                <strong style="color: var(--on-surface);">${sale.monto}</strong>
            </td>
        `;
        tableBody.appendChild(row);
    });
}