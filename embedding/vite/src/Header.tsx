import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import React from 'react';

interface HeaderProps {
  logo: string;
  onNavigate?: (view: 'dashboard' | 'panel') => void;
}

export function Header({ logo, onNavigate }: HeaderProps) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <a
            href="https://perses.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <img src={logo} alt="Perses logo" style={{ height: 40, marginRight: 12 }} />
            <span style={{ fontWeight: 600, fontSize: 20, color: 'white' }}>Perses Embed Example App</span>
          </a>
          <Box sx={{ paddingLeft: 2 }} />
          <Button color="inherit" onClick={() => onNavigate?.('dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => onNavigate?.('panel')}>
            Panel
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
