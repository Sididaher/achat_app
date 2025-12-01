# Image Upload Setup Guide

This guide will help you set up image upload functionality for products in your Purchase Management System.

## 📋 Prerequisites

- Supabase project created and configured
- Database tables created
- Application running

## 🚀 Setup Steps

### Step 1: Run Database Migration

Open your **Supabase Dashboard** → **SQL Editor** and run this SQL:

```sql
-- Add image_url column to produits table
ALTER TABLE produits ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to achats table (optional - for receipts/invoices)
ALTER TABLE achats ADD COLUMN IF NOT EXISTS image_url TEXT;
```

Click **Run** to execute the migration.

✅ **Checkpoint**: Verify columns added successfully

---

### Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (in left sidebar)

2. Click **Create a new bucket**

3. Fill in the details:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **Enable** (check the box)
   - **File size limit**: 5MB (default is fine)
   - **Allowed MIME types**: Leave empty for all image types

4. Click **Create bucket**

✅ **Checkpoint**: Bucket `product-images` appears in Storage list

---

### Step 3: Configure Storage Policies

#### Option A: Public Access (Easiest for Development)

If you created a **public bucket**, your images are automatically accessible!

#### Option B: Add Custom Policies (For Production)

If you need more control, add these policies:

1. Click on the `product-images` bucket
2. Click **Policies** tab
3. Click **New Policy**

**Policy 1: Allow Public Read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

**Policy 2: Allow Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-images' );
```

**Policy 3: Allow Users to Update Their Uploads**
```sql
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'product-images' );
```

**Policy 4: Allow Users to Delete Their Uploads**
```sql
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'product-images' );
```

✅ **Checkpoint**: Policies created successfully

---

### Step 4: Test the Feature

1. **Restart your dev server** (if it was running):
   ```bash
   # Stop with Ctrl+C, then:
   cd achats-nextjs
   npm run dev
   ```

2. **Navigate to Products page**:
   - Open http://localhost:3001
   - Login
   - Go to **Produits** in sidebar

3. **Add a new product**:
   - Click **Ajouter** button
   - You'll see an image upload area
   - Click to upload or drag & drop an image
   - Fill in other product details
   - Click **Ajouter**

4. **Verify the image**:
   - Product should show with image in the table
   - Go to **Achats** → **Nouvel Achat**
   - Create a purchase with that product
   - View purchase details - image should appear

✅ **Checkpoint**: Images upload and display correctly

---

## 🎨 Features Added

### Products Page
- ✅ Image upload component in Add/Edit modal
- ✅ Preview image before saving
- ✅ Remove image button
- ✅ Display product images in product table
- ✅ Placeholder icon for products without images

### Purchase Details Page
- ✅ Show product images in purchase details
- ✅ Larger image thumbnails (16x16)
- ✅ Placeholder for products without images

---

## 📂 Files Modified/Created

### New Files:
- `components/ImageUpload.tsx` - Reusable image upload component
- `supabase-migrations/add_image_support.sql` - Database migration
- `IMAGE_UPLOAD_SETUP.md` - This file

### Modified Files:
- `types/index.ts` - Added `image_url` to Produit and Achat interfaces
- `app/dashboard/produits/page.tsx` - Added image upload functionality
- `app/dashboard/achats/[id]/page.tsx` - Display product images

---

## 🖼️ Supported Image Formats

The system accepts:
- PNG
- JPEG/JPG
- GIF
- WebP
- SVG

**Maximum file size**: 5MB (configurable in Supabase bucket settings)

---

## 🔧 Troubleshooting

### Issue: "Failed to upload image"

**Solutions:**
1. Check Supabase Storage bucket exists
2. Verify bucket is public OR policies are set
3. Check browser console for error details
4. Verify `.env.local` has correct Supabase credentials

### Issue: Images not displaying

**Solutions:**
1. Check if `image_url` column exists in database
2. Verify image URL is saved in database (check Table Editor)
3. Check if bucket is public
4. Try accessing image URL directly in browser

### Issue: "Bucket not found"

**Solution:**
- Make sure bucket name is exactly `product-images`
- Verify bucket exists in Storage section
- Check if you created it in the correct Supabase project

### Issue: Upload button not working

**Solution:**
1. Check browser console for errors
2. Verify file size is under 5MB
3. Try a different image format
4. Restart dev server

---

## 📊 Storage Management

### View Uploaded Images

1. Go to **Storage** in Supabase Dashboard
2. Click on `product-images` bucket
3. See all uploaded images
4. Can download or delete from here

### Delete Old Images

Images are NOT automatically deleted when:
- Product is deleted
- Product image is changed

You can manually clean up in Supabase Storage or add cleanup logic later.

---

## 🎯 Next Steps (Optional Enhancements)

Want to add more features? Here are some ideas:

### 1. Multiple Images per Product
- Modify schema to add `images` JSONB column
- Update ImageUpload component for multiple files
- Add image gallery view

### 2. Image Optimization
- Add image resizing before upload
- Create thumbnails automatically
- Use WebP format for better compression

### 3. Image Validation
- Check image dimensions
- Validate file type on server
- Add virus scanning

### 4. Invoice/Receipt Images for Purchases
- Add image upload to purchases
- Store purchase receipts
- Display in purchase details

### 5. Admin Image Management
- Bulk image operations
- Image search
- Storage usage statistics

---

## 🔐 Security Best Practices

For production deployment:

1. **Use authenticated policies** instead of public bucket
2. **Validate file types** on server
3. **Scan for malware** before storing
4. **Set proper CORS headers**
5. **Limit upload size** appropriately
6. **Use signed URLs** for private images
7. **Implement rate limiting** on uploads

---

## 💡 Tips

- **Use descriptive filenames**: Upload component generates unique names automatically
- **Optimize images**: Compress images before upload for better performance
- **Set image dimensions**: CSS handles sizing, but smaller files load faster
- **Test on mobile**: Image upload works on mobile browsers
- **Monitor storage**: Check Supabase Storage dashboard regularly

---

## ✅ Complete Checklist

Use this checklist to ensure everything is set up:

- [ ] Database migration run successfully
- [ ] `image_url` columns added to tables
- [ ] Storage bucket `product-images` created
- [ ] Bucket set to public OR policies configured
- [ ] Dev server restarted
- [ ] Tested image upload on Products page
- [ ] Image displays in Products table
- [ ] Image displays in Purchase details
- [ ] Placeholder shows for products without images

---

## 📞 Need Help?

If you encounter issues:

1. Check Supabase logs (Database → Logs)
2. Check browser console for errors
3. Verify all environment variables
4. Ensure Supabase project is active

---

**Congratulations! 🎉**

Your Purchase Management System now supports product images!

Images will make your inventory more visual and professional.
