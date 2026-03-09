import { useState, useEffect } from 'react';
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
  Grid2 as Grid,
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
  const initialInventory: InventoryItem[] = [
    { id: '1', name: 'Nike SB Janoski Black Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '2', name: 'Nike SB Janoski Black Size 9', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '3', name: 'Nike SB Janoski Black Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '4', name: 'Nike SB Janoski Black Size 8', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '5', name: 'Nike SB Janoski White Size 8', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '6', name: 'Nike SB Janoski White Size 9', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '7', name: 'Nike SB Janoski Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '8', name: 'Nike SB Janoski Size 8.5', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '9', name: 'Nike SB Janoski Size 7.5', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '10', name: 'Nike SB Janoski Maroon Size 8.5', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '11', name: 'Nike SB Black Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
    { id: '12', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '13', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '14', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '15', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '16', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '17', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '18', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '19', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
    { id: '20', name: 'Supreme Kids Tee Navy Size L', type: 'shirts', purchaseAmount: 2850, soldAmount: null, isSold: false },
    { id: '21', name: 'Supreme Shadow Tee Navy Size L', type: 'shirts', purchaseAmount: 2850, soldAmount: null, isSold: false },
    { id: '22', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
    { id: '23', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
    { id: '24', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
    { id: '25', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
    { id: '26', name: 'PSU Power Supply', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
  ];

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const totalPurchase = inventory.reduce((sum, item) => sum + item.purchaseAmount, 0);
  const totalSold = inventory.reduce((sum, item) => sum + (item.soldAmount || 0), 0);
  const totalProfit = totalSold - totalPurchase;

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  const formatPesos = (amount: number | null) => {
    if (amount === null) return '-';
    return `₱${amount.toLocaleString('en-PH')}`;
  };

  const handleSoldAmountChange = (id: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, soldAmount: numValue } : item
    ));
  };

  const markAsSold = (id: string) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, isSold: true } : item
    ));
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
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
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
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
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
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
        </Grid>
      </Grid>
      
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
