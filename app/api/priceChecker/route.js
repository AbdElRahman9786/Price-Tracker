import { sendPriceDropAlert } from "@/lib/email";
import { scarpelWebsite } from "@/lib/fireCrawl";
import { createClient } from "@supabase/supabase-js"

export async function POST(request) {
 const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for server-side operations
 );

 // Get all products from database (no user filter for cron job)
 const { data: products, error: productsError } = await supabase
   .from("products")
   .select("*");

 if (productsError) {
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
 }

 let foundedChanges = {
    count: 0,
    name: []
 };

 for (const product of products) {
    const scrapedData = await scarpelWebsite(product.url);
    if (scrapedData && scrapedData.currentPrice && scrapedData.currentPrice !== product.price) {
        // Update product price
        await supabase.from("products").update({
            price: scrapedData.currentPrice,
            currancy: scrapedData.currencyCode || "USD",
        }).eq("id", product.id);
        foundedChanges.count++;
        foundedChanges.name.push(product.name);

        // Insert into price_history
        await supabase.from("price_history").insert({
            product_id: product.id,
            price: scrapedData.currentPrice,
            currancy: scrapedData.currencyCode || "USD",
            checked_at: new Date().toISOString(),
        });

        // Send email alert if price dropped
        if (scrapedData.currentPrice < product.price) {
            // Get user email from auth.users via service role
            const { data: userData } = await supabase.auth.admin.getUserById(product.user_id);
            
            if (userData?.email) {
                await sendPriceDropAlert(
                    userData.email,
                    product,
                    product.price,           // oldPrice
                    scrapedData.currentPrice // newPrice
                );
            }
        }
    }
 }

 return new Response(JSON.stringify({ 
    success: true, 
    updatedCount: foundedChanges.count,
    updatedProducts: foundedChanges.name 
 }), { status: 200 });
}