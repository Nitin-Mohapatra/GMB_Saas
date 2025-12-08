exports.scrapUpdate = async (page) => {
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

    } catch (e) {
        totalUpdates = 0;
    }

    return totalUpdates;
}