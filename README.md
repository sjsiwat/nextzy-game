# เกมสะสมคะแนน Nextzy

เว็บแอปเกมสะสมคะแนน (รองรับหน้าจอกว้าง 300–500px) ผู้เล่นกดสุ่มคะแนน นำไปสะสม และกดรับรางวัลเมื่อถึง checkpoint ประกอบด้วยสองหน้าหลัก คือ **Home** (คะแนน, progress bar, ประวัติ) และ **Game** (สุ่มคะแนน)

## ลิงก์

| รายการ                   | ที่อยู่                                  |
| ------------------------ | ---------------------------------------- |
| เว็บไซต์                 | https://nextzy-game.vercel.app           |
| เอกสาร API (ยิงทดสอบได้) | https://3e734zs7wj.apidog.io             |
| Backend API              | https://nextzy-game.onrender.com         |
| Github repo              | https://github.com/sjsiwat/nextzy-game   |
| OpenAPI spec             | [`docs/openapi.yaml`](docs/openapi.yaml) |

> **ข้อควรทราบสำหรับผู้ตรวจ**
>
> - Backend รันบน Render แพ็กเกจฟรี ซึ่งหลับเมื่อไม่มีการใช้งานราว 15 นาที คำขอแรกหลังจากนั้นอาจใช้เวลา 30–60 วินาที ถ้าหน้า Home ขึ้นข้อความ "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" ให้รอสักครู่แล้วกด "ลองอีกครั้ง"
> - ผู้เล่นแต่ละคนถูกแยกด้วย UUID ที่สร้างในเบราว์เซอร์และเก็บใน `localStorage` (key `nextzy-player-id`) เปิดเบราว์เซอร์ใหม่หรือหน้าต่างไม่ระบุตัวตน = ผู้เล่นใหม่เริ่มที่ 0
> - ในเอกสาร API ค่า `playerId` ตัวอย่างใช้ร่วมกันทุกคน แนะนำให้แทนด้วย UUID ของตัวเองก่อนกด Try it out (เช่นสร้างจาก `crypto.randomUUID()` ในคอนโซลของเบราว์เซอร์ หรือเอาจาก `localStorage` (key `nextzy-player-id`) มาทดสอบยิง)

## ฟีเจอร์

**หน้า Home** (`/`)

- แสดงคะแนนสะสม (เริ่มที่ 0, สูงสุด 10,000) และ progress bar พร้อม checkpoint 3 จุด: 5,000 / 7,500 / 10,000 (รางวัล A / B / C)
- เมื่อคะแนนถึงหรือเกิน checkpoint ปุ่มรับรางวัลของจุดนั้นกดได้ กดแล้วขึ้น modal "ยินดีด้วย" และรับซ้ำไม่ได้
- ปุ่ม RESET ล้างคะแนนและประวัติของผู้เล่น (ไว้ให้ผู้ทดสอบเริ่มใหม่)
- ประวัติสองแท็บ: ประวัติการเล่น (ล่าสุด 100 รายการ) และประวัติรางวัล
- สถานะ loading (skeleton), error (ข้อความภาษาไทยพร้อมปุ่ม "ลองอีกครั้ง") และ empty ("ยังไม่มีประวัติ")

**หน้า Game** (`/game`)

- แสดงคะแนนสะสมด้านบน และคะแนนที่เป็นไปได้ 300 / 500 / 1,000 / 3,000
- กด "สุ่มคะแนน" แล้วตัวเลขที่ไม่ได้จะค่อยๆ หายไปทีละตัว (ห่างกัน 700 ms) จนเหลือคะแนนที่ได้ แล้วขึ้น modal
- คะแนนที่ได้ถูกบวกเข้าคะแนนสะสม เล่นได้ไม่จำกัดครั้ง ปุ่ม "กลับหน้าหลัก" ไปหน้า Home
- ถ้าเรียก API ไม่สำเร็จ แสดงข้อความ error ใต้ปุ่ม และกดสุ่มใหม่ได้

## เทคโนโลยี

| ส่วน       | เครื่องมือ                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Frontend   | Next.js 16.4 (App Router), React 19.3, TypeScript, Tailwind CSS v4 (ผ่าน `@tailwindcss/turbopack`), ฟอนต์ Kanit ผ่าน `next/font` |
| Backend    | NestJS 12, TypeScript, class-validator / class-transformer                                                                       |
| ฐานข้อมูล  | PostgreSQL (Supabase) ผ่าน Prisma 7 + `@prisma/adapter-pg`                                                                       |
| เอกสาร API | OpenAPI 3 ([`docs/openapi.yaml`](docs/openapi.yaml)) → Apidog                                                                    |
| Lint       | oxlint (backend), ESLint (frontend)                                                                                              |
| Deploy     | Vercel (frontend), Render (backend)                                                                                              |

