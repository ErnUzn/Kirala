const API_BASE_URL = 'http://localhost:5000/api';

// Ürüne puan ver
export const rateItem = async (itemId, rating, comment = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/ratings/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Puan verilemedi');
    }

    return data;
  } catch (error) {
    console.error('Rate item error:', error);
    throw error;
  }
};

// Ürünün puanlarını getir
export const getItemRatings = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${itemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Puanlar getirilemedi');
    }

    return data;
  } catch (error) {
    console.error('Get item ratings error:', error);
    throw error;
  }
};

// Kullanıcının verdiği puanı getir
export const getUserRating = async (itemId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: true, review: null };
    }

    const response = await fetch(`${API_BASE_URL}/ratings/${itemId}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kullanıcı puanı getirilemedi');
    }

    return data;
  } catch (error) {
    console.error('Get user rating error:', error);
    return { success: true, review: null };
  }
}; 