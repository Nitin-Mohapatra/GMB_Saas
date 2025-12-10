import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../marketing-page/shared-theme/AppTheme.jsx';
import AppAppBar from './components/AppAppBar.jsx';
import Hero from './components/Hero.jsx';
import LogoCollection from './components/LogoCollection.jsx';
import Highlights from './components/Highlights.jsx';
import Pricing from './components/Pricing.jsx';
import Features from './components/Features.jsx';
import Testimonials from './components/Testimonials.jsx';
import Footer from './components/Footer.jsx';
import { Link } from "react-scroll";

export default function MarketingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        {/* trusted by */}

          <LogoCollection />


        <div id="features"><Features /></div>
        
        <Divider />

        <div id="testimonials"><Testimonials /></div>

        <Divider />

        <div id="highlights"><Highlights /></div>

        <Divider />

        <div id="pricing"><Pricing /><Pricing /></div>

        <Divider />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
