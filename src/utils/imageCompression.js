/**
 * Compress image to WebP format if it's larger than 500KB
 * @param {File} file - The image file to compress
 * @param {number} maxSizeKB - Maximum size in KB before compression (default: 500)
 * @param {number} quality - WebP quality (0-1, default: 0.8)
 * @returns {Promise<File>} - Compressed file or original file if no compression needed
 */
export async function compressImageIfNeeded(
  file,
  maxSizeKB = 500,
  quality = 0.8
) {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Check if file is PNG or JPEG
  if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
    return file;
  }

  // Check file size (convert bytes to KB)
  const fileSizeKB = file.size / 1024;

  // If file is smaller than maxSizeKB, return original
  if (fileSizeKB <= maxSizeKB) {
    return file;
  }

  try {
    // Create canvas for image processing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create image element
    const img = new Image();

    // Convert file to data URL
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Load image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Set canvas dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0);

    // Convert to WebP blob
    const webpBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert to WebP"));
          }
        },
        "image/webp",
        quality
      );
    });

    // Create new file with WebP extension
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove original extension
    const compressedFile = new File([webpBlob], `${originalName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    console.log(
      `Image compressed: ${fileSizeKB.toFixed(1)}KB → ${(
        compressedFile.size / 1024
      ).toFixed(1)}KB`
    );

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files
 * @param {number} maxSizeKB - Maximum size in KB before compression
 * @param {number} quality - WebP quality
 * @returns {Promise<File[]>} - Array of compressed files
 */
export async function compressImagesIfNeeded(
  files,
  maxSizeKB = 500,
  quality = 0.8
) {
  const compressedFiles = await Promise.all(
    files.map((file) => compressImageIfNeeded(file, maxSizeKB, quality))
  );

  return compressedFiles;
}
