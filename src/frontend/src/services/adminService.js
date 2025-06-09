const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Dashboard API calls
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Dashboard istatistikleri alınamadı');
    }

    return data;
  } catch (error) {
    console.error('Dashboard stats hatası:', error);
    throw error;
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/activity`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Son aktiviteler alınamadı');
    }

    return data;
  } catch (error) {
    console.error('Recent activity hatası:', error);
    throw error;
  }
};

// Users API calls
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kullanıcılar alınamadı');
    }

    return data;
  } catch (error) {
    console.error('Users fetch hatası:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kullanıcı durumu güncellenemedi');
    }

    return data;
  } catch (error) {
    console.error('User status update hatası:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kullanıcı silinemedi');
    }

    return data;
  } catch (error) {
    console.error('User delete hatası:', error);
    throw error;
  }
};

// Items API calls
export const getAllItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/items`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ürünler alınamadı');
    }

    return data;
  } catch (error) {
    console.error('Items fetch hatası:', error);
    throw error;
  }
};

export const updateItemStatus = async (itemId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/items/${itemId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ürün durumu güncellenemedi');
    }

    return data;
  } catch (error) {
    console.error('Item status update hatası:', error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ürün silinemedi');
    }

    return data;
  } catch (error) {
    console.error('Item delete hatası:', error);
    throw error;
  }
};

// Rentals API calls
export const getAllRentals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/rentals`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralamalar alınamadı');
    }

    return data;
  } catch (error) {
    console.error('Rentals fetch hatası:', error);
    throw error;
  }
};

export const updateRentalStatus = async (rentalId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/rentals/${rentalId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Kiralama durumu güncellenemedi');
    }

    return data;
  } catch (error) {
    console.error('Rental status update hatası:', error);
    throw error;
  }
};

// Payments API calls
export const getPayments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/payments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ödeme verileri alınamadı');
    }

    return data;
  } catch (error) {
    console.error('Payments fetch hatası:', error);
    throw error;
  }
};

// Reports API calls
export const getReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Rapor verileri alınamadı');
    }

    return data;
  } catch (error) {
    console.error('Reports fetch hatası:', error);
    throw error;
  }
}; 