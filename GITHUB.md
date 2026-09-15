# GitHub-ийг хэрхэн ашиглах вэ — бүрэн гарын авлага (жишээнүүдтэй)

Энэ файл нь **энэ repo** (https://github.com/tamir-ariunsukh/web-programming-2) дээр
ажиллахад хэрэгтэй бүх `git` ба `gh` тушаалыг жишээтэйгээр харуулна.
Бүх жишээ нь Windows PowerShell дээр, локал зам
`c:\Users\atamir\Desktop\web programm` гэж бичигдсэн.

> Дүрэм: блок доторх мөр бүрийг дараалан хуулж ажиллуулах боломжтой.
> `#` -ээс хойшхи хэсэг нь тухайн тушаалын тайлбар (ажиллуулах шаардлагагүй).

---

## 0. Юу хэрэгтэй вэ

| Хэрэгсэл | Зориулалт | Шалгах тушаал |
| --- | --- | --- |
| Git | commit, push, pull | `git --version` |
| GitHub account | код хадгалах газар | — |
| GitHub CLI (`gh`) | repo/issue/PR-ийг терминалд удирдах | `gh --version` |
| Node.js | долоо хоног бүрийн төслийг ажиллуулах | `node -v` |

---

## 1. НЭГ УДААГИЙН ТОХИРГОО

### 1.1. Git суусан эсэхээ шалгах

```powershell
git --version
# Жишээ гаралт: git version 2.51.0.windows.1
```

Суугаагүй бол: https://git-scm.com/download/win — татаж суулгана.

### 1.2. Нэр, и-мэйлээ бүртгэх (commit бүрд харагдана)

```powershell
git config --global user.name "Tamir Ariunsukh"
git config --global user.email "87663656+tamir-ariunsukh@users.noreply.github.com"
git config --global init.defaultBranch main
```

Шалгах:

```powershell
git config --global --list
# Жишээ гаралт:
# user.name=Tamir Ariunsukh
# user.email=87663656+tamir-ariunsukh@users.noreply.github.com
# init.defaultbranch=main
```

### 1.3. GitHub CLI-ээр нэвтрэх

```powershell
gh auth login
# Сонголтууд: GitHub.com → HTTPS → Login with a web browser → кодоо хуулж хөтчид оруулна

gh auth status
# Жишээ гаралт: ✓ Logged in to github.com account tamir-ariunsukh
```

---

## 2. REPO-Г ТАТАХ (clone) — ШИНЭ КОМПЬЮТЕР ДЭЭР

```powershell
cd $HOME\Desktop
git clone https://github.com/tamir-ariunsukh/web-programming-2.git
cd web-programming-2
```

Долоо хоног бүрийн төсөлд шаардлагатай багцуудыг суулгана (аль долоо хоног дээр ажиллахаа сонгоно):

```powershell
cd week3
npm install
npm run dev
# Хөтчөөр: http://localhost:5173
```

Аль repo, аль салаа дээр байгаагаа шалгах:

```powershell
git remote -v          # origin https://github.com/tamir-ariunsukh/web-programming-2.git
git branch             # * main
git status             # Working tree clean
```

---

## 3. ӨДӨР ТУТМЫН УРСГАЛ (хамгийн чухал 4 тушаал)

```powershell
git status                     # 1) Юу өөрчлөгдсөн бэ?
git add .                      # 2) Бүх өөрчлөлтийг "бэлтгэнэ" (stage)
git commit -m "feat(week4): add useEffect lab"   # 3) Түүхэнд бичнэ
git push                       # 4) GitHub руу илгээнэ
```

### Жишээ: week3-ийн нэг файлд тайлбар зассан

```powershell
cd "c:\Users\atamir\Desktop\web programm"

git status
# Жишээ гаралт: modified: week3/src/App.jsx

git diff week3/src/App.jsx
# Яг юу өөрчлөгдсөнийг мөр мөрөөр харуулна (+ нэмэгдсэн, - хасагдсан)

git add week3/src/App.jsx      # зөвхөн энэ файлыг бэлтгэнэ
git commit -m "docs(week3): clarify LABS array comment"
git push
```

### Жишээ: 2 файл зэрэг зассан, 1-ийг нь л оруулах

```powershell
git add week3/src/labs/01-Counter.jsx
git commit -m "fix(week3): disable minus button below zero"
git push

# Нөгөө файлыг дараа нь:
git add week3/src/labs/02-EventList.jsx
git commit -m "style(week3): shorten delete button label"
git push
```

---

## 4. ШИНЭ ДОЛОО ХОНОГ (week4, week5, ...) НЭМЭХ — БҮТЭН ЖИШЭЭ

### 4.1. Шинэ төсөл үүсгэх

```powershell
cd "c:\Users\atamir\Desktop\web programm"
mkdir week4
cd week4
npm create vite@latest . -- --template react    # эсвэл гараар файлуудыг үүсгэнэ
npm install
npm run dev
# Ажиллаж байгааг харсны дараа Ctrl+C дараад зогсооно
cd ..
```

### 4.2. Repo руу нэмэх

```powershell
git status
# Жишээ гаралт: Untracked files: week4/

git status --ignored --short | Select-String node_modules
# node_modules/ ороогүй эсэхийг шалгана (root .gitignore автоматаар хасна)

git add week4
git commit -m "feat(week4): add useEffect lab"
git push
```

### 4.3. Хүснэгтээ шинэчлэх (сайн дадал)

```powershell
# README.md-ийн "Долоо хоногууд" хүснэгтэд week4-ийг нэмнэ
git add README.md
git commit -m "docs: add week4 to README table"
git push
```

### 4.4. Commit мессежийн жишээнүүд (Conventional Commits)

| Төрөл | Хэзээ | Жишээ |
| --- | --- | --- |
| `feat` | шинэ агуулга | `feat(week5): add context lab` |
| `fix` | алдаа зассан | `fix(week3): correct form reset` |
| `docs` | зөвхөн тайлбар/README | `docs: update course list` |
| `refactor` | ажиллагаа ижил, код цэгцэлсэн | `refactor(week6): extract ListItem` |
| `style` | формат, зай, нэр | `style(week3): reorder imports` |
| `chore` | тохиргоо, багц шинэчлэл | `chore: bump vite to 8.4` |

Бичих загвар: `<төрөл>(<долоо хоног>): <юу хийсэн> — тушаалын хэлбэрээр, 50 тэмдэгт орчим>`.

---

## 5. САЛАА (branch) БА PULL REQUEST

### 5.1. Салаа үүсгэж ажиллах (том өөрчлөлт хийхэд зөвлөнө)

```powershell
cd "c:\Users\atamir\Desktop\web programm"
git switch main
git pull                              # хамгийн шинэ хувилбарыг татна
git switch -c week5-lab               # шинэ салаа үүсгэж тэр рүү шилжинэ

# ... ажил хийнэ ...

git add .
git commit -m "feat(week5): add context and useReducer lab"
git push -u origin week5-lab          # шинэ салааг GitHub руу илгээнэ
```

### 5.2. Pull Request (PR) үүсгэж нэгтгэх

```powershell
gh pr create --fill
# Гарчиг/тайлбарыг commit-ээс автоматаар бөглөнө. Эсвэл:
# gh pr create --title "Week 5 lab" --body "Context, useReducer жишээнүүд"

gh pr status                          # өөрийн PR-үүдийн төлөв
gh pr view --web                      # PR-ийг хөтчөөр нээх

gh pr merge --squash --delete-branch  # нэгтгэж, салааг устгана
```

Нэгтгэсний дараа локал дээрээ шинэчилнэ:

```powershell
git switch main
git pull
git branch -d week5-lab               # локал салааг устгах
```

> Жижиг засварт шууд `main` дээр push хийх нь зүгээр — дээрх урсгал нь олон хүн
> хамтран ажиллах, эсвэл том өөрчлөлт хийх үед хэрэгтэй.

---

## 6. ОЮУТНЫ АЖЛЫН УРСГАЛ (fork → PR)

Оюутнууд шууд энэ repo руу бичих эрхгүй бол **fork** хийж, дараа нь PR илгээнэ:

```powershell
# Оюутан дээр:
gh repo fork tamir-ariunsukh/web-programming-2 --clone
cd web-programming-2

git switch -c student-bold-form-fix   # өөрийн нэрээр салаа
# ... файл засна ...
git add .
git commit -m "fix(week3): validate email domain"
git push -u origin student-bold-form-fix
gh pr create --fill                   # багш руу PR илгээнэ
```

Багш дээр хянаад нэгтгэнэ:

```powershell
gh pr list                            # ирсэн PR-үүд
gh pr checkout 7                      # 7 дугаар PR-ийг локал дээр шалгах
npm run dev --prefix week3            # ажиллуулж үзэх
gh pr merge 7 --squash --delete-branch
```

---

## 7. ГИТХҮЙ БАЙГАА АЛДАА БА ШИЙДЭЛ

### 7.1. `push` хийхэд "rejected ... fetch first"

Шалтгаан: GitHub дээр таны локалд байхгүй commit байна (өөр компьютерээс push хийсэн).

```powershell
git pull --rebase     # эхлээд GitHub дахь өөрчлөлтийг аваад, өөрийн commit-оо дээр нь тавина
git push
```

### 7.2. Merge conflict

```powershell
git status
# Жишээ гаралт: both modified: week3/src/App.jsx

# Файлыг нээвэл:
#   <<<<<<< HEAD
#   таны хувилбар
#   =======
#   GitHub-аас ирсэн хувилбар
#   >>>>>>> origin/main
# Зөв хувилбарыг үлдээж, <<<<<<< ======= >>>>>>> мөрүүдийг устгана.

git add week3/src/App.jsx
git rebase --continue          # (rebase хийж байсан бол)
# merge хийж байсан бол: git commit -m "merge: resolve App.jsx conflict"

# Бүхэлдээ болихыг хүсвэл:
git rebase --abort             # эсвэл: git merge --abort
```

### 7.3. Буруу файл staged болсон (commit хийгээгүй)

```powershell
git restore --staged week3/dist/index.html   # зөвхөн staged жагсаалтаас гаргана (файл үлдэнэ)
git restore week3/src/App.jsx                # өөрчлөлтийг бүрмөсөн устгана (АЮУЛТАЙ!)
```

### 7.4. Сүүлийн commit-ийн мессеж буруу

```powershell
git commit --amend -m "fix(week3): correct typo in comment"
git push --force-with-lease        # зөвхөн ӨӨРИЙН салаа дээр! main дээр бүү хий
```

### 7.5. Сүүлийн commit-ийг буцаах (GitHub дээр ч буцаана)

```powershell
git revert HEAD        # шинэ "эсрэг" commit үүсгэж агуулгыг буцаана — аюулгүй арга
git push
```

### 7.6. Нууц утга (token, password) санамсаргүй орсон

```powershell
git rm --cached week3/.env       # git-ээс гаргана (файл диск дээр үлдэнэ)
Add-Content .gitignore ".env"    # дахин орохгүй болгоно
git add .gitignore
git commit -m "chore: stop tracking .env"
git push
```

АНХААР: утга нь түүхэнд үлдсэн тул **тэр token/password-ийг ЗААВАЛ солино**
(GitHub → Settings → Developer settings → Tokens). Public repo-д ил гарсан гэж үзнэ.

### 7.7. Алсын хаяг буруу (remote)

```powershell
git remote -v
git remote set-url origin https://github.com/tamir-ariunsukh/web-programming-2.git
```

### 7.8. Түр зуур хадах (сэлгээ хийхэд)

```powershell
git stash           # commit хийгээгүй өөрчлөлтүүдийг хадаж, цэвэр төлөвт шилжинэ
git switch main     # өөр ажил хийх
git switch week5-lab
git stash pop       # хадаж тавьснаа буцааж авна
```

---

## 8. ХЭРЭГТЭЙ `git` ТУШААЛУУДЫН ХУРААНГУЙ

| Тушаал | Юу хийдэг | Жишээ |
| --- | --- | --- |
| `git status` | Юу өөрчлөгдсөн | `git status -s` (богино) |
| `git add <файл>` | Бэлтгэх | `git add week3/src` |
| `git add -A` | Бүгдийг бэлтгэх | `git add -A` |
| `git commit -m "..."` | Түүхэнд бичих | `git commit -m "feat(week4): ..."` |
| `git log --oneline -10` | Сүүлийн 10 commit | `git log --oneline --graph` |
| `git diff` | Хийгээгүй өөрчлөлт | `git diff week3/src/App.jsx` |
| `git diff --staged` | Staged өөрчлөлт | `git diff --staged` |
| `git push` | GitHub руу илгээх | `git push -u origin week5-lab` |
| `git pull` | GitHub-оос татах | `git pull --rebase` |
| `git switch -c <нэр>` | Шинэ салаа | `git switch -c week6-lab` |
| `git switch main` | main руу буцах | `git switch main` |
| `git branch -a` | Бүх салаа | `git branch -a` |
| `git restore <файл>` | Өөрчлөлтийг устгах | `git restore week3/src/App.jsx` |
| `git rm --cached <файл>` | git-ээс гаргах | `git rm --cached .env` |
| `git remote -v` | Алсын хаяг | `git remote -v` |
| `git fetch --all --prune` | Шинэчлэлт татах (нэгтгэлгүй) | `git fetch --all` |
| `git clone <url>` | Хуулах | `git clone https://github.com/...` |
| `git stash` / `git stash pop` | Түр хадах / буцаах | `git stash` → `git stash pop` |

---

## 9. ХЭРЭГТЭЙ `gh` ТУШААЛУУДЫН ХУРААНГУЙ

| Тушаал | Юу хийдэг | Жишээ |
| --- | --- | --- |
| `gh auth login` / `gh auth status` | Нэвтрэх / шалгах | `gh auth status` |
| `gh repo view --web` | Repo-г хөтчөөр нээх | `gh repo view --web` |
| `gh repo create <нэр> --public --source . --push` | Шинэ repo үүсгэж push | `gh repo create web-programming-3 --public --source . --push` |
| `gh repo clone <owner/repo>` | Repo хуулах | `gh repo clone tamir-ariunsukh/web-programming-2` |
| `gh issue list` | Issue-үүд харах | `gh issue list --state open` |
| `gh issue create --title "..." --body "..."` | Issue үүсгэх | `gh issue create --title "Week6 санаа" --body "..."` |
| `gh pr create --fill` | PR үүсгэх | `gh pr create --fill` |
| `gh pr list` / `gh pr view 5` | PR харах | `gh pr view 5 --web` |
| `gh pr checkout 5` | PR-ийг локалд татах | `gh pr checkout 5` |
| `gh pr merge 5 --squash --delete-branch` | PR нэгтгэх | `gh pr merge 5 --squash` |
| `gh run list` | GitHub Actions (CI) харах | `gh run list --limit 5` |

---

## 10. GITHUB ВЭБ САЙТ ДЭЭР (UI) — ЮУ ХААНА

| Хэсэг | Зориулалт |
| --- | --- |
| **Code** таб | Файлууд, түүх (History), хэн юу зассан (Blame) |
| **Issues** | Санаа, алдаа, даалгавар бүртгэх |
| **Pull requests** | Өөрчлөлт хянаж нэгтгэх |
| **Actions** | CI/CD (автомат тест, бүтээлт) |
| **Settings → Pages** | Статик сайт байршуулах (доор жишээ) |
| **Settings → Collaborators** | Хамтран ажиллагч нэмэх |

### Жишээ: repo-г хөтчөөр нээх

```powershell
cd "c:\Users\atamir\Desktop\web programm"
gh repo view --web
```

### Жишээ: GitHub Pages дээр week3-ийг нийтлэх (нэмэлт)

```powershell
cd week3
npm run build                       # dist/ үүснэ
# dist/ хавтсыг gh-pages салаа руу түлхэх (эсвэл Settings → Pages-ээс сонгох)
# Анхаар: Vite-д vite.config.js дотор base: '/web-programming-2/' гэж тохируулах шаардлагатай
```

---

## 11. PUBLIC REPO — ХАМГААЛАЛТЫН ДҮРЭМ

1. `.env`, token, password, API key — **ХЭЗЭЭ Ч** commit хийхгүй.
2. Commit хийхийн өмнө шалгах:

   ```powershell
   git status --short                                # юу орохыг харна
   git diff --staged                                 # юу нэмэгдсэнийг мөрөөр харна
   git status --ignored --short | Select-String ".env|node_modules|.pdf"
   ```

3. Санамсаргүй орсон бол: `git rm --cached <файл>` → `.gitignore`-д нэмэх →
   **утгыг нь солих** (түүхээс арилгах нь төвөгтэй, солих нь баталгаатай арга).
4. `.gitignore`-д аль хэдийн хасагдсан: `node_modules/`, `dist/`, `.env*`, `*.pdf`,
   `.context-mode/`, `.vscode/*` (зөвхөн `extensions.json` үлдэнэ).

---

## 12. САНУУЛГА — 6 ТУШААЛ ХАНГАЛТТАЙ

```powershell
git status                          # 1. Юу өөрчлөгдсөн?
git add .                           # 2. Бэлтгэх
git commit -m "feat(week4): ..."     # 3. Бичих
git push                            # 4. Илгээх
git pull                            # 5. (өөр газар ажилласан бол) татах
gh pr create --fill                 # 6. (том өөрчлөлт) PR үүсгэх
```
