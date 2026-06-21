import React, { useState } from 'react';

function ProductForm() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const [productos, setProductos] = useState([]);
  const [errores, setErrores] = useState({});

  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const tamanoMaximoMB = 2;
    const tamanoEnBytes = tamanoMaximoMB * 1024 * 1024;

    if (archivo.size > tamanoEnBytes) {
      setErrores({
        ...errores,
        imagen: `El archivo es muy pesado. El tamaño máximo permitido es de ${tamanoMaximoMB}MB.`
      });
      setImagen(null);
      setPreview(null);
      return;
    }

    setErrores({ ...errores, imagen: null });
    setImagen(archivo);
    setPreview(URL.createObjectURL(archivo));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre del producto es obligatorio.';
    if (!categoria) nuevosErrores.categoria = 'Debes seleccionar una categoría.';
    if (!precio || Number(precio) <= 0) nuevosErrores.precio = 'El precio debe ser un número mayor a cero.';
    if (!stock || Number(stock) < 0) nuevosErrores.stock = 'El stock es obligatorio y no puede ser negativo.';
    if (!descripcion.trim()) nuevosErrores.descripcion = 'Añade una breve descripción del producto.';
    if (!imagen) nuevosErrores.imagen = 'Debes adjuntar una imagen para el producto.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      categoria,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      descripcion,
      imagenUrl: preview
    };

    setProductos([...productos, nuevoProducto]);

    setNombre('');
    setCategoria('');
    setPrecio('');
    setStock('');
    setDescripcion('');
    setImagen(null);
    setPreview(null);
    setErrores({});
  };

  const eliminarProducto = (idParaEliminar) => {
    const listaActualizada = productos.filter(producto => producto.id !== idParaEliminar);
    setProductos(listaActualizada);
  };

  return (
    <div className="techzone-wrapper">
      <header className="tech-header">
        <h1>TechZone <span>Store</span></h1>
        <div className="contador-badge">
          <span>{productos.length}</span> {productos.length === 1 ? 'Producto registrado' : 'Productos registrados'}
        </div>
      </header>

      <div className="main-container">
        <section className="form-section">
          <h2>Registro de Hardware</h2>
          
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Nombre del Producto *</label>
              <input 
                type="text" 
                placeholder="Ej: Tarjeta Gráfica RTX 4060"
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
              />
              {errores.nombre && <span className="error-text">{errores.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">-- Seleccionar Categoría --</option>
                <option value="Componentes PC">Componentes PC</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Monitores">Monitores</option>
                <option value="Almacenamiento">Almacenamiento</option>
                <option value="Laptops">Laptops</option>
              </select>
              {errores.categoria && <span className="error-text">{errores.categoria}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio ($) *</label>
                <input 
                  type="number" 
                  placeholder="250000"
                  value={precio} 
                  onChange={(e) => setPrecio(e.target.value)} 
                />
                {errores.precio && <span className="error-text">{errores.precio}</span>}
              </div>

              <div className="form-group">
                <label>Unidades en Stock *</label>
                <input 
                  type="number" 
                  placeholder="15"
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                />
                {errores.stock && <span className="error-text">{errores.stock}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Descripción técnica *</label>
              <textarea 
                rows="3" 
                placeholder="Detalles de memoria, conectividad, compatibilidad..."
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
              />
              {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
            </div>

            <div className="form-group">
              <label>Imagen del Producto (Max 2MB) *</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImagenChange} 
                className="file-input"
              />
              {errores.imagen && <span className="error-text">{errores.imagen}</span>}
            </div>

            {preview && (
              <div className="preview-container">
                <p className="preview-title">Vista previa de la foto:</p>
                <img src={preview} alt="Vista previa" className="img-preview" />
              </div>
            )}

            <button type="submit" className="btn-submit">
              Guardar en Inventario
            </button>
          </form>
        </section>

        <section className="inventory-section">
          <h2>Inventario Actual</h2>

          {productos.length === 0 ? (
            <div className="empty-state">
              <p>No hay productos registrados en la base de datos.</p>
            </div>
          ) : (
            <div className="products-grid">
              {productos.map((prod) => (
                <div key={prod.id} className="product-card">
                  <div className="card-img-container">
                    <img src={prod.imagenUrl} alt={prod.nombre} />
                    <span className="badge-cat">{prod.categoria}</span>
                  </div>

                  <div className="card-body">
                    <h3>{prod.nombre}</h3>
                    <p className="prod-desc">{prod.descripcion}</p>
                    
                    <div className="card-meta">
                      <span className="price">${prod.precio.toLocaleString('es-CL')}</span>
                      <span className="stock">Stock: {prod.stock} u.</span>
                    </div>

                    <button 
                      onClick={() => eliminarProducto(prod.id)} 
                      className="btn-delete"
                    >
                      Eliminar producto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductForm;