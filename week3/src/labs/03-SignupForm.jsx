// 03-SignupForm.jsx — Дадлага 3: Хяналттай форм (controlled form) ба шалгалт
// Хичээлийн 3-р бүлэг: value + onChange холбоо, олон талбартай форм (нэг объект төлөв),
// динамик handleChange, checkbox ба select, preventDefault, форм цэвэрлэх, алдаа шалгах.

import { useState } from 'react'

// Анхны утгыг НЭГ ГАЗАР тогтмол болгож зарлана. Форм цэвэрлэхэд дахин ашиглана —
// ингэснээр ижил утгыг хоёр газар бичих, мартах эрсдэл багасна.
const INITIAL_FORM = {
  name: '', // хэрэглэгчийн нэр (текст)
  email: '', // и-мэйл (текст)
  city: 'Улаанбаатар', // сонгосон хот (select-ийн анхны сонголт)
  agree: false, // нөхцөл зөвшөөрсөн эсэх (логик утга)
}

export default function SignupForm() {
  // Нэг ОБЪЕКТ төлөв: талбар бүрд тусдаа useState зарлахаас илүү цэгцтэй.
  const [form, setForm] = useState(INITIAL_FORM)

  // errors — шалгалтын үр дүн. Аль талбар алдаатай бол тэр нэрээр түлхүүр үүснэ.
  // Жишээ: { name: 'Нэр хоосон байна.', email: '...' }
  const [errors, setErrors] = useState({})

  // sent — амжилттай илгээгдсэн эсэх (нөхцөлт мэдэгдэл харуулахад хэрэгтэй).
  const [sent, setSent] = useState(false)

  // БҮХ оролтод НЭГ handler хангалттай — оролтын name-аар нь ялгаж шинэчилнэ.
  function handleChange(event) {
    // event.target — өөрчлөгдсөн оролтын DOM элемент.
    // Объектын задлалт: name, value, type, checked гэсэн 4 талбарыг салгаж авна.
    const { name, value, type, checked } = event.target

    // checkbox-ийн утга нь value биш, checked (true/false) — төрлөөр нь ялгана.
    const nextValue = type === 'checkbox' ? checked : value

    // ТООЦООЛСОН ТҮЛХҮҮР [name]: зөвхөн тухайн нэг талбарыг солино.
    // Spread (...prev): бусад талбарыг хэвээр ХУУЛЖ үлдээнэ (объектыг шууд өөрчлөхгүй!).
    // prev ашиглаж буй шалтгаан: шинэ утга нь өмнөх төлвөөс хамааралтай.
    setForm((prev) => ({ ...prev, [name]: nextValue }))
  }

  // Шалгалтын функц: алдааны объект буцаана. Алдаа байхгүй бол хоосон {}.
  function validate(data) {
    const nextErrors = {}

    // trim() — хоёр талын хоосон зайг хасна ("   " гэж бичсэн нэр хүчингүй).
    if (data.name.trim() === '') {
      nextErrors.name = 'Нэр хоосон байна.'
    }

    // includes('@') — и-мэйл хаягт @ тэмдэг байгаа эсэх (даалгаврын шаардлага).
    if (!data.email.includes('@')) {
      nextErrors.email = 'И-мэйл хаягт @ тэмдэг байх ёстой.'
    }

    // !data.agree — checkbox сонгогдоогүй бол true болно.
    if (!data.agree) {
      nextErrors.agree = 'Үйлчилгээний нөхцөлийг зөвшөөрнө үү.'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    // ФОРМЫН АНХДАГЧ ҮЙЛДЭЛ нь хуудсыг дахин ачаалах (GET хүсэлт илгээх) юм.
    // React дээр үүнийг ЗААВАЛ зогсооно — эс бөгөөс хуудас дахин ачаалж, төлөв алдагдана.
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)

    // Object.keys(obj).length — объектын түлхүүрүүдийн тоо буюу алдааны тоо.
    if (Object.keys(nextErrors).length > 0) {
      setSent(false) // алдаатай үед амжилтын мэдэгдэл харуулахгүй
      return // эрт буцаалт: цааш үргэлжлүүлэхгүй
    }

    // Энд хүрвэл форм зөв бөглөгдсөн. Бодит системд энд API рүү илгээнэ.
    setSent(true)

    // Форм цэвэрлэх нь DOM-ийн reset() БИШ — төлвийг анхны утга руу буцаана.
    // (Хяналттай оролт дээр DOM-ийн reset() нь зөвхөн дэлгэцийг цэвэрлэдэг тул хангалтгүй.)
    setForm(INITIAL_FORM)
  }

  return (
    <section className="card">
      <h2>Дадлага 3 — Хяналттай форм ба шалгалт</h2>

      {/* onSubmit={handleSubmit} — товч дарах эсвэл Enter дарахад ажиллана.
          onSubmit={handleSubmit(event)} гэж хаалттай бичих нь БУРУУ (дүрслэл бүрд ажиллана). */}
      <form onSubmit={handleSubmit}>
        {/* <label> — шошго. Шошго дотор оролт байвал дарахад автоматаар фокус авна. */}
        <label className="field">
          Нэр
          {/* value={form.name} — ТӨЛӨВ → ОРОЛТ (оролт юу харуулахыг төлөв шийднэ).
              onChange={handleChange} — ОРОЛТ → ТӨЛӨВ (бичих бүрд төлөв шинэчлэгдэнэ).
              Хоёулаа ХАМТ байж л хяналттай оролт зөв ажиллана.
              name="name" — объектын түлхүүртэй ЯГ ижил байх ёстой (handleChange үүгээр ялгана). */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Жишээ: Болд"
          />
        </label>
        {/* ЛОГИК БА (&&): errors.name байгаа (truthy) үед л <p> дүрслэгдэнэ.
            Алдаа байхгүй үед JSX-д юу ч нэмэгдэхгүй. */}
        {errors.name && <p className="error">{errors.name}</p>}

        <label className="field">
          И-мэйл
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="bold@example.mn"
          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}

        <label className="field">
          Хот
          {/* select дээр value атрибутыг <select> таг дээр нь бичнэ (option дээр биш).
              onChange нь мөн select дээр байрлана. value нь option-ийн value-тай таарна. */}
          <select name="city" value={form.city} onChange={handleChange}>
            <option value="Улаанбаатар">Улаанбаатар</option>
            <option value="Дархан">Дархан</option>
            <option value="Эрдэнэт">Эрдэнэт</option>
          </select>
        </label>

        <label className="check">
          {/* checkbox нь логик утга хадгална: value биш, CHECKED атрибут ашиглана.
              event.target.checked нь true/false буцаана. */}
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          Үйлчилгээний нөхцөлийг зөвшөөрч байна
        </label>
        {errors.agree && <p className="error">{errors.agree}</p>}

        <div className="row">
          {/* type="submit" товч нь форм дээрх onSubmit-ыг дуудна. */}
          <button type="submit">Илгээх</button>
        </div>
      </form>

      {/* Нөхцөлт мэдэгдэл: sent === true үед л харагдана. */}
      {sent && <p className="ok">Амжилттай илгээгдэж, форм цэвэрлэгдлээ!</p>}

      {/* Хөгжүүлэлтийн үед төлвийг нүдээр шалгах хэрэгсэл.
          JSON.stringify — объектыг текст болгож хөрвүүлнэ. */}
      <p className="note">Одоогийн төлөв: {JSON.stringify(form)}</p>
    </section>
  )
}
