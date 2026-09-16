// App.jsx — Лабораторын ҮНДСЭН ХУУДАС.
// Зүүн талын цэснээс дасгал сонгоход баруун талд тухайн жишээ гарна.
// Дэлгэцэн дээрх үр дүнгийн ДООР нь мөн тэр дасгалын ЭХ КОД харагдана —
// ингэснээр "эх код ↔ бодит DOM" хоёрыг зэрэг харьцуулж суралцана.
// Түүнчлэн кодыг ГАЗАР ДЭЭР НЬ засварлаж болно: засвар хийгээд удалгүй дээрх
// жишээ (DOM) автоматаар тэр засвараараа ажиллаж эхэлнэ.
// Энэ файл өөрөө ч гэсэн 3 ойлголтыг давтан үзүүлж байна:
//   1) useState — сонгосон цэсний дугаарыг санана,
//   2) Жагсаалтын дүрслэл — LABS массив дээр map + key,
//   3) Нөхцөлт дүрслэл — зөвхөн сонгосон компонент дүрслэгдэнэ.

// useState — цэсний сонголтыг хадгалах төлөв.
import { useState } from 'react'

// Дасгал бүр тусдаа файлд (нэг файл = нэг сэдэв). Зам нь './labs/...' харьцангуй зам.
import Counter from './labs/01-Counter.jsx'
import EventList from './labs/02-EventList.jsx'
import SignupForm from './labs/03-SignupForm.jsx'
import ConditionalDemo from './labs/04-Conditional.jsx'
import SearchList from './labs/05-SearchList.jsx'
import LiftState from './labs/06-LiftState.jsx'
import TodoStorage from './labs/07-TodoStorage.jsx'

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
// Буцаах утга нь толь (object): { './labs/01-Counter.jsx': '// 01-Counter...', ... }
const SOURCES = import.meta.glob('./labs/*.jsx', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// LABS — цэсний өгөгдөл. Объект бүр:
//   id    — давтагдашгүй түлхүүр (key),
//   title — товчны текст,
//   View  — тухайн дасгалын компонент (React-д функц бол өгөгдөл юм),
//   file  — эх файлын нэр (SOURCES-ээс эх кодыг олоход хэрэглэнэ).
const LABS = [
  { id: 'counter', title: '1. Тоолуур — useState', View: Counter, file: '01-Counter.jsx' },
  { id: 'event', title: '2. Үйл явдал ба устгах товч', View: EventList, file: '02-EventList.jsx' },
  { id: 'form', title: '3. Хяналттай форм ба шалгалт', View: SignupForm, file: '03-SignupForm.jsx' },
  { id: 'conditional', title: '4. Нөхцөлт дүрслэл', View: ConditionalDemo, file: '04-Conditional.jsx' },
  { id: 'list', title: '5. Жагсаалт, хайлт, эрэмбэ', View: SearchList, file: '05-SearchList.jsx' },
  { id: 'lift', title: '6. Төлөвийг дээш өргөх', View: LiftState, file: '06-LiftState.jsx' },
  { id: 'todo', title: '7. To-do ба localStorage', View: TodoStorage, file: '07-TodoStorage.jsx' },
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
  // './labs/01-Counter.jsx' гэсэн хэлбэртэй тул замаа файлын нэрэн дээр залгана.
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
        <h1>Web Programming II — 3 дугаар долоо хоног</h1>
        <p>
          State (төлөв), үйл явдал, хяналттай форм, нөхцөлт ба жагсаалтын дүрслэл —
          унших материалын дагуух лабораторын жишээнүүд. Жишээ бүрийн доор нь
          түүний эх код харагдана: «Засварлах» товчоор кодоо өөрчилбөл дээрх үр дүн
          (DOM) тэр дор нь шинэчлэгдэнэ.
        </p>
      </header>

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
              хуучин компонентыг арилгаж, шинийг нь эхнээс нь ажиллуулна
              (тиймээс солиход хуучин төлөв хадгалагдахгүй — зөв зан төлөв). */}
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
