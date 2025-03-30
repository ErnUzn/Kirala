import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Badge,
  Paper,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const MessageContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const MessageInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    // Simüle edilmiş konuşma verileri
    const mockConversations = [
      {
        id: 1,
        user: 'Ahmet Yılmaz',
        lastMessage: 'Kamerayı ne zaman teslim edebilirsiniz?',
        timestamp: '10:30',
        unread: 2,
        avatar: 'https://source.unsplash.com/random/100x100?portrait',
      },
      {
        id: 2,
        user: 'Ayşe Demir',
        lastMessage: 'Drone için fiyat teklifiniz nedir?',
        timestamp: '09:15',
        unread: 0,
        avatar: 'https://source.unsplash.com/random/100x100?woman',
      },
    ];

    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Simüle edilmiş mesaj verileri
      const mockMessages = [
        {
          id: 1,
          sender: 'Ahmet Yılmaz',
          message: 'Merhaba, kamera hakkında bilgi almak istiyorum.',
          timestamp: '10:00',
          isOwn: false,
        },
        {
          id: 2,
          sender: 'Ben',
          message: 'Merhaba, nasıl yardımcı olabilirim?',
          timestamp: '10:05',
          isOwn: true,
        },
        {
          id: 3,
          sender: 'Ahmet Yılmaz',
          message: 'Kamerayı ne zaman teslim edebilirsiniz?',
          timestamp: '10:30',
          isOwn: false,
        },
      ];

      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'Ben',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };

      setMessages([...messages, message]);
      setNewMessage('');

      // Konuşma listesini güncelle
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: newMessage, timestamp: message.timestamp }
            : conv
        )
      );
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mesajlar
      </Typography>

      <Grid container spacing={3}>
        {/* Sol Taraf - Konuşma Listesi */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <List>
                {conversations.map((conversation) => (
                  <React.Fragment key={conversation.id}>
                    <ListItem
                      button
                      selected={selectedConversation?.id === conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="primary"
                          variant="dot"
                          invisible={conversation.unread === 0}
                        >
                          <Avatar src={conversation.avatar} />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={conversation.user}
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            noWrap
                          >
                            {conversation.lastMessage}
                          </Typography>
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        {conversation.timestamp}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Taraf - Mesaj Detayları */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <MessageContainer>
                {selectedConversation ? (
                  <>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="h6">
                        {selectedConversation.user}
                      </Typography>
                    </Box>

                    <MessageList>
                      {messages.map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Paper
                            sx={{
                              p: 2,
                              maxWidth: '70%',
                              backgroundColor: message.isOwn
                                ? 'primary.light'
                                : 'grey.100',
                              color: message.isOwn ? 'white' : 'text.primary',
                            }}
                          >
                            <Typography variant="body1">{message.message}</Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                mt: 0.5,
                                opacity: 0.7,
                              }}
                            >
                              {message.timestamp}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                    </MessageList>

                    <MessageInput>
                      <form onSubmit={handleSendMessage}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <AttachFileIcon />
                          </IconButton>
                          <IconButton size="small">
                            <ImageIcon />
                          </IconButton>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Mesajınızı yazın..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            size="small"
                          />
                          <IconButton
                            color="primary"
                            type="submit"
                            disabled={!newMessage.trim()}
                          >
                            <SendIcon />
                          </IconButton>
                        </Box>
                      </form>
                    </MessageInput>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography color="text.secondary">
                      Mesajlaşmak için bir konuşma seçin
                    </Typography>
                  </Box>
                )}
              </MessageContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages; 