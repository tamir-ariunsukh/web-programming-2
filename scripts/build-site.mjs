// scripts/build-site.mjs — Бүх долоо хоногийн лабораторыг НЭГ статик сайт болгон угсарна.
//
// ЯАГААД: Vercel дээр (Vercel-ийн Git integration-оор) push бүрт автоматаар deploy
// хийхийн тулд repo-ийн ҮНДЭС дээр нэг л "build" команд хэрэгтэй. Энэ скрипт:
//
//   1) weekN хавтсуудыг АВТОМАТААР олно — шинэ долоо хоног нэмэгдэхэд энд юу ч
//      өөрчлөх шаардлагагүй (дүрэм: AGENTS.md §10),
//   2) долоо хоног бүрийг өөрийн node_modules-тойгоор build хийнэ,
//   3) бүтээлтийг dist/weekN/ дотор байрлуулна — сайт дэд замд
//      (ж: https://....vercel.app/week4/) ажиллахын тулд base=/weekN/ -ээр,
//   4) dist/index.html — долоо хоногууд руу холбоос бүхий эх хуудсыг үүсгэнэ.
//
// ЛОКАЛ ТУРШИХ:
//   npm run build                 # бүтэн (дотроо npm install-ийг ажиллуулна)
//   npm run build:skip-install    # node_modules аль хэдийн байгаа үед хурдан
//   npm run preview               # http://localhost:4173 — угсарсан сайтыг үзнэ

import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Скрипт нь scripts/ дотор байгаа тул repo-ийн үндэс нэг түвшинд дээш байна.
// (Процессын ажлын хавтас хаана ч байсан зөв ажиллана.)
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = join(repoRoot, 'dist')

// --skip-install → npm install-ийг алгасна (локал хөгжүүлэлтэд хурдан).
const skipInstall = process.argv.includes('--skip-install')

// ---------------------------------------------------------------------------
// 1. Долоо хоногуудыг олох
// ---------------------------------------------------------------------------
// 'week3', 'week4', ... гэсэн нэртэй ба package.json-той хавтсууд.
// АНХААР: ТООГООР эрэмбэлнэ — текстээр эрэмбэлбэл 'week10' < 'week3' болж буруу.
const weeks = readdirSync(repoRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^week\d+$/.test(entry.name))
  .map((entry) => entry.name)
  .filter((week) => existsSync(join(repoRoot, week, 'package.json')))
  .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)))

if (weeks.length === 0) {
  console.error('Алдаа: weekN хавтас олдсонгүй (package.json-той).')
  process.exit(1)
}

console.log(`Долоо хоногууд: ${weeks.join(', ')}`)

// ---------------------------------------------------------------------------
// 2. Гаралтын хавтсыг цэвэрлэх
// ---------------------------------------------------------------------------
rmSync(outRoot, { recursive: true, force: true })
mkdirSync(outRoot, { recursive: true })

// Тухайн хавтас дотроос нэг тушаал ажиллуулах туслах.
// execSync нь shell ашигладаг тул Windows-ын npm.cmd болон Linux-ийн npm дээр
// адил ажиллана (Vercel дээр Linux).
function run(command, cwd) {
  console.log(`  > ${command}`)
  execSync(command, { cwd, stdio: 'inherit' })
}

// ---------------------------------------------------------------------------
// 3. Долоо хоног бүрийг build хийж, dist/weekN руу хуулах
// ---------------------------------------------------------------------------
for (const week of weeks) {
  const weekDir = join(repoRoot, week)
  console.log(`\n=== ${week} ===`)

  if (!skipInstall) {
    // ЯАГААД npm install (npm ci биш): долоо хоногуудын package-lock.json нь
    // өөр хэрэгслээр (pnpm) ч шинэчлэгдэж байсан тул ci-ийн хатуу шаардлага
    // хангагдахгүй байж болно. install нь шаардлагатай бол түгжээгээ шинэчилж,
    // найдвартай ажиллана.
    run('npm install --no-audit --no-fund', weekDir)
  }

  // --base=/weekN/ — АНХААР: сайт дэд замд (/week4/) байрлана. Эс бөгөөс
  // бүтээлт нь '/assets/...' гэсэн үндсэн замаар asset хайж, 404 болно.
  run(`npm run build -- --base=/${week}/`, weekDir)

  // Vite-ийн гаралт нь weekN/dist (base=/weekN/ замтай) — сайтын бүтцэд хуулна.
  // dist дотор public/ доторх файлууд (ж: week4/students.json) бас орсон байна.
  cpSync(join(weekDir, 'dist'), join(outRoot, week), { recursive: true })
}

