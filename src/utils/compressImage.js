/**
 * Compress an image file in the browser before upload.
 *
 * Downscales to `maxDim` on the longest side and re-encodes as JPEG,
 * so an 8–10 MB phone photo becomes a ~100–300 KB passport-style
 * image that uploads fast and reliably. Falls back to the original
 * file if anything goes wrong.
 *
 * @param {File} file
 * @param {{maxDim?:number, quality?:number}} opts
 * @returns {Promise<File>}
 */
export async function compressImage(file, { maxDim = 1024, quality = 0.82 } = {}) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file

  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

    const img = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Could not read image'))
      image.src = dataUrl
    })

    let { width, height } = img
    const longest = Math.max(width, height)
    if (longest > maxDim) {
      const scale = maxDim / longest
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff' // flatten any transparency
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob) return file

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], name, { type: 'image/jpeg' })
  } catch {
    return file // never block a registration because compression failed
  }
}
