import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import './employee.css';

const Employee = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const employeeId = user?.empId; // Use optional chaining

  if (!employeeId) {
    throw new Error('User not found in localStorage');
  }

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  console.log('Employee ID:', employeeId);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const drawerList = () => (
    <div
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
    >
    <List>
      <ListItem button component={Link} to="/employee/worker-info"> {/* Adjusted path */}
        <ListItemText primary="Worker Info" />
      </ListItem>
      <ListItem button component={Link} to="/employee/attendance"> {/* Adjusted path */}
        <ListItemText primary="Attendance" />
      </ListItem>
      <ListItem button component={Link} to="/employee/attendance-table"> {/* Adjusted path */}
        <ListItemText primary="Attendance Table" />
      </ListItem>
      <ListItem button component={Link} to="/employee/work-post"> {/* Adjusted path */}
        <ListItemText primary="Work Post" />
      </ListItem>
      <ListItem button component={Link} to="/employee/logout"> {/* Adjusted path */}
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  </div>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isSmallScreen ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Worker Tracker
              </Typography>
              <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerList()}
              </Drawer>
            </>
          ) : (
            <>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Worker Tracker
              </Typography>
              <Button color="inherit" component={Link} to="worker-info">Worker Info</Button>
              <Button color="inherit" component={Link} to="attendance">Attendance</Button>
              <Button color="inherit" component={Link} to="attendance-table">Attendance Table</Button>
              <Button color="inherit" component={Link} to="work-post">Work Post</Button>
              <Button color="inherit" component={Link} to="logout">Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
};

export default Employee;
