import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Box, IconButton, useMediaQuery, Grid,Card,CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line ,Pie,Bar} from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const drawerWidth = 240;

function Home() {
  const [selectedOption, setSelectedOption] = useState('income');
  const [data, setData] = useState({
    income: {},
    users: {},
    services: {}
  });
  const [open, setOpen] = useState(false); // Drawer open state
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

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
        <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>Income Overview</Typography>
        
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
      <Box sx={{ marginTop: 3, height: { xs: '300px', sm: '400px', md: '500px' } }}>
        <Typography variant="h6">Daily Income</Typography>
        <Line data={dailyIncomeData} options={{ maintainAspectRatio: true }} />
      </Box>

      <Box sx={{ marginTop: 3, height: { xs: '300px', sm: '400px', md: '500px' } }}>
        <Typography variant="h6">Service Wise Income</Typography>
        <Pie data={serviceIncomeData} options={{ maintainAspectRatio: true }} />
      </Box>

      <Box sx={{ marginTop: 3, height: { xs: '300px', sm: '400px', md: '500px' } }}>
        <Typography variant="h6">Employee Wise Income</Typography>
        <Bar data={employeeIncomeData} options={{ maintainAspectRatio: true }} />
      </Box>
    </Box>
      </Box>
      );
    } else if (selectedOption === 'users') {
      return (
        <Box>
          <Typography variant="h6">Users</Typography>
          <Typography variant="body1">Total Users: {users.length}</Typography>
          {/* Render charts or data for users */}
          <Line
            data={{
              labels: users.map(user => user.name),
              datasets: [
                {
                  label: 'Number of Users',
                  data: users.map((_, index) => index + 1),
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
              ],
            }}
          />
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </Box>
      );
    } else if (selectedOption === 'services') {
      return (
        <Box>
          <Typography variant="h6">Services</Typography>
          <Typography variant="body1">Total Services: {services.length}</Typography>
          {/* Render charts or data for services */}
          <Line
            data={{
              labels: services.map(service => service.name),
              datasets: [
                {
                  label: 'Service Income',
                  data: services.map(service => service.amount),
                  borderColor: 'rgba(255, 206, 86, 1)',
                  backgroundColor: 'rgba(255, 206, 86, 0.2)',
                },
              ],
            }}
          />
          <pre>{JSON.stringify(services, null, 2)}</pre>
        </Box>
      );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleDrawerToggle}
        sx={{ display: isMobile ? 'block' : 'none',height:'20px' }}
      >
        <MenuIcon />
      </IconButton>
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
          {['income', 'users', 'services'].map((text) => (
            <ListItem
              button
              key={text}
              onClick={() => handleOptionClick(text)}
              selected={selectedOption === text}
            >
              <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)`, marginTop: '0' }} // Adjust marginTop if needed
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default Home;