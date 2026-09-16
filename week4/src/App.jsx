// App.jsx — Лабораторын ҮНДСЭН ХУУДАС.
// Зүүн талын цэснээс дасгал сонгоход баруун талд тухайн жишээ гарна.
// Дэлгэцэн дээрх үр дүнгийн ДООР нь мөн тэр дасгалын ЭХ КОД харагдана — түүнийг
// ГАЗАР ДЭЭР НЬ засварлаж болно: засвар хийгээд удалгүй дээрх жишээ (DOM)
// автоматаар тэр засвараараа ажиллаж эхэлнэ.
// Цэсний механизм нь өмнө үзсэн мэдлэгээ давтаж байна:
//   1) useState — сонгосон цэсний id-г санана,
//   2) Жагсаалтын дүрслэл — LABS массив дээр map + key,
//   3) Нөхцөлт дүрслэл — зөвхөн сонгосон компонент дүрслэгдэнэ.
// Харин гол агуулга нь лабораторын дасгал бүр дэх useEffect юм.

// useState — цэсний сонголтыг хадгалах төлөв.
import { useState } from 'react'

// Дасгал бүр тусдаа файлд (нэг файл = нэг сэдэв). Зам нь './labs/...' харьцангуй зам.
import MountLog from './labs/01-MountLog.jsx'
import TitleSync from './labs/02-TitleSync.jsx'
import Timer from './labs/03-Timer.jsx'
import WindowSize from './labs/04-WindowSize.jsx'
import FetchList from './labs/05-FetchList.jsx'
import DepsForms from './labs/06-DepsForms.jsx'

// CodeBlock — эх кодыг өнгөтэй, мөр дугаартайгаар харуулах ба засварлах туслах компонент.
import CodeBlock from './components/CodeBlock.jsx'

// LivePreview — засварласан код дүрслэх үед гарсан алдааг барих "хамгаалалтын хүрээ".
import LivePreview from './components/LivePreview.jsx'

// compileLab — засварласан JSX кодыг browser дотор ажиллуулж, компонент болгоно.
import { compileLab } from './lib/compileLab.js'

