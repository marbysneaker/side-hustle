import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import {
  Checkroom,
  ShoppingBag,
  Devices,
  BeachAccess,
  CheckCircle,
  Add,
  Edit,
} from '@mui/icons-material';

interface InventoryItem {
  id: string;
  name: string;
  type: 'shoes' | 'shirts' | 'bags' | 'sandals' | 'electronics';
  purchaseAmount: number;
  soldAmount: number | null;
  commission: number | null;
  isSold: boolean;
}

function App() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'shoes' as InventoryItem['type'],
    purchaseAmount: '',
  });

  const totalPurchase = inventory.reduce((sum, item) => sum + item.purchaseAmount, 0);
  const totalSold = inventory.reduce((sum, item) => sum + (item.soldAmount || 0), 0);
  const totalCommission = inventory.reduce((sum, item) => sum + (item.commission || 0), 0);
  const totalProfit = totalSold - totalPurchase - totalCommission;

  useEffect(() => {
    console.log('Setting up Firebase listener...');
    const unsubscribe = onSnapshot(
      collection(db, 'inventory'), 
      (snapshot) => {
        console.log('Firebase snapshot received, document count:', snapshot.size);
        const items: InventoryItem[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as InventoryItem);
        });
        console.log('Loaded items:', items.length);
        setInventory(items.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
        setLoading(false);
      },
      (error) => {
        console.error('Firebase error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatPesos = (amount: number | null) => {
    if (amount === null) return '-';
    return `₱${amount.toLocaleString('en-PH')}`;
  };

  const handleSoldAmountChange = async (id: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    const itemRef = doc(db, 'inventory', id);
    await updateDoc(itemRef, { soldAmount: numValue });
  };

  const handleCommissionChange = async (id: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    const itemRef = doc(db, 'inventory', id);
    await updateDoc(itemRef, { commission: numValue });
  };

  const markAsSold = async (id: string) => {
    const itemRef = doc(db, 'inventory', id);
    await updateDoc(itemRef, { isSold: true });
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.purchaseAmount) return;
    
    try {
      await addDoc(collection(db, 'inventory'), {
        name: newItem.name,
        type: newItem.type,
        purchaseAmount: parseFloat(newItem.purchaseAmount),
        soldAmount: null,
        commission: null,
        isSold: false,
      });
      
      setOpenDialog(false);
      setNewItem({ name: '', type: 'shoes', purchaseAmount: '' });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;
    
    try {
      const itemRef = doc(db, 'inventory', editingItem.id);
      await updateDoc(itemRef, {
        name: editingItem.name,
        type: editingItem.type,
        purchaseAmount: editingItem.purchaseAmount,
        soldAmount: editingItem.soldAmount,
        commission: editingItem.commission,
        isSold: editingItem.isSold,
      });
      
      setOpenEditDialog(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem({ ...item });
    setOpenEditDialog(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shoes':
        return <BeachAccess sx={{ fontSize: 18 }} />;
      case 'shirts':
        return <Checkroom sx={{ fontSize: 18 }} />;
      case 'bags':
        return <ShoppingBag sx={{ fontSize: 18 }} />;
      case 'sandals':
        return <BeachAccess sx={{ fontSize: 18 }} />;
      case 'electronics':
        return <Devices sx={{ fontSize: 18 }} />;
      default:
        return <ShoppingBag sx={{ fontSize: 18 }} />;
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6">Loading inventory...</Typography>
        </Box>
      </Backdrop>

      <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          Side Hustle Inventory
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          Add Item
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(25% - 16px)' } }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
              <Typography variant="h5" color="error.main">
                {formatPesos(totalPurchase)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(25% - 16px)' } }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Sold
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatPesos(totalSold)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(25% - 16px)' } }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Commission/Fees
              </Typography>
              <Typography variant="h5" color="warning.main">
                {formatPesos(totalCommission)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(25% - 16px)' } }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Net Profit
              </Typography>
              <Typography 
                variant="h5" 
                color={totalProfit >= 0 ? 'success.main' : 'error.main'}
              >
                {formatPesos(totalProfit)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer 
          component={Paper} 
          elevation={2}
          sx={{ 
            overflowX: 'auto',
            '& .MuiTable-root': {
              minWidth: { xs: 600, sm: 750 }
            }
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }} align="right">Purchase</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }} align="right">Sold (₱)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }} align="right">Commission</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }} align="center">Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow 
                  key={item.id} 
                  hover
                  sx={{ 
                    bgcolor: item.isSold ? 'success.light' : 'inherit',
                    opacity: item.isSold ? 0.7 : 1 
                  }}
                >
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{item.name}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(item.type)}
                      label={item.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{formatPesos(item.purchaseAmount)}</TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      value={item.soldAmount ?? ''}
                      onChange={(e) => handleSoldAmountChange(item.id, e.target.value)}
                      placeholder="Not sold"
                      disabled={item.isSold}
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                          sx: { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
                        }
                      }}
                      sx={{ width: { xs: 100, sm: 130 } }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      value={item.commission ?? ''}
                      onChange={(e) => handleCommissionChange(item.id, e.target.value)}
                      placeholder="No fee"
                      disabled={item.isSold}
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                          sx: { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
                        }
                      }}
                      sx={{ width: { xs: 100, sm: 130 } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {item.isSold ? (
                      <Chip 
                        icon={<CheckCircle sx={{ fontSize: { xs: 14, sm: 16 } }} />} 
                        label="Sold" 
                        color="success" 
                        size="small"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => markAsSold(item.id)}
                        disabled={!item.soldAmount}
                        startIcon={<CheckCircle sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                        sx={{ 
                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                          px: { xs: 1, sm: 2 },
                          py: { xs: 0.5, sm: 1 }
                        }}
                      >
                        Mark
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openEditModal(item)}
                      startIcon={<Edit sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 0.5, sm: 0.75 }
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {inventory.map((item) => (
          <Card 
            key={item.id} 
            sx={{ 
              mb: 1, 
              bgcolor: item.isSold ? 'success.light' : 'inherit',
              opacity: item.isSold ? 0.8 : 1 
            }}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                    <Chip
                      icon={getTypeIcon(item.type)}
                      label={item.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 20 }}
                    />
                    {item.isSold && (
                      <Chip 
                        icon={<CheckCircle sx={{ fontSize: 12 }} />} 
                        label="Sold" 
                        color="success" 
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    )}
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openEditModal(item)}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <Edit sx={{ fontSize: 16 }} />
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Buy: {formatPesos(item.purchaseAmount)}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>•</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    type="number"
                    value={item.soldAmount ?? ''}
                    onChange={(e) => handleSoldAmountChange(item.id, e.target.value)}
                    placeholder="Sold"
                    disabled={item.isSold}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start" sx={{ mr: 0.5 }}>₱</InputAdornment>,
                        sx: { fontSize: '0.75rem', height: 28 }
                      }
                    }}
                    sx={{ width: 80 }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    value={item.commission ?? ''}
                    onChange={(e) => handleCommissionChange(item.id, e.target.value)}
                    placeholder="Fee"
                    disabled={item.isSold}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start" sx={{ mr: 0.5 }}>₱</InputAdornment>,
                        sx: { fontSize: '0.75rem', height: 28 }
                      }
                    }}
                    sx={{ width: 70 }}
                  />
                  {!item.isSold && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => markAsSold(item.id)}
                      disabled={!item.soldAmount}
                      sx={{ 
                        fontSize: '0.65rem',
                        minWidth: 'auto',
                        px: 1,
                        height: 28
                      }}
                    >
                      ✓
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Item Name"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="e.g., Nike Air Max Size 10"
            />
            <TextField
              select
              label="Type"
              fullWidth
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value as InventoryItem['type'] })}
            >
              <MenuItem value="shoes">Shoes</MenuItem>
              <MenuItem value="shirts">Shirts</MenuItem>
              <MenuItem value="bags">Bags</MenuItem>
              <MenuItem value="sandals">Sandals</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
            </TextField>
            <TextField
              label="Purchase Amount"
              fullWidth
              type="number"
              value={newItem.purchaseAmount}
              onChange={(e) => setNewItem({ ...newItem, purchaseAmount: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddItem} 
            variant="contained" 
            disabled={!newItem.name || !newItem.purchaseAmount}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {editingItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Item Name"
                fullWidth
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />
              <TextField
                select
                label="Type"
                fullWidth
                value={editingItem.type}
                onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as InventoryItem['type'] })}
              >
                <MenuItem value="shoes">Shoes</MenuItem>
                <MenuItem value="shirts">Shirts</MenuItem>
                <MenuItem value="bags">Bags</MenuItem>
                <MenuItem value="sandals">Sandals</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
              </TextField>
              <TextField
                label="Purchase Amount"
                fullWidth
                type="number"
                value={editingItem.purchaseAmount}
                onChange={(e) => setEditingItem({ ...editingItem, purchaseAmount: parseFloat(e.target.value) })}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                  }
                }}
              />
              <TextField
                label="Sold Amount"
                fullWidth
                type="number"
                value={editingItem.soldAmount ?? ''}
                onChange={(e) => setEditingItem({ ...editingItem, soldAmount: e.target.value ? parseFloat(e.target.value) : null })}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                  }
                }}
                placeholder="Not sold yet"
              />
              <TextField
                label="Commission/Fees"
                fullWidth
                type="number"
                value={editingItem.commission ?? ''}
                onChange={(e) => setEditingItem({ ...editingItem, commission: e.target.value ? parseFloat(e.target.value) : null })}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                  }
                }}
                placeholder="No commission"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleEditItem} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </>
  );
}

export default App;
