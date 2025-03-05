export const CLOUDINARY_UPLOAD_PRESET = 'ml_default'
export const CLOUDINARY_CLOUD_NAME = 'dpxvj0sml'
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'projects'
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder) // Upload to a specific folder

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload')
    }

    return data.secure_url // Return the uploaded file URL
  } catch (error) {
    console.error('Cloudinary Upload Error:', error)
    return null
  }
}
