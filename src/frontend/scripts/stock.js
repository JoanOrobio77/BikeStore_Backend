// Gestión de stock
const stock = {
    // Obtener todo el stock
    async getAll() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_URL}/stock`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener stock por ID
    async getById(id) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_URL}/stock/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Actualizar stock
    async update(id, stockData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_URL}/stock/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stockData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Renderizar lista de stock
    renderList(stockItems) {
        const container = document.getElementById('stockList');
        if (!container) return;

        if (!stockItems || stockItems.length === 0) {
            container.innerHTML = '<p>No hay registros de stock disponibles.</p>';
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${stockItems.map(item => `
                        <tr>
                            <td>${item.id_stock}</td>
                            <td>${item.nombre_producto}</td>
                            <td>${item.cantidad}</td>
                            <td>
                                <button onclick="stock.showEditModal(${item.id_stock})">Actualizar Stock</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    // Mostrar modal de edición
    async showEditModal(id) {
        try {
            const stockItem = await this.getById(id);
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            modalContent.innerHTML = `
                <h3>Actualizar Stock</h3>
                <form id="editStockForm">
                    <div class="form-group">
                        <label for="cantidad">Cantidad:</label>
                        <input type="number" id="cantidad" value="${stockItem.cantidad}" min="0" required>
                    </div>
                    <button type="submit">Guardar</button>
                </form>
            `;

            modal.classList.add('show');
            
            document.getElementById('editStockForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    cantidad: document.getElementById('cantidad').value
                };
                
                try {
                    await this.update(id, formData);
                    modal.classList.remove('show');
                    this.loadStock();
                } catch (error) {
                    alert(error.message);
                }
            });
        } catch (error) {
            alert('Error al cargar los datos del stock: ' + error.message);
        }
    },

    // Cargar stock
    async loadStock() {
        try {
            const stockItems = await this.getAll();
            this.renderList(stockItems);
        } catch (error) {
            const container = document.getElementById('stockList');
            if (container) {
                container.innerHTML = `<p class="error">Error al cargar stock: ${error.message}</p>`;
            }
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('stockList')) {
        stock.loadStock();
    }
}); 