// Objeto para manejar la página de inicio
const home = {
    // Cargar todos los productos
    async loadProductos(categoriaId = null) {
        try {
            const productosContainer = document.getElementById('productosContainer');
            productosContainer.innerHTML = '<div class="loading">Cargando productos...</div>';
            
            let url = `${API_URL}/productos`;
            if (categoriaId) {
                url += `?categoria=${categoriaId}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            
            const productos = await response.json();
            
            if (productos.length === 0) {
                productosContainer.innerHTML = '<div class="no-productos">No hay productos disponibles.</div>';
                return;
            }
            
            this.renderProductos(productos);
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('productosContainer').innerHTML = 
                `<div class="error">Error al cargar los productos: ${error.message}</div>`;
        }
    },
    
    // Renderizar productos en la página
    renderProductos(productos) {
        const productosContainer = document.getElementById('productosContainer');
        
        productosContainer.innerHTML = productos.map(producto => `
            <div class="producto-card">
                <img src="${producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : '../images/no-image.jpg'}" 
                     alt="${producto.nombre_producto}" 
                     class="producto-imagen">
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre_producto}</h3>
                    <p class="producto-descripcion">${producto.descripcion || 'Sin descripción'}</p>
                    <div class="producto-categoria">${producto.nombre_categoria || 'Sin categoría'}</div>
                    <div class="producto-precio">$${parseFloat(producto.precio).toFixed(2)}</div>
                    <a href="#" class="btn-ver-mas" data-id="${producto.id_producto}">Ver Detalles</a>
                </div>
            </div>
        `).join('');
        
        // Agregar event listeners a los botones "Ver Detalles"
        document.querySelectorAll('.btn-ver-mas').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                this.showProductoDetalle(id);
            });
        });
    },
    
    // Cargar categorías para el filtro
    async loadCategorias() {
        try {
            const categoriasContainer = document.getElementById('categoriasFilter');
            categoriasContainer.innerHTML = '<div class="loading">Cargando categorías...</div>';
            
            const response = await fetch(`${API_URL}/categorias`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar las categorías');
            }
            
            const categorias = await response.json();
            
            if (categorias.length === 0) {
                categoriasContainer.innerHTML = '<div class="no-categorias">No hay categorías disponibles.</div>';
                return;
            }
            
            this.renderCategorias(categorias);
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('categoriasFilter').innerHTML = 
                `<div class="error">Error al cargar las categorías: ${error.message}</div>`;
        }
    },
    
    // Renderizar categorías en el filtro
    renderCategorias(categorias) {
        const categoriasContainer = document.getElementById('categoriasFilter');
        
        categoriasContainer.innerHTML = `
            <button class="categoria-btn active" data-id="">Todas</button>
            ${categorias.map(categoria => `
                <button class="categoria-btn" data-id="${categoria.id_categoria}">${categoria.nombre_categoria}</button>
            `).join('')}
        `;
        
        // Agregar event listeners a los botones de categoría
        document.querySelectorAll('.categoria-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remover clase active de todos los botones
                document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
                // Agregar clase active al botón clickeado
                e.target.classList.add('active');
                
                const categoriaId = e.target.getAttribute('data-id');
                this.loadProductos(categoriaId || null);
            });
        });
    },
    
    // Mostrar detalles de un producto
    async showProductoDetalle(id) {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar los detalles del producto');
            }
            
            const producto = await response.json();
            
            // Crear modal para mostrar detalles
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content producto-detalle">
                    <span class="close">&times;</span>
                    <div class="producto-detalle-content">
                        <div class="producto-detalle-imagen">
                            <img src="${producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : '../images/no-image.jpg'}" 
                                 alt="${producto.nombre_producto}">
                        </div>
                        <div class="producto-detalle-info">
                            <h2>${producto.nombre_producto}</h2>
                            <div class="producto-detalle-categoria">${producto.nombre_categoria || 'Sin categoría'}</div>
                            <div class="producto-detalle-precio">$${parseFloat(producto.precio).toFixed(2)}</div>
                            <div class="producto-detalle-descripcion">
                                <h3>Descripción</h3>
                                <p>${producto.descripcion || 'Sin descripción'}</p>
                            </div>
                            <button class="btn-comprar">Agregar al Carrito</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Cerrar modal al hacer clic en X
            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            // Cerrar modal al hacer clic fuera del contenido
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            
            // Event listener para el botón de comprar
            const btnComprar = modal.querySelector('.btn-comprar');
            btnComprar.addEventListener('click', () => {
                alert('Funcionalidad de carrito en desarrollo');
            });
        } catch (error) {
            console.error('Error:', error);
            alert(`Error al cargar los detalles del producto: ${error.message}`);
        }
    },
    
    // Inicializar la página
    init() {
        console.log('Inicializando página de inicio...');
        
        // Cargar productos y categorías al iniciar
        this.loadProductos();
        this.loadCategorias();
        
        // Event listeners para los enlaces de navegación
        const inicioLink = document.getElementById('inicioLink');
        const inicioFooterLink = document.getElementById('inicioFooterLink');
        
        if (inicioLink) {
            inicioLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Redirigiendo a inicio...');
                window.location.href = 'home.html';
            });
        }
        
        if (inicioFooterLink) {
            inicioFooterLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Redirigiendo a inicio desde footer...');
                window.location.href = 'home.html';
            });
        }
        
        document.getElementById('categoriasLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.categorias-filter').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('categoriasFooterLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.categorias-filter').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('contactoLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('contactoFooterLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
        });
    }
};

// No inicializamos aquí, dejamos que home.html lo haga 