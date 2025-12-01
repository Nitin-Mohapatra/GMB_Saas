const express = require('express');
const path = require('path');
const scrapeGMB = require("../services/scraperServices");
const {createPDF} = require("../services/pdfServices")


exports.Home = (req,res)=>{
    res.render('Home', { error: false, errors: [] });
}

exports.analyzeGMB = async (req , res)=>{
    try {
        const GMB_link = req.body.gmbUrl;
        console.log("Scraping URL:", GMB_link);

        const gmbScrapperData = await scrapeGMB(GMB_link);
        console.log("gmbScrapperData = ", gmbScrapperData);
        
        
        const pdfPath = await createPDF(gmbScrapperData);
        console.log("PDF created at:", pdfPath);
        
        // Extract just the filename from the full path
        const fileName = path.basename(pdfPath);
        
        res.send(`<h2>Audit Generated Successfully</h2>
            <p>Business: ${gmbScrapperData.bisName}</p>
            <a href="/reports/${fileName}" download>Download PDF</a>
            `);
    } catch (error) {
        console.error("Error in analyzeGMB:", error);
        res.status(500).send(`<h2>Error</h2><p>An error occurred while processing your request: ${error.message}</p>`);
    }
}