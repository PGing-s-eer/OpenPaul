/**
 * Liste ordonnée des images d'un projet pour la galerie.
 * La vignette (`thumbnail`) reste l'image de couverture (première),
 * suivie des images supplémentaires (`images`). 100 % rétrocompatible :
 * un projet sans `images` se comporte comme avant.
 *
 * @param {{ thumbnail?: string | null, images?: string[] | null }} project
 * @returns {string[]}
 */
export function projectImages(project) {
  const cover = project?.thumbnail ? [project.thumbnail] : []
  const extra = Array.isArray(project?.images) ? project.images.filter(Boolean) : []
  return [...cover, ...extra]
}
