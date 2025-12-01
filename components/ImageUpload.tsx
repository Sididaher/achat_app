'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
  onImageRemoved: () => void
}

export default function ImageUpload({ currentImageUrl, onImageUploaded, onImageRemoved }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        // Handle bucket not found error gracefully
        if (uploadError.message.includes('Bucket not found')) {
          alert('⚠️ Storage bucket not configured!\n\nPlease create "product-images" bucket in Supabase:\n1. Go to Storage\n2. Create new bucket\n3. Name: product-images\n4. Check "Public bucket"\n\nSee IMAGE_UPLOAD_SETUP.md for details.')
          return
        }
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl
      setPreview(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error: any) {
      alert(error.message || 'Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageRemoved()
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Image du produit
      </label>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Product preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <div className="text-gray-600">Uploading...</div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={uploadImage}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  )
}
