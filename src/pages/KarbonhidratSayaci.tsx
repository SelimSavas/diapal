import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type FoodItem = {
  id: string
  name: string
  carbs: number
  calories: number
  portion: string
}

const FOOD_DATABASE: FoodItem[] = [
  { id: '1', name: '1 dilim beyaz ekmek', carbs: 15, calories: 79, portion: '1 dilim (25g)' },
  { id: '2', name: '1 dilim tam buğday ekmeği', carbs: 12, calories: 69, portion: '1 dilim (28g)' },
  { id: '3', name: '1 küçük muz', carbs: 23, calories: 90, portion: '1 adet (~100g)' },
  { id: '4', name: '1 orta elma', carbs: 25, calories: 95, portion: '1 adet (~180g)' },
  { id: '5', name: '1 porsiyon pilav (pişmiş)', carbs: 35, calories: 160, portion: '1 kase (~150g)' },
  { id: '6', name: '1 porsiyon makarna (pişmiş)', carbs: 43, calories: 220, portion: '1 kase (~140g)' },
  { id: '7', name: '1 su bardağı süt (yarım yağlı)', carbs: 12, calories: 122, portion: '200 ml' },
  { id: '8', name: '1 kase yoğurt (az yağlı)', carbs: 17, calories: 154, portion: '200g' },
  { id: '9', name: '1 yumurta', carbs: 0.6, calories: 78, portion: '1 adet (50g)' },
  { id: '10', name: '1 porsiyon patates (haşlanmış)', carbs: 27, calories: 116, portion: '1 orta boy (~150g)' },
  { id: '11', name: '1 porsiyon mercimek çorbası', carbs: 20, calories: 180, portion: '1 kase' },
  { id: '12', name: '1 dilim peynir (beyaz)', carbs: 1, calories: 70, portion: '30g' },
  { id: '13', name: '1 avuç fındık', carbs: 5, calories: 176, portion: '28g' },
  { id: '14', name: '1 bardak portakal suyu', carbs: 26, calories: 112, portion: '248 ml' },
  { id: '15', name: '1 porsiyon kuru fasulye (pişmiş)', carbs: 40, calories: 255, portion: '1 kase (~170g)' },
  { id: '16', name: '1 dilim kek', carbs: 35, calories: 240, portion: '1 dilim (~80g)' },
  { id: '17', name: '1 tatlı kaşığı bal', carbs: 17, calories: 64, portion: '21g' },
  { id: '18', name: '1 orta patates kızartması', carbs: 48, calories: 365, portion: '100g' },
  { id: '19', name: '1 porsiyon yeşil salata (sossuz)', carbs: 4, calories: 20, portion: '1 kase' },
  { id: '20', name: '1 hamburger ekmeği', carbs: 30, calories: 236, portion: '1 adet' },
]

const PORTION_MULTIPLIERS = [0.5, 1, 1.5, 2, 2.5, 3]

type SelectedFood = {
  food: FoodItem
  multiplier: number
}

