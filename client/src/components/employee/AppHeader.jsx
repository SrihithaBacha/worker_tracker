import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';

const AppHeader = () => {
  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(to right, blue, cyan)' 
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Worker Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
};

export default AppHeader;