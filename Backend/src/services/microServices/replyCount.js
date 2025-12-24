exports.getRepliesCount = async (page) => {
    const backButton = await page.$('button[aria-label*="Back"]');
    if (backButton) {
        await backButton.click();
        console.log('Clicked Back button');
    }

    // Click on Reviews tab
    try{
        await page.waitForSelector(".RWPxGd", { timeout: 3000 });
        await page.evaluate(async()=>{
            let myDivs = document.querySelector(".RWPxGd");
            if(myDivs){
                let btnDivs = [...myDivs.children];
                btnDivs.forEach(async (btn) => {
                    if(btn.innerText == "Reviews"){
                        await btn.click();
                        console.log('Clicked on Reviews tab');
                    }
                });
            }else{
                console.log("Review btn not found")
            }
        })
    }catch(e){
        console.error(e);
    }

    // const reviewsButton = await page.$('button[aria-label*="Reviews"]');
    // if (reviewsButton) {
    //     await reviewsButton.click();
    //     console.log('Clicked on Reviews tab');
    // }else{console.log("Review btn not found")};

    let repliesCount = 0;
    try {
        await page.waitForSelector(".wiI7pd", { timeout: 3000 });

        await page.evaluate(async () => {
            const Container = document.querySelector(".m6QErb.Hk4XGb.WNBkOb.XiKgde.ZaEtDb");
            if (!Container) {
                console.log("Review Container not found");
                return;
            }
            for (let i = 0; i < 15; i++) {
                Container.scrollBy(0, 500);
                await new Promise((resolve) => setTimeout(resolve, 300));
            }
        });

        repliesCount = await page.evaluate(() => {
            return document.querySelectorAll(".wiI7pd").length;
        });
        
    } catch (error) {
        repliesCount = 0;
        console.error("review fetch error:", error);
    }

    return repliesCount;
}