## สถาปัตยกรรม

```
┌──────────────────────┐   HTTPS / JSON    ┌───────────────────────┐   Prisma    ┌──────────────┐
│ Browser              │ ────────────────▶ │ NestJS API            │ ──────────▶ │ PostgreSQL   │
│ Next.js (Vercel)     │ ◀──────────────── │ (Render)              │ ◀────────── │ (Supabase)   │
└──────────────────────┘                   └───────────────────────┘             └──────────────┘
```

**server: เป็นผู้ตัดสินทุกอย่างที่กระทบคะแนนและรางวัล** frontend ไม่มีทางส่งคะแนนมาเอง การสุ่ม การบวกคะแนน การตัดเพดาน 10,000 และการตรวจว่าถึง checkpoint จริงอยู่ที่ backend ทั้งหมด ฝั่ง frontend เล่นแอนิเมชัน "ตัดช่องอื่นทิ้ง" ตามผลที่ server ตอบกลับมาเท่านั้น

### โครงสร้างโปรเจกต์

```
nextzy-game/
├── backend/      NestJS API
├── frontend/     Next.js
└── docs/
    └── openapi.yaml
```

### Backend (`backend/`)

```
prisma/
  schema.prisma                     โมเดลข้อมูล
  migrations/                       ไฟล์ migration (SQL)
prisma7.config.ts                   config ของ Prisma CLI (ที่อยู่ schema, migrations, DATABASE_URL)
src/
  main.ts                           CORS, ValidationPipe, exception filter, พอร์ต
  app.module.ts
  common/
    dto/player-params.dto.ts        ตรวจ playerId ต้องเป็น UUID
    filters/all-exceptions.filter.ts  รูปแบบ error เดียวกันทั้งระบบ
  game/
    game.controller.ts              รับ-ส่ง HTTP (play, summary, claim, reset)
    game.service.ts                 คุยกับฐานข้อมูล (transaction)
    game.logic.ts                   ฟังก์ชันล้วน (สุ่ม, สถานะ checkpoint, เพดานคะแนน)
    game.constants.ts               ค่าคะแนน, เพดาน, checkpoint และชื่อรางวัล
    game.types.ts                   ชนิดข้อมูลที่ตอบกลับ
    dto/claim-params.dto.ts         ตรวจ checkpoint ต้องเป็นค่าที่มีในระบบ
  history/                          ประวัติการเล่นและประวัติรางวัล (อ่านอย่างเดียว)
  health/                           GET /health สำหรับ health check
  prisma/                           PrismaService (global module)
  generated/prisma/                 Prisma Client ที่สร้างจาก `prisma generate` (ไม่เก็บใน Git)
```

ชั้นการเรียก: `Controller → Service → PrismaService` และ `Service → logic`
กติกาเกมทั้งหมดกำหนดที่ `game.constants.ts`

### Frontend (`frontend/src`)

```
app/
  layout.tsx                        ฟอนต์ Kanit, metadata, preconnect ไป backend
  page.tsx                          หน้า Home
  game/page.tsx                     หน้า Game
  globals.css                       ธีม Tailwind v4 (`@theme inline`, `@utility`) สีและ gradient
components/                         ProgressCard, HistoryTabs, HistoryList, ScoreChip, ResultModal (`<dialog>`), BottomBar
hooks/
  useHomeData.ts                    โหลด summary + ประวัติ, claim, reset
  useGame.ts                        สถานะเกมและแอนิเมชันเฉลยคะแนน
lib/
  api.ts                            ที่เดียวที่รู้ URL ของ API และแปลง error เป็นข้อความ
  types.ts                          ชนิดข้อมูลที่ตรงกับ response ของ backend
  player.ts                         สร้าง/อ่าน UUID ผู้เล่นจาก localStorage
  format.ts                         จัดรูปแบบตัวเลขและวันเวลา
  game.ts                           ค่าสำหรับแสดงผล (`GAME_SCORES`, `REVEAL_DELAY_MS`, `DEFAULT_MAX_SCORE`), shuffle, sleep
```

หน้าเป็น Client Component เพราะรหัสผู้เล่นอยู่ใน `localStorage` (ฝั่ง server อ่านไม่ได้) logic การดึงข้อมูลอยู่ใน hooks หน้าจึงมีแต่โครงสร้าง UI

