import mongoose from 'mongoose';
import { Schema, model, Document } from 'mongoose';

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/product_db');
    console.log('Conexión a MongoDB establecida con éxito');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}

// 2. Definición del esquema y modelo
interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

const Product = model<IProduct>('Product', ProductSchema);

// 3. Implementación de operaciones CRUD

// CREATE - Crear un nuevo producto
async function createProduct(productData) {
  try {
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    console.log('Producto creado:', savedProduct);
    return savedProduct;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
}

// READ - Obtener todos los productos
async function getAllProducts() {
  try {
    const products = await Product.find();
    console.log('Total de productos encontrados:', products.length);
    return products;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
}

// READ - Obtener un producto por ID
async function getProductById(id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      console.log('Producto no encontrado');
      return null;
    }
    console.log('Producto encontrado:', product);
    return product;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw error;
  }
}

// UPDATE - Actualizar un producto
async function updateProduct(id, updateData) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      console.log('Producto no encontrado para actualizar');
      return null;
    }
    console.log('Producto actualizado:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
}


// DELETE - Eliminar un producto

async function deleteProduct(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      console.log('Producto no encontrado para eliminar');
      return false;
    }
    console.log('Producto eliminado con éxito');
    return true;
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error;
  }
}

// 4. Función principal para probar las operaciones CRUD

async function runCrudOperations() {
  await connectToDatabase();
  
  try {
    console.log('\n--- CREACIÓN DE PRODUCTOS ---');
    const product1 = await createProduct({
      name: 'Notebook hp',
      price: 899.99,
      description: 'Notebook con procesador i7, 16GB RAM, 512GB SSD',
      category: 'Electrónica'
    });
    
    const product2 = await createProduct({
      name: 'Samsung Galaxy',
      price: 699.99,
      description: 'pantalla AMOLED, 128GB almacenamiento',
      category: 'Telefonos'
    });
    
    console.log('\n--- OBTENER TODOS LOS PRODUCTOS ---');
    const allProducts = await getAllProducts();
    
    console.log('\n--- OBTENER PRODUCTO POR ID ---');
    if (product1) {
      const foundProduct = await getProductById(product1._id);
    }
    
    console.log('\n--- ACTUALIZAR PRODUCTO ---');
    if (product1) {
      const updatedProduct = await updateProduct(product1._id, {
        price: 849.99,
        description: 'Notebook con procesador i7, 16GB RAM, 512GB SSD, Windows 11'
      });
    }
    
    console.log('\n--- OBTENER PRODUCTOS ACTUALIZADOS ---');
    await getAllProducts();
    
    console.log('\n--- ELIMINAR PRODUCTO ---');
    if (product2) {
      await deleteProduct(product2._id);
    }
    
    console.log('\n--- VERIFICAR PRODUCTOS DESPUÉS DE ELIMINAR ---');
    await getAllProducts();
    
  } catch (error) {
    console.error('Error en las operaciones CRUD:', error);
  } finally {
    
    // Cerrar la conexión a la base de datos
   
    await mongoose.connection.close();
    console.log('\nConexión a MongoDB cerrada');
  }
}

// Ejecutar el programa

runCrudOperations();