// scripts/serve-site.mjs — Угсарсан сайтыг (dist/) локал дээр үзүүлэх энгийн статик сервер.
//
// ЯАГААД: `npm run build`-ийн дараа сайт нь ДЭД ЗАМД байрладаг (dist/week4/,
// dist/week3/). Энгийн серверээр тэр бүтцийг зөв үзүүлэхэд энэ script хангалттай
// (нэмэлт сан шаардлагагүй — Node-ийн built-in http модуль).
//
// АЖИЛЛУУЛАХ:
//   npm run preview        # http://localhost:4173
//   PORT=5000 npm run preview   (эсвэл: node scripts/serve-site.mjs 5000)

import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

// repo-ийн үндэс → dist хавтас (build-site.mjs-тэй ижил зарчим).
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(repoRoot, 'dist')

const port = Number(process.env.PORT || process.argv[2] || 4173)

if (!existsSync(root)) {
  console.error('Алдаа: dist хавтас байхгүй. Эхлээд `npm run build` ажиллуулна уу.')
  process.exit(1)
}

// Өргөтгөлөөр нь MIME төрөл тодорхойлно (хөтөч зөв танихын тулд).
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

createServer((request, response) => {
  // URL-ийн замыг л авна (query string-ийг хаяна) ба %XX-ийг задална.
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)

  // Хавтас руу slash-ГҮЙ хандвал slash-тай руу шилжүүлнэ — ингэснээр доторх
  // харьцангуй зам (ж: fetch('students.json')) зөв ажиллана.
  // АНХААР: slash-тай замыг дахин шилжүүлбэл төгсгөлгүй давталт (redirect loop)
  // үүснэ — тиймээс !pathname.endsWith('/') нөхцөл ЗААВАЛ хэрэгтэй.
  if (pathname !== '/' && !pathname.endsWith('/')) {
    const direct = normalize(join(root, pathname))
    if (existsSync(direct) && statSync(direct).isDirectory()) {
      // no-store — шилжүүлэлтийг хөтөч кэшлэхгүй (кэшлэвэл дараагийн
      // туршилтад хуучин шилжүүлэлт давтагдаж, төөрөгдөл үүсгэдэг).
      response.writeHead(301, { Location: `${pathname}/`, 'Cache-Control': 'no-store' })
      response.end()
      return
    }
  }

  // Хавтас → дотор нь index.html; эс бөгөөс тухайн файл.
  const filePath = normalize(join(root, pathname.endsWith('/') ? join(pathname, 'index.html') : pathname))

  // Аюулгүй байдал: root-оос гадагш гарахыг (../../) хориглоно.
  if (!filePath.startsWith(root)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('403 — хориглосон зам')
    return
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('404 — олдсонгүй')
    return
  }

  response.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] || 'application/octet-stream' })
  createReadStream(filePath).pipe(response)
}).listen(port, () => {
  console.log(`Сайт: http://localhost:${port}/   (эх хуудас)`)
  console.log(`      http://localhost:${port}/week3/ , http://localhost:${port}/week4/ ...`)
})
