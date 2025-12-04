const puppeteer = require("puppeteer");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const initalizePuppeteer = async () => {
    let browser;
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

    return {page , browser};
};

module.exports = { initalizePuppeteer };

