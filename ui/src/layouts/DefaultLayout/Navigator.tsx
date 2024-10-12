import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { RouteInfo } from '../../types';


const item = {
  py: '2px',
  px: 3,
  color: 'rgba(0,0,0, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(89,165,89, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(89,165,89,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props: DrawerProps) {
  const { ...other } = props;

  const navigate = useNavigate();
  const location = useLocation();

  function isActive(v: RouteInfo): boolean {
    // @todo
    return false
  }

  function handleClickTo(path: string) {
    return (e: React.MouseEventHandler<any>) => {
      e.preventDefault();
      navigate(path);
    };
  }

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#59A559' }}>
          Oryboard
        </ListItem>
        {routes.map(({ id, label, children }) => (
          <Box key={id} sx={{ bgcolor: '#f9f9f9' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#59A559' }}>{label}</ListItemText>
            </ListItem>
            {children.map((c: RouteInfo) => !c.label ? null : (
              <ListItem disablePadding key={c.id}>
                <ListItemButton
                  selected={isActive(c)}
                  sx={item}
                  href={c.path}
                  onClick={handleClickTo(c.path!)}
                >
                  <ListItemIcon>{c.icon}</ListItemIcon>
                  <ListItemText>{c.label}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
