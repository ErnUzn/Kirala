const API_BASE_URL = 'http://localhost:5000/api';

// Tüm ürünleri getir
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) {
      throw new Error('Ürünler yüklenirken bir hata oluştu');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    throw error;
  }
};

// Tek ürün getir
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    if (!response.ok) {
      throw new Error('Ürün yüklenirken bir hata oluştu');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ürün yüklenirken hata:', error);
    throw error;
  }
};

// Kullanıcının kendi ürünlerini getir
export const getMyProducts = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/items/my-items?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Ürünler yüklenirken bir hata oluştu');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Kullanıcı ürünleri yüklenirken hata:', error);
    throw error;
  }
};

// Ürün sil
export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Ürün silinirken bir hata oluştu');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    throw error;
  }
};

// Yeni ürün ekle
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Ürün eklenirken bir hata oluştu');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    throw error;
  }
};

// Kategoriye göre ürünleri filtrele
export const getProductsByCategory = (products, category) => {
  return products.filter(product => product.category === category);
};

// Ürün arama
export const searchProducts = (products, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
}; 