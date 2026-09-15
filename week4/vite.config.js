// vite.config.js — Vite-ийн тохиргооны файл.
// Vite нь хөгжүүлэлтийн сервер (npm run dev) болон бүтээлтийн (npm run build)
// үйл явцыг удирддаг хэрэгсэл.

// defineConfig — тохиргоог туслах функцээр ороож бичих нь автомат бөглөлт
// (IntelliSense) болон алдаа шалгалт өгдөг.
import { defineConfig } from 'vite'

// @vitejs/plugin-react — JSX бичлэгийг хөтөч ойлгох энгийн JS болгон хувиргах
// залгуур. Мөн "Fast Refresh" (хадгалахад хуудас бүхэлдээ ачаалахгүй, зөвхөн
// өөрчилсөн хэсэг шинэчлэгдэх) боломжийг өгнө.
import react from '@vitejs/plugin-react'

// export default — энэ файлын үндсэн экспорт: Vite тохиргоог эндээс уншина.
export default defineConfig({
  // plugins массивт ашиглах залгууруудаа жагсаана.
  plugins: [react()],
})
