// 05-SearchList.jsx — Дадлага 5: Жагсаалтын дүрслэл, хайлт, шүүлт, эрэмбэлэлт
// Хичээлийн 4-5-р бүлэг: map + key, нөхцөлт дүрслэл, хайлт ба шүүлтүүр.
//
// ГОЛ САНАА: шүүсэн/эрэмбэлсэн жагсаалтыг ТУСДАА ТӨЛӨВ болгож ХАДГАЛАХГҮЙ.
// Зөвхөн "түүхий" өгөгдөл ба 3 шалгуурыг (query, club, sortBy) төлөвт хадгалаад,
// дүрслэлийн ЯВЦАД filter/sort-оор бодож гаргана. Ингэснээр төлөв давхардахгүй,
// хайлт ба шүүлтүүр үргэлж нийцэж байна.

import { useState } from 'react'

// Тогтмол өгөгдөл (төлөв биш — хэрэглэгч өөрчлөхгүй) тул компонентын гадна талд.
const STUDENTS = [
  { id: 101, name: 'Болд', score: 82, club: 'Программчлал' },
  { id: 102, name: 'Сараа', score: 95, club: 'Робот' },
  { id: 103, name: 'Тэмүүлэн', score: 74, club: 'Программчлал' },
  { id: 104, name: 'Номин', score: 88, club: 'Дизайн' },
  { id: 105, name: 'Амар', score: 61, club: 'Робот' },
]

// Клубийн сонголтууд — select-ийн option-уудыг map-оор үүсгэнэ.
const CLUBS = ['Бүгд', 'Программчлал', 'Робот', 'Дизайн']

export default function SearchList() {
  // Жагсаалтын өөрөө биш, ШАЛГУУРУУДЫГ төлөвт хадгална:
  const [query, setQuery] = useState('') // хайлтын текст
  const [club, setClub] = useState('Бүгд') // сонгосон клуб
  const [sortBy, setSortBy] = useState('name') // эрэмбэ: 'name' эсвэл 'score'

  // ДҮРСЛЭЛИЙН ЯВЦАД бодож гаргана. Алхмууд:
  //   1) [...STUDENTS] — ХУУЛБАР. Учир нь sort() нь массивыг ГАЗАР ДЭЭРЭЭ өөрчилдөг
  //      (мутаци хийдэг). Хуулбар авахгүй бол анхны өгөгдөл эвдэрнэ!
  //   2) filter ×2 — нэр ба клубаар шүүнэ (filter нь үргэлж ШИНЭ массив буцаана).
  //   3) sort — эрэмбэлнэ (буцсан шинэ массив дээр ажиллана).
  const visible = [...STUDENTS]
    .filter((student) =>
      // toLowerCase() — жижиг/том үсгийг ялгахгүй хайх.
      // includes() — тухайн дэд текст байгаа эсэх (true/false).
      student.name.toLowerCase().includes(query.toLowerCase()),
    )
    .filter(
      // 'Бүгд' сонгосон бол бүгдийг үлдээнэ; эс бөгөөс зөвхөн таарсан клубыг.
      (student) => club === 'Бүгд' || student.club === club,
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        // localeCompare — тэмдэгт мөрүүдийг цагаан толгойн дарааллаар харьцуулна
        // (монгол үсгийг ч зөв эрэмбэлнэ).
        return a.name.localeCompare(b.name)
      }
      // Оногоор БУУРАХААР: b - a. (Өсөхөөр эрэмбэлэх бол a - b гэж бичнэ.)
      return b.score - a.score
    })

  return (
    <section className="card">
      <h2>Дадлага 5 — Жагсаалт, хайлт, шүүлт, эрэмбэ</h2>

      <div className="row">
        <label className="field">
          Хайх
          {/* Хяналттай оролт: value төлвөөс, onChange төлөв рүү. */}
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Нэрээр хайх..."
          />
        </label>

        <label className="field">
          Клуб
          {/* select-ийн сонголтуудыг CLUBS массиваас map-оор үүсгэж байна.
              key={name} — утга нь давтагдашгүй тул key болгож болно. */}
          <select
            value={club}
            onChange={(event) => setClub(event.target.value)}
          >
            {CLUBS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          Эрэмбэ
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="name">Нэрээр (А→Я)</option>
            <option value="score">Оногоор (их→бага)</option>
          </select>
        </label>
      </div>

      {/* Илэрцийн тоо: visible.length нь шүүлтийн үр дүнгээс шууд бодогдоно. */}
      <p className="note">
        Илэрц: {visible.length} / {STUDENTS.length}
      </p>

      {/* Тернар оператор: илэрц байгаа эсэхээс хамаарч хоёр өөр дэлгэц. */}
      {visible.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Нэр</th>
              <th>Клуб</th>
              <th>Оноо</th>
            </tr>
          </thead>
          <tbody>
            {/* map + key: key={student.id} нь өгөгдлөөс ирсэн давтагдашгүй утга.
                Массивын индексийг key болгож болохгүй (эрэмбэ солигдоход алдаа гарна). */}
            {visible.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.club}</td>
                {/* Нөхцөлт className: 90-ээс дээш бол 'good' класс нэмэгдэж, ногоон болно. */}
                <td className={student.score >= 90 ? 'good' : ''}>
                  {student.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="note">Илэрц олдсонгүй. Хайлтын текстээ өөрчилж үзээрэй.</p>
      )}

      <p className="note">
        Туршиж үзээрэй: "Сараа" гэж хайгаад клубыг "Робот" болго — хоёр шалгуур зэрэг
        ажиллана. Жагсаалтын төлөв тусдаа хадгалагдаагүй, шалгуур бүр өөрчлөгдөх бүрд
        visible дахин бодогдож байна.
      </p>
    </section>
  )
}
