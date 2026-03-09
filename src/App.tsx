import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
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
} from '@mui/material';
import {
  Checkroom,
  ShoppingBag,
  Devices,
  BeachAccess,
  CheckCircle,
} from '@mui/icons-material';

interface InventoryItem {
  id: string;
  name: string;
  type: 'shoes' | 'shirts' | 'bags' | 'sandals' | 'electronics';
  purchaseAmount: number;
  soldAmount: number | null;
  isSold: boolean;
}

function App() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const totalPurchase = inventory.reduce((sum, item) => sum + item.purchaseAmount, 0);
  const totalSold = inventory.reduce((sum, item) => sum + (item.soldAmount || 0), 0);
  const totalProfit = totalSold - totalPurchase;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      const items: InventoryItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as InventoryItem);
      });
      setInventory(items.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    });

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

  const markAsSold = async (id: string) => {
    const itemRef = doc(db, 'inventory', id);
    await updateDoc(itemRef, { isSold: true });
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
    <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        Side Hustle Inventory
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' } }}>
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
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' } }}>
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
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' } }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Profit
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }} align="center">Status</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
