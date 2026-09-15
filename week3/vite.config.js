// vite.config.js — Vite-ийн тохиргооны файл.
// Vite нь хөгжүүлэлтийн сервер болон бүтээлтийн (build) үйл явцыг удирддаг хэрэгсэл.

// defineConfig — тохиргоог туслах функцээр ороож бичих нь автомат бөглөлт (IntelliSense) өгдөг.
import { defineConfig } from 'vite'

// @vitejs/plugin-react — JSX-ийг браузер ойлгох энгийн JS болгон хувиргах залгуур.
// Мөн "Fast Refresh" (хадгалахад хуудас бүхэлдээ ачаалахгүй, төлөвөө хадгалан шинэчлэгдэх) боломж өгнө.
import react from '@vitejs/plugin-react'

// export default — энэ файлын үндсэн экспорт: Vite тохиргоог эндээс уншина.
export default defineConfig({
  // plugins массивт ашиглах залгууруудаа жагсаана.
  plugins: [react()],
})
