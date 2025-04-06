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
                if (section) {
                    section.classList.add('hidden');
                }
            });
            
            // Mostrar la sección seleccionada
            const targetElement = document.getElementById(`${targetSection}Section`);
            if (targetElement) {
                targetElement.classList.remove('hidden');
                
                // Cargar datos de la sección
                switch(targetSection) {
                    case 'productos':
                        if (typeof productos !== 'undefined') {
                            productos.loadProductos();
                        }
                        break;
                    case 'categorias':
                        if (typeof categorias !== 'undefined') {
                            categorias.loadCategorias();
                        }
                        break;
                    case 'ventas':
                        if (typeof ventas !== 'undefined') {
                            ventas.loadVentas();
                        }
                        break;
                    case 'stock':
                        if (typeof stock !== 'undefined') {
                            stock.loadStock();
                        }
                        break;
                }
            }
        });
    });

    // Cerrar modal
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Cerrar modal al hacer clic fuera
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

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