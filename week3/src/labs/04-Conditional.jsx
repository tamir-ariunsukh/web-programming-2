// 04-Conditional.jsx — Дадлага 4: Нөхцөлт дүрслэл (conditional rendering) 4 арга
// Хичээлийн 4-р бүлэг: if/else, тернар оператор, логик БА (&&), эрт буцаалт (null).

import { useState } from 'react'

// Жижиг туслах компонент: зөвхөн нэвтэрсэн үед дүрслэгдэнэ.
// Тусдаа компонент болгосноор логикийг биш, зөвхөн харагдацыг нь уншина.
function AdminNote() {
  return (
    <p className="note">Админы тэмдэглэл: өнөөдөр 3 шинэ хэрэглэгч бүртгүүлсэн.</p>
  )
}

// АРГА 4 — ЭРТ БУЦААЛТ (early return):
// нөхцөл биелээгүй бол null буцаана → дэлгэцэнд юу ч гарахгүй.
// null бол "юу ч дүрслэхгүй" гэсэн ЗӨВ утга (0 тоо дэлгэцэнд гарах эрсдэлгүй).
function WelcomeBadge({ name }) {
  if (!name) {
    return null
  }
  // {name} — props-оор ирсэн утгыг дэлгэцэнд бичнэ.
  return (
    <p>
      Тавтай морил, <strong>{name}</strong>!
    </p>
  )
}

export default function ConditionalDemo() {
  // isLoggedIn — логик (boolean) төлөв: нэвтэрсэн эсэх.
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // name — хэрэглэгчийн нэр. Зочин үед төлөвт хадгалагдсан ч дэлгэцэнд гарахгүй.
  const [name, setName] = useState('Ануу')

  // АРГА 1 — if / else: нөхцөлөөр JSX-ийг хувьсагчид хадгална.
  // if нь утга БУЦААДАГГҮЙ илэрхийлэл тул JSX дотор { if (...) } гэж
  // ШУУД бичих боломжгүй — тиймээс бодолтыг функцийн биед урьдчилан хийнэ.
  let greeting
  if (isLoggedIn) {
    greeting = <span>Та нэвтэрсэн байна.</span>
  } else {
    greeting = <span>Та зочин хэрэглэгч байна.</span>
  }

  // Нэг үйл явдлын функц: товч дарахад логик утгыг эсрэг рүү нь эргүүлнэ.
  function handleToggleLogin() {
    // Функциональ шинэчлэл + логик НЕГАЦ (!):
    // !prev → true бол false, false бол true болно.
    setIsLoggedIn((prev) => !prev)
  }

  return (
    <section className="card">
      <h2>Дадлага 4 — Нөхцөлт дүрслэл (4 арга)</h2>

      <div className="row">
        {/* Товчны ТЕКСТ өөрөө нөхцөлт дүрслэл — тернар оператор (арга 2).
            isLoggedIn true үед "Гарах", false үед "Нэвтрэх" гэж харагдана. */}
        <button onClick={handleToggleLogin}>
          {isLoggedIn ? 'Гарах' : 'Нэвтрэх'}
        </button>
      </div>

      <h3>1) if / else — хувьсагчид хадгалах</h3>
      {/* greeting хувьсагч нь дээрх if/else-ийн үр дүнг агуулна. */}
      <p>{greeting}</p>

      <h3>2) Тернар оператор — хоёр сонголтын аль нэг</h3>
      <p>
        Төлөв:{' '}
        <strong>{isLoggedIn ? 'Нэвтэрсэн' : 'Нэвтрээгүй'}</strong>
      </p>

      <h3>3) Логик БА (&&) — зөвхөн НЭГ тохиолдол</h3>
      {/* isLoggedIn true үед л <AdminNote /> дүрслэгдэнэ.
          АНХААР: тоо ашиглах үед ЗААВАЛ харьцуулна.
            {items.length && <p>...</p>}   ← хоосон үед дэлгэцэнд "0" гарна (буруу)
            {items.length > 0 && <p>...</p>} ← зөв */}
      {isLoggedIn && <AdminNote />}

      <h3>4) Эрт буцаалт (null) — тусдаа компонент</h3>
      {/* Нэвтэрсэн үед нэрээ дамжуулна, зочин үед ХООСОН ТЕКСТ дамжуулна.
          WelcomeBadge дотроос null буцаж, дэлгэцэнд юу ч гарахгүй. */}
      <WelcomeBadge name={isLoggedIn ? name : ''} />

      <h3>Нэмэлт — нэрийг өөрчлөх (хяналттай оролт)</h3>
      {/* Зөвхөн нэвтэрсэн үед харагдах хяналттай оролт.
          isLoggedIn && (...) — олон мөртэй JSX-ийг бүлэглэж бичих хэлбэр. */}
      {isLoggedIn && (
        <label className="field">
          Нэр солих
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
      )}

      <p className="note">
        Дөрвөн арга бүгд ижил төлөв (isLoggedIn)-оос хамаарна: товч дарж туршиж үзээрэй.
      </p>
    </section>
  )
}
