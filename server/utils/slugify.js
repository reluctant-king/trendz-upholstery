const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Generate a unique slug against a model. */
async function uniqueSlug(model, title, existingId) {
  const base = slugify(title) || 'item';
  let slug = base;
  let i = 1;
  while (true) {
    const query = { slug };
    if (existingId) query._id = { $ne: existingId };
    const found = await model.findOne(query);
    if (!found) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

module.exports = { slugify, uniqueSlug };
