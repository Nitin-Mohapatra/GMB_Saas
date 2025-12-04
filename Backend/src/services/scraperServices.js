const { initalizePuppeteer } = require("./microServices/inistializePuppeteer");
const { scrapDescriptionProduct } = require("./microServices/descriptionProductScraper");
const {mainDetails} = require("./microServices/scrapMainDetails");
const {scrapUpdate} = require("./microServices/getUpdates");

const scrapeGMB = async (gmbUrl) => {
    let browser
    try {
        const { browser: br, page } = await initalizePuppeteer();
        browser = br;

        await page.goto(gmbUrl, {
            waitUntil: "networkidle2",
            timeout: 60000,
        });

        // Wait for business title
        await page.waitForSelector("h1", { timeout: 60000 });

        // SCRAPE MAIN DETAILS FROM MAPS
        const mainData = await mainDetails(page);

        // SCRAPE UPDATES
        const totalUpdates = await scrapUpdate(page);

        // SCRAPE REVIEWS
       

        //SCRAPE  DESCRIPTION & PRODUCTS FROM (SERP)            
        const des_ser = await scrapDescriptionProduct(page, mainData.bisName , mainData.category, mainData.address);

        return { ...mainData, ...des_ser, totalUpdates };

    } catch (err) {
        console.error("SCRAPING ERROR:", err);
        return { error: "Failed to scrape data" };
    } finally {
        if (browser) await browser.close();
    }
};
module.exports = scrapeGMB;
