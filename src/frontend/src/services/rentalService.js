const API_BASE_URL = 'http://localhost:5000/api';

// Kiralama oluştur
export const createRental = async (rentalData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rentals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rentalData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralama oluşturulamadı');
    }

    return data;
  } catch (error) {
    console.error('Kiralama oluşturma hatası:', error);
    throw error;
  }
};

// Kullanıcının kiralamalarını getir
export const getUserRentals = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rentals/my-rentals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralamalar getirilemedi');
    }

    return data;
  } catch (error) {
    console.error('Kiralamalar getirme hatası:', error);
    throw error;
  }
};

// Kiralama iptal et
export const cancelRental = async (rentalId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralama iptal edilemedi');
    }

    return data;
  } catch (error) {
    console.error('Kiralama iptal etme hatası:', error);
    throw error;
  }
};

// Kiralama tamamla
export const completeRental = async (rentalId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralama tamamlanamadı');
    }

    return data;
  } catch (error) {
    console.error('Kiralama tamamlama hatası:', error);
    throw error;
  }
}; 

// Bekleyen kiralama taleplerini getir
export const getPendingRentals = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rentals/pending-approvals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Bekleyen kiralamalar getirilemedi');
    }

    return data;
  } catch (error) {
    console.error('Bekleyen kiralamalar getirme hatası:', error);
    throw error;
  }
};

// Kiralama talebini onayla
export const approveRental = async (rentalId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralama onaylanamadı');
    }

    return data;
  } catch (error) {
    console.error('Kiralama onaylama hatası:', error);
    throw error;
  }
};

// Kiralama talebini reddet
export const rejectRental = async (rentalId, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralama reddedilemedi');
    }

    return data;
  } catch (error) {
    console.error('Kiralama reddetme hatası:', error);
    throw error;
  }
}; 