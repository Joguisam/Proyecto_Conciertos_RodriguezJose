// --- 1. ESTADO GLOBAL ---
window.cartStorage = JSON.parse(localStorage.getItem('temp_cart')) || [];

// --- 2. FUNCIÓN TOAST (MENSAJE FLOTANTE) ---
function showToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast-mini toast-show'; 
    
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '10000',
        opacity: '1',
        display: 'flex'
    });

    toast.innerHTML = `
        <span class="material-symbols-outlined" style="color: #44ddc1;">check_circle</span>
        <div class="toast-content">
            <p class="toast-title" style="margin:0; font-weight:800; color:white;">${title}</p>
            <p class="toast-msg" style="margin:0; font-size:0.85rem; color:#cbc3d9;">${message}</p>
        </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// --- 3. FUNCIONES DE RENDERIZADO Y ACCIÓN ---
window.actualizarContadorCarrito = function() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = window.cartStorage.length;
        badge.style.display = window.cartStorage.length > 0 ? 'flex' : 'none';
    }
};

window.agregarAlCarrito = function(id) {
    const eventos = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    const ev = eventos.find(e => e.id === id);
    if (ev) {
        window.cartStorage.push({ 
            id: ev.id, 
            name: ev.name, 
            price: ev.price, 
            image: ev.image 
        });
        localStorage.setItem('temp_cart', JSON.stringify(window.cartStorage));
        window.actualizarContadorCarrito();
        showToast("Ticket Added", ev.name);
    }
};

window.eliminarItem = function(index) {
    window.cartStorage.splice(index, 1);
    localStorage.setItem('temp_cart', JSON.stringify(window.cartStorage));
    window.actualizarContadorCarrito();
    // Re-renderizar el contenido del carrito después de borrar
    const container = document.getElementById('cart-items-container');
    if (container) {
        const cartModal = document.getElementById('cart-modal');
        // Si el modal está abierto, actualizamos la vista
        if (cartModal && cartModal.style.display === 'flex') {
            // Llamamos a la lógica de renderizado (definida en DOMContentLoaded)
            document.dispatchEvent(new CustomEvent('renderCart'));
        }
    }
};

// --- 4. LÓGICA DEL DOM Y MODAL ---
document.addEventListener('DOMContentLoaded', () => {
    const cartModal = document.getElementById('cart-modal');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const closeBtn = document.getElementById('continue-shopping');
    const btnBuy = document.getElementById('btn-complete-purchase');
    const container = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');

    // Inicializar contador al cargar
    window.actualizarContadorCarrito();

    // Función para dibujar los items en el modal
    const renderCartItems = () => {
        if (!container) return;
        container.innerHTML = '';
        let total = 0;

        window.cartStorage.forEach((item, index) => {
            total += parseFloat(item.price) || 0;
            container.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <img src="${item.image}" class="item-img-mini" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-price">$${item.price}</span>
                        </div>
                    </div>
                    <button onclick="window.eliminarItem(${index})" style="background:none; border:none; color:#ffb4ab; cursor:pointer;">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>`;
        });
        if (totalPriceElement) totalPriceElement.innerText = total.toFixed(2);
    };

    // Escuchar evento personalizado para re-renderizar
    document.addEventListener('renderCart', renderCartItems);

    // Abrir Modal
    if (cartIconBtn) {
        cartIconBtn.onclick = (e) => {
            e.preventDefault();
            renderCartItems();
            cartModal.style.display = 'flex';
        };
    }

    // Cerrar Modal
    if (closeBtn) {
        closeBtn.onclick = () => {
            cartModal.style.display = 'none';
        };
    }

    // Cerrar al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
    });

    // --- LÓGICA DE COMPRA ---
    const ejecutarCompra = (e) => {
        if (e) e.preventDefault();
        
        if (window.cartStorage.length === 0) {
            showToast("Error", "Your cart is empty");
            return;
        }

        const nombre = document.getElementById('cust-name').value;
        const email = document.getElementById('cust-email').value;

        if (!nombre || !email) {
            alert("Please fill in Name and Email");
            return;
        }

        const ticketID = "TH-" + Math.floor(100000 + Math.random() * 900000);
        
        const nuevaVenta = {
            id: ticketID,
            cliente: nombre,
            email: email,
            direccion: document.getElementById('cust-address')?.value || "",
            telefono: document.getElementById('cust-phone')?.value || "",
            monto: `$${totalPriceElement ? totalPriceElement.innerText : '0.00'}`,
            fecha: new Date().toLocaleString(),
            status: "Confirmed"
        };

        let ventas = JSON.parse(localStorage.getItem('tickethub_sales')) || [];
        ventas.push(nuevaVenta);
        localStorage.setItem('tickethub_sales', JSON.stringify(ventas));

        window.cartStorage = [];
        localStorage.setItem('temp_cart', JSON.stringify([]));
        window.actualizarContadorCarrito();

        showToast("Success!", "Purchase ID: " + ticketID);
        
        if (cartModal) cartModal.style.display = 'none';

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    if (btnBuy) {
        const parentForm = btnBuy.closest('form');
        if (parentForm) {
            parentForm.onsubmit = ejecutarCompra;
        } else {
            btnBuy.onclick = ejecutarCompra;
        }
    }
});