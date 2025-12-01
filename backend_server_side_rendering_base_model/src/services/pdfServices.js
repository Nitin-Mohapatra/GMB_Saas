const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.createPDF = (data)=>{
    return new Promise((res, rej)=>{
        const doc = new PDFDocument();

        // save pdf in reports
        const outerPath = path.join(__dirname, '../public/reports');
        if(!fs.existsSync(outerPath)){
            fs.mkdirSync(outerPath,{recursive:true});
        }

        // get the filename to create that file - sanitize filename
        const sanitizeFileName = (name) => {
            if (!name || name === "Business Name Not Found" || name === "undefined") {
                return `GMB_Report_${Date.now()}`;
            }
            // Remove invalid characters for filenames
            return name.replace(/[<>:"/\\|?*]/g, '_').trim() || `GMB_Report_${Date.now()}`;
        };
        
        const fileName = `${sanitizeFileName(data.bisName)}.pdf`;
        const filePath = path.join(outerPath,fileName);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // add content to pdf
        // Title
        doc.fontSize(22).text("GMB Audit Report",{underline:true});
        doc.moveDown();

        // basic Info
        // Business Name
        if(data.bisName && data.bisName !== "Business Name Not Found"){
            doc.fontSize(14).text(`Business Name: ${data.bisName}. It is very crucial for better outreach`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Business Name: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Business name is essential for GMB ranking as it helps Google identify and match your business in local searches. Missing or incorrect names can significantly reduce visibility.`, {continued: false});
        }
        doc.moveDown();

        // Category
        if(data.category && data.category !== "Category Not Found"){
            doc.fontSize(14).text(`Category: ${data.category}. It is very crucial for better categorization and local search visibility`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Category: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Category selection directly affects which searches your business appears in. Missing categories mean you won't rank for relevant local searches, reducing discoverability.`, {continued: false});
        }
        doc.moveDown();

        // Rating
        if(data.rating && data.rating !== "Rating Not Found"){
            doc.fontSize(14).text(`Rating: ${data.rating}. It is very crucial for building trust and improving local search rankings`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Rating: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Ratings are a major ranking factor for GMB. Higher ratings improve visibility in local pack results and increase click-through rates. Missing ratings indicate low engagement.`, {continued: false});
        }
        doc.moveDown();

        // Total Reviews
        if(data.totalReviews && data.totalReviews !== "Not Found" && data.totalReviews !== ""){
            doc.fontSize(14).text(`Total Reviews: ${data.totalReviews}. It is very crucial for social proof and ranking signals`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Total Reviews: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Review quantity and recency are key ranking factors. More reviews signal authority and trustworthiness to Google, improving local pack positioning.`, {continued: false});
        }
        doc.moveDown();

        // Address
        if(data.address && data.address !== "Address Not Found"){
            doc.fontSize(14).text(`Address: ${data.address}. It is very crucial for local SEO and map visibility`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Address: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Complete address information is critical for local ranking. Missing addresses prevent your business from appearing in "near me" searches and map results.`, {continued: false});
        }
        doc.moveDown();

        // Website
        if(data.website && data.website !== "Website Not Found"){
            doc.fontSize(14).text(`Website: ${data.website}. It is very crucial for establishing online presence and authority`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Website: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: A verified website link strengthens your GMB profile's authority and provides additional ranking signals. Missing websites reduce trust and local search visibility.`, {continued: false});
        }
        doc.moveDown();

        // Phone
        if(data.phone && data.phone !== "Phone Not Found"){
            doc.fontSize(14).text(`Phone: ${data.phone}. It is very crucial for customer contact and local search optimization`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Phone: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Phone number consistency across platforms (NAP - Name, Address, Phone) is crucial for local SEO. Missing or inconsistent phone numbers can hurt ranking and confuse Google's algorithm.`, {continued: false});
        }
        doc.moveDown();

        // Establishment Date
        if(data.date && data.date !== "Date Not Found"){
            doc.fontSize(14).text(`Establishment Date: ${data.date}. It is very crucial for establishing business credibility`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Establishment Date: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: While not a direct ranking factor, establishment date adds credibility and can help in competitive markets. Older businesses may receive slight preference in local rankings.`, {continued: false});
        }
        doc.moveDown();

        // Description
        if(data.description && data.description !== "Description Not Found"){
            doc.fontSize(14).text(`Description: ${data.description.substring(0, 100)}`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Description: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Business descriptions help Google understand your services and improve keyword relevance. Missing descriptions reduce your ability to rank for relevant search terms.`, {continued: false});
        }
        doc.moveDown();

        // Products
        if(data.products && data.products.productCount > 0){
            doc.fontSize(14).text(`Products: ${data.products.productCount} product(s) found. It is very crucial for showcasing services and improving search relevance`);
            if(data.products.products && data.products.products.length > 0){
                doc.fontSize(12).text(`Product List: ${data.products.products.join(', ')}`);
            }
        }else{
            doc.fillColor('red').fontSize(14).text(`Products: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Product/service listings help Google understand your offerings and match you to relevant searches. Missing products reduce visibility for specific service-based queries.`, {continued: false});
        }
        doc.moveDown();

        // Total Updates
        if(data.totalUpdates && data.totalUpdates > 0){
            doc.fontSize(14).text(`Total Updates: ${data.totalUpdates}. It is very crucial for maintaining engagement and showing active business presence`);
        }else{
            doc.fillColor('red').fontSize(14).text(`Total Updates: absent`);
            doc.fillColor('black');
            doc.fontSize(12).text(`Impact: Regular posts and updates signal an active business to Google. Businesses with frequent updates tend to rank higher as they demonstrate engagement and relevance.`, {continued: false});
        }
        doc.moveDown();

        // Finalize PDF
        doc.end();
        writeStream.on('finish', () => {
            res(filePath);
        });
        writeStream.on('error', (err) => {
            rej(err);
        });
    })
}