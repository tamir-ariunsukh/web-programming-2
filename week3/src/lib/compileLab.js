// compileLab.js — Браузер дотор бичсэн JSX кодыг "амьд" компонент болгох туслах модуль.
//
// Яагаад хэрэгтэй вэ: browser нь JSX-ийг ойлгодоггүй (энэ бол Babel-ийн зохиомол
// синтакс). Тиймээс дэлгэцэн дээрх засварлагчид бичсэн кодыг эхлээд ЭНГИЙН JavaScript
// болгож хөрвүүлээд, дараа нь ажиллуулах шаардлагатай.
//
//   JSX код  ──(1) Babel.transform──▶  энгийн JS  ──(2) new Function──▶  компонент
//
// Жич: энэ файл нь хичээлийн үндсэн сэдэв БИШ — зөвхөн "засварлаж үзэх" боломж
// гаргах туслах хэрэгсэл. Хичээлийн кодууд нь labs хавтас дотор хэвээр.

// React — хөрвүүлсэн код дотор React.createElement(...) хэлбэрээр хэрэглэгддэг.
import React from 'react'

// loadBabel — Babel санг ЗӨВХӨН эхний удаа ачаална (динамик import).
// Сан нь том (хэдэн MB) тул хуудас ачаалах үед биш, зөвхөн хэрэглэгч засвар
// хийж эхлэх үед л татагдана. Үр дүнг кэшлэснээр дараагийн удаа шууд буцна.
let babelPromise = null

function loadBabel() {
  if (babelPromise === null) {
    babelPromise = import('@babel/standalone')
  }
  return babelPromise
}

// compileLab(code) → Promise<Component>
//
// Амжилттай бол тухайн файлын export default компонентыг буцаана.
// Алдаа гарвал Error шидэнэ — дуудаж буй газар (App.jsx) try/catch-аар барьж,
// хэрэглэгчид улаан хайрцагт харуулна.
export async function compileLab(code) {
  const babelModule = await loadBabel()
  const Babel = babelModule.default !== undefined ? babelModule.default : babelModule

  // -------------------------------------------------------------------------
  // 1) ХӨРВҮҮЛЭЛТ (compile)
  // -------------------------------------------------------------------------
  //   presets: ['react']        → JSX-ийг React.createElement(...) болгоно,
  //   transform-modules-commonjs → import/export-ийг require/exports болгоно
  //                               (browser-т require гэж байхгүй тул бид өөрсдөө өгнө),
  //   filename                   → алдааны мессежид харагдах нэр.
  const result = Babel.transform(code, {
    presets: [['react', { runtime: 'classic' }]],
    plugins: ['transform-modules-commonjs'],
    filename: 'Lab.jsx',
  })

  // -------------------------------------------------------------------------
  // 2) АЖИЛЛУУЛАЛТ (run)
  // -------------------------------------------------------------------------
  // Хөрвүүлсэн кодыг new Function(...) дотор ажиллуулна. Код нь require,
  // exports, module, React гэсэн нэрсийг ашигладаг тул тэднийг параметрээр өгнө.
  const exportsObject = {}

  // require('react') → жинхэнэ React багц. Бусад модуль оруулахыг хориглоно
  // (browser-т файлын систем, сүлжээний модуль ачаалах боломжгүй).
  const requireModule = (name) => {
    if (name === 'react') return React
    throw new Error(
      `'${name}' модулийг энэ засварлагчид ачаалах боломжгүй. Зөвхөн 'react'-оос import хийж болно.`
    )
  }

  const run = new Function('require', 'exports', 'module', 'React', result.code)
  run(requireModule, exportsObject, { exports: exportsObject }, React)

  // -------------------------------------------------------------------------
  // 3) КОМПОНЕНТЫГ АВАХ
  // -------------------------------------------------------------------------
  // export default ... гэж экспортолсон компонент exports.default дотор байна.
  const Component = exportsObject.default

  if (typeof Component !== 'function') {
    throw new Error(
      'export default компонент олдсонгүй. Файл нь "export default function Нэр() { ... }" хэлбэртэй байх ёстой.'
    )
  }

  return Component
}
