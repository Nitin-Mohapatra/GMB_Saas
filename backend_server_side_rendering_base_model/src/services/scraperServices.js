    const puppeteer = require("puppeteer");

    // CHANGE THIS TO YOUR ACTUAL Chrome.exe PATH
    const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

    /* ---------------------------------------------------------
        DESCRIPTION + PRODUCTS SCRAPER (Google Search SERP)
    ----------------------------------------------------------- */
    const descriptionScraper = async (page, bizName,bizCategory,bizAddress) => {
        const query = encodeURIComponent(`${bizName} ${bizCategory} ${bizAddress}`);

        await page.goto(`https://www.google.com/search?q=${query}`, {
            waitUntil: "networkidle2",
            timeout: 60000,
        });

        // Close location popup
        try { await page.click('button[aria-label="Not now"]'); } catch { }

        // Click "More" description button
        try {
            await page.waitForSelector('a.RRYiY[aria-label="Show more"]', { timeout: 3000 });
            page.evaluate(() => {
                const moreBtn = document.querySelector("a.RRYiY");
                if (moreBtn) moreBtn.click();
            });
        } catch { }

        // All possible description selectors
        const selectors = [
            '[data-attrid="kc:/local:description"]',
            '[data-attrid="kc:/location:short_description"]',
            '[data-attrid*="merchant_description"]',
            '[data-attrid*="description"]',
            '.wwUB2c',
            '.SPZz6b',
            '.kno-rdesc span',
            'span.LGOjhe',
            '.O9g5cc',
            '.VwiC3b',
            ".EvNWZc"
        ];

        const description = await page.evaluate((selectors) => {
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.innerText.trim().length > 20) {
                    return el.innerText.trim();
                }
            }
            return "Description Not Found";
        }, selectors);

        // PRODUCTS
        const products = await page.evaluate(() => {
            let productNodes = [];
            if (document.querySelector('.sRlWDc.xHRvib')) {
                productNodes = [...document.querySelector('.sRlWDc.xHRvib').children].slice(1);
            }

            const products = [];
            productNodes.forEach((node) => {
                const name = node.querySelector(".zPcHee");
                if (name) products.push(name.innerText.trim());
            });

            return {
                productCount: products.length,
                products,
            };
        });

        return { description, products };
    };

    /* ---------------------------------------------------------
    MAIN SCRAPER (Maps + Updates)
    ----------------------------------------------------------- */
    const scrapeGMB = async (gmbUrl) => {
        let browser;

        try {
            browser = await puppeteer.launch({
                headless: false, // set true later
                executablePath: CHROME_PATH,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-blink-features=AutomationControlled",
                ],
            });

            const page = await browser.newPage();

            // Desktop UA
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            );

            await page.setViewport({ width: 1366, height: 768 });

            // Anti-detect
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, "webdriver", { get: () => false });
                Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3] });
                Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
            });

            await page.goto(gmbUrl, {
                waitUntil: "networkidle2",
                timeout: 60000,
            });

            // Wait for business title
            await page.waitForSelector("h1", { timeout: 60000 });

            /* ------------------------------------------
                SCRAPE MAIN DETAILS FROM MAPS
            ------------------------------------------- */
            const data = await page.evaluate(() => {

                const bisName = document.querySelector("h1")?.innerText || "Business Name Not Found";

                let category = "Category Not Found";
                const btnCat = document.querySelector('button[jsaction*="category"]');
                if (btnCat) category = btnCat.innerText.trim();

                let rating =
                    document.querySelector("span[aria-label*='star']")?.getAttribute("aria-label")?.split(" ")[0] ||
                    document.querySelector(".F7nice")?.innerText ||
                    "Rating Not Found";

                let totalReviews =
                    document.querySelector("span[aria-label*='review']")?.innerText || "Not Found";
                totalReviews = totalReviews.replace(/[^\d]/g, "");

                let address = "Address Not Found";
                const addressDiv = document.querySelector(".Io6YTe.fontBodyMedium.kR99db.fdkmkc");
                if(addressDiv) address = addressDiv.innerText.trim();

                let website = "Website Not Found";
                const web = document.querySelector('a[data-item-id="authority"]');
                if (web) website = web.href;

                let phone = "Phone Not Found";
                const phoneBtn = [...document.querySelectorAll("button[data-item-id]")]
                    .find(el => el.getAttribute("data-item-id")?.includes("phone"));
                if (phoneBtn) {
                    phone = phoneBtn.innerText.replace(/[^0-9+]/g, "").trim();
                }

                let date = "Date Not Found";
                const dateSelector = document.querySelector('[data-item-id="establishment_year"]');
                if (dateSelector) date = dateSelector.innerText.trim();


                return {
                    bisName,
                    category,
                    rating,
                    totalReviews,
                    address,
                    website,
                    phone,
                    date
                };

            });

            //  CLICK "From the owner" (updates)
            let totalUpdates = 0;
            try {
                await page.waitForSelector(".SBD2Rc.waIsr", { timeout: 5000 });
                await page.click(".SBD2Rc.waIsr");

                // Wait for first update to load
                await page.waitForSelector(".Tc0rEd.cKbrCd", { timeout: 5000 });

                // Scroll the updates panel
                await page.evaluate(async () => {
                    const panel = document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde");
                    if (!panel) return;

                    for (let i = 0; i < 15; i++) {
                        panel.scrollBy(0, 500);
                        await new Promise(res => setTimeout(res, 300));
                    }
                });

                // Count updates
                totalUpdates = await page.evaluate(() => {
                    return document.querySelectorAll(".Tc0rEd.cKbrCd").length;
                });
                // document.querySelector(".hYBOP.FeXq4d").click();

            } catch (e) {
                totalUpdates = 0;
            }

            /* ------------------------------------------
                    DESCRIPTION + PRODUCTS (SERP)
            ------------------------------------------- */
            const des_ser = await descriptionScraper(page, data.bisName , data.category, data.address);

            return { ...data, ...des_ser, totalUpdates};

        } catch (err) {
            console.error("SCRAPING ERROR:", err);
            return { error: "Failed to scrape data" };
        } finally {
            if (browser) await browser.close();
        }
    };
    module.exports = scrapeGMB;
