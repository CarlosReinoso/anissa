/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The generated slug
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by checking for duplicates and adding a suffix if needed
 * @param {string} baseText - The base text to create slug from
 * @param {Function} checkSlugExists - Function to check if slug exists in database
 * @returns {Promise<string>} - The unique slug
 */
export async function generateUniqueSlug(baseText, checkSlugExists) {
  let baseSlug = generateSlug(baseText);
  let slug = baseSlug;
  let counter = 1;

  // Check if the base slug exists
  while (await checkSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
