// Navegación
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main > section');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');

    // Manejar navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Mostrar la sección seleccionada
            document.getElementById(`${targetSection}Section`).classList.remove('hidden');
            
            // Cargar datos de la sección
            switch(targetSection) {
                case 'productos':
                    productos.loadProductos();
                    break;
                case 'categorias':
                    categorias.loadCategorias();
                    break;
                case 'ventas':
                    ventas.loadVentas();
                    break;
                case 'stock':
                    stock.loadStock();
                    break;
            }
        });
    });

    // Cerrar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Verificar autenticación
    if (auth.isAuthenticated()) {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('registerSection').classList.add('hidden');
        document.querySelector('nav').classList.remove('hidden');
        
        // Cargar sección inicial (productos)
        document.getElementById('productosSection').classList.remove('hidden');
        productos.loadProductos();
    } else {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('registerSection').classList.add('hidden');
        document.querySelector('nav').classList.add('hidden');
    }
}); 