"use client"

import Link from "next/link"
import { ArrowLeft, Copy, Check, Cloud, Image, Film, Upload, Zap, Shield, Layers, Terminal, Package, Github } from "lucide-react"
import { useState } from "react"

export default function DocsCloudustPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative rounded-lg bg-slate-900 border border-sky-500/20 p-4 my-3">
      <button onClick={() => copy(code, id)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 cursor-pointer">
        {copied === id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-sky-100 bg-sky-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/docs" className="text-xs text-gray-400 hover:text-sky-600 mb-4 inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to docs</Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600">
              <Cloud className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Cloudust SDK</h1>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl">Self-hosted Cloudinary alternative — image & video processing, transformation, and delivery with S3-backed storage. TypeScript, Go, and Python SDKs.</p>
          <div className="flex gap-3 mt-4">
            <a href="https://github.com/Cofoundr-Ng/cloudust-sdk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 border border-sky-200 rounded-lg px-3 py-1.5 hover:bg-sky-50 transition-colors"><Github className="h-3 w-3" /> GitHub →</a>
            <span className="text-xs text-gray-400 py-1.5">by CofoundrNG</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Overview</h2>
          <p className="text-sm text-gray-600 mb-4">
            Cloudust is a <strong className="text-gray-900">managed media processing and delivery platform</strong> designed as a drop-in alternative to Cloudinary. It provides image and video transformation, optimized delivery via CDN, and a full management API — all backed by your own S3-compatible storage.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Image, title: "Image Transform", desc: "Resize, crop, effects, format conversion, overlays" },
              { icon: Film, title: "Video Processing", desc: "Transcode, trim, resize, format conversion via ffmpeg" },
              { icon: Upload, title: "Upload API", desc: "File upload, chunked upload, URL import, presets" },
              { icon: Zap, title: "URL Delivery", desc: "Optimized URLs with on-the-fly transformation params" },
              { icon: Shield, title: "Signed URLs", desc: "SHA-1/SHA-256 signed URLs for access control" },
              { icon: Layers, title: "Multi-format", desc: "AVIF, WebP, JPEG, PNG, GIF, HEIF, and more" },
              { icon: Terminal, title: "CLI Tool", desc: "Go CLI for upload, transform, search, manage" },
              { icon: Package, title: "3 SDKs", desc: "TypeScript, Go, Python — same API everywhere" },
            ].map((f) => (
              <div key={f.title} className="border border-sky-100 rounded-lg p-3 bg-white/80">
                <f.icon className="h-4 w-4 text-sky-500 mb-1.5" />
                <h3 className="text-xs font-semibold text-gray-900">{f.title}</h3>
                <p className="text-[11px] text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Installation</h2>
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">TypeScript</h3>
            <CodeBlock code="npm install cloudust-sdk" id="ts-install" />
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mt-3">Go CLI</h3>
            <CodeBlock code="curl -fsSL https://raw.githubusercontent.com/Cofoundr-Ng/cloudust-sdk/main/install.sh | sh" id="go-install" />
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mt-3">Python</h3>
            <CodeBlock code="pip install cloudust-sdk" id="py-install" />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">TypeScript SDK — Quick Start</h2>
          <CodeBlock code={`import { cloudust } from "cloudust-sdk"

const cu = cloudust({
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
  bucket: "my-media-bucket",
})

// Generate an optimized image URL
const url = cu.image("my-image.jpg", {
  width: 800,
  height: 600,
  crop: "fill",
  quality: "auto",
  format: "avif",
})

// Generate an HTML <img> tag
const tag = cu.imageTag("my-image.jpg", {
  width: 400,
  alt: "My Image",
  className: "rounded-lg",
})

// Upload a file
const result = await cu.uploader.upload("/path/to/image.png", {
  folder: "products",
  tags: ["featured"],
  transformation: { width: 1200, quality: "auto" },
})

console.log(result.secure_url)`} id="ts-quick" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Image Transformations</h2>
          <p className="text-sm text-gray-600 mb-3">Cloudust supports the full set of Cloudinary-compatible transformation parameters via its URL API.</p>
          <table className="w-full text-sm border-collapse mb-3">
            <thead>
              <tr className="border-b border-sky-200">
                <th className="text-left py-2 text-gray-500 font-medium">Parameter</th>
                <th className="text-left py-2 text-gray-500 font-medium">Options</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">w_800</td><td className="py-1.5 text-gray-500 text-xs">Width in pixels</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">h_600</td><td className="py-1.5 text-gray-500 text-xs">Height in pixels</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">c_fill</td><td className="py-1.5 text-gray-500 text-xs">Crop: fill, fit, scale, crop, thumb, pad, lpad, mpad</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">g_auto</td><td className="py-1.5 text-gray-500 text-xs">Gravity: center, north, face, auto, adv_face, etc.</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">q_auto</td><td className="py-1.5 text-gray-500 text-xs">Quality: auto, auto:best, auto:good, auto:low, auto:eco</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">f_avif</td><td className="py-1.5 text-gray-500 text-xs">Format: avif, webp, jpeg, png, gif, heif, tiff, jp2</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">e_sepia</td><td className="py-1.5 text-gray-500 text-xs">Effect: grayscale, sepia, negate, blur, sharpen, vignette, pixelate, oil_paint, cartoonify, etc.</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">r_20</td><td className="py-1.5 text-gray-500 text-xs">Corner radius</td></tr>
              <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-900 font-mono text-xs">a_90</td><td className="py-1.5 text-gray-500 text-xs">Angle: 90, 180, 270, auto_right, auto_left, vflip, hflip</td></tr>
            </tbody>
          </table>
          <CodeBlock code={`// Transformation via URL parameters
https://media.yourdomain.com/image/upload/c_fill,g_auto,w_800,h_600,q_auto,f_avif/v1/my-image.jpg

// With signed URL
https://media.yourdomain.com/image/upload/c_fill,w_400/v1/my-image.jpg?s--abc12345--`} id="tx-url" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Go CLI Reference</h2>
          <p className="text-sm text-gray-600 mb-3">The <code className="bg-sky-50 px-1.5 py-0.5 rounded text-xs font-mono text-sky-700">cloudust</code> CLI provides full media management from the terminal.</p>
          <CodeBlock code={`# Initialize config
cloudust init

# Upload with transformations
cloudust upload hero.jpg -w 1200 -H 630 -c fill -f webp -q auto -i my-hero

# Generate delivery URL
cloudust url my-hero -w 400 -H 300 -c fill -f avif

# Generate HTML image tag
cloudust url my-hero -w 400 --tag --alt "Hero image"

# List resources
cloudust list -p products/

# Transform local file
cloudust transform input.jpg -w 800 -e sepia -f png -o output.png

# Search
cloudust search "products/*"

# Get resource info
cloudust info my-hero

# Delete resources
cloudust delete my-hero unwanted-image`} id="go-cli" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Upload API</h2>
          <p className="text-sm text-gray-600 mb-3">Upload files with transformations, presets, eager transformations, responsive breakpoints, and more.</p>
          <CodeBlock code={`// Upload with eager transformations
const result = await cu.uploader.upload("photo.jpg", {
  public_id: "vacation/beach",
  transformation: { width: 2000 },
  eager: [
    { width: 300, height: 300, crop: "fill" },
    { width: 150, height: 150, crop: "fill" },
  ],
  tags: ["vacation", "summer"],
  context: { photographer: "John" },
  invalidate: true,
})

// Upload from URL
const result2 = await cu.uploader.uploadFromUrl(
  "https://example.com/image.jpg",
  { folder: "imports" }
)

// Chunked upload for large files
const result3 = await cu.uploader.uploadLarge("large-video.mp4", {
  chunk_size: 10 * 1024 * 1024,
  onProgress: (loaded, total) => console.log(\`\${loaded}/\${total}\`),
})`} id="upload-api" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Admin API</h2>
          <p className="text-sm text-gray-600 mb-3">Manage resources, tags, context, presets, and usage.</p>
          <CodeBlock code={`// List resources
const list = await cu.api.resources({
  prefix: "products/",
  max_results: 50,
  context: true,
})

// Delete by prefix
await cu.api.deleteByPrefix("old-assets/")

// Manage tags
await cu.api.addTags("my-image", ["featured", "hero"])
await cu.api.removeTags("my-image", ["old-tag"])

// Context/metadata
await cu.api.context({
  public_ids: ["my-image"],
  context: { alt: "Hero image", credit: "Photographer" },
})

// Usage stats
const usage = await cu.api.usage()
console.log(usage.objects)

// Presets
cu.api.createPreset({
  name: "product-thumb",
  transformation: { width: 300, height: 300, crop: "fill" },
  format: "webp",
  allowedFormats: ["jpg", "png", "webp"],
})`} id="admin-api" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Python SDK</h2>
          <CodeBlock code={`from cloudust import Cloudust

cu = Cloudust(
    api_key="your-api-key",
    api_secret="your-api-secret",
    bucket="my-media-bucket",
)

# Upload and transform
result = cu.upload("photo.jpg", {
    "folder": "products",
    "transformation": {"width": 800, "crop": "fill"},
})

# Generate URL
url = cu.url("products/photo.jpg", {
    "width": 400,
    "quality": "auto",
    "format": "webp",
})

# List resources
resources = cu.api.resources(prefix="products/")

# Transform locally
cu.transform("input.jpg", "output.webp", {
    "width": 800,
    "effect": "sepia",
})`} id="py-sdk" />
        </section>

        <section className="bg-sky-50 border border-sky-100 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Why Cloudust?</h2>
          <p className="text-xs text-gray-500 mb-3">Self-host your media pipeline. No vendor lock-in, no per-image pricing, full control over your delivery infrastructure.</p>
          <ul className="text-xs text-gray-600 space-y-1 mb-3">
            <li>• S3-backed storage — use your existing bucket</li>
            <li>• Cloudinary-compatible URL API — minimal migration effort</li>
            <li>• 3 SDKs (TypeScript, Go, Python) — integrate from any stack</li>
            <li>• On-the-fly transformations — no pre-processing needed</li>
            <li>• Signed URLs — control access to private media</li>
            <li>• CLI tool — manage media from CI/CD or scripts</li>
          </ul>
          <a href="https://github.com/Cofoundr-Ng/cloudust-sdk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 border border-sky-200 rounded-lg px-3 py-1.5 hover:bg-sky-50 transition-colors">
            <Github className="h-3 w-3" /> github.com/Cofoundr-Ng/cloudust-sdk
          </a>
        </section>
      </div>
    </div>
  )
}