// ---------------------------------------------------------------------------
// 4. Эх хуудас (dist/index.html) үүсгэх
// ---------------------------------------------------------------------------
// Долоо хоног бүрийн гарчгийг түүний README.md-ийн ЭХНИЙ '# ' мөрөөс авна
// (ж: "# Week 4 — Компонентын амьдралын мөчлөг ба useEffect (Лаборатор)").
function weekTitle(week) {
  const readme = join(repoRoot, week, 'README.md')
  if (existsSync(readme)) {
    const heading = readFileSync(readme, 'utf8')
      .split('\n')
      .find((line) => line.startsWith('# '))
    if (heading !== undefined) return heading.slice(2).trim()
  }
  return week // README байхгүй бол хавтсны нэрээр
}

const cards = weeks
  .map((week) => {
    const title = weekTitle(week)
    return `        <li class="item">
          <a href="/${week}/">
            <span class="badge">${week}</span>
            <span class="title">${title}</span>
            <span class="go">Нээх →</span>
          </a>
        </li>`
  })
  .join('\n')

const indexHtml = `<!doctype html>
<html lang="mn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Programming II — лабораторын материалууд</title>
    <style>
      :root {
        --blue: #2e86ab;
        --blue-dark: #1f6c8c;
        --line: #dcdfe4;
        --bg: #f6f8fa;
        --gray: #666666;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 40px 16px 60px;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        background: var(--bg);
        color: #1a1a1a;
        line-height: 1.6;
      }
      .wrap {
        max-width: 760px;
        margin: 0 auto;
      }
      h1 {
        margin: 0 0 6px;
        font-size: 26px;
        border-bottom: 3px solid var(--blue);
        padding-bottom: 12px;
      }
      p.lead {
        color: var(--gray);
        margin: 12px 0 26px;
      }
      ul.list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 10px;
      }
      .item a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: #ffffff;
        border: 1px solid var(--line);
        border-radius: 12px;
        text-decoration: none;
        color: inherit;
      }
      .item a:hover {
        border-color: var(--blue);
        box-shadow: 0 2px 10px rgba(46, 134, 171, 0.14);
      }
      .badge {
        flex: 0 0 auto;
        padding: 2px 10px;
        border-radius: 999px;
        background: var(--blue);
        color: #ffffff;
        font-size: 13px;
        font-weight: 600;
      }
      .title {
        flex: 1 1 auto;
        font-weight: 600;
      }
      .go {
        flex: 0 0 auto;
        color: var(--blue-dark);
        font-size: 14px;
      }
      footer {
        margin-top: 30px;
        color: var(--gray);
        font-size: 14px;
      }
      footer a {
        color: var(--blue-dark);
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>Web Programming II — лабораторын материалууд</h1>
      <p class="lead">
        Хүрээ их сургуулийн хичээлийн лабораторууд — долоо хоног бүр тусдаа
        Vite + React төсөл. Жишээ бүрийн эх кодыг дэлгэцэн дээр харж, газар дээр
        нь засварлаж турших боломжтой.
      </p>
      <ul class="list">
${cards}
      </ul>
      <footer>
        Эх код: <a href="https://github.com/tamir-ariunsukh/web-programming-2">github.com/tamir-ariunsukh/web-programming-2</a>
      </footer>
    </div>
  </body>
</html>
`

writeFileSync(join(outRoot, 'index.html'), indexHtml, 'utf8')

console.log(`\nБэлэн: ${outRoot}`)
console.log('  dist/index.html  — долоо хоногуудын холбоос')
for (const week of weeks) {
  console.log(`  dist/${week}/index.html`)
}
console.log('\nЛокал үзэх: npm run preview')
