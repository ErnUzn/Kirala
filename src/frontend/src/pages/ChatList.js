import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Badge
} from '@mui/material';
import {
  Chat as ChatIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getUserChats } from '../services/messageService';
import Chat from '../components/Chat';
import { getCurrentUserId } from '../services/authService';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      setCurrentUser({ id: userId });
      loadChats();
    }
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getUserChats();
      
      // Backend'den gelen aggregate veriyi frontend için düzenle
      const formattedChats = (response.data || []).map(chat => {
        const currentUserId = getCurrentUserId();
        
        // Karşı kullanıcıyı belirle (sender mi receiver mi)
        let otherUser;
        if (chat.sender && chat.sender[0] && chat.sender[0]._id !== currentUserId) {
          otherUser = chat.sender[0];
        } else if (chat.receiver && chat.receiver[0] && chat.receiver[0]._id !== currentUserId) {
          otherUser = chat.receiver[0];
        } else {
          // Fallback: sender'ı al
          otherUser = chat.sender && chat.sender[0] ? chat.sender[0] : (chat.receiver && chat.receiver[0] ? chat.receiver[0] : {});
        }
        
        return {
          ...chat,
          otherUser: otherUser,
          itemId: chat.item && chat.item[0] ? chat.item[0] : {},
          chatId: chat._id.chatId
        };
      });
      
      setChats(formattedChats);
    } catch (error) {
      console.error('Sohbetler yükleme hatası:', error);
      setError('Sohbetler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setSelectedChat(null);
    // Sohbetleri yeniden yükle (okunmamış mesaj sayısını güncellemek için)
    loadChats();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ChatIcon />
        Mesajlarım
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {chats.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Henüz mesajınız yok
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ürün sayfalarından ürün sahipleriyle mesajlaşmaya başlayabilirsiniz.
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {chats.map((chat, index) => (
              <React.Fragment key={chat.chatId}>
                <ListItem
                  button
                  onClick={() => handleChatClick(chat)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {chat.otherUser?.firstName || 'Bilinmeyen'} {chat.otherUser?.lastName || 'Kullanıcı'}
                        </Typography>
                        <Chip 
                          label={chat.itemId?.name || 'Bilinmeyen Ürün'} 
                          size="small" 
                          variant="outlined" 
                        />
                        {chat.unreadCount > 0 && (
                          <Badge badgeContent={chat.unreadCount} color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {chat.lastMessage?.messageType === 'discount_offer' 
                            ? `💰 İndirim teklifi: %${chat.lastMessage.discountOffer?.percentage}`
                            : chat.lastMessage?.content || 'Mesaj bulunamadı'
                          }
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleString('tr-TR') : ''}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < chats.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Chat Dialog */}
      {selectedChat && (
        <Chat
          open={chatOpen}
          onClose={handleChatClose}
          item={selectedChat.itemId}
          otherUser={selectedChat.otherUser}
          currentUser={currentUser}
        />
      )}
    </Container>
  );
};

export default ChatList; 