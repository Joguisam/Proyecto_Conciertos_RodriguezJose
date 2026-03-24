# Conciertos Conectados 🎸

**Conciertos Conectados** es una plataforma web integral diseñada para la gestión y venta de entradas a eventos musicales y culturales. El proyecto surge como solución digital para permitir que los clientes adquieran boletos de forma rápida y sencilla, mientras ofrece una herramienta administrativa robusta para el control de inventario y ventas.

---

## 🚀 Características Principales

### 👤 Front de Clientes (Vista Pública)
* **Catálogo Dinámico:** Visualización de eventos con imagen, fecha, hora, lugar y precio.
* **Buscador y Filtros:** Búsqueda por palabras clave en tiempo real y filtrado avanzado por **ciudad** (Bogotá, Medellín, etc.) y **categoría**.
* **Detalle de Producto:** Vista ampliada con descripción completa del evento.
* **Carrito de Compras:** Sistema basado en un modal que permite gestionar la selección de boletos antes de la compra.
* **Checkout Integrado:** Formulario de registro de datos del cliente (ID, nombre, dirección, etc.) con confirmación de compra exitosa.

### 🔐 Front de Administración (Privado)
* **Autenticación de Seguridad:** Login para usuarios autorizados.
    * *Credenciales por defecto:* `admin@mail.com` | `123456`
* **Dashboard de Control:** Menú de navegación intuitivo hacia los módulos de gestión.
* **Gestión de Categorías (CRUD):** Registro de nuevas categorías mediante modales, con opción de edición y eliminación.
* **Gestión de Eventos (CRUD):** Control total sobre el inventario (imágenes, precios, horarios y locaciones).
* **Módulo de Ventas:** Historial detallado de transacciones ordenado cronológicamente, incluyendo datos del cliente y totales.

---

## 🛠️ Stack Tecnológico

Este proyecto ha sido desarrollado siguiendo estándares modernos de desarrollo web sin librerías externas pesadas:

* **Estructura:** HTML5 Semántico.
* **Estilos:** CSS3 (Diseño responsivo y layouts basados en Flexbox/Grid).
* **Lógica de Programación:** JavaScript (ES6+).
* **Arquitectura:** Uso de **Web Components** para la creación de elementos de UI reutilizables y encapsulados.
* **Persistencia de Datos:** `localStorage` para el almacenamiento local de categorías, eventos y registros de ventas.

---

## 📦 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/conciertos-conectados.git](https://github.com/tu-usuario/conciertos-conectados.git)
    ```
2.  **Navegar al directorio:**
    ```bash
    cd conciertos-conectados
    ```
3.  **Ejecutar el proyecto:**
    Puedes abrir el archivo `index.html` directamente en tu navegador o utilizar una extensión como **Live Server** en Visual Studio Code.

---

## 📐 Consideraciones Técnicas y UI/UX
* **Propuesta UI:** Se incluyen los wireframes diseñados para garantizar una navegación fluida tanto para el administrador como para el cliente final.
* **Feedback al Usuario:** Implementación de mensajes de confirmación y error en tiempo real para cada acción realizada (alertas/toasts).
* **Persistencia:** La aplicación mantiene los datos guardados en el navegador incluso después de recargar la página gracias a la integración con la Web Storage API.

---

## 👥 Créditos
Proyecto desarrollado para la asignatura de **Programación y Diseño Digital**.

---