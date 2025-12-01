-- Add image_url column to produits table
ALTER TABLE produits ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to achats table (optional - for purchase receipt/invoice)
ALTER TABLE achats ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for product images (run this in Supabase Dashboard)
-- Go to Storage > Create Bucket:
-- Bucket name: product-images
-- Public bucket: Yes (for easy access)

-- Storage policies will be added via Supabase Dashboard
