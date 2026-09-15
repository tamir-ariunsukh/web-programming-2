// 02-EventList.jsx — Дадлага 2: Жагсаалтаас сонгосон элементийг устгах
// Хичээлийн 2-р бүлэг: үйл явдал зохицуулах (event handling), camelCase нэр,
// функцийн ишлэл ба сумтай функц, аргумент дамжуулах, event объект, bubbling.

import { useState } from 'react'

// Тогтмол анхны өгөгдөл. Энэ нь ТӨЛӨВ БИШ (өөрчлөгдөхгүй) тул компонентын ГАДНА,
// файлын дээд түвшинд байрлана. Гадна байгаа нь төлөв үүсэх бүрд дахин
// үүсэхгүй гэсэн давуу талтай.
const INITIAL_ITEMS = [
  { id: 1, title: 'React үндэс' },
  { id: 2, title: 'JSX ба компонент' },
  { id: 3, title: 'props ба state' },
  { id: 4, title: 'Үйл явдал ба форм' },
]

export default function EventList() {
  // items — объектуудын МАССИВ төлөв. Анхны утга нь дээрх тогтмол массив.
  const [items, setItems] = useState(INITIAL_ITEMS)

  // lastAction — сүүлийн үйлдлийн тайлбар хадгалах төлөв.
  // event объектын шинж чанаруудыг дэлгэцэнд харуулахад хэрэгтэй.
  const [lastAction, setLastAction] = useState('Одоогоор үйлдэл байхгүй')

  // АРГУМЕНТТАЙ үйл явдлын функц: аль элементийг устгахыг id-гаар нь тодорхойлно.
  function handleDelete(event, id, title) {
    // stopPropagation — үйл явдал дээшээ (эцэг рүү) хөвшихөөс сэргийлнэ.
    // Эс бөгөөс доорх section-ийн onClick бас ажиллаж, хоёр мэдэгдэл давхцана.
    event.stopPropagation()

    // filter — нөхцөл биелсэн элементүүдээр ШИНЭ массив үүсгэнэ.
    // item.id !== id → сонгосон id-гаас бусад бүх элемент үлдэнэ.
    // Хуучин items массивыг шууд өөрчлөх (items.splice гэх мэт) ХЭЗЭЭ Ч болохгүй:
    // React зөвхөн ШИНЭ массив ирэхэд л өөрчлөлтийг таньдаг.
    const nextItems = items.filter((item) => item.id !== id)
    setItems(nextItems)
    setLastAction(`Устгасан: "${title}" (id=${id}) → үлдсэн ${nextItems.length}`)
  }

  // "Сэргээх" товчны функц: төлвийг анхны массив руу буцаана.
  function handleRestore() {
    setItems(INITIAL_ITEMS)
    setLastAction('Жагсаалтыг анхны хэвээр сэргээлээ')
  }

  // БҮТЭН section дээр бүртгэсэн үйл явдал.
  // Дотоод элемент дээр дарахад үйл явдал дээшээ хөвж (bubbling) энд хүрч ирнэ.
  function handleSectionClick(event) {
    // event.target — үйл явдал үүссэн БОДИТ элемент (хамгийн дотоод).
    // event.currentTarget — сонсогч (onClick) бүртгэгдсэн элемент (энэ section).
    // event.type — үйл явдлын төрлийг текст хэлбэрээр буцаана: 'click'.
    setLastAction(
      `section дээр ${event.type}: target = <${event.target.tagName.toLowerCase()}>`,
    )
  }

  return (
    // onClick={handleSectionClick} — section-ийн аль ч хэсэгт дарахад ажиллана.
    <section className="card" onClick={handleSectionClick}>
      <h2>Дадлага 2 — Жагсаалт ба устгах товч</h2>

      <p className="note">Нийт: {items.length} элемент</p>

      {/* НӨХЦӨЛТ ДҮРСЛЭЛ (тернар): жагсаалт хоосон бол өөр текст харуулна.
          Анхаар: items.length && ... гэж бичихэд хоосон үед дэлгэцэнд "0" гардаг тул
          ЗААВАЛ items.length > 0 гэж харьцуулна. */}
      {items.length > 0 ? (
        <ul>
          {/* map — элемент бүрээр гүйж, тус бүрийг JSX болгон хувиргаж ШИНЭ массив буцаана. */}
          {items.map((item) => (
            // key — React-д элементүүдийг таних ДАВТАГДАШГҮЙ утга (энд өгөгдлийн id).
            // Массивын индексийг key болгох нь эрсдэлтэй: дараалал өөрчлөгдөхөд алдаа гарна.
            <li key={item.id}>
              {item.title}

              {/* Аргумент дамжуулах бол АЖИЛЛАХ сумтай функцээр ороох ЁСТОЙ:
                    onClick={(event) => handleDelete(event, item.id, item.title)}  ← ЗӨВ
                    onClick={handleDelete(item.id, item.title)}                    ← БУРУУ
                  Хаалттай бичих нь дүрслэл бүрд шууд ажиллана. */}
              <button
                onClick={(event) => handleDelete(event, item.id, item.title)}
              >
                Устгах
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="note">
          Жагсаалт хоосон байна. "Сэргээх" дарж анхны хэвээр болгоно уу.
        </p>
      )}

      <div className="row">
        <button onClick={handleRestore}>Сэргээх</button>
      </div>

      <p className="note">Сүүлийн үйл явдал: {lastAction}</p>

      <p className="note">
        Туршиж үзээрэй: жагсаалтын хоосон хэсэгт дарахад bubbling-ийн мэдээлэл гарна.
        Харин "Устгах" товч дээр дарахад зөвхөн устгалын мэдээлэл гарна — учир нь
        event.stopPropagation() дээшээ хөвшихийг зогсоосон.
      </p>
    </section>
  )
}
