export function getCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const folder = import.meta.env.VITE_CLOUDINARY_FOLDER;

  return {
    cloudName,
    uploadPreset,
    folder,
    ready: Boolean(cloudName && uploadPreset),
  } as const;
}

export async function uploadImageToCloudinary(file: File) {
  const { cloudName, uploadPreset, folder, ready } = getCloudinaryConfig();

  if (!ready || !cloudName || !uploadPreset) {
    throw new Error("Cloudinary upload is not configured for this workspace.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({} as { error?: { message?: string } }));
    throw new Error(error.error?.message ?? "Failed to upload logo");
  }

  const data = await response.json() as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary did not return an uploaded image URL.");
  }

  return data.secure_url;
}
