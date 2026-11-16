/** Exporttest — versie 1.0 | Laatst gewijzigd: 2026-10-29. Maakt een korte bronclip en verifieert de MP4. */
import { test, expect } from '@playwright/test'

// Test echte transcoding met een lokaal gegenereerde clip; geen klantvideo of account wordt gebruikt.
test('lokale video wordt een afspeelbare 480p MP4', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/studio?demo=1')
  await expect(page.frameLocator('iframe.canvas-frame').locator('h1')).toBeVisible()
  const result = await page.evaluate(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 180
    const drawing = canvas.getContext('2d')
    drawing.fillStyle = '#657b4f'
    drawing.fillRect(0, 0, 320, 180)
    const stream = canvas.captureStream(5)
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    const parts = []
    recorder.ondataavailable = (event) => parts.push(event.data)
    const recording = new Promise((resolve) => {
      recorder.onstop = resolve
    })
    recorder.start()
    await new Promise((resolve) => setTimeout(resolve, 1200))
    recorder.stop()
    await recording
    stream.getTracks().forEach((track) => track.stop())
    const file = new File(parts, 'test.webm', { type: 'video/webm' })
    const { convertVideo } = await import('/src/services/videoExport.js')
    const output = await convertVideo(file, 480, () => {}, new AbortController().signal)
    const video = document.createElement('video')
    const metadata = new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve
      video.onerror = reject
    })
    video.src = URL.createObjectURL(output)
    await metadata
    const info = {
      size: output.size,
      type: output.type,
      height: video.videoHeight,
      width: video.videoWidth,
    }
    URL.revokeObjectURL(video.src)
    return info
  })
  expect(result.type).toBe('video/mp4')
  expect(result.size).toBeGreaterThan(1000)
  expect(result.height).toBe(480)
  expect(result.width).toBeGreaterThan(600)
})
