import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Bilgi from './pages/Bilgi'
import Doktorlar from './pages/Doktorlar'
import Forum from './pages/Forum'
import ForumTopic from './pages/ForumTopic'
import ForumNewTopic from './pages/ForumNewTopic'
import Giris from './pages/Giris'
import Kayit from './pages/Kayit'
import Profil from './pages/Profil'
import KarbonhidratSayaci from './pages/KarbonhidratSayaci'
import Hba1cTahminleyici from './pages/Hba1cTahminleyici'
import Iletisim from './pages/Iletisim'
import GunlukGorevler from './pages/GunlukGorevler'
import SikSorulanSorular from './pages/SikSorulanSorular'
import Gizlilik from './pages/Gizlilik'
import KullanimSartlari from './pages/KullanimSartlari'
import OlcumGunlugu from './pages/OlcumGunlugu'
import IlacHatirlatici from './pages/IlacHatirlatici'
import Makaleler from './pages/Makaleler'
import MakaleDetay from './pages/MakaleDetay'
import Hikayeler from './pages/Hikayeler'
import HaberlerDuyurular from './pages/HaberlerDuyurular'
import HaberDetay from './pages/HaberDetay'
import SifremiUnuttum from './pages/SifremiUnuttum'
import GeriBildirim from './pages/GeriBildirim'
import Tarifler from './pages/Tarifler'
import MeydanOkumalar from './pages/MeydanOkumalar'
import DoktorDetay from './pages/DoktorDetay'
import Favorilerim from './pages/Favorilerim'
import Admin from './pages/Admin'
import Mesajlar from './pages/Mesajlar'
import Icerik from './pages/Icerik'
import Araclar from './pages/Araclar'
import Platform from './pages/Platform'
import Kurumsal from './pages/Kurumsal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="icerik" element={<Icerik />} />
          <Route path="araclar" element={<Araclar />} />
          <Route path="platform" element={<Platform />} />
          <Route path="kurumsal" element={<Kurumsal />} />
          <Route path="bilgi" element={<Bilgi />} />
          <Route path="makaleler" element={<Makaleler />} />
          <Route path="makaleler/:slug" element={<MakaleDetay />} />
          <Route path="hikayeler" element={<Hikayeler />} />
          <Route path="haberler-duyurular" element={<HaberlerDuyurular />} />
          <Route path="haberler-duyurular/:slug" element={<HaberDetay />} />
          <Route path="tarifler" element={<Tarifler />} />
          <Route path="meydan-okumalar" element={<MeydanOkumalar />} />
          <Route path="doktorlar" element={<Doktorlar />} />
          <Route path="doktorlar/:id" element={<DoktorDetay />} />
          <Route path="favorilerim" element={<Favorilerim />} />
          <Route path="mesajlar" element={<Mesajlar />} />
          <Route path="admin" element={<Admin />} />
          <Route path="karbonhidrat-sayaci" element={<KarbonhidratSayaci />} />
          <Route path="hba1c-tahminleyici" element={<Hba1cTahminleyici />} />
          <Route path="olcum-gunlugu" element={<OlcumGunlugu />} />
          <Route path="ilac-hatirlatici" element={<IlacHatirlatici />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/yeni" element={<ForumNewTopic />} />
          <Route path="forum/:id" element={<ForumTopic />} />
          <Route path="iletisim" element={<Iletisim />} />
          <Route path="gunluk-gorevler" element={<GunlukGorevler />} />
          <Route path="sss" element={<SikSorulanSorular />} />
          <Route path="gizlilik" element={<Gizlilik />} />
          <Route path="kullanim-sartlari" element={<KullanimSartlari />} />
          <Route path="giris" element={<Giris />} />
          <Route path="kayit" element={<Kayit />} />
          <Route path="sifremi-unuttum" element={<SifremiUnuttum />} />
          <Route path="geri-bildirim" element={<GeriBildirim />} />
          <Route path="profil" element={<Profil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
