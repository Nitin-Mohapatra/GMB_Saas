exports.mainDetails = async (page)=>{
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
            if (addressDiv) address = addressDiv.innerText.trim();

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
    return data;
}

