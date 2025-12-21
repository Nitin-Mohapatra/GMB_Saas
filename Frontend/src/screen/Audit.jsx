import React, { useEffect } from 'react'
import AppAppBar from '../../marketing-page/components/AppAppBar.jsx'
import axios from 'axios'
import { useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppTheme from '../../marketing-page/shared-theme/AppTheme.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Footer from '../../marketing-page/components/Footer.jsx'

// import { Document, Page } from 'react-pdf'; 

export default function Audit() {
    const [pdfs,setPdfs] = useState([])

    useEffect(()=>{
        const getPdfs = async()=>{
            try {
                const res = await axios.get("http://localhost:8080/pdfs")
                console.log(res.data)
                if(res.data.success && res.data.pdfFiles) {
                    setPdfs(res.data.pdfFiles)
                }
            } catch(error) {
                console.error("Error fetching PDFs:", error)
            }
        }
        getPdfs()
    }, [])
    
  return (
    <AppTheme>
        <CssBaseline enableColorScheme />     
        <AppAppBar></AppAppBar>

        <Box
            sx={{minHeight:"100vh" , flexDirection:'column', p:5}}
        >
            <Container maxWidth='lg' sx={{mt:'calc(var(--template-frame-height, 0px) + 35px)', py: 8 }}>',

                <Typography variant='h1' component="h1" mb={3}>
                    My Audits
                </Typography>

                <Divider></Divider>

                {pdfs.length === 0 ? (
                    <Typography variant='body1'>No Pdf Found</Typography>
                ):(
                    <Grid container spacing={3} mt={3}>
                        {pdfs.map((pdf,index)=>(
                            <Grid size={{xs:12,sm:6,md:4}} >
                                <Card>
                                    <CardContent sx={{flexGrow:1}}>
                                        <Typography variant='h5' component="h2">
                                            {pdf.name.replace('.pdf',"")}
                                        </Typography>
                                        <Box mt={2}>
                                            <Link
                                            component={Link}
                                            href={`http://localhost:8080/reports/${pdf.name}`}
                                            target='_blank'
                                            >
                                                View Pdf
                                            </Link>
                                        </Box>

                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

            </Container>
        </Box>


        <Footer></Footer>
    </AppTheme>
  )
}
