import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText,Button, Typography, Box, IconButton, useMediaQuery, Grid, Card, CardContent, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';
const drawerWidth = 240;

function Home() {
  const [selectedOption, setSelectedOption] = useState('income');
  const [data, setData] = useState({
    income: {},
    users: {},
    services: {}
  });
  const [bookings,setBookings]=useState([]);
  const [userss, setUserss] = useState([]);
  const [servicess, setServicess] = useState([]);
  const [open, setOpen] = useState(false); 
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');

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
        income: 'https://oneapp.trivedagroup.com/api/c3/admin/getalldata',
        bookings:'https://oneapp.trivedagroup.com/api/c3/admin/getallbookings'
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
      setServicess(responses[1].data.services);
      setBookings(responses[3].data.data)
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

  const groupBookingsByDate = (bookings) => {
    return bookings.reduce((groupedBookings, booking) => {
      const date = moment(booking.date).format('YYYY-MM-DD');
      if (!groupedBookings[date]) {
        groupedBookings[date] = [];
      }
      groupedBookings[date].push(booking);
      return groupedBookings;
    }, {});
  };

  const renderContent = () => {
    const { income, users, services } = data;
    const groupedBookings = groupBookingsByDate(bookings);
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
    const [loadingService, setLoadingService] = useState(null);

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
      const filteredServices = servicess.filter(service =>
        service.name.toLowerCase().includes(searchQuery2.toLowerCase()) ||
        service.email.toLowerCase().includes(searchQuery2.toLowerCase())||
        String(service.number).toLowerCase().includes(searchQuery2.toLowerCase())||
        service.service.toLowerCase().includes(searchQuery2.toLowerCase())||
        service.role.toLowerCase().includes(searchQuery2.toLowerCase())

      );
      const handleServiceRole = async (serviceId) => {
        setLoadingService(serviceId);
        try {
          const response = await axios.put(
            'https://oneapp.trivedagroup.com/api/c3/admin/disableservice',
            { serviceId: serviceId },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
              },
            }
          );
      
          let newRole;
          if (response.data.message === 'Service enabled') {
            newRole = 'service';
            alert('Service enabled');
          } else if (response.data.message === 'Service disabled') {
            newRole = 'disabled';
            alert('Service disabled');
          } else {
            alert('Unexpected response');
            return;
          }
      
          setServicess((prevServices) =>
            prevServices.map((service) =>
              service._id === serviceId ? { ...service, role: newRole } : service
            )
          );
        } catch (error) {
          console.error('Error updating service role:', error);
          alert('An error occurred while updating the service role.');
        }
       finally {
        setLoadingService(null);
      }
        
      };
      
      
      return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Admin Panel</Typography>
          <Typography variant="h6" gutterBottom>Services</Typography>
          <TextField
            label="Search here..."
            variant="outlined"
            fullWidth
            value={searchQuery2}
            onChange={(e) => setSearchQuery2(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">Name: {service.name}</Typography>
                    <Typography variant="body2">service: {service.service}</Typography>
                    <Typography variant="body2">number: {service.number}</Typography>
                    <Typography variant="body2">Price: ${service.amount}</Typography>
                    <Typography variant="body2">status: {service.role}</Typography>
                
                            <Box key={service.addresses[0].address._id} sx={{marginTop:'5px',marginBottom:'10px'}}>
                            <Typography variant="body2" >Address : {service.addresses[0].address.address}</Typography>
                            <Box sx={{ paddingLeft: 2 }}>

                            <Typography variant="body2">place : {service.addresses[0].address}</Typography>
                            <Typography variant="body2">Zipcode: {service.addresses[0].pincode}</Typography>
                            </Box>
                            </Box>
                            <Button
  variant="contained"
  sx={{
    backgroundColor: '#588157',
    color: '#ffffff', 
    '&:hover': {
      backgroundColor: '#3a5a40', 
      color: '#e0e0e0', 
    },
    '&:active': {
      backgroundColor: '#3a5a40', 
      color: '#ffffff',
    }
  }}
  onClick={() => handleServiceRole(service._id)}
  disabled={loadingService === service._id} 
>
  {loadingService === service._id ? 'Loading...' : 'Change status'}
</Button>


                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }else if (selectedOption === 'bookings') {
      const filteredBookings = bookings.filter(booking =>
        booking.name.toLowerCase().includes(searchQuery3.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchQuery3.toLowerCase()) ||
        String(booking.phonenumber).toLowerCase().includes(searchQuery3.toLowerCase())||
        String(booking.bookingId).toLowerCase().includes(searchQuery3.toLowerCase())

      );

      const groupedBookings = groupBookingsByDate(filteredBookings);

      return (
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>Bookings</Typography>
          <TextField
            label="Search here..."
            variant="outlined"
            fullWidth
            value={searchQuery3}
            onChange={(e) => setSearchQuery3(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          {Object.keys(groupedBookings).map(date => (
            <Box key={date} sx={{ marginBottom: 3 }}>
              <Typography variant="h6" gutterBottom>{moment(date).format('MMMM Do YYYY')}</Typography>
              <Grid container spacing={3}>
                {groupedBookings[date].map(booking => (
                  <Grid item xs={12} sm={6} md={4} key={booking._id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6">Name: {booking.name}</Typography>
                        <Typography variant="body2">Email: {booking.email}</Typography>
                        <Typography variant="body2">Number: {booking.phonenumber}</Typography>
                        <Typography variant="body2">Price: ${booking.amountpaid}</Typography>
                        <Typography variant="body2">Booking ID: {booking.bookingId}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )
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
          <ListItem button onClick={() => handleOptionClick('bookings')}>
            <ListItemText primary="Bookings" />
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
