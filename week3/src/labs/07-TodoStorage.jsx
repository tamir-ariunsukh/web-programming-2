// 07-TodoStorage.jsx — Нэмэлт: To-do жагсаалт ба localStorage
// Хичээлийн 5-р бүлгийн "To-do хэрэглээний алхмууд" ба localStorage хэсэг.
// Энд давтаж үзүүлэх ойлголтууд: хяналттай оролт, форм (preventDefault),
// массив төлөв дээр НЭМЭХ (spread) / УСТГАХ (filter) / ШИНЭЧЛЭХ (map),
// хөтөч дээр өгөгдөл хадгалах (localStorage).

import { useState } from 'react'

// localStorage-ийн түлхүүр. Нэг газар тогтмол болгож зарлавал
// нэрээ буруу бичих эрсдэл байхгүй.
const STORAGE_KEY = 'week3-todos'

// Анхны утгыг ФУНКЦ хэлбэрээр бэлтгэнэ (lazy initializer).
// useState(loadTodos) гэж ФУНКЦЭЭ дамжуулбал React зөвхөн ЭХНИЙ дүрслэл дээр
// нэг удаа дуудна. useState(loadTodos()) гэж ХААЛТТАЙ бичвэл дүрслэл бүрд
// (дахин дүрслэх бүрд) ажиллаж, илүүц ажил үүсгэнэ.
function loadTodos() {
  // localStorage зөвхөн ТЕКСТ хадгалдаг тул JSON.parse-оор буцаан массив болгоно.
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    // Хадгалагдсан өгөгдөл байхгүй бол хоосон массив буцаана.
    return []
  }

  return JSON.parse(raw)
}

export default function TodoStorage() {
  // todos — объектуудын МАССИВ төлөв. Анхны утга нь localStorage-аас (эсвэл []).
  // Төлөв бүр: { id: тоо, text: текст, done: логик }
  const [todos, setTodos] = useState(loadTodos)

  // text — оролтын одоогийн утга (хяналттай оролт).
  const [text, setText] = useState('')

  // Төлөв ба localStorage-ийг ХАМТ шинэчлэх жижиг туслах функц.
  // Ингэснээр "хадгалахаа мартах" алдаа гарахгүй — зөвхөн энэ функцийг дуудна.
  // (Дараагийн долоо хоногт useEffect сурсны дараа "төлөв өөрчлөгдөх бүрд
  //  автоматаар хадгалах" хэлбэрт шилжүүлж болно.)
  function updateTodos(nextTodos) {
    setTodos(nextTodos) // 1) React-ийн төлөв — дэлгэц шинэчлэгдэнэ

    // 2) Хөтчийн сан: объект/массивыг JSON.stringify-оор ТЕКСТ болгож хадгална.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos))
  }

  function handleAdd(event) {
    // Формын анхдагч үйлдэл (хуудас дахин ачаалах)-ыг зогсооно.
    event.preventDefault()

    // Хоосон эсвэл зөвхөн хоосон зай бичсэн бол нэмэхгүй (эрт буцаалт).
    if (text.trim() === '') {
      return
    }

    // Шинэ объект. id-д Date.now() (одоогийн миллисекунд тоо) — давтагдашгүй
    // утга өгөх энгийн арга (бодит системд серверээс id авна).
    const newTodo = { id: Date.now(), text: text.trim(), done: false }

    // НЭМЭХ: хуучин массивыг spread (...) -ээр задлаад, шинэ элементийг
    // төгсгөлд нь хамт бичнэ → ШИНЭ массив үүснэ (хуучин массив хөндөгдөхгүй).
    updateTodos([...todos, newTodo])

    // Оролтыг цэвэрлэнэ. Хяналттай оролт дээр DOM биш, ТӨЛӨВ л цэвэрлэгдэнэ.
    setText('')
  }

  function handleDelete(id) {
    // УСТГАХ: filter нь сонгосон id-г хассан ШИНЭ массив буцаана.
    updateTodos(todos.filter((todo) => todo.id !== id))
  }

  function handleToggle(id) {
    // ШИНЭЧЛЭХ: map нь элемент бүрээр гүйж, ЗӨВХӨН сонгосон элементийг
    // ШИНЭ объектоор солино; бусад элементийг хэвээр нь буцаана.
    // {...todo, done: !todo.done} — бусдыг хуулж, зөвхөн done-г эсрэгээр солино.
    updateTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  // ҮҮСМЭЛ УТГА (derived value): тусдаа төлөв ХЭРЭГГҮЙ —
  // массив дээр шууд filter().length гэж бодож гаргана.
  const doneCount = todos.filter((todo) => todo.done).length

  return (
    <section className="card">
      <h2>Нэмэлт — To-do ба localStorage</h2>

      {/* onSubmit — товч дарах ЭСВЭЛ Enter дарахад ажиллана (зөвхөн форм дээр боломжтой). */}
      <form onSubmit={handleAdd} className="row">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Шинэ ажил бичих..."
        />
        {/* type="submit" — форм дээрх onSubmit-ыг дуудна. */}
        <button type="submit">Нэмэх</button>
      </form>

      {/* Хоёр өөр тоо ижил массиваас бодогдож байна — төлөв давхарлаагүй жишээ. */}
      <p className="note">
        Нийт: {todos.length} · Дууссан: {doneCount}
      </p>

      <ul>
        {/* map + key: todo.id нь өгөгдлийн объектоос ирсэн давтагдашгүй утга. */}
        {todos.map((todo) => (
          <li key={todo.id}>
            {/* checkbox — checked атрибут нь төлвөөс, onChange нь төлөв рүү бичнэ. */}
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggle(todo.id)}
            />

            {/* style={{ ... }} — гадна хаалт нь JSX илэрхийлэл, дотор нь JS ОБЪЕКТ.
                CSS нэрнүүд JS дээр camelCase бичигдэнэ (text-decoration → textDecoration).
                Нөхцөлт утга: дууссан бол текст зурж харуулна. */}
            <span
              style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>

            <button onClick={() => handleDelete(todo.id)}>Устгах</button>
          </li>
        ))}
      </ul>

      {/* Логик БА: жагсаалт ХООСОН үед л энэ мэдэгдэл харагдана.
          todos.length && ... гэж бичихэд хоосон үед дэлгэцэнд "0" гардаг тул
          ЗААВАЛ === 0 (эсвэл > 0) гэж харьцуулна. */}
      {todos.length === 0 && (
        <p className="note">Одоогоор ажил байхгүй. Нэг нэмж үзээрэй.</p>
      )}

      <p className="note">
        Туршиж үзээрэй: 2-3 ажил нэмээд хөтчөө F5-ээр дахин ачаал — ажлууд
        localStorage-д хадгалагдсан тул үлдэнэ.
      </p>
    </section>
  )
}
