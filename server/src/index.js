import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { db } from './db.js'

const app = express()
const PORT = process.env.PORT || 4000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: false,
  })
)
app.use(helmet())
app.use(express.json())

// Simple auth placeholder: trust x-user-id header for now.
// In a real deployment, replace with JWT/session-based auth.
app.use((req, res, next) => {
  const userId = req.header('x-user-id')
  if (!userId) return res.status(401).json({ error: 'Missing x-user-id header' })
  req.userId = userId
  next()
})

// Ensure user exists in DB (id from frontend auth)
function ensureUser(userId, role = 'hasta') {
  const row = db.prepare('SELECT id FROM users WHERE id = ?').get(userId)
  if (!row) {
    db.prepare('INSERT INTO users (id, email, role, created_at) VALUES (?, ?, ?, ?)').run(
      userId,
      '', // email not synced yet
      role,
      Date.now()
    )
  }
}

// Goals endpoints
app.get('/api/me/goals', (req, res) => {
  ensureUser(req.userId)
  const row = db.prepare('SELECT * FROM patient_goals WHERE user_id = ?').get(req.userId)
  if (!row) return res.json(null)
  res.json({
    hba1cTarget: row.hba1c_target,
    stepsTarget: row.steps_target,
    carbsLimit: row.carbs_limit,
    waterTargetMl: row.water_target_ml,
    updatedAt: row.updated_at,
  })
})

app.post('/api/me/goals', (req, res) => {
  ensureUser(req.userId)
  const { hba1cTarget, stepsTarget, carbsLimit, waterTargetMl } = req.body || {}
  const now = Date.now()
  db.prepare(
    `INSERT INTO patient_goals (user_id, hba1c_target, steps_target, carbs_limit, water_target_ml, updated_at)
     VALUES (@user_id, @hba1c_target, @steps_target, @carbs_limit, @water_target_ml, @updated_at)
     ON CONFLICT(user_id) DO UPDATE SET
       hba1c_target = excluded.hba1c_target,
       steps_target = excluded.steps_target,
       carbs_limit = excluded.carbs_limit,
       water_target_ml = excluded.water_target_ml,
       updated_at = excluded.updated_at`
  ).run({
    user_id: req.userId,
    hba1c_target: hba1cTarget ?? null,
    steps_target: stepsTarget ?? null,
    carbs_limit: carbsLimit ?? null,
    water_target_ml: waterTargetMl ?? null,
    updated_at: now,
  })
  res.status(204).end()
})

// Measurements endpoints
app.get('/api/me/measurements', (req, res) => {
  ensureUser(req.userId)
  const { from, to } = req.query
  let sql = 'SELECT * FROM measurements WHERE user_id = ?'
  const params = [req.userId]
  if (from) {
    sql += ' AND measured_at >= ?'
    params.push(Number(from))
  }
  if (to) {
    sql += ' AND measured_at <= ?'
    params.push(Number(to))
  }
  sql += ' ORDER BY measured_at DESC LIMIT 500'
  const rows = db.prepare(sql).all(...params)
  res.json(
    rows.map((r) => ({
      id: r.id,
      valueMgDl: r.value_mgdl,
      measuredAt: r.measured_at,
      context: r.context,
      note: r.note,
    }))
  )
})

app.post('/api/me/measurements', (req, res) => {
  ensureUser(req.userId)
  const { valueMgDl, measuredAt, context, note } = req.body || {}
  if (typeof valueMgDl !== 'number' || !isFinite(valueMgDl)) {
    return res.status(400).json({ error: 'valueMgDl must be a number' })
  }
  const ts = measuredAt ? Number(measuredAt) : Date.now()
  db.prepare(
    'INSERT INTO measurements (user_id, value_mgdl, measured_at, context, note) VALUES (?, ?, ?, ?, ?)'
  ).run(req.userId, valueMgDl, ts, context ?? null, note ?? null)
  res.status(201).end()
})

// Moods endpoints
app.get('/api/me/moods', (req, res) => {
  ensureUser(req.userId)
  const rows = db
    .prepare(
      'SELECT * FROM moods WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 90'
    )
    .all(req.userId)
  res.json(
    rows.map((r) => ({
      id: r.id,
      mood: r.mood,
      stress: r.stress,
      sleepQuality: r.sleep_quality,
      note: r.note,
      recordedAt: r.recorded_at,
    }))
  )
})

app.post('/api/me/moods', (req, res) => {
  ensureUser(req.userId)
  const { mood, stress, sleepQuality, note } = req.body || {}
  if (typeof mood !== 'number') {
    return res.status(400).json({ error: 'mood is required (1-5)' })
  }
  const now = Date.now()
  db.prepare(
    'INSERT INTO moods (user_id, mood, stress, sleep_quality, note, recorded_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.userId, mood, stress ?? null, sleepQuality ?? null, note ?? null, now)
  res.status(201).end()
})

// Simple dashboard recommendation based on goals & recent data
app.get('/api/me/dashboard/recommendations', (req, res) => {
  ensureUser(req.userId)
  const goals = db.prepare('SELECT * FROM patient_goals WHERE user_id = ?').get(req.userId)
  const latestMeasurement = db
    .prepare('SELECT * FROM measurements WHERE user_id = ? ORDER BY measured_at DESC LIMIT 1')
    .get(req.userId)
  const todayMoods = db
    .prepare(
      'SELECT * FROM moods WHERE user_id = ? AND recorded_at >= ? ORDER BY recorded_at DESC LIMIT 1'
    )
    .get(req.userId, Date.now() - 24 * 60 * 60 * 1000)

  const cards = []

  if (goals?.steps_target) {
    cards.push({
      id: 'steps',
      title: 'Günlük adım hedefi',
      description: `Bugünkü hedefin yaklaşık ${goals.steps_target.toLocaleString('tr-TR')} adım. Gün içinde kısa yürüyüşler planlayabilirsin.`,
      link: '/meydan-okumalar',
    })
  }

  if (goals?.water_target_ml) {
    cards.push({
      id: 'water',
      title: 'Su tüketimi',
      description: `Günün toplam su hedefi ${Math.round(goals.water_target_ml / 250)} bardak civarında. Şimdi bir bardak su içmek ister misin?`,
      link: '/gunluk-gorevler',
    })
  }

  if (latestMeasurement) {
    cards.push({
      id: 'glucose',
      title: 'Son ölçümün',
      description: `Son ölçümün ${latestMeasurement.value_mgdl.toFixed(0)} mg/dL. Açlık / tokluk durumuna göre doktorunun önerdiği aralığı hatırla.`,
      link: '/olcum-gunlugu',
    })
  }

  if (todayMoods && cards.length < 3) {
    cards.push({
      id: 'mood',
      title: 'Bugünkü ruh halin',
      description:
        todayMoods.mood <= 2
          ? 'Bugün kendini yorgun veya düşük hissediyor olabilirsin. Küçük bir yürüyüş veya sevdiğin bir müzik listesi iyi gelebilir.'
          : 'Bugün kendini nispeten iyi hissediyorsun. Bu enerjiyi kısa bir egzersiz veya sağlıklı bir öğün planlamak için kullanabilirsin.',
      link: '/bilgi',
    })
  }

  res.json(cards.slice(0, 3))
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Diapal API listening on port ${PORT}`)
})

