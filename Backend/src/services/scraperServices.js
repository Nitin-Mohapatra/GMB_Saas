const { initalizePuppeteer } = require("./microServices/inistializePuppeteer");
const { scrapDescriptionProduct } = require("./microServices/descriptionProductScraper");
const { mainDetails } = require("./microServices/scrapMainDetails");
const { scrapUpdate } = require("./microServices/getUpdates");
const {getRepliesCount} = require("./microServices/replyCount");

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

        // SCRAPE TOTAL REPLIES
        let repliesCount = await getRepliesCount(page);
        
        //SCRAPE  DESCRIPTION & PRODUCTS FROM (SERP)            
        const des_ser = await scrapDescriptionProduct(page, mainData.bisName, mainData.category, mainData.address);

        return { ...mainData, ...des_ser, totalUpdates , repliesCount};

    } catch (err) {
        console.error("SCRAPING ERROR:", err);
        return { error: "Failed to scrape data" };
    } finally {
        if (browser) await browser.close();
    }
};
module.exports = scrapeGMB;
