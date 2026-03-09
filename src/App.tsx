import { useState } from 'react';
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
  const [inventory, setInventory] = useState<InventoryItem[]>([
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
  ]);

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
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Side Hustle Inventory
      </Typography>
      
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Purchase Amount</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Sold Amount (₱)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
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
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Chip
                    icon={getTypeIcon(item.type)}
                    label={item.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">{formatPesos(item.purchaseAmount)}</TableCell>
                <TableCell align="right">
                  <TextField
                    size="small"
                    type="number"
                    value={item.soldAmount ?? ''}
                    onChange={(e) => handleSoldAmountChange(item.id, e.target.value)}
                    placeholder="Not sold"
                    disabled={item.isSold}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }}
                    sx={{ width: 150 }}
                  />
                </TableCell>
                <TableCell align="center">
                  {item.isSold ? (
                    <Chip 
                      icon={<CheckCircle />} 
                      label="Sold" 
                      color="success" 
                      size="small" 
                    />
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => markAsSold(item.id)}
                      disabled={!item.soldAmount}
                      startIcon={<CheckCircle />}
                    >
                      Mark Sold
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