// ---------------------------------------------------------------------------
// ЭХ КОД ХАРУУЛАХ ТЕХНИК: Vite-ийн import.meta.glob
// ---------------------------------------------------------------------------
// import.meta.glob(загвар, тохиргоо) — нэг БҮЛЭГ файлыг нэг дор импортлох
// Vite-ийн боломж (стандарт JS-д байхгүй). './labs/*.jsx' гэсэн загвар нь
// labs хавтас доторх бүх .jsx файлыг олно.
//   query: '?raw'     → файлыг compile хийхгүй, ЭНГИЙН ТЕКСТ (эх код) болгож авна.
//   import: 'default' → модулын үндсэн экспорт (энд текст) -ыг утга болгоно.
//   eager: true       → ачаалах үед тэр даруй уншина (жижиг төсөлд тохиромжтой).
// Буцаах утга нь толь (object): { './labs/01-MountLog.jsx': '// 01-MountLog...' , ... }
const SOURCES = import.meta.glob('./labs/*.jsx', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// LABS — цэсний өгөгдөл. Объект бүр:
//   id    — давтагдашгүй түлхүүр (key),
//   title — цэсэн дээр харагдах текст,
//   View  — тухайн дасгалын компонент (функц нь өөрөө утга учир ингэж хадгалж болно),
//   file  — эх файлын нэр (SOURCES-ээс эх кодыг олоход хэрэглэнэ).
const LABS = [
  { id: 'mount', title: '1. Анхны дүрслэл — хоосон массив', View: MountLog, file: '01-MountLog.jsx' },
  { id: 'title', title: '2. Хөтчийн гарчиг — утгатай массив', View: TitleSync, file: '02-TitleSync.jsx' },
  { id: 'timer', title: '3. Секундийн тоолуур — цэвэрлэгээ', View: Timer, file: '03-Timer.jsx' },
  { id: 'window', title: '4. Цонхны хэмжээ — сонсогчийн цэвэрлэгээ', View: WindowSize, file: '04-WindowSize.jsx' },
  { id: 'fetch', title: '5. Өгөгдөл татах — ачаалал ба алдаа', View: FetchList, file: '05-FetchList.jsx' },
  { id: 'deps', title: '6. Хамаарлын массивын 3 хэлбэр', View: DepsForms, file: '06-DepsForms.jsx' },
]

// export default — энэ файлын үндсэн экспорт. main.jsx үүнийг <App /> гэж дуудна.
export default function App() {
  // activeId — одоо сонгогдсон дасгалын id. Анхны утга нь массивын эхний элементийн id.
  const [activeId, setActiveId] = useState(LABS[0].id)

  // edits — ЗАСВАРЛАСАН дасгалууд: { [id]: { code, Component, error, run } }.
  // Зөвхөн засвар хийсэн дасгалууд энд хадгалагдана (эхэндээ хоосон {}).
  const [edits, setEdits] = useState({})

  // find — нөхцөл биелсэн ЭХНИЙ элементийг буцаана (filter биш, нэг объект).
  const activeLab = LABS.find((lab) => lab.id === activeId)

  // Олдсон объектын View талбарыг ТОМ үсгээр эхэлсэн хувьсагчид авна.
  // JSX дотор <ActiveView /> гэж бичихэд React үүнийг "компонент" гэж ойлгоно
  // (жижиг үсгээр бичихэд <div> шиг энгийн HTML таг гэж ойлгодог — анхаар!).
  const ActiveView = activeLab.View

  // Сонгосон дасгалын ЭХ КОД (энгийн текст). SOURCES-ийн түлхүүр нь
  // './labs/01-MountLog.jsx' гэсэн хэлбэртэй тул замаа файлын нэрэн дээр залгана.
  const activeSource = SOURCES[`./labs/${activeLab.file}`]

  // Сонгосон дасгалын ЗАСВАР (хэрэв хийгдсэн бол). Байхгүй бол undefined.
  const edit = edits[activeLab.id]

  // Засварласан компонент (байвал) — ТОМ үсгээр эхэлсэн нэрээр авна, JSX дотор
  // <EditedView /> гэж бичихэд React үүнийг компонент гэж ойлгоно.
  const EditedView = edit === undefined ? null : edit.Component

  // handleRun — засварласан кодыг BROWSER дотор compile хийж (lib/compileLab.js),
  // гарсан компонентыг төлөвт хадгална. Амжилтгүй бол алдааны текст хадгалж,
  // дээрх хэсэгт улаан хайрцагт харуулна.
  async function handleRun(labId, newCode) {
    try {
      const Component = await compileLab(newCode)

      // Функциональ шинэчлэл: өмнөх засваруудыг хадгалж, зөвхөн энэ дасгалыг сольно.
      setEdits((prev) => ({
        ...prev,
        [labId]: { code: newCode, Component, error: null, run: Date.now() },
      }))
    } catch (error) {
      setEdits((prev) => ({
        ...prev,
        [labId]: {
          code: newCode,
          Component: null,
          error: String(error.message || error),
          run: Date.now(),
        },
      }))
    }
  }

  // handleReset — засварыг устгана: демо нь эх компонент руугаа буцаж харагдана.
  function handleReset(labId) {
    setEdits((prev) => {
      const next = { ...prev } // төлөвийг ШУУД бус, хуулбарлан өөрчилнө
      delete next[labId]
      return next
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Web Programming II — 4 дүгээр долоо хоног</h1>
        <p>
          Компонентын амьдралын мөчлөг (lifecycle) ба useEffect — унших
          материал дахь дадлага даалгавруудын лаборатор. Жишээ бүрийн доор нь
          түүний эх код харагдана: «Засварлах» товчоор кодоо өөрчилбөл дээрх үр
          дүн (DOM) тэр дор нь шинэчлэгдэнэ.
        </p>
      </header>

      {/* САНУУЛГА: дасгал бүр console.log-оор мэдэгдэл хэвлэдэг.
          F12 (эсвэл баруун товч → Inspect) → Console табыг НЭЭЖ ажиглаарай.
          Хөгжүүлэлтийн горимд StrictMode эффектийг 2 удаа ажиллуулдаг —
          энэ нь алдаа биш, цэвэрлэгээг шалгах зорилготой (main.jsx-ийг үз). */}
      <p className="note">
        Дасгал бүр console дээр мэдэгдэл хэвлэдэг — хөтчийнхөө Console-ийг
        нээж туршиж үзээрэй. Хөгжүүлэлтийн горимд эффект 2 удаа ажилладаг нь
        хэвийн (StrictMode-ийн шалгалт) бөгөөд бүтээлтэд давтагдахгүй.
      </p>

      <div className="layout">
        <nav className="menu">
          {/* map — LABS элемент бүрээр гүйж, товч болгон хувиргана.
              key={lab.id} — React-д элементүүдийг таних давтагдашгүй утга. */}
          {LABS.map((lab) => (
            <button
              key={lab.id}
              // Нөхцөлт className: сонгосон цэс нь 'active' нэмэлт кластай болно.
              className={lab.id === activeId ? 'menu-btn active' : 'menu-btn'}
              // Сумтай функц: зөвхөн ДАРАХ үед setActiveId ажиллана.
              onClick={() => setActiveId(lab.id)}
            >
              {lab.title}
            </button>
          ))}
        </nav>

        <main className="content">
          {/* НӨХЦӨЛТ ДҮРСЛЭЛ: засвар байхгүй бол labs доторх ЭХ компонент,
              засвар байвал тэр засварын компонент дүрслэгдэнэ. Солигдох үед React
              хуучин компонентыг дэлгэцээс АРИЛГАЖ (салгах үе === unmount), шинийг
              нь эхнээс нь ажиллуулна (анхны дүрслэл === mount). Энэ бол амьдралын
              мөчлөгийн бодит жишээ: 3-р дасгал дээр "нуух" товч дарахад
              цэвэрлэгээ ажиллаж байгааг console-оос харна. */}
          {edit === undefined ? (
            <ActiveView />
          ) : (
            <>
              {/* Алдаагүй ажиллаж байгаа үед л "таны засвар" гэдгийг мэдэгдэнэ. */}
              {edit.error === null && (
                <div className="live-bar">
                  <span className="live-dot" aria-hidden="true" />
                  <span>
                    Таны засварласан код ажиллаж байна. Эх хувилбар руу буцаах бол
                    доорх «Буцаах» товчийг дарна уу.
                  </span>
                </div>
              )}

              {/* LivePreview — засварласан код дүрслэх үед гарсан алдааг барьж
                  (Error Boundary), хуудсыг бүхэлд нь унагахгүй.
                  key={edit.run} — шинэ засвар бүрд хязгаарыг шинээр эхлүүлнэ. */}
              <LivePreview key={edit.run} error={edit.error}>
                {EditedView !== null && <EditedView />}
              </LivePreview>
            </>
          )}

          {/* Дэлгэцэн дээрх үр дүнгийн доор — түүний ЭХ КОД (засварлах боломжтой).
              props-оор дамжуулж байна:
                fileName   — толгойд харуулах файлын нэр,
                code       — файлын бүтэн эх текст,
                editedCode — хэрэглэгчийн засвар (байвал),
                onRun      — засварласан текстийг ажиллуулах,
                onReset    — эх код руу буцаах.
              key={activeLab.id} — дасгал солиход засварлагчийн дотоод төлөв шинээр эхэлнэ. */}
          <CodeBlock
            key={activeLab.id}
            fileName={activeLab.file}
            code={activeSource}
            editedCode={edit === undefined ? undefined : edit.code}
            onRun={(newCode) => handleRun(activeLab.id, newCode)}
            onReset={() => handleReset(activeLab.id)}
          />
        </main>
      </div>
    </div>
  )
}