`lib/game.ts` มีรายการคะแนน `300 / 500 / 1,000 / 3,000` ไว้วาดช่องบนหน้า Game เท่านั้น ถ้า backend ตอบคะแนนที่ไม่อยู่ในรายการนี้ หน้าจะแสดง error แทนการเล่นแอนิเมชันผิด

## โมเดลข้อมูล

```
Player        id (uuid) · totalScore · createdAt
PlayHistory   id · playerId → Player · score · createdAt
              INDEX (playerId, createdAt)
RewardClaim   id · playerId → Player · checkpoint · rewardName · createdAt
              UNIQUE (playerId, checkpoint)
```

แถว `Player` ถูกสร้างตอนเล่นครั้งแรก (`upsert`) ผู้เล่นที่ยังไม่เคยเล่นจึงไม่มีแถวในฐานข้อมูล ลบ `Player` แล้วประวัติลบตาม (`onDelete: Cascade`) ใช้กับปุ่ม RESET

## API

อ่านรายละเอียดและยิงทดสอบได้ที่ [เอกสาร API](https://3e734zs7wj.apidog.io) (ที่มาคือ [`docs/openapi.yaml`](docs/openapi.yaml))

| Method | Path                                           | หน้าที่                                                       | สถานะ         |
| ------ | ---------------------------------------------- | ------------------------------------------------------------- | ------------- |
| GET    | `/health`                                      | ตรวจว่าบริการทำงาน                                            | 200           |
| GET    | `/players/:playerId/summary`                   | คะแนนรวม + สถานะ checkpoint (ผู้เล่นใหม่ได้ 0 ไม่เขียนข้อมูล) | 200, 400      |
| POST   | `/players/:playerId/game/play`                 | สุ่มหนึ่งรอบ บวกคะแนน บันทึกประวัติ                           | 201, 400      |
| POST   | `/players/:playerId/rewards/:checkpoint/claim` | รับรางวัลของ checkpoint                                       | 201, 400, 409 |
| POST   | `/players/:playerId/reset`                     | ลบคะแนนและประวัติของผู้เล่น                                   | 204, 400      |
| GET    | `/players/:playerId/history/plays`             | ประวัติการเล่น 100 รายการล่าสุด                               | 200, 400      |
| GET    | `/players/:playerId/history/rewards`           | ประวัติรางวัล                                                 | 200, 400      |

สถานะ checkpoint ใน summary มีสามค่า: `locked` (คะแนนยังไม่ถึง), `claimable` (กดรับได้), `claimed` (รับแล้ว)

รูปแบบ error เป็นแบบเดียวกันทุกกรณี (`message` เป็นอาร์เรย์เสมอ):

```json
{
  "statusCode": 400,
  "message": ["playerId must be a UUID"],
  "path": "/players/abc/summary",
  "timestamp": "2026-10-11T00:00:00.000Z"
}
```

ลองด้วย curl:

```bash
B=https://nextzy-game.onrender.com
P=$(uuidgen)                                  # หรือ UUID ใดๆ ที่ถูกรูปแบบ
curl $B/players/$P/summary
curl -X POST $B/players/$P/game/play
curl $B/players/$P/history/plays
```

## การตัดสินใจเชิงออกแบบ

| เรื่อง           | ที่เลือก                                                                                       | เหตุผล                                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ใครสุ่มคะแนน     | backend                                                                                        | client ปลอมค่าได้ จึงให้ server ตัดสินทุกอย่างที่กระทบคะแนนและรางวัล                                                                           |
| การระบุผู้เล่น   | UUID นิรนามที่ frontend สร้างและเก็บใน localStorage                                            | โจทย์ไม่มีระบบ login ผู้ทดสอบแต่ละคนจึงไม่ชนกัน ส่ง UUID ใน path รับค่าด้วย @Param() และใช้ DTO ร่วมกับ ValidationPipe เพื่อตรวจสอบรูปแบบ UUID |
| เล่นหนึ่งรอบ     | `$transaction` + `increment`                                                                   | สามขั้น (บวกคะแนน, ตัดเพดาน, บันทึกประวัติ) ต้องสำเร็จพร้อมกัน และให้ฐานข้อมูลบวกให้ กันคำขอพร้อมกันบวกซ้อนจนคะแนนหาย                          |
| กันรับรางวัลซ้ำ  | unique constraint `(playerId, checkpoint)` แล้วจับ error `P2002` → **409**                     | ไม่ใช้ "เช็กก่อนเขียน" เพราะสองคำขอที่มาพร้อมกันอาจผ่านการเช็กทั้งคู่                                                                          |
| 400 กับ 409      | 400 = คำขอไม่เข้าเงื่อนไข (checkpoint ไม่มีในระบบ / คะแนนยังไม่ถึง), 409 = ถูกต้องแต่รับไปแล้ว | แยกให้ client แสดงข้อความถูกต้อง                                                                                                               |
| คะแนนเกิน 10,000 | ตัดที่ 10,000                                                                                  | โจทย์กำหนดค่าสูงสุดที่ 10,000 ผู้เล่นที่ถึงเพดานยังกดสุ่มได้ (โจทย์ให้เล่นไม่จำกัดครั้ง) modal จะบอกคะแนนที่สุ่มได้ แต่คะแนนสะสมคงที่ 10,000   |
| โอกาสสุ่ม        | เท่ากันทั้งสี่ค่า                                                                              | โจทย์ไม่ระบุ                                                                                                                                   |
| RESET            | ลบแถวผู้เล่น (cascade)                                                                         | ผู้เล่นที่ไม่มีแถวแสดงเป็น 0 อยู่แล้ว และเรียกซ้ำได้ไม่ error                                                                                  |
| รูปแบบ error     | exception filter กลาง                                                                          | ฝั่ง frontend รับรูปแบบเดียว error ที่ไม่คาดคิดตอบข้อความกลางๆ (ไม่เปิดเผยรายละเอียดภายใน) และบันทึกลง log                                     |
| ประสิทธิภาพ      | skeleton ที่สูงเท่าของจริง, `next/font`, `preconnect` ไป backend                               |

## วิธีติดตั้งและรันในเครื่อง

**สิ่งที่ต้องมี:** Node.js 22 ขึ้นไป, npm, ฐานข้อมูล PostgreSQL (เครื่องตัวเองหรือ Supabase)

```bash
git clone https://github.com/sjsiwat/nextzy-game.git
cd nextzy-game
```

### 1. Backend (พอร์ต 3001)

```bash
cd backend
npm install
cp .env.example .env          # แล้วแก้ DATABASE_URL ให้เป็นของตัวเอง
npx prisma migrate deploy     # สร้างตารางตามไฟล์ใน prisma/migrations
npx prisma generate           # สร้าง Prisma Client ไปที่ src/generated/prisma
npm run start:dev
```

Prisma CLI อ่าน config จาก `prisma7.config.ts` ซึ่งโหลด `DATABASE_URL` จาก `.env` ให้เอง

ตรวจว่าทำงาน: `curl http://localhost:3001/health` ต้องได้ `{"status":"ok"}`

| ตัวแปร (`backend/.env`) | ความหมาย                                                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | connection string ของ PostgreSQL เช่น `postgresql://USER:PASSWORD@HOST:5432/postgres` (Supabase แนะนำแบบ Session pooler; รหัสผ่านที่มีอักขระพิเศษต้อง URL-encode) |
| `CORS_ORIGIN`           | โดเมนที่อนุญาตให้เรียก API คั่นด้วยจุลภาค ค่าเริ่มต้น `http://localhost:3000`                                                                                     |
| `PORT`                  | พอร์ต (ค่าเริ่มต้น 3001)                                                                                                                                          |

### 2. Frontend (พอร์ต 3000)

เปิดเทอร์มินัลใหม่:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

เปิด http://localhost:3000

| ตัวแปร (`frontend/.env.local`) | ความหมาย                                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | ที่อยู่ backend ค่าเริ่มต้น `http://localhost:3001` (ค่านี้ถูกฝังตอน build ถ้าเปลี่ยนต้อง build ใหม่) |

### คำสั่งอื่น

| ที่      | คำสั่ง                                | หน้าที่                                        |
| -------- | ------------------------------------- | ---------------------------------------------- |
| backend  | `npm run build && npm run start:prod` | build แล้วรันแบบ production (`node dist/main`) |
| backend  | `npm run lint`                        | ตรวจโค้ดด้วย oxlint                            |
| backend  | `npm run format`                      | จัดรูปแบบโค้ดด้วย Prettier                     |
| frontend | `npm run build && npm run start`      | build แล้วรันแบบ production                    |
| frontend | `npm run lint`                        | ตรวจโค้ดด้วย ESLint                            |

## Deploy

**Backend (Render, Web Service, Singapore)**

- Root Directory: `backend`
- Build: `npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build`
- Start: `npm run start:prod`
- Environment: `DATABASE_URL`, `CORS_ORIGIN` (โดเมน frontend), `NODE_VERSION=22`
- Health Check Path: `/health`

**Frontend (Vercel)**

- Root Directory: `frontend`
- Environment: `NEXT_PUBLIC_API_URL` = ที่อยู่ backend
