/** Video-export — versie 1.0 | Laatst gewijzigd: 2026-10-29. Lokale WebAssembly-conversie, zonder bronupload. */
// Laadt de rekenmodule pas op verzoek en ruimt het geheugen na iedere export op.
export async function convertVideo(file, height, onProgress, signal) {
  if (!file || file.size > 120 * 1024 * 1024)
    throw new Error(
      'Kies een lokaal videobestand van maximaal 120 MB voor deze browserexport. Gebruik voor grotere films een lokale video-editor.'
    )
  if (![480, 720, 1080].includes(height)) throw new Error('Kies 480p, 720p of 1080p.')
  const { FFmpeg } = await import('@ffmpeg/ffmpeg')
  const { fetchFile } = await import('@ffmpeg/util')
  const ffmpeg = new FFmpeg()
  const urls = []
  // Afbreken beëindigt de worker in plaats van de UI alleen visueel te sluiten.
  const abort = () => ffmpeg.terminate()
  signal.addEventListener('abort', abort)
  try {
    signal.throwIfAborted()
    onProgress({
      percent: 0,
      message: 'Rekenmodule laden (ongeveer 32 MB, daarna door de browser gecachet)…',
    })
    const base = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'
    const [script, wasm] = await Promise.all([
      fetch(`${base}/ffmpeg-core.js`, { signal }),
      fetch(`${base}/ffmpeg-core.wasm`, { signal }),
    ])
    if (!script.ok || !wasm.ok)
      throw new Error('De rekenmodule kon niet worden geladen. Controleer je internetverbinding.')
    const coreURL = URL.createObjectURL(
      new Blob([await script.arrayBuffer()], { type: 'text/javascript' })
    )
    const wasmURL = URL.createObjectURL(
      new Blob([await wasm.arrayBuffer()], { type: 'application/wasm' })
    )
    urls.push(coreURL, wasmURL)
    await ffmpeg.load({ coreURL, wasmURL })
    signal.throwIfAborted()
    ffmpeg.on('progress', ({ progress }) =>
      onProgress({
        percent: Math.max(0, Math.min(99, Math.round(progress * 100))),
        message: `Video omzetten naar ${height}p…`,
      })
    )
    await ffmpeg.writeFile('input', await fetchFile(file))
    const code = await ffmpeg.exec([
      '-i',
      'input',
      '-vf',
      `scale=-2:${height}`,
      '-c:v',
      'libx264',
      '-preset',
      'ultrafast',
      '-crf',
      '23',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
      'output.mp4',
    ])
    if (code !== 0)
      throw new Error('Deze video kon niet worden omgezet. Probeer een kleinere MP4 of WebM.')
    const data = await ffmpeg.readFile('output.mp4')
    onProgress({ percent: 100, message: 'Je export is klaar om te downloaden.' })
    return new Blob([data], { type: 'video/mp4' })
  } finally {
    signal.removeEventListener('abort', abort)
    ffmpeg.terminate()
    urls.forEach((url) => URL.revokeObjectURL(url))
  }
}
