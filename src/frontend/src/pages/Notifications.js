import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Paper,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ShoppingCart,
  Payment,
  Warning,
  SystemUpdate,
  Delete as DeleteIcon,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material';

const Notifications = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Yeni Mesaj',
      message: 'Kiralama talebiniz onaylandı',
      time: '5 dakika önce',
      type: 'success',
      read: false,
    },
    {
      id: 2,
      title: 'Ödeme Bildirimi',
      message: 'Ödemeniz başarıyla alındı',
      time: '1 saat önce',
      type: 'payment',
      read: false,
    },
    {
      id: 3,
      title: 'Hatırlatma',
      message: 'Kiralama süreniz yakında dolacak',
      time: '2 saat önce',
      type: 'warning',
      read: true,
    },
    {
      id: 4,
      title: 'Sistem Bildirimi',
      message: 'Profiliniz güncellendi',
      time: '1 gün önce',
      type: 'info',
      read: true,
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'payment':
        return <Payment color="primary" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 0) return true;
    if (selectedTab === 1) return !notification.read;
    return notification.read;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Bildirimler
        </Typography>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Tümü" />
          <Tab
            label="Okunmamış"
            icon={
              <Badge
                badgeContent={notifications.filter(n => !n.read).length}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            }
            iconPosition="end"
          />
          <Tab label="Okunmuş" />
        </Tabs>

        <List>
          {filteredNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.paper' }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" component="span">
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Chip
                          label="Yeni"
                          size="small"
                          color="error"
                          sx={{ height: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < filteredNotifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {filteredNotifications.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
            }}
          >
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Bildirim bulunmuyor
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Notifications; 