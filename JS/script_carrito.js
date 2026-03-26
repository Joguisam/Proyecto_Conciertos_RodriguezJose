window.cartStorage = JSON.parse(localStorage.getItem('temp_cart')) || [];

window.actualizarContadorCarrito = () => {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = window.cartStorage.length;
        badge.style.display = window.cartStorage.length > 0 ? 'flex' : 'none';
    }
};

window.renderCartItems = () => {
    const list = document.getElementById('modal-cart-items');
    const totalPriceElement = document.getElementById('total-price');
    if (!list) return;

    list.innerHTML = '';
    let total = 0;

    if (window.cartStorage.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity:0.5; padding:20px;">Your cart is empty</p>';
    } else {
        window.cartStorage.forEach((item, index) => {
            total += parseFloat(item.price) || 0;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="item-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">$${item.price}</p>
                </div>
                <button onclick="window.quitarDelCarrito(${index})" class="remove-btn" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">
                    <span class="material-symbols-outlined">delete</span>
                </button>`;
            list.appendChild(itemDiv);
        });
    }
    if (totalPriceElement) totalPriceElement.innerText = total.toFixed(2);
};

window.agregarAlCarrito = (id) => {
    const events = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    const event = events.find(e => e.id == id);
    if (event) {
        window.cartStorage.push({...event});
        localStorage.setItem('temp_cart', JSON.stringify(window.cartStorage));
        window.actualizarContadorCarrito();
        if(window.showToast) window.showToast(event.name);
    }
};

window.quitarDelCarrito = (index) => {
    window.cartStorage.splice(index, 1);
    localStorage.setItem('temp_cart', JSON.stringify(window.cartStorage));
    window.actualizarContadorCarrito();
    window.renderCartItems();
};

// --- PROCESO DE COMPRA ---
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (window.cartStorage.length === 0) return;

            // 1. Generar ID y Datos
            const boletaId = "TK-" + Math.floor(100000 + Math.random() * 900000);
            const total = document.getElementById('total-price').innerText;

            // 2. Guardar en Ventas (Conectividad)
            const ventasExistentes = JSON.parse(localStorage.getItem('tickethub_sales')) || [];
            const nuevaVenta = {
                id: boletaId,
                fecha: new Date().toLocaleString(),
                cliente: document.getElementById('cust-name').value,
                email: document.getElementById('cust-email').value,
                telefono: document.getElementById('cust-phone').value,
                direccion: document.getElementById('cust-address').value,
                identificacion: document.getElementById('cust-id').value,
                monto: `$${total}`,
                status: "Confirmed",
                tickets: [...window.cartStorage] // Acumulación de tickets
            };
            
            ventasExistentes.push(nuevaVenta);
            localStorage.setItem('tickethub_sales', JSON.stringify(ventasExistentes));

            // 3. Cerrar modal de formulario
            document.getElementById('cart-modal').classList.remove('show');

            // 4. Mostrar Éxito
            showSuccessModal(boletaId);
        });
    }

    function showSuccessModal(id) {
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-card">
                <span class="material-symbols-outlined success-icon">verified</span>
                <h2 style="color:white; margin-bottom:10px;">Purchase Confirmed!</h2>
                <p style="color:#888;">Thank you for choosing Tokethub.</p>
                <div class="boleta-tag">
                    <span style="font-size:0.7rem; color:#666; display:block; margin-bottom:5px;">OFFICIAL RECEIPT</span>
                    <span class="boleta-number">${id}</span>
                </div>
                <button class="btn-primary" id="finish-btn" style="width:100%;">Close & Clear Cart</button>
                <div class="auto-close-bar"></div>
            </div>`;
        
        document.body.appendChild(overlay);

        const cleanAndExit = () => {
            // REINICIO DEL CARRITO: Solo ocurre aquí
            window.cartStorage = [];
            localStorage.setItem('temp_cart', JSON.stringify([]));
            window.actualizarContadorCarrito();
            overlay.remove();
            if(checkoutForm) checkoutForm.reset();
        };

        document.getElementById('finish-btn').onclick = cleanAndExit;
        setTimeout(cleanAndExit, 5000); // Cierre automático en 5 seg
    }

    // Handlers de apertura/cierre existentes
    document.getElementById('cart-icon-btn')?.addEventListener('click', () => {
        document.getElementById('cart-modal').classList.add('show');
        window.renderCartItems();
    });
    
    document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        document.getElementById('cart-modal').classList.remove('show');
    });
});