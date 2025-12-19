const { createClient } = require("@/utils/supabase/client");
const { scarpelWebsite } = require("./fireCrawl");

async function addProduct(formData) {
    const url = formData.get("url");
    const supabase = createClient();
    if (!url) {
       throw new Error("URL is required");
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
       throw new Error("User not authenticated");
    }

    try{
        const productData = await scarpelWebsite(url);
        if(!productData?.productName || !productData?.currentPrice){
            throw new Error("Failed to extract product data from the URL");
        }
        
        const { data, error } = await supabase
        .from("products")
        .insert({
            
            name: productData.productName,
            price: productData.currentPrice,
            url: url,
            image_url: productData.productImageUrl,
            currancy: productData.currencyCode || "USD",
            created_at: new Date().toISOString(),
            user_id: user.id,


        })
        .select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            throw new Error("Failed to insert product");
        }
        
        
        
       await supabase.from("price_history").insert({
            product_id: data[0].id,
            price: productData.currentPrice,
            created_at: new Date().toISOString(),
            currancy: productData.currencyCode || "USD",
            checked_at: new Date().toISOString(),
        });
        
        return { success: true, data: data[0] };

    }catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }


    
}


async function deleteProduct(productId) {
    const supabase=createClient();
    const user = supabase.auth.getUser();
    if (!user) {
       throw new Error("User not authenticated");
    }
    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("user_id", user.id);
    if (error) {
       console.error("Error deleting product:", error);
       throw error;
    }
    return data;
}


async function getProducts() {
    const supabase=createClient();
    const user = supabase.auth.getUser();
    if (!user) {
       throw new Error("User not authenticated");
    }
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id);    
    if (error) {
       console.error("Error fetching products:", error);
       throw error;
    }
    return data;
}


function getPriceHistory(productId) {
    const supabase=createClient();
    return supabase
        .from("price_history")
        .select("*")
        .eq("product_id", productId)
        .order("checked_at", { ascending: true });
}

module.exports = {
    addProduct,
    deleteProduct,
    getProducts,
    getPriceHistory,
};