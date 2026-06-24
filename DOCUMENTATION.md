# Ashwood Revival — Документация проекта (v2)

> Это спецификация сайта-портфолио. Сначала согласуем её, потом строим.
> Подход адаптирован с референса **«Stones / Скала Космонавт»** (Matvey Shulga,
> https://i-want-fable.vercel.app) под твою идею про флиппинг домов.

---

## 0. Что это и зачем

Сайт-**портфолио** Антона Павлова. Цель — доказать навык фронтенда и интерактива одним
сильным, запоминающимся приёмом: **spotlight-reveal под курсором**.

Идея: на главном экране — **новый, отремонтированный дом**. Водишь курсором — за курсором
едет круглое «окно», которое сквозь новый дом показывает **старый, разрушенный дом** (тот же
ракурс, дождь, разруха). На доме — мерцающие точки (крыша, окна, дверь и т.д.); наводишь/жмёшь —
spotlight «прилипает» к элементу, справа выезжает карточка: что было, что сделали, сколько стоило.

Компания **Ashwood Revival** — вымышленная. Это явно показано (плашка сверху + блок About +
футер: *Made by Pavlov Anton → pavlov-ai.online*).

---

## 1. Что я изучил в референсе (техника Stones)

Референс — это разбор реального лендинга с готовыми промптами. Архитектура:

- **Стек:** React 18 + TypeScript + Vite + Tailwind CSS + `lucide-react` (иконки) + **Lenis** (инерционный скролл).
- **Шрифты:** `Inter` (body/UI) + `Playfair Display` *italic* (акцент в заголовке).
- **Hero — полноэкранный, «пришпиленный»** (`sticky top-0 z-0 h-screen`, `100dvh`):
  - **BASE-слой** — статичная картинка (голая скала на чёрном фоне), `object-cover`.
  - **REVEAL-слой** — **видео** (та же скала, но покрытая растительностью), лежит поверх base
    и показывается только сквозь **spotlight-маску**.
  - **Spotlight** рисуется на `<canvas>` как `radial-gradient` (центр = курсор, `SPOTLIGHT_R = 260`),
    мягкие стопы прозрачности, затем `canvas.toDataURL()` → `mask-image` на обёртке reveal-слоя.
    Движение сглаживается через `requestAnimationFrame` + lerp (`+= (target-cur)*0.1`).
    На устройстве без мыши spotlight **сам дрейфует** по кругу вокруг объекта.
  - **`mediaTransform`** (один и тот же `translate+scale`) применяется к base И reveal → они
    совпадают пиксель-в-пиксель. Маска живёт на обёртке (в координатах вьюпорта), видео — двигается.
- **Overlay поверх hero:** заголовок по центру сверху (строка `Playfair italic` + строка `Inter`),
  микротекст слева внизу, микротекст + оранжевая кнопка справа внизу, навбар-«пилюля» по центру
  (`bg-white/20 backdrop-blur` со ссылками).
- **Анимации (keyframes):** `heroReveal, heroFadeUp/Down, imgReveal, heroRise, marquee`;
  easing `cubic-bezier(0.16,1,0.3,1)`; всё отключается при `prefers-reduced-motion`.
- **«Тёмная штора»:** все секции после hero лежат в обёртке `relative z-20 bg-black`, которая
  **наезжает поверх** pinned-hero при скролле.
- **Секции по порядку:** Hero → Story (редакторский асимметричный сплит + параллакс) →
  Stats (цифры) → Quote (крупная цитата) → CTA → Footer (**огромный обрезанный вордмарк** + бегущая строка).
- **Генерация медиа — 3 промпта:**
  1. **BASE-картинка:** объект на чистом чёрном (#000000), кинематографичный верхний свет, центр, 8k.
  2. **REVEAL-картинка:** *«Keep the EXACT same rock: same shape, silhouette, camera angle, position,
     lighting, black background. Only add …»* — правка базы, чтобы геометрия совпала.
  3. **VIDEO:** *«Animate this exact image with subtle premium motion only … locked static camera,
     seamless loop, no camera movement, no added/removed elements.»*

---

## 2. Как адаптируем под флиппинг

| Stones | Ashwood Revival |
|--------|-----------------|
| Голая скала (base) | **Новый дом** (base) — солнечно, ухоженно |
| Скала с растительностью (reveal, видео) | **Старый дом** (reveal) — разруха, дождь |
| «Stone remembers / what time forgets» | «We rebuild / what time forgot» |
| Геология: veins, fault lines, fossils | Ремонт: крыша, окна, сантехника, двор |
| Нет точек на объекте | **11 хотспотов** на элементах дома (наша добавка) |
| Скала левитирует на чёрном | см. §3.1 — выбираем подачу |

Берём **технику и премиальную тёмную эстетику** референса, наполняем своим смыслом и добавляем
систему хотспотов.

---

## 3. Hero (главный экран)

### 3.1 Подача героя — ✅ ВЫБРАНО: полноэкранная сцена
**Полноэкранная сцена.** Дом в реальной среде на весь экран (опушка соснового леса у спокойного
озера), без чёрного фона. Кинематографично, тёплый солнечный новый дом → reveal показывает ту же
сцену, но дом разрушен и идёт дождь. Заголовок и угловой текст — поверх, как в Stones.

- Hero: `sticky top-0 h-screen` (`100dvh`), media `object-cover` на весь вьюпорт.
- Лёгкая виньетка/затемнение по краям для читаемости заголовка и углового текста.

### 3.2 Механика reveal — ✅ reveal-слой = ВИДЕО с дождём
- Два слоя: **BASE = новый дом** (статичная картинка, солнце), **REVEAL = старый дом** (видео: дождь,
  качается ставня, мерцает молния).
- Spotlight: `<canvas>` `radial-gradient`, `SPOTLIGHT_R ≈ 260`, мягкие стопы
  (`1 → 1 → 0.75 → 0.4 → 0.12 → 0`), `toDataURL()` → `mask-image` обёртки reveal-слоя.
- Сглаживание `rAF + lerp 0.1`; авто-дрейф по кругу на тач/без-мыши.
- Общий `mediaTransform` для base и reveal → идеальное совпадение.
- `prefers-reduced-motion` → дрейф/анимации off, reveal остаётся рабочим.

### 3.3 Хотспоты (наша добавка к референсу)
- 11 точек поверх дома (абсолютно, в %): крыша, каминная труба, крыльцо, дверь, окна, газон,
  сантехника, забор, калитка, дорожка, гаражная дверь.
- Точка пульсирует (амбер). Наведение/фокус/тап → spotlight «прилипает» к элементу (показывает
  его *старую* версию) + выезжает стеклянная карточка: **Было / Что сделали / Стоимость**.
- Реальные кнопки (`<button aria-label>`), Enter/Esc, тач ≥44px. Данные — §8.

### 3.4 Overlay
- **Навбар-пилюля** по центру с blur: лого *Ashwood Revival* + ссылки (Work / Process / Services /
  About / Contact) + кнопка «Get an Estimate».
- **Заголовок** сверху по центру: `We rebuild` (Playfair italic) / `what time forgot` (Inter).
- **Слева внизу** — микротекст-эпиграф.
- **Справа внизу** — короткий текст + **оранжевая кнопка** (≈ `#e8702a`) «Start your flip».

---

## 4. Структура страницы (single-page, dark-curtain)

Hero (pinned) → **штора** наезжает со следующими секциями:

1. **Story** — редакторский асимметричный сплит: слева крупная мысль, справа 2 абзаца + фото
   (параллакс). Про «почти любой дом стоит спасти».
2. **The Numbers (Stats)** — цифры с анимацией: *вложено $71,350 · 14 недель · 11 элементов · ARV $340K*.
3. **Transformation breakdown** — 11 элементов из хотспотов списком/сеткой (before → after, стоимость).
   Дублирует хотспоты для тех, кто не водил мышкой (и для мобилы/доступности).
4. **Quote** — крупная цитата-обещание бренда.
5. **CTA** — призыв «Tell us about the house» + кнопка.
6. **Footer** — **огромный обрезанный вордмарк `ASHWOOD`** (как в референсе) + бегущая строка +
   ссылки + **Made by Pavlov Anton → pavlov-ai.online** + дисклеймер «fictional company / portfolio demo».

Плюс **плашка-портфолио** сверху и блок **About this site** (раскрытие, что компания вымышлена).

---

## 5. Бренд

- **Название:** Ashwood Revival. **Слоган:** *We rebuild what time forgot.*
- **Шрифты:** Inter (UI/текст) + Playfair Display italic (акцент). *(Если хочешь — заменю на
  Cinzel, но Playfair ближе к референсу.)*
- **Цвета:** фон `#000`/`#0B0C0E`, текст off-white `#F4F1EA`, акцент-CTA оранжевый `#e8702a`,
  «после»/успех зелёный `#3FB68B`, «до»/разруха ржаво-красный `#C2452D`, хотспот — амбер `#F5A623`.
- **Анимации:** keyframes из §1, easing `cubic-bezier(0.16,1,0.3,1)`, reduced-motion off.
- **Иконки:** `lucide-react`, без эмодзи.

---

## 6. Технологии и хостинг — ✅ ВЫБРАНО

**Стек:** **React 18 + TypeScript + Vite + Tailwind + Lenis + lucide-react** (как референс).

**Хостинг:** **GitHub Pages**, репо `RemDee13/AW-House-Flipping` (уже создан). Нюансы Vite на Pages:
- `vite.config.ts` → `base: '/AW-House-Flipping/'` (сайт живёт на подпути).
- Деплой через **GitHub Actions** (`actions/deploy-pages`): на push в `main` — `npm ci && npm run
  build`, паблиш `dist/`. Токен имеет scope `workflow` → настрою воркфлоу сам.
- Все ассеты грузятся относительно `import.meta.env.BASE_URL`.
- Live: **https://remdee13.github.io/AW-House-Flipping/**

> `pavlov-ai.online` — только ссылка в футере, не хостинг.
> ⚠️ Видео в reveal-слое — следить за весом (сжать, ≤ ~8–10 МБ, h264/webm), Pages отдаёт статику.

---

## 7. Генерация медиа (адаптированные промпты) — полноэкранная сцена + видео-reveal

Нужно **3 ассета**, все с **идентичной композицией/ракурсом**:
- **`base.jpg`** — новый дом (статика, BASE-слой).
- *(промежуточно)* `old.jpg` — старый дом картинкой (для выравнивания и как кадр для видео).
- **`reveal.mp4`** — старый дом видео (REVEAL-слой, дождь, луп).

Приём как в Stones: генерируешь **base** → правкой «Keep the EXACT same house» получаешь **old**
(геометрия совпадает) → анимируешь old в **видео** с locked-камерой. Экспорт картинок 16:9
(≥2560×1440), видео — тот же кадр, бесшовный луп, ≤ ~8–10 МБ.

> Порядок: **сначала Промпт 1 (ПОСЛЕ)**, затем **Промпт 2 (ДО) запускать как edit, прицепив фото из
> Промпта 1 референсом** → геометрия совпадёт пиксель-в-пиксель. Оба содержат все 11 чинимых
> элементов (включая видимую сантехнику: вент-труба на крыше + кран на стене) — под хотспоты.

### 7.1 ПРОМПТ 1 — ПОСЛЕ (новый дом, `base`, генерить первым)
```
Photorealistic full-frame real-estate photograph of a freshly renovated two-story American Craftsman suburban house, three-quarter front view, 35mm lens, eye-level, the whole house and front yard in frame with headroom above the roof.

HOUSE (pristine, just renovated):
- Roof: brand-new charcoal-grey architectural asphalt shingles, straight clean ridge line, new ridge vent, new white aluminium gutters and downspouts.
- Chimney: red-brick chimney on the left roof slope, fresh clean mortar, shiny stainless-steel chimney cap.
- Front porch: covered porch with white turned columns, freshly built wooden steps, painted white railings, a warm glowing porch light.
- Front door: freshly painted deep forest-green insulated fiberglass entry door, polished brass handle, glass sidelight.
- Windows: twelve new white double-hung windows with clean glass and black shutters.
- Siding: warm white and sage-green fiber-cement lap siding, crisp white trim, spotless.
- Garage: attached two-car garage on the right with a new beige carriage-style insulated door with small windows.
- Driveway: freshly poured light-grey concrete driveway to the garage, clean concrete walkway to the porch.
- Fence: new white cedar picket fence along the front yard.
- Gate: matching white picket gate centered on the walkway, on tidy hinges.
- Lawn & landscaping: lush manicured bright-green lawn, young maple trees, neat flower beds with fresh mulch.
- Plumbing (visible): a clean white PVC plumbing vent pipe sticking up through the roof, and a new copper hose bib on the side wall.

SETTING: a clearing at the edge of a pine forest beside a calm mirror-like lake.
LIGHT: golden-hour sunlight, clear blue sky with soft clouds, warm and inviting.
QUALITY: photorealistic, ultra-detailed, sharp, high dynamic range, 8k. No people, no cars, no text, no watermark. Aspect ratio 16:9.
```

### 7.2 ПРОМПТ 2 — ДО (старый дом, `old`, генерить вторым; прицепить фото из Промпта 1 референсом)
```
Use the attached image as the exact reference. Keep the EXACT same house and scene: identical camera angle, lens, framing, composition, and the same position and size of EVERY element (roof, chimney, porch, door, each window, garage door, driveway, fence, gate, lawn, the roof vent pipe and the wall hose bib). Change ONLY the condition into a derelict, abandoned, storm-damaged version of the SAME house years before its renovation:

- Roof: sagging and uneven, many missing, curled and cracked shingles, green moss and dark water stains, patches of exposed rotted decking, rusted and broken sagging gutters.
- Chimney: cracked crumbling brick, missing mortar, no cap, leaning slightly.
- Front porch: rotted sagging deck boards, broken collapsing steps, grey peeling paint, one leaning column.
- Front door: warped, faded and scratched door, rusty handle, cracked rotted frame.
- Windows: cracked and shattered glass, several boarded up with plywood, rotted grey frames.
- Siding: faded, water-stained, peeling paint, dark mildew and rot.
- Garage door: dented and rusted, flaking paint, one broken panel.
- Driveway: cracked and broken with potholes, weeds growing through the seams, muddy puddles.
- Fence: weathered grey, leaning, with broken and missing pickets.
- Gate: hanging off one hinge, broken latch.
- Lawn & landscaping: dead and overgrown with tall brown weeds, bare dirt patches, scattered debris and junk.
- Plumbing (visible): the roof vent pipe rusted and crooked, the wall hose bib rusty and dripping with a wet stain running down the siding.

WEATHER: replace the sunny sky with heavy rain, dark grey storm clouds, puddles and wet reflections, gloomy desaturated overcast light, thin mist.

Do NOT move the camera, do NOT change the framing or composition, do NOT move or resize any element. Photorealistic, ultra-detailed, 8k. No people, no text, no watermark. Aspect ratio 16:9.
```

### 7.3 REVEAL — видео старого дома (анимировать old.jpg, камера зафиксирована)
```
Animate this exact image with subtle premium motion only: heavy rain falling, puddles rippling, a
faint distant lightning flicker, grey storm clouds drifting slowly, a loose shutter gently swaying,
tall weeds and overgrown grass trembling in the wind, a thin wisp of mist. Locked frame, locked
static camera, seamless loop. The house and everything structural stays perfectly still. No camera
movement, no zoom, no pan, no rotation, no added or removed elements.
```

> Выравнивание критично: base (картинка) и reveal (видео) должны совпадать кадр-в-кадр, иначе
> spotlight «поедет». Если видео чуть уплывёт — подгоним общим `mediaTransform`, как в референсе.

---

## 8. Хотспоты — данные (11 элементов)

Координаты x/y (% от картинки) подгоняются под финальный рендер. Цены — иллюстративные USD.

| # | Элемент | Было | Что сделали | $ |
|---|---------|------|-------------|---|
| 1 | Roof | Просевшая обрешётка, сорванная черепица, мох | Полная замена, новая обрешётка, GAF-черепица, конёк-вентиляция | 14,800 |
| 2 | Chimney | Треснувшая корона, без колпака | Перекладка короны, расшивка кирпича, нерж. колпак + гильза | 4,200 |
| 3 | Porch | Сгнившие доски/столбы, битые ступени | Новые лаги, композит, колонны, перила по нормам | 6,500 |
| 4 | Door | Поведённая дверь, сломанный замок | Утеплённая дверь, смарт-замок, уплотнение | 2,400 |
| 5 | Windows | Выбитые/заколоченные, гнилые рамы | 12 окон double-hung Low-E argon + наличники, ставни | 11,200 |
| 6 | Lawn | Сорняки, проплешины, мусор | Планировка, газон, полив, клумбы, 2 клёна | 5,300 |
| 7 | Plumbing | Гнилые оцинковка/слив, старый бойлер | PEX-перетрубовка, смесители, тэнклес, прочистка | 9,700 |
| 8 | Fence | Кривой, гнилые штакетины | Новый кедровый забор, столбы в бетоне | 4,600 |
| 9 | Gate | Сломанные петли, нет защёлки | Новая калитка, петли, доводчик | 650 |
| 10 | Driveway | Треснувший асфальт, лужи | Демонтаж, новый бетон, дренаж, герметик | 8,900 |
| 11 | Garage door | Вмятины, пружины, мёртвый привод | Утеплённая стальная дверь, смарт-привод, пружины | 3,100 |

**Итого ≈ $71,350.** Нарратив: вложено $71K → ARV $340K → профит ≈ $84K (цифры правим в копирайте).

---

## 9. Портфолио-атрибуция (обязательно)

- **Плашка сверху:** «Portfolio demo · fictional company · built by Anton Pavlov».
- **About this site:** раскрытие, что Ashwood Revival — демо/вымысел, показывает навык.
- **Футер:** **Made by Pavlov Anton → https://pavlov-ai.online** + © + «portfolio demo».

---

## 10. План разработки (фазами, по образцу референса)

1. **Фундамент + Hero:** стек, шрифты, анимации, навбар-пилюля, полноэкранный hero со spotlight-reveal
   (base + reveal), `mediaTransform`, авто-дрейф, заголовок + угловой текст + CTA.
2. **Хотспоты:** 11 точек поверх hero, прилипание spotlight, стеклянная карточка Было/Сделали/Цена,
   клавиатура/тач/доступность.
3. **Lenis + dark-curtain + Story + The Numbers.**
4. **Transformation breakdown + Quote + CTA.**
5. **Footer** (огромный обрезанный вордмарк + marquee) + плашка + About + атрибуция.
6. **Медиа:** вставить реальные рендеры (§7), подогнать координаты хотспотов; адаптив 375/768/1024/1440;
   reduced-motion; Lighthouse.
7. **Деплой** (Vercel или GH Pages) + проверка вживую.

---

## 11. Решения — ✅ зафиксированы

1. **Подача героя:** полноэкранная сцена (дом у леса/озера, без чёрного фона).
2. **Стек:** React 18 + TypeScript + Vite + Tailwind + Lenis + lucide-react.
3. **Хостинг:** GitHub Pages (`base: '/AW-House-Flipping/'` + GitHub Actions деплой).
4. **Reveal-слой:** видео с дождём (`reveal.mp4`), base — статичная картинка нового дома.
5. **Шрифт-акцент:** Playfair Display italic (как референс). *(скажешь — поменяю на Cinzel.)*

**Медиа от тебя (Nano Banana Pro + видео-генератор):** `base.jpg` (новый дом) → `old.jpg`
(старый, правкой §7.2) → `reveal.mp4` (видео §7.3). До их появления строю на временных плейсхолдерах,
сайт сразу рабочий; потом просто подменяем файлы и подгоняем координаты хотспотов.

---

## Следующий шаг
Жду «го» — начинаю **Фазу 1** (фундамент + полноэкранный hero со spotlight-reveal). Строю на
плейсхолдер-медиа, ты параллельно генеришь реальные base/old/reveal по §7.
