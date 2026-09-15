// App.jsx — Лабораторын ҮНДСЭН ХУУДАС.
// Зүүн талын цэснээс дасгал сонгоход баруун талд тухайн жишээ гарна.
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

// LABS — цэсний өгөгдөл. Объект бүр:
//   id    — давтагдашгүй түлхүүр (key),
//   title — цэсэн дээр харагдах текст,
//   View  — тухайн дасгалын компонент (функц нь өөрөө утга учир ингэж хадгалж болно).
const LABS = [
  { id: 'mount', title: '1. Анхны дүрслэл — хоосон массив', View: MountLog },
  { id: 'title', title: '2. Хөтчийн гарчиг — утгатай массив', View: TitleSync },
  { id: 'timer', title: '3. Секундийн тоолуур — цэвэрлэгээ', View: Timer },
  { id: 'window', title: '4. Цонхны хэмжээ — сонсогчийн цэвэрлэгээ', View: WindowSize },
  { id: 'fetch', title: '5. Өгөгдөл татах — ачаалал ба алдаа', View: FetchList },
  { id: 'deps', title: '6. Хамаарлын массивын 3 хэлбэр', View: DepsForms },
]

// export default — энэ файлын үндсэн экспорт. main.jsx үүнийг <App /> гэж дуудна.
export default function App() {
  // activeId — одоо сонгогдсон дасгалын id. Анхны утга нь массивын эхний элементийн id.
  const [activeId, setActiveId] = useState(LABS[0].id)

  // find — нөхцөл биелсэн ЭХНИЙ элементийг буцаана (filter биш, нэг объект).
  const activeLab = LABS.find((lab) => lab.id === activeId)

  // Олдсон объектын View талбарыг ТОМ үсгээр эхэлсэн хувьсагчид авна.
  // JSX дотор <ActiveView /> гэж бичихэд React үүнийг "компонент" гэж ойлгоно
  // (жижиг үсгээр бичихэд <div> шиг энгийн HTML таг гэж ойлгодог — анхаар!).
  const ActiveView = activeLab.View

  return (
    <div className="app">
      <header className="header">
        <h1>Web Programming II — 4 дүгээр долоо хоног</h1>
        <p>
          Компонентын амьдралын мөчлөг (lifecycle) ба useEffect — унших
          материал дахь дадлага даалгавруудын лаборатор.
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
          {/* Зөвхөн сонгосон компонент дүрслэгдэнэ. Солигдох үед React хуучин
              компонентыг дэлгэцээс АРИЛГАЖ (салгах үе === unmount), шинийг нь
              эхнээс нь ажиллуулна (анхны дүрслэл === mount). Энэ бол амьдралын
              мөчлөгийн бодит жишээ: 3-р дасгал дээр "нуух" товч дарахад
              цэвэрлэгээ ажиллаж байгааг console-оос харна. */}
          <ActiveView />
        </main>
      </div>
    </div>
  )
}
