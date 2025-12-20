import { getProducts } from "@/lib/action";
import { sendPriceDropAlert } from "@/lib/email";
import { scarpelWebsite } from "@/lib/fireCrawl";
import { createClient } from "@supabase/supabase-js"

export async function POST(request) {
 const supabase=await createClient({
    url:process.env.NEXT_PUBLIC_SUPABASE_URL,
    key:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
 })

 const user=await supabase.auth.getUser();

 if(!user){
    return new Response(JSON.stringify({error:"User not authenticated"}),{status:401})
 }

 const data= await getProducts();
 let foundedChanges={
    count:0,
    name:[]
 };

 for(const product of data){
    const scrapedData=await scarpelWebsite(product.url);
    if(scrapedData && scrapedData.currentPrice && scrapedData.currentPrice !== product.price){
        // Update product price
        await supabase.from("products").update({
            price:scrapedData.currentPrice,
            currancy:scrapedData.currencyCode || "USD",
        }).eq("id",product.id);
        foundedChanges.count++;
        foundedChanges.name.push(product.name);

        // Insert into price_history
        await supabase.from("price_history").insert({
            product_id:product.id,
            price:scrapedData.currentPrice,
            currancy:scrapedData.currencyCode || "USD",
            checked_at:new Date().toISOString(),
        });
    }
 if(foundedChanges.count > 0){
    const emaolResult=await sendPriceDropAlert(
        user.email,
                product,
                scrapedData.currentPrice,
    ) 
 }
 }



}