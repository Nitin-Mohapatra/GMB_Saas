const express = require('express');
const path = require('path');
const scrapeGMB = require("../services/scraperServices");
const {createPDF} = require("../services/pdfServices")
const fs = require('fs');


exports.Home = (req,res)=>{
    res.render('Home', { error: false, errors: [] });
}

exports.analyzeGMB = async (req , res)=>{
    try {
        const GMB_link = req.body.gmbUrl;
        console.log("Scraping URL:", GMB_link);

        const gmbScrapperData = await scrapeGMB(GMB_link);
        console.log("gmbScrapperData = ", gmbScrapperData);
        
        // Check if scraping returned an error object (legacy check, though now it should throw)
        if (gmbScrapperData && gmbScrapperData.error) {
            throw new Error(gmbScrapperData.error);
        }
        
        const pdfPath = await createPDF(gmbScrapperData);
        console.log("PDF created at:", pdfPath);
        
        // Extract just the filename from the full path
        const fileName = path.basename(pdfPath);
        
        // res.send(`<h2>Audit Generated Successfully</h2>
        //     <p>Business: ${gmbScrapperData.bisName}</p>
        //     <a href="/reports/${fileName}" download>Download PDF</a>
        //     `);

        res.status(200).json({success:true,link:`/reports/${fileName}`})
    } catch (error) {
        console.error("Error in analyzeGMB:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while processing your request"
        });
    }
}

exports.getAllPdfs = (req,res)=>{
    try{
        const pdfDir = path.join(__dirname,"../public/reports")

    const files = fs.readdirSync(pdfDir)
    
    const pdfFiles = files.map((fls)=>{
        return {
            name:fls,
            path:`/reports/${fls}`
        }
    })

    return res.status(200).json({success:true,pdfFiles})
    }catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}