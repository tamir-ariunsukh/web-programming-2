// LivePreview.jsx — Засварласан код дээрх АЛДААНЫГ барих "хамгаалалтын хүрээ".
//
// Яагаад хэрэгтэй вэ: хэрэглэгчийн зассан код дүрслэх үед алдаа гарвал (жишээ нь
// байхгүй утга дээр .map дуудах, undefined.foo гэж унших) React бүхэл мод-ыг
// арилгаж, хуудас хоосон болдог. Error Boundary (алдааны хязгаар) ашиглавал
// зөвхөн энэ хэсэг л алдааны мэдэгдэл болж солигдоно.
//
// Анхаар: алдааны хязгаар нь ЗӨВХӨН КЛАСС компонент байж чадна — useState гэх мэт
// hook ашиглах боломжгүй. Тиймээс доорх ErrorBoundary нь класс хэлбэрээр бичигдсэн.
// (render дотор this.props.children-ийг буцааж байгаа нь тухайн хүүхдүүдийг
//  өөрчлөлтгүйгээр харуулах гэсэн үг.)

import { Component } from 'react'

// ErrorCard — алдааны мэдэгдэл. Хоёр төрлийн алдаанд нэг л хайрцгийг ашиглана:
//   1) compile (код задалж чадсангүй) — App.jsx-ээс error текстээр дамжина,
//   2) ажиллагааны алдаа (дүрслэх үед) — ErrorBoundary өөрөө барьж авна.
function ErrorCard({ title, message }) {
  return (
    <section className="card live-error">
      <h2>{title}</h2>
      <pre>{message}</pre>

      <p className="note">
        Кодоо засварлаад үзээрэй — засвар хийгээд төдийгүй хэсэг хүлээхэд энэ хэсэг
        автоматаар дахин ажиллана. Эсвэл доорх «Буцаах» товчоор эх код руу буцна уу.
      </p>
    </section>
  )
}

// LivePreview — гаднаас дуудагдах үндсэн компонент.
//   error — compile-ийн алдааны текст (алдаа байхгүй бол null).
//   children — ажиллуулах гэж буй засварласан компонент.
export default function LivePreview({ error, children }) {
  // Нэгдүгээрт: код задалж (compile) чадсангүй бол шууд алдааг харуулна.
  if (error !== null) {
    return <ErrorCard title="Кодыг ажиллуулж чадсангүй" message={error} />
  }

  // Хоёрдугаарт: код ажиллаж эхэлсний дараах алдааг хязгаараар барина.
  return <ErrorBoundary>{children}</ErrorBoundary>
}

class ErrorBoundary extends Component {
  // Класс компонентын төлөв — useState-ийн оронд this.state хэлбэрээр бичнэ.
  state = { error: null }

  // Алдаа гарсан үед React энэ функцийг дуудаж, төлөвийг өөрөө солино.
  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error !== null) {
      const message = String((this.state.error && this.state.error.message) || this.state.error)
      return <ErrorCard title="Ажиллах үед алдаа гарлаа" message={message} />
    }

    // Алдаа байхгүй бол хүүхдүүдээ (засварласан компонентыг) хэвээр харуулна.
    return this.props.children
  }
}
