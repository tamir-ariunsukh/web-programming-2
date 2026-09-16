// CodeBlock.jsx — Тухайн дасгалын ЭХ КОД-ыг дэлгэцэн дээр харуулах ба ЗАСВАРЛАХ
// туслах компонент.
// Зорилго: "эх код ↔ бодит DOM" хоёрыг зэрэг харж харьцуулах — код нь ямар
// дүрслэл (HTML) үүсгэж байгааг нүдээр батлах, түүнчлэн кодыг ГАЗАР ДЭЭР НЬ засаж,
// үр дүн нь тэр дор нь өөрчлөгдөхийг харах.
//
// Энэ файл өөрөө дараах ойлголтуудыг давтан үзүүлж байна:
//   1) props — эцэг (App.jsx) -ээс fileName, code, editedCode, onRun, onReset,
//   2) useState — код нээлттэй эсэх, засварлах горим, хуулагдсан эсэх, засварын текст,
//   3) Нөхцөлт дүрслэл — showCode/editing-ээс хамаарч <pre> эсвэл текст хайрцаг,
//   4) Жагсаалтын дүрслэл — мөр бүр, токен бүрийг map-аар гүйлгэнэ,
//   5) useEffect — засвар хийгээд 0.6 секунд хүлээгээд автоматаар ажиллуулах.
//
// Тэмдэглэл: useEffect нь ЭНЭ долоо хоногийн гол сэдэв. Дасгалууд дээр эффект нь
// гаж нөлөө (fetch, таймер, сонсогч) биелүүлдэг бол энд "хэрэглэгч бичиж дуусахыг
// хүлээгээд ажиллуулах" (debounce) зорилготой — ижил hook, өөр зорилго.

// useState — төлөвүүд; useEffect — засварыг тодорхой хугацааны дараа ажиллуулахад.
import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// 1. Энгийн өнгөжүүлэлт (syntax highlight)
//    Жинхэнэ parser биш — зөвхөн уншихад эвтэйхэн болгох хялбар арга.
//    Текстийг эхнээс нь уншиж, байрлал бүр дээр дүрмүүдийг ДАРААЛЛААР шалгана.
//    Аль нэг дүрэм таарвал тэр хэсгийг "токен" болгож, төрлийн нэр өгнө.
// ---------------------------------------------------------------------------

