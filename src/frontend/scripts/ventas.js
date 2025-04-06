// Gestión de ventas
const ventas = {
    // Obtener todas las ventas
    async getAll() {
        try {
            const response = await fetch(`${API_URL}/ventas`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Crear venta
    async create(ventaData) {
        try {
            const response = await fetch(`${API_URL}/ventas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener detalles de una venta
    async getDetalles(ventaId) {
        try {
            const response = await fetch(`${API_URL}/detalle-ventas/venta/${ventaId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Renderizar lista de ventas
    renderList(ventas) {
        const container = document.getElementById('ventasList');
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${ventas.map(venta => `
                        <tr>
                            <td>${venta.id_venta}</td>
                            <td>${new Date(venta.fecha_venta).toLocaleDateString()}</td>
                            <td>${venta.total}</td>
                            <td>
                                <button onclick="ventas.showDetalles(${venta.id_venta})">Ver Detalles</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    // Mostrar detalles de una venta
    async showDetalles(ventaId) {
        const detalles = await this.getDetalles(ventaId);
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = `
            <h3>Detalles de la Venta</h3>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${detalles.map(detalle => `
                        <tr>
                            <td>${detalle.nombre_producto}</td>
                            <td>${detalle.cantidad}</td>
                            <td>${detalle.precio_unitario}</td>
                            <td>${detalle.subtotal}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        modal.classList.remove('hidden');
    },

    // Cargar ventas
    async loadVentas() {
        try {
            const ventas = await this.getAll();
            this.renderList(ventas);
        } catch (error) {
            alert('Error al cargar ventas');
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const addVentaBtn = document.getElementById('addVentaBtn');
    
    if (addVentaBtn) {
        addVentaBtn.addEventListener('click', () => {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            modalContent.innerHTML = `
                <h3>Nueva Venta</h3>
                <form id="addVentaForm">
                    <div class="form-group">
                        <label for="producto">Producto:</label>
                        <select id="producto" required>
                            <option value="">Seleccione un producto</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="cantidad">Cantidad:</label>
                        <input type="number" id="cantidad" min="1" required>
                    </div>
                    <button type="submit">Crear Venta</button>
                </form>
            `;

            modal.classList.remove('hidden');
            
            // Cargar productos en el select
            productos.getAll().then(productos => {
                const select = document.getElementById('producto');
                productos.forEach(producto => {
                    const option = document.createElement('option');
                    option.value = producto.id_producto;
                    option.textContent = `${producto.nombre} - $${producto.precio}`;
                    select.appendChild(option);
                });
            });
            
            document.getElementById('addVentaForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    id_producto: document.getElementById('producto').value,
                    cantidad: document.getElementById('cantidad').value
                };
                
                try {
                    await ventas.create(formData);
                    modal.classList.add('hidden');
                    ventas.loadVentas();
                } catch (error) {
                    alert(error.message);
                }
            });
        });
    }
}); 