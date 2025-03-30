import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'page',
    status: true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      // TODO: API çağrısı yapılacak
      // Simüle edilmiş veri
      setContents([
        {
          id: 1,
          title: 'Hakkımızda',
          content: 'Şirketimiz hakkında bilgiler...',
          type: 'page',
          status: true,
          lastUpdated: '2024-03-15',
        },
        {
          id: 2,
          title: 'İletişim',
          content: 'İletişim bilgileri ve form...',
          type: 'page',
          status: true,
          lastUpdated: '2024-03-14',
        },
        {
          id: 3,
          title: 'SSS',
          content: 'Sıkça sorulan sorular...',
          type: 'page',
          status: true,
          lastUpdated: '2024-03-13',
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('İçerikler alınamadı:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (content = null) => {
    if (content) {
      setSelectedContent(content);
      setFormData(content);
    } else {
      setSelectedContent(null);
      setFormData({
        title: '',
        content: '',
        type: 'page',
        status: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContent(null);
    setFormData({
      title: '',
      content: '',
      type: 'page',
      status: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: API çağrısı yapılacak
      if (selectedContent) {
        // İçerik güncelleme
        setContents(
          contents.map((content) =>
            content.id === selectedContent.id
              ? { ...content, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
              : content
          )
        );
      } else {
        // Yeni içerik ekleme
        setContents([
          ...contents,
          {
            id: contents.length + 1,
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0],
          },
        ]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('İçerik kaydedilemedi:', error);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      try {
        // TODO: API çağrısı yapılacak
        setContents(contents.filter((content) => content.id !== contentId));
      } catch (error) {
        console.error('İçerik silinemedi:', error);
      }
    }
  };

  const handleStatusChange = async (contentId, newStatus) => {
    try {
      // TODO: API çağrısı yapılacak
      setContents(
        contents.map((content) =>
          content.id === contentId ? { ...content, status: newStatus } : content
        )
      );
    } catch (error) {
      console.error('İçerik durumu güncellenemedi:', error);
    }
  };

  const filteredContents = contents.filter((content) =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">İçerik Yönetimi</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni İçerik
        </Button>
      </Box>

      <SearchField
        fullWidth
        variant="outlined"
        placeholder="İçerik ara..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Başlık</TableCell>
                  <TableCell>İçerik</TableCell>
                  <TableCell>Tip</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Son Güncelleme</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>{content.title}</TableCell>
                    <TableCell>{content.content.substring(0, 50)}...</TableCell>
                    <TableCell>{content.type}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={content.status}
                            onChange={(e) =>
                              handleStatusChange(content.id, e.target.checked)
                            }
                          />
                        }
                      />
                    </TableCell>
                    <TableCell>{content.lastUpdated}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(content)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(content.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedContent ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Başlık"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="İçerik"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              margin="normal"
              multiline
              rows={10}
              required
            />
            <TextField
              fullWidth
              label="Tip"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              margin="normal"
              required
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="page">Sayfa</option>
              <option value="blog">Blog</option>
              <option value="announcement">Duyuru</option>
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                />
              }
              label="Aktif"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedContent ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminContent; 