import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Box, IconButton, useMediaQuery, Grid, Card, CardContent, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const drawerWidth = 240;

function Home() {
  const [selectedOption, setSelectedOption] = useState('income');
  const [data, setData] = useState({
    income: {},
    users: {},
    services: {}
  });
  const [userss, setUserss] = useState([]);
  const [open, setOpen] = useState(false); // Drawer open state
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const urls = {
        users: 'https://oneapp.trivedagroup.com/api/c3/admin/allusers',
        services: 'https://oneapp.trivedagroup.com/api/c3/ser/allservice',
        income: 'https://oneapp.trivedagroup.com/api/c3/admin/getalldata'
      };

      const responses = await Promise.all(Object.values(urls).map(url =>
        axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      ));

      setData({
        users: responses[0].data.data,
        services: responses[1].data.services,
        income: responses[2].data
      });
      setUserss(responses[0].data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const renderContent = () => {
    const { income, users, services } = data;

    const dailyIncomeData = {
      labels: Object.keys(income.dailyIncome || {}),
      datasets: [{
        label: 'Daily Income',
        data: Object.values(income.dailyIncome || {}),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }],
    };

    const serviceIncomeData = {
      labels: Object.keys(income.serviceWiseIncome || {}),
      datasets: [{
        label: 'Service Wise Income',
        data: Object.values(income.serviceWiseIncome || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    };

    const employeeIncomeData = {
      labels: Object.keys(income.employeeIncomes || {}),
      datasets: [{
        label: 'Employee Income',
        data: Object.values(income.employeeIncomes || {}),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }],
    };

    const totalIncome = income.totalIncome || 0;
    const totalUsers = users.length || 0;
    const totalServices = services.length || 0;

    if (selectedOption === 'income') {
      return (
        <Box sx={{ padding: 0 }}>
          <Typography variant="h4" gutterBottom>Admin Panel</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Income</Typography>
                  <Typography variant="h5">${totalIncome}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h5">{totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Services</Typography>
                  <Typography variant="h5">{totalServices}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ padding: 3 }}>
            <Grid container spacing={3} sx={{ marginTop: 3 }}>
              <Grid item xs={12} md={6} sx={{ marginBottom: '20px' }}>
                <Box sx={{ height: { xs: '250px', sm: '300px', md: '350px' } }}>
                  <Typography variant="h6" gutterBottom>
                    Daily Income
                  </Typography>
                  <Line data={dailyIncomeData} options={{ maintainAspectRatio: false }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ marginBottom: '20px' }}>
                <Box sx={{ height: { xs: '250px', sm: '300px', md: '350px' } }}>
                  <Typography variant="h6" gutterBottom>
                    Service Wise Income
                  </Typography>
                  <Pie data={serviceIncomeData} options={{ maintainAspectRatio: false }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ marginBottom: '20px' }}>
                <Box sx={{ height: { xs: '250px', sm: '300px', md: '350px' } }}>
                  <Typography variant="h6" gutterBottom>
                    Employee Wise Income
                  </Typography>
                  <Bar data={employeeIncomeData} options={{ maintainAspectRatio: false }} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      );
    } else if (selectedOption === 'users') {
      const filteredUsers = userss.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())||
        String(user.number).toLowerCase().includes(searchQuery.toLowerCase())
      );
      return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Admin Panel</Typography>
          <Typography variant="h6" gutterBottom>Users</Typography>
          <TextField
            label="Search here..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <Grid container spacing={3}>
            {filteredUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2">Email: {user.email}</Typography>
                    <Typography variant="body2">Number: {user.number}</Typography>
                    {user.addresses.length > 0 && (
                      <>
                        {user.addresses.map((address, index) => (
                            <Box key={address._id} sx={{marginTop:'5px'}}>

                            <Typography variant="body2" >Address :{index + 1} {address.address}</Typography>
                            <Box sx={{ paddingLeft: 2 }}>

                            <Typography variant="body2">city : {address.address}</Typography>
                            <Typography variant="body2">Zipcode: {address.pincode}</Typography>
                            </Box>
                            </Box>
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    } else if (selectedOption === 'services') {
      return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Admin Panel</Typography>
          <Typography variant="h6" gutterBottom>Services</Typography>
          <Grid container spacing={3}>
            {data.services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{service.name}</Typography>
                    <Typography variant="body2">Price: ${service.amount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        <List>
          <ListItem button onClick={() => handleOptionClick('income')}>
            <ListItemText primary="Income" />
          </ListItem>
          <ListItem button onClick={() => handleOptionClick('users')}>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => handleOptionClick('services')}>
            <ListItemText primary="Services" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: (theme) => theme.palette.background.default,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            display: { sm: 'none' },
            mb: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
        {renderContent()}
      </Box>
    </Box>
  );
}

export default Home;
