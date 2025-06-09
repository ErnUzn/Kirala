const API_BASE_URL = 'http://localhost:5000/api';

// Mevcut kullanıcı bilgilerini getir
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kullanıcı bilgileri getirilemedi');
    }

    return data.user;
  } catch (error) {
    console.error('Kullanıcı bilgileri getirme hatası:', error);
    return null;
  }
};

// Token'dan kullanıcı ID'sini çıkar (geçici çözüm)
export const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    // JWT token'ı decode et (basit yöntem)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (error) {
    console.error('Token decode hatası:', error);
    return null;
  }
};

// Giriş kontrolü
export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
}; 