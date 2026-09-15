// App.jsx — Лабораторын ҮНДСЭН ХУУДАС.
// Зүүн талын цэснээс дасгал сонгоход баруун талд тухайн жишээ гарна.
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

// LABS — цэсний өгөгдөл. Объект бүр: id (давтагдашгүй түлхүүр), title (товчны текст),
// View (тухайн дасгалын компонент). Компонентыг утга хэлбэрээр хадгалж болно —
// React-д функц бол өгөгдөл юм.
const LABS = [
  { id: 'counter', title: '1. Тоолуур — useState', View: Counter },
  { id: 'event', title: '2. Үйл явдал ба устгах товч', View: EventList },
  { id: 'form', title: '3. Хяналттай форм ба шалгалт', View: SignupForm },
  { id: 'conditional', title: '4. Нөхцөлт дүрслэл', View: ConditionalDemo },
  { id: 'list', title: '5. Жагсаалт, хайлт, эрэмбэ', View: SearchList },
  { id: 'lift', title: '6. Төлөвийг дээш өргөх', View: LiftState },
  { id: 'todo', title: '7. To-do ба localStorage', View: TodoStorage },
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
        <h1>Web Programming II — 3 дугаар долоо хоног</h1>
        <p>
          State (төлөв), үйл явдал, хяналттай форм, нөхцөлт ба жагсаалтын дүрслэл —
          унших материалын дагуух лабораторын жишээнүүд.
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
          {/* Зөвхөн сонгосон компонент дүрслэгдэнэ. Солигдох үед React
              хуучин компонентыг арилгаж, шинийг нь эхнээс нь ажиллуулна
              (тиймээс солиход хуучин төлөв хадгалагдахгүй — зөв зан төлөв). */}
          <ActiveView />
        </main>
      </div>
    </div>
  )
}
