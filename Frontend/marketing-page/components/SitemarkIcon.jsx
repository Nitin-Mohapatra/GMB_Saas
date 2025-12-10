import Box from '@mui/material/Box';
import logo2 from '../../src/assets/logo2.png';

export default function SitemarkIcon() {
  return (
    // The error is that 'img' is not defined. 
    // 'component={img}' should be 'component="img"'
    // Here is the corrected code:
    <Box
      component="img"
      src={logo2}
      height={"4em"}
      width={"4em"}
    >
    </Box>
  );
}
