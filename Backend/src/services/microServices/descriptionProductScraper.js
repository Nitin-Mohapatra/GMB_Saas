const scrapDescriptionProduct = async (page, bizName,bizCategory,bizAddress) => {
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
        } catch(e) {return e}

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

module.exports = { scrapDescriptionProduct };