# 🚀 Loyihani Railway'ga Deploy Qilish

Bu qo'llanma sizning backend va frontend loyihangizni Railway'ga deploy qilish uchun. Shu tizim orqali do'stlaringiz ham internet orqali ilovangizga kirishlari mumkin.

---

## 📦 1-QADAM: GitHub'ga Yuklash

### GitHub'da repository yaratish:
1. [GitHub.com](https://github.com) saytiga kiring
2. Yangi repository yarating (masalan: `my-product-app`)
3. **"Initialize this repository with:"** qismida **.gitignore** ni `Node` qilib tanlang
4. **"Add a README file"** ni belgilang
5. **"Create repository"** tugmasini bosing

### Loyihani GitHub'ga yuklash:
```bash
# Terminalda (VS Code'da Ctrl+`):
git init
git add .
git commit -m "Initial commit - Product API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

⚠️ **Muhim:** `YOUR_USERNAME` va `YOUR_REPO_NAME` ni o'z GitHub username va repository nomingiz bilan almashtiring!

---

## 🌐 2-QADAM: Backend'ni Railway'ga Deploy Qilish

### Railway'da loyiha yaratish:
1. [Railway.app](https://railway.app) saytiga kiring
2. **"Sign Up"** tugmasini bosing va GitHub orqali ro'yxatdan o'ting
3. GitHub repositoriyangizni ulang

### Backend deploy qilish:
1. Railway dashboard'da **"New Project"** tugmasini bosing
2. **"Deploy from GitHub repo"** ni tanlang
3. O'z repositoryngizni tanlang
4. **"Configure"** tugmasini bosing va **root directory**ni `backend` qilib belgilang
5. **"Deploy"** tugmasini bosing

### Health check sozlash:
1. Deploy bo'lgandan so'ng, loyiha sahifasiga kiring
2. **Settings** → **Health** bo'limiga o'ting
3. **Path**ni `/health` qilib belgilang
4. **Save** tugmasini bosing

### Backend URLni eslab qoling:
Deploy muvaffaqiyatli bo'lgandan so'ng, sizga quyidagi kabi URL beriladi:
```
https://backend-xxxxx.up.railway.app
```

⚠️ **Muhim:** Bu URLni **esa qoling** - keyinroq frontend uchun kerak bo'ladi!

---

## 🎨 3-QADAM: Frontend'ni Netlify'ga Deploy Qilish

Frontend uchun Railway ishlatish ham mumkin, lekin Netlify ancha tez va oson:

### Netlify'da loyiha yaratish:
1. [Netlify.com](https://netlify.com) saytiga kiting
2. **"Sign Up"** tugmasini bosing va GitHub orqali ro'yxatdan o'ting
3. **"Add new site"** tugmasini bosing
4. **"Import an existing project"** ni tanlang
5. GitHub repositoriyangizni tanlang

### Build sozlamalari:
- **Base directory:** `frontend` (yoki bo'sh qoldiring)
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

### Environment variable qo'shish:
1. **"Environment variables"** bo'limida **"Add variable"** tugmasini bosing
2. **Key:** `VITE_API_URL`
3. **Value:** Sizning Railway backend URLingiz (masalan: `https://backend-xxxxx.up.railway.app`)

⚠️ **Muhim:** `https://` bilan boshlanishi kerak va oxirida `/` belgisi **bo'lmasligi** kerak!

### Deploy tugmasini bosing:
1. **"Deploy site"** tugmasini bosing
2. Bir necha daqiqa kutib turing
3. Deploy tugagandan so'ng, sizga URL beriladi:
```
https://xxxxx-xxxxx.netlify.app
```

---

## ✅ 4-QADAM: Tekshirish

Endi ikkala qism ham ishlayotganini tekshiring:

### Backend'ni tekshirish:
```
https://backend-xxxxx.up.railway.app/health
```

Bu yerda quyidagi javobni ko'rishingiz kerak:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

### Frontend'ni tekshirish:
Brauzerda Netlify URLini oching va ilovangiz ishlashini tekshiring.

---

## 🔧 5-QADAM: Telegram yoki WhatsApp orqali do'stlarga yuborish

Deploy muvaffaqiyatli bo'lgandan so'ng:

1. **Netlify URLini** do'stlaringizga yuboring
2. Ular brauzerda shu URLni ochib, ilovadan foydalanishlari mumkin

---

## 🔄 Yangilanishlar (Updates)

Agar kodni o'zgartirsangiz:

### Backend yangilash:
1. Kodni o'zgartiring
2. GitHub'ga push qiling:
```bash
git add .
git commit -m "Update: yangi o'zgarishlar"
git push
```
3. Railway avtomatik yangilanadi

### Frontend yangilash:
1. Kodni o'zgartiring
2. GitHub'ga push qiling:
```bash
git add .
git commit -m "Update: yangi o'zgarishlar"
git push
```
3. Netlify avtomatik yangilanadi

---

## ❗ Muammolar bo'lsa

### Backend ishlamasa:
1. Railway dashboard'da **"Logs"** bo'limini tekshiring
2. Xatolarni ko'ring va to'g'rilang

### Frontend backendga ulana olmasa:
1. Brauzerda **F12** bosing va **Console** bo'limini tekshiring
2. Network so'rovlarini tekshiring
3. `VITE_API_URL` to'g'ri sozlanganganligini tekshiring

### CORS xatoligi:
Frontend 3001-portdagi localhost'ga ulanishga harakat qilayotgan bo'lishi mumkin. `VITE_API_URL` environment variable to'g'ri Railway URL'ga o'rnatilganligini tekshiring.

---

## 📝 Tez-So'raladigan Savollar

**Q: Narxi qancha?**
A: Railway va Netlify'da **bepul** rejalar mavjud, kichik loyihalar uchun yetarli.

**Q: Do'stlarim ilovani ko'ra olmayapti?**
A: `VITE_API_URL` to'g'ri Railway URL'ga o'rnatilganligini tekshiring. Brauzerni yangilang (Ctrl+Shift+R).

**Q: Ma'lumotlar yo'qoladimi?**
A: SQLite fayli Railway'da saqlanadi, lekin restart paytida o'chirilishi mumkin. Doimiy saqlash uchun PostgreSQL qo'shish tavsiya etiladi.

**Q: Telegram bot yaratishim mumkinmi?**
A: Ha, backend API'ni Telegram bot uchun ishlatishingiz mumkin.

---

## 🎯 Natija

Tugallangandan so'ng, sizning ilovangiz:
- ✅ Har qanday qurilmadan (telefon, kompyuter, planshet) ishlaydi
- ✅ Internetga ulangan har qanday joydan kirish mumkin
- ✅ Do'stlaringiz foydalanishi mumkin
