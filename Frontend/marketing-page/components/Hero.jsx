import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles';
import TextType from '../../src/ReactBitzAnimationComponents/Components/TextType';
import { useForm } from "react-hook-form";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import Alert from '@mui/material/Alert';



const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage:
    'url(https://dummyimage.com/1200x800/dashboard-light.jpg)',
  backgroundSize: 'cover',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage:
      'url(https://dummyimage.com/1200x800/dashboard-dark.jpg)',
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export default function Hero() {

  const [open, setOpen] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm({ mode: "onChange" });
  const [serverError,setServerError] = useState("");

  const onSubmit = async (data) => {
    console.log("FORM DATA:", data);
    try {
      const response = await axios.post("http://localhost:8080/analyze", data);

      if (response.status === 200 && response.data.success === true) {
        console.log(response);
        setServerError("");
        setOpen(true);
        setPdfLink(response?.data.link);
        console.log(response.data.link)
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong... 😢")
      console.error(error);
      setOpen(true);
    }
  };


  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => {
          setOpen(false);
          setServerError("");
        }}
        >
        <Alert
          onClose={() => {
            setOpen(false)
            setServerError("");

          }}
          severity={ serverError? "error":"success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {serverError ? serverError : (
            <>
              Audit Generated Sucessfully.{" "}
              <Button
                onClick={() => { window.open(`http://localhost:8080/${pdfLink}`, "_blank") }}>
                View Now
              </Button>
            </>
          )}
        </Alert>
      </Snackbar>

      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Analyze&nbsp;Any&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: '#CF1020',

                ...theme.applyStyles('dark', {

                }),
              })}
            >
              <TextType
                text="GMB"
                // 75 is the typing speed in ms per character (lower = faster). Controls how quickly "GMB" animates in the typewriter effect.
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
              />
            </Typography>
          </Typography>

          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Effortlessly audit any Google Business Profile with instant AI analysis. Uncover insights, identify issues, and boost your local visibility—all in one intuitive app.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
            >
              <InputLabel htmlFor="GMB-link" sx={visuallyHidden}>
                Email
              </InputLabel>

              <TextField
                id="GMB-link"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter Your GMB Link"
                placeholder="Enter Your GMB Link"
                {...register("gmbUrl", { required: "GMB Link is required" })}
                error={!!errors.gmbUrl}
                helperText={errors.gmbUrl?.message}
                fullWidth
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': 'Enter Your GMB Link',
                  },
                }}
              />

              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ minWidth: 'fit-content' }}
                type='submit'
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Scraping..." : "Start Now"}
              </Button>

            </Stack>
          </form>

        </Stack>

        {/* <StyledBox id="image" /> */}
      </Container>
    </Box>
  );
}