// Дүрэм бүр: [төрөл, regex]. "y" (sticky) тэмдэг нь regex-ийг ЯГ одоогийн
// байрлалаас эхлэхийг шаардана — өөр газар хайхгүй.
const RULES = [
  // Тайлбар: /* ... */ (олон мөрт байж болно) эсвэл // ... (мөрийн төгсгөл хүртэл).
  ['comment', /\/\*[\s\S]*?\*\/|\/\/[^\n]*/y],
  // Тэмдэгт мөр: '...' эсвэл "..." — дотроо шинэ мөр орохгүй.
  ['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/y],
  // Сумтай функц: => — энэ нь доорх ">" (таг хаах) дүрмээс ӨМНӨ байх ёстой.
  ['op', /=>/y],
  // JSX таг: <div, </p, <Counter гэх мэт эхлэл ба />, > тэмдэг.
  ['tag', /<\/?[A-Za-z][\w.$]*|\/?>/y],
  // Hook: useState, useEffect, useMemo ... (use + том үсэг).
  ['hook', /\buse[A-Z]\w*/y],
  // Түлхүүр үг.
  [
    'keyword',
    /\b(?:import|from|export|default|const|let|var|function|return|if|else|for|of|in|new|typeof|null|true|false|undefined)\b/y,
  ],
  // Тоо.
  ['number', /\b\d+(?:\.\d+)?\b/y],
]

// tokenize — бүтэн текстийг { type, text } токены массив болгон задална.
//   type === 'plain' → өнгөгүй энгийн текст (жишээ нь JSX доторх монгол өгүүлбэр).
function tokenize(code) {
  const tokens = []
  let plain = '' // өнгөгүй текст хуримтлуулах буфер
  let i = 0 // одоо уншиж буй тэмдэгтийн байрлал

  while (i < code.length) {
    let match = null

    // Дүрмүүдийг дараалан шалга — ЭХНИЙ таарсан дүрэм ялна.
    for (const [type, re] of RULES) {
      re.lastIndex = i // sticky regex-ийг энэ байрлалаас эхлүүлнэ
      const found = re.exec(code)
      if (found !== null) {
        match = { type, text: found[0] }
        break
      }
    }

    if (match !== null) {
      // Өмнө хуримтласан өнгөгүй хэсгээ эхлээд бичээд, дараа нь токеныг нэмнэ.
      if (plain !== '') {
        tokens.push({ type: 'plain', text: plain })
        plain = ''
      }
      tokens.push(match)
      i += match.text.length
    } else {
      // Ямар ч дүрэм таарахгүй бол тэмдэгтийг өнгөгүй текстэд нэмнэ.
      plain += code[i]
      i += 1
    }
  }

  if (plain !== '') tokens.push({ type: 'plain', text: plain })
  return tokens
}

// toLines — токенуудыг МӨРӨӨР нь бүлэглэнэ (мөрийн дугаар харуулахад хэрэгтэй).
// Нэг токен дундаа \n агуулж болно (олон мөрт тайлбар) тул түүнийг хэсэглэнэ.
function toLines(tokens) {
  const lines = [[]] // мөр бүр токены массив байна

  for (const token of tokens) {
    token.text.split('\n').forEach((part, index) => {
      if (index > 0) lines.push([]) // шинэ мөр эхэллээ
      if (part !== '') lines[lines.length - 1].push({ type: token.type, text: part })
    })
  }

  return lines
}

// Эх кодыг "мөр мөрөөр нь" бэлдэнэ.
//   replace(/\r\n?/g, '\n') — Windows-ийн мөр таслалтыг нэг хэлбэрт оруулна.
//   replace(/\n$/, '')      — төгсгөлийн илүү хоосон мөрийг хасна.
// Файл жижиг (хэдхэн KB) тул дүрслэл бүрд дахин бодоход асуудалгүй —
// ингэснээр нэмэлт hook (useMemo) шаардлагагүй.
function prepare(code) {
  return toLines(tokenize(code.replace(/\r\n?/g, '\n').replace(/\n$/, '')))
}

// renderLines — бэлдсэн мөрүүдийг ӨНГӨТЭЙ JSX болгон дүрслэнэ.
// Нэг л функцийг 2 газарт ашиглана:
//   1) унших харагдац (<pre className="code">),
//   2) засварлагчийн доод давхарга (<pre className="code-editor-view">) —
//      ингэснээр засварлаж байх үед ч кодын өнгө хэвээр харагдана.
function renderLines(rows) {
  return rows.map((tokens, lineIndex) => (
    // key — мөрийн дугаар давтагдашгүй тул түүнийг ашиглана.
    <span className="code-line" key={lineIndex}>
      {/* Мөрийн дугаар (хуулах үед орохгүй — CSS-д user-select: none). */}
      <span className="code-num">{lineIndex + 1}</span>

      {/* Мөр доторх токенууд. 'plain' бол өнгөгүй энгийн текст. */}
      <span className="code-text">
        {tokens.map((token, tokenIndex) =>
          token.type === 'plain' ? (
            token.text
          ) : (
            // className нь токены төрлөөс хамаарна: .tok-comment, .tok-string ...
            <span className={`tok-${token.type}`} key={tokenIndex}>
              {token.text}
            </span>
          )
        )}
      </span>
    </span>
  ))
}

// props:
//   fileName   — толгойд харуулах файлын нэр (жишээ нь '01-MountLog.jsx'),
//   code       — ЭХ код (App.jsx-ээс import.meta.glob-оор авсан текст),
//   editedCode — хэрэглэгчийн засварласан хувилбар (байхгүй бол undefined),
//   onRun      — засварласан текстийг ажиллуулахыг хүсэх үед дуудагдах функц,
//   onReset    — «Буцаах» дарахад дуудагдах функц (App засварыг устгана).
export default function CodeBlock({ fileName, code, editedCode, onRun, onReset }) {
  // showCode — код харагдаж байгаа эсэх. Анхны утга true (нээлттэй).
  const [showCode, setShowCode] = useState(true)

  // copied — "Хуулах" дарсны дараа түр "Хуулагдлаа" гэж харуулах төлөв.
  const [copied, setCopied] = useState(false)

  // editing — засварлах горимд байгаа эсэх (true үед <pre>-ийн оронд текст хайрцаг).
  const [editing, setEditing] = useState(false)

  // firstText — эхлэх текст: засвар байвал түүнээс, эс бөгөөс эх кодоос.
  const firstText = editedCode === undefined ? code : editedCode

  // draft — засварлагч дахь ОДООГИЙН текст; lastRun — сүүлд АЖИЛЛУУЛСАН текст.
  // Эхэндээ хоюулаа ижил тул демо хуучин хэвээр үлдэнэ (дэмий ажиллахгүй).
  const [draft, setDraft] = useState(firstText)
  const [lastRun, setLastRun] = useState(firstText)

  // ЗАСВАР → АВТОМАТ АЖИЛЛУУЛАЛТ (debounce):
  // draft өөрчлөгдөөд 0.6 секунд дараа л onRun дуудна. Хэрэглэгч бичиж байх зуур
  // шинэ үсэг бичих бүрд хуучин таймер "цэвэрлэгдэж" (return доорх функц), шинээр
  // тохируулагдана — тиймээс зөвхөн бичиж ЗОГССОНЫ дараа нэг удаа ажиллана.
  useEffect(() => {
    if (draft === lastRun) return undefined // өөрчлөлт байхгүй — ажиллуулахгүй
    const timer = window.setTimeout(() => {
      setLastRun(draft)
      onRun(draft)
    }, 600)
    return () => window.clearTimeout(timer)
  }, [draft, lastRun, onRun])

  // Эх код олдоогүй бол (жишээ нь файлын нэр таарсангүй) оронд нь сануулга.
  if (code === undefined) {
    return (
      <section className="code-block">
        <div className="code-head">
          <span className="code-file">Эх код олдсонгүй — {fileName}</span>
        </div>
      </section>
    )
  }

  // Мөрүүд болгон задлана: [[токен, токен], [токен], ...]
  // Анхаар: ЭХ код (code) биш, ЗАСВАРЛАГЧ дахь текстээс (draft) хийж байна —
  // ингэснээр хайрцагт харагдах код нь дээрх демо-той ЯГ тохирно. Засвар
  // байхгүй үед draft нь эх кодтой тэнцүү тул ялгаа гарахгүй.
  const lines = prepare(draft)

  // Засварлагчийн доод давхаргын мөрүүд: хэрэглэгч төгсгөлд нь шинэ мөр нэмэхэд
  // тэр хоосон мөр нэмэгдэнэ (курсор тэр мөрөнд байрладаг тул).
  const editorRows = draft.endsWith('\n') ? [...lines, []] : lines

  // Толгойн шошго: засварлах горим / засвартай харагдац / эх код.
  const modeLabel = editing ? 'Засварлагч' : draft === code ? 'Эх код' : 'Засвар'

  // Хуулах: clipboard API. http/эрхгүй орчинд боломжгүй тул шалгаж байна.
  // Засвар байвал засварлагч дахь ОДООГИЙН текстийг хуулна.
  async function handleCopy() {
    if (navigator.clipboard === undefined) return
    await navigator.clipboard.writeText(draft)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  // Засварлагчийн гүйлгэлтийг доод (өнгөтэй) давхаргад дамжуулна — текст
  // хайрцгийг гүйлгэхэд доорх өнгөтэй код зэрэг хөдөлнө.
  // (event.currentTarget.previousElementSibling нь <pre> элемент.)
  function handleEditorScroll(event) {
    const view = event.currentTarget.previousElementSibling
    view.scrollTop = event.currentTarget.scrollTop
    view.scrollLeft = event.currentTarget.scrollLeft
  }

  // Буцаах: засварлагчийн текстийг эх код руу буцааж, App-д засвараа устгуулна
  // (дээрх демо ч эх компонент руугаа буцаж харагдана).
  function handleResetClick() {
    setDraft(code)
    setLastRun(code)
    onReset()
  }

  return (
    <section className="code-block">
      {/* Толгой: файлын нэр + товчнууд. */}
      <div className="code-head">
        <span className="code-file">
          {modeLabel} · {fileName}
        </span>

        <div className="code-actions">
          {/* Нөхцөлт текст: copied-оос хамаарч товчны шошго солигдоно. */}
          <button onClick={handleCopy}>{copied ? 'Хуулагдлаа ✓' : 'Хуулах'}</button>

          {/* Засварлах горим руу орох/гарах — нөхцөлт дүрслэл. */}
          {editing ? (
            <>
              <button onClick={handleResetClick}>Буцаах</button>
              <button onClick={() => setEditing(false)}>Код харах</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}>Засварлах</button>
          )}

          {/* Функциональ шинэчлэл: өмнөх утгаас хамаарч эсрэг утга өгнө. */}
          <button onClick={() => setShowCode((prev) => !prev)}>
            {showCode ? 'Код нуух' : 'Код харуулах'}
          </button>
        </div>
      </div>

      {/* && — showCode true үед л дүрслэнэ (нөхцөлт дүрслэлийн нэг арга).
          Дотор нь мөн нөхцөлт дүрслэл: editing true үед засварлагч,
          false үед зөвхөн өнгөтэй код. */}
      {showCode &&
        (editing ? (
          <>
            {/* ЗАСВАРЛАХ ХАРАГДАЦ — 2 давхарга:
                  доод .code-editor-view — өнгөтэй код (зөвхөн харагдана),
                  дээд .code-editor      — жинхэнэ текст хайрцаг. Дээд давхаргын
                үсэг нь ТУНГАЛАГ (color: transparent) тул доорх өнгө л харагдана,
                харин курсор, сонголт, бичих ажиллагаа хэвийн үлдэнэ. */}
            <div className="code-editor-wrap">
              <pre className="code-editor-view" aria-hidden="true">
                {renderLines(editorRows)}
              </pre>

              {/* Контролтой оролт: value + onChange — төлөв нь эх сурвалж. */}
              <textarea
                className="code-editor"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                // Гүйлгэхэд доорх өнгөтэй давхарга зэрэг хөдөлнө.
                onScroll={handleEditorScroll}
                spellCheck={false} // монгол үгэн дээр улаан зураас гарахгүй
                wrap="off" // мөрийг доош шилжүүлэхгүй — кодын хэлбэр хэвээр
                aria-label={`${fileName} файлын эх код — засварлах`}
              />
            </div>

            <p className="code-hint">
              Засвар хийгээд <strong>0.6 секунд</strong> хүлээгээрэй — дээрх жишээ
              автоматаар ажиллаж эхэлнэ. Алдаа гарвал тэнд улаан хайрцагт харагдана.
              Ажиллах бүрд жишээ эхнээс эхэлнэ: эффектүүд дахин ажиллана (console-ыг
              ажиглаарай).
            </p>
          </>
        ) : (
          <pre className="code">{renderLines(lines)}</pre>
        ))}
    </section>
  )
}
