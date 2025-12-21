import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown.jsx';
import Sitemark from './SitemarkIcon.jsx';
import { Link } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // dynamically handle the appbar links
  const handleSectionClick = (sesionId)=>{
    if(isHomePage){
      // then use the react scroll
      return ;
    }else{
      navigate('/')  //naviagte to home page
      // then clcik on that
      setTimeout(()=>{
        const ele = document.getElementById(sesionId);
        if(ele){
          ele.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },1000)
    }
  }

  // render navlicks dynamically
  const SecLink = ({to,children,...stys})=>{
    console.log(stys);
    if(isHomePage){
      return (
        <Link to={to} {...stys} smooth={true} duration={500}>
          {children}
        </Link>
      )
    }else{
      return (
        <RouterLink to={`/${to}`}
        onClick={(e)=>{
            e.preventDefault();
            handleSectionClick(to);
        }}
        {...stys}
        >
          {children}
        </RouterLink>
      )
    }
  }


  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >

      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          
          {/* nav links */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            {/* logo */}
            <Sitemark />


            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
             
              <Button variant="text" color="info" size="small">
                <SecLink to="features" style={{ color: 'inherit', textDecoration: 'none' }} >Features</SecLink>
              </Button>

              <Button variant="text" color="info" size="small">
                <SecLink to="testimonials" style={{ color: 'inherit', textDecoration: 'none' }} >Testimonials</SecLink>
              </Button>

              <Button variant="text" color="info" size="small">
                <SecLink to="highlights" style={{ color: 'inherit', textDecoration: 'none' }} >Highlights</SecLink>
              </Button>

              <Button variant="text" color="info" size="small">
                <SecLink to="pricing" style={{ color: 'inherit', textDecoration: 'none' }} >Pricing</SecLink>
              </Button>

              <Button variant="text" color="info" size="small">
                <RouterLink to="/audits" style={{color:'inherit', textDecoration: 'none'}}>My Audits</RouterLink>
              </Button>


            </Box>
          </Box>

          {/* colour drop down */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <ColorModeIconDropdown />
          </Box>

          {/* menu for the mobile ss */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />

            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            {/* opens the drawer */}
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* Use Link from react-scroll to enable smooth scrolling to anchor sections */}
                <MenuItem>
                  <Link to="features" smooth={true} duration={500} offset={-64} style={{ color: "inherit", display: "block", width: "100%" }}>
                    Features
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="testimonials" smooth={true} duration={500} offset={-64} style={{ color: "inherit", display: "block", width: "100%" }}>
                    Testimonials
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="highlights" smooth={true} duration={500} offset={-64} style={{ color: "inherit", display: "block", width: "100%" }}>
                    Highlights
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="pricing" smooth={true} duration={500} offset={-64} style={{ color: "inherit", display: "block", width: "100%" }}>
                    Pricing
                  </Link>
                </MenuItem>
                <MenuItem>
                  <RouterLink to="/audits" style={{ color: "inherit", display: "block", width: "100%", textDecoration: "none" }}>
                    My Audits
                  </RouterLink>
                </MenuItem>

                <Divider sx={{ my: 3 }} />

              </Box>
            </Drawer>

          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