export default function KarbonhidratSayaci() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedList, setSelectedList] = useState<SelectedFood[]>([])
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false)
  const [photoResult, setPhotoResult] = useState<{ carbs: number; calories: number } | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (!user) navigate('/kayit', { replace: true })
  }, [user, navigate])

  const suggestions = useMemo(() => {
    if (!search.trim()) return FOOD_DATABASE.slice(0, 8)
    const q = search.trim().toLowerCase()
    return FOOD_DATABASE.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.name.toLocaleLowerCase('tr').includes(q)
    ).slice(0, 8)
  }, [search])

  const totalFromList = useMemo(() => {
    let carbs = 0
    let calories = 0
    selectedList.forEach(({ food, multiplier }) => {
      carbs += food.carbs * multiplier
      calories += food.calories * multiplier
    })
    return { carbs: Math.round(carbs * 10) / 10, calories: Math.round(calories) }
  }, [selectedList])

  const addFood = (food: FoodItem, multiplier: number = 1) => {
    setSelectedList((prev) => [...prev, { food, multiplier }])
    setSearch('')
    setShowSuggestions(false)
  }

  const removeFood = (index: number) => {
    setSelectedList((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMultiplier = (index: number, multiplier: number) => {
    setSelectedList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, multiplier } : item))
    )
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setPhotoFile(file)
    setPhotoResult(null)
    setPhotoAnalyzing(true)
    setTimeout(() => {
      setPhotoAnalyzing(false)
      setPhotoResult({
        carbs: Math.round(35 + Math.random() * 25),
        calories: Math.round(200 + Math.random() * 150),
      })
    }, 1500)
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-700 text-slate-900">Üyelere özel</h1>
          <p className="mt-3 text-slate-600">
            Akıllı Karbonhidrat Sayacı'nı kullanmak için kayıt olmanız gerekiyor.
          </p>
          <Link
            to="/kayit"
            className="mt-6 inline-block rounded-xl bg-diapal-600 px-6 py-3 text-white font-600 hover:bg-diapal-700 transition-colors"
          >
            Kayıt ol
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Akıllı Karbonhidrat Sayacı
        </h1>
        <p className="mt-2 text-slate-600">
          Yediğin yemeği yaz veya tabağının fotoğrafını yükle; tahmini karbonhidrat ve kalori değerini gör. Tip 1 diyabette insülin dozunu hekiminle belirlediğin orana göre ayarlamanda yardımcı olur. Bu araç bilgilendirme amaçlıdır; tıbbi karar ve doz hesaplaması için mutlaka doktoruna danış.
        </p>
      </header>

      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-700 text-slate-900 mb-4">
            Yemek adıyla ara
          </h2>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Örn: ekmek, pilav, muz..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                {suggestions.map((food) => (
                  <li key={food.id}>
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-diapal-50 flex justify-between items-center"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        addFood(food)
                      }}
                    >
                      <span>{food.name}</span>
                      <span className="text-xs text-slate-500">
                        ~{food.carbs} g KH · {food.portion}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedList.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-700 text-slate-900 mb-4">
              Eklenen yemekler
            </h2>
            <ul className="space-y-3">
              {selectedList.map((item, index) => (
                <li
                  key={`${item.food.id}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-500 text-slate-900">{item.food.name}</p>
                    <p className="text-xs text-slate-500">{item.food.portion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={item.multiplier}
                      onChange={(e) =>
                        updateMultiplier(index, Number(e.target.value))
                      }
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-diapal-500 outline-none"
                    >
                      {PORTION_MULTIPLIERS.map((m) => (
                        <option key={m} value={m}>
                          {m === 1 ? '1 porsiyon' : `${m} porsiyon`}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-slate-600 w-20 text-right">
                      ~{Math.round(item.food.carbs * item.multiplier * 10) / 10} g KH
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFood(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                      aria-label="Kaldır"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-diapal-50 px-4 py-3">
              <span className="font-600 text-diapal-900">Toplam tahmini</span>
              <div className="text-right">
                <p className="text-xl font-800 text-diapal-700">
                  {totalFromList.carbs} g karbonhidrat
                </p>
                <p className="text-sm text-diapal-700">
                  ~{totalFromList.calories} kcal
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-700 text-slate-900 mb-2">
            Veya tabağının fotoğrafını yükle
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Yemeğin fotoğrafını yükleyerek tahmini karbonhidrat ve kalori alabilirsin. Bu özellik demo amaçlıdır; gerçek uygulamada görsel analiz için bir AI modeli kullanılabilir.
          </p>
          <label className="block rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center cursor-pointer hover:border-diapal-400 hover:bg-diapal-50/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {photoAnalyzing ? (
              <p className="text-diapal-700 font-500">Analiz ediliyor...</p>
            ) : photoFile ? (
              <p className="text-slate-700 font-500">{photoFile.name}</p>
            ) : (
              <p className="text-slate-600">
                Fotoğrafı sürükle-bırak veya tıklayarak seç
              </p>
            )}
          </label>
          {photoResult && !photoAnalyzing && (
            <div className="mt-4 rounded-xl bg-diapal-50 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-500 text-diapal-700">Fotoğraftan tahmin</p>
                <p className="text-lg font-700 text-diapal-900">
                  ~{photoResult.carbs} g karbonhidrat · ~{photoResult.calories} kcal
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-600 mb-1">Önemli uyarı</p>
          <p>
            Karbonhidrat/insülin oranı ve doz kişiye özeldir. Bu araç sadece tahmini bilgi verir; insülin dozunu asla yalnızca bu sonuça göre verme. Her zaman hekiminle belirlediğin kurallara uy.
          </p>
        </div>
      </section>
    </div>
  )
}
