// main.jsx — Хэрэглээний ЭХЛЭЛ (entry point). index.html энэ файлыг дуудна.
// Энд React-ийг бодит хуудастай холбож, хамгийн эцэг компонентыг (App) дүрсэлнэ.

// React-ийн үндсэн багц. Доорх <React.StrictMode> гэсэн бичигт хэрэгтэй.
import React from 'react'

// createRoot — React 18-аас хойшхи ШИНЭ арга: "үндэс" (root) үүсгэж дэлгэцэд холбоно.
// Хуучин ReactDOM.render(...) арга ашиглагдахаа больсон.
import { createRoot } from 'react-dom/client'

// CSS-ийг нэг л газар, нэг л удаа оруулж ирнэ. Бүх компонентод нөлөөлнө.
import './index.css'

// Хамгийн эцэг компонент. Дотроо бүх дасгалыг удирдана.
import App from './App.jsx'

// document.getElementById('root')
//   → index.html доторх <div id="root"> элементийг олж авна.
// createRoot(...)
//   → тэр элементийг React-ийн "үндэс" болгоно (React энд л зурах эрхтэй болно).
// .render(<App />)
//   → <App /> элементээс эхлэн бүх дэлгэцийг зурна.
createRoot(document.getElementById('root')).render(
  // StrictMode — зөвхөн ХӨГЖҮҮЛЭЛТИЙН үед ажиллах туслах:
  //  1) түгээмэл алдааг (жишээ нь hook-ийн дүрэм зөрчсөн) console дээр сануулна,
  //  2) компонентийг 2 удаа дуудаж шалгана (тэгш бус үйлдэл байвал илрүүлнэ).
  // Бүтээлтийн (production) хувилбарт ямар ч нөлөөгүй.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
