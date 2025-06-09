import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  ButtonGroup,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Send as SendIcon,
  LocalOffer as OfferIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingIcon
} from '@mui/icons-material';
import { sendMessage, sendDiscountOffer, getChatHistory, respondToDiscountOffer } from '../services/messageService';
import { createRental } from '../services/rentalService';

const MessageBubble = styled(Paper)(({ theme, isOwn, messageType }) => ({
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.5, 0),
  maxWidth: '70%',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  backgroundColor: 
    messageType === 'discount_offer' ? theme.palette.warning.light :
    messageType === 'discount_response' ? theme.palette.info.light :
    isOwn ? theme.palette.primary.light : theme.palette.grey[200],
  color: isOwn && messageType === 'text' ? 'white' : 'inherit',
  borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
}));

const ChatContainer = styled(Box)({
  height: '400px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px',
  gap: '4px'
});

const Chat = ({ open, onClose, item, otherUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);

  // loadChatHistory fonksiyonunu önce tanımla
  const loadChatHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // otherUser ownerInfo objesi olduğu için _id yerine userId kullan
      const otherUserId = otherUser._id || otherUser.userId;
      const response = await getChatHistory(item._id, otherUserId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Sohbet geçmişi yükleme hatası:', error);
      setError('Sohbet geçmişi yüklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [item?._id, otherUser?._id, otherUser?.userId]);

  // Sohbet geçmişini yükle
  useEffect(() => {
    if (open && item && otherUser) {
      loadChatHistory();
    }
  }, [open, item, otherUser, loadChatHistory]);

  // Yeni mesaj geldiğinde en alta scroll et
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Lütfen önce giriş yapın');
        window.location.href = '/login';
        return;
      }

      const messageData = {
        itemId: item._id,
        receiverId: otherUser._id || otherUser.userId,
        content: newMessage.trim(),
        messageType: 'text'
      };

      const response = await sendMessage(messageData);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      
      // Token geçersizse logout yap ve login sayfasına yönlendir
      if (error.message.includes('Geçersiz token') || error.message.includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        setError('Oturumunuz sona erdi, lütfen tekrar giriş yapın');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError('Mesaj gönderilemedi: ' + error.message);
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendDiscountOffer = async (percentage) => {
    try {
      setSending(true);
      const response = await sendDiscountOffer(item._id, otherUser._id || otherUser.userId, percentage);
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('İndirim teklifi gönderme hatası:', error);
      setError('İndirim teklifi gönderilemedi');
    } finally {
      setSending(false);
    }
  };

  const handleDiscountResponse = async (messageId, response) => {
    try {
      await respondToDiscountOffer(messageId, response);
      // Mesajları yeniden yükle
      await loadChatHistory();
    } catch (error) {
      console.error('İndirim teklifi yanıtlama hatası:', error);
      setError('İndirim teklifi yanıtlanamadı');
    }
  };

  const handleRentWithDiscount = async (discountedPrice, duration = 1) => {
    try {
      setSending(true);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + duration);

      const rentalData = {
        itemId: item._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: discountedPrice * duration
      };

      const response = await createRental(rentalData);
      
      if (response.success) {
        // Başarılı kiralama mesajı gönder
        await sendMessage({
          itemId: item._id,
          receiverId: otherUser._id || otherUser.userId,
          content: `İndirimli fiyatla kiralama talebim oluşturuldu! Toplam: ${discountedPrice * duration}₺`,
          messageType: 'text'
        });
        
        await loadChatHistory();
        alert('İndirimli kiralama talebi başarıyla oluşturuldu!');
      }
    } catch (error) {
      console.error('İndirimli kiralama hatası:', error);
      setError('İndirimli kiralama oluşturulamadı');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (message) => {
    const isOwn = message.senderId._id === (currentUser?.id || currentUser?._id);
    const isOwner = item.ownerInfo?.userId === (currentUser?.id || currentUser?._id);

    return (
      <MessageBubble
        key={message._id}
        isOwn={isOwn}
        messageType={message.messageType}
        elevation={1}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {isOwn ? 'Sen' : `${message.senderId.firstName} ${message.senderId.lastName}`}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 1 }}>
          {message.content}
        </Typography>

        {/* İndirim teklifi detayları */}
        {message.messageType === 'discount_offer' && (
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<OfferIcon />}
              label={`%${message.discountOffer.percentage} İndirim`}
              color="warning"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" display="block">
              Orijinal: {message.discountOffer.originalPrice}₺ → İndirimli: {message.discountOffer.discountedPrice}₺
            </Typography>
            
            {/* Sadece ürün sahibi yanıtlayabilir ve henüz yanıtlanmamışsa */}
            {!isOwn && isOwner && message.discountOffer.status === 'pending' && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={() => handleDiscountResponse(message._id, 'accepted')}
                >
                  Kabul Et
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={() => handleDiscountResponse(message._id, 'rejected')}
                >
                  Reddet
                </Button>
              </Box>
            )}

            {/* İndirim kabul edildiyse kiralama butonu göster - sadece teklifi gönderen kişiye */}
            {isOwn && message.discountOffer.status === 'accepted' && !isOwner && (
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingIcon />}
                  onClick={() => handleRentWithDiscount(message.discountOffer.discountedPrice)}
                  disabled={sending}
                >
                  İndirimli Kirala ({message.discountOffer.discountedPrice}₺)
                </Button>
              </Box>
            )}

            {/* İndirim durumu göstergesi */}
            {message.discountOffer.status !== 'pending' && (
              <Chip
                label={message.discountOffer.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                color={message.discountOffer.status === 'accepted' ? 'success' : 'error'}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {new Date(message.createdAt).toLocaleString('tr-TR')}
        </Typography>
      </MessageBubble>
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            {otherUser?.firstName || otherUser?.userName || 'Kullanıcı'} {otherUser?.lastName || ''} ile Sohbet
          </Typography>
          <Chip label={item?.name} variant="outlined" size="small" />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Mesaj listesi */}
        <ChatContainer ref={chatContainerRef}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
              Henüz mesaj yok. İlk mesajı sen gönder!
            </Typography>
          ) : (
            messages.map(renderMessage)
          )}
        </ChatContainer>

        <Divider sx={{ my: 2 }} />

        {/* İndirim teklifleri - sadece ürün sahibi değilse göster */}
        {item?.ownerInfo?.userId !== (currentUser?.id || currentUser?._id) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              İndirim Teklifi Gönder:
            </Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button
                onClick={() => handleSendDiscountOffer(5)}
                disabled={sending}
                startIcon={<OfferIcon />}
              >
                %5
              </Button>
              <Button
                onClick={() => handleSendDiscountOffer(10)}
                disabled={sending}
                startIcon={<OfferIcon />}
              >
                %10
              </Button>
              <Button
                onClick={() => handleSendDiscountOffer(15)}
                disabled={sending}
                startIcon={<OfferIcon />}
              >
                %15
              </Button>
            </ButtonGroup>
          </Box>
        )}

        {/* Mesaj gönderme alanı */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            sx={{ minWidth: 'auto', p: 1.5 }}
          >
            {sending ? <CircularProgress size={20} /> : <SendIcon />}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Chat; 