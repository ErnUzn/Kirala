const API_BASE_URL = 'http://localhost:5000/api';

// Mesaj gönder
export const sendMessage = async (messageData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(messageData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Mesaj gönderilemedi');
    }

    return data;
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    throw error;
  }
};

// İndirim teklifi gönder
export const sendDiscountOffer = async (itemId, receiverId, percentage) => {
  try {
    const messageData = {
      itemId,
      receiverId,
      content: `%${percentage} indirim teklifi yapıyorum!`,
      messageType: 'discount_offer',
      discountOffer: {
        percentage
      }
    };

    return await sendMessage(messageData);
  } catch (error) {
    console.error('İndirim teklifi gönderme hatası:', error);
    throw error;
  }
};

// Sohbet geçmişini getir
export const getChatHistory = async (itemId, otherUserId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages/chat/${otherUserId}/${itemId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Sohbet geçmişi getirilemedi');
    }

    return data;
  } catch (error) {
    console.error('Sohbet geçmişi getirme hatası:', error);
    throw error;
  }
};

// Kullanıcının tüm sohbetlerini getir
export const getUserChats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages/chats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Sohbetler getirilemedi');
    }

    return data;
  } catch (error) {
    console.error('Sohbetler getirme hatası:', error);
    throw error;
  }
};

// İndirim teklifini yanıtla
export const respondToDiscountOffer = async (messageId, response) => {
  try {
    const token = localStorage.getItem('token');
    const apiResponse = await fetch(`${API_BASE_URL}/messages/${messageId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ response })
    });

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      throw new Error(data.message || 'İndirim teklifi yanıtlanamadı');
    }

    return data;
  } catch (error) {
    console.error('İndirim teklifi yanıtlama hatası:', error);
    throw error;
  }
}; 