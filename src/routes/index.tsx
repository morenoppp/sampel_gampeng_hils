import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/gampeng-hero.jpg";
import story from "@/assets/gampeng-story.jpg";
import experience from "@/assets/gampeng-experience.jpg";
import evening from "@/assets/gampeng-evening.jpg";

const whatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent("Halo Gampeng Hills, saya ingin bertanya tentang camping dan ketersediaan tempat.")}`;

const navigation = [
  { label: "Experience", href: "#experience" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Paket", href: "#paket" },
  { label: "Galeri", href: "#galeri" },
  { label: "FAQ", href: "#faq" },
];

const questions = [
  { question: "Mobil bisa parkir dekat tenda?", answer: "Untuk informasi area parkir dan akses ke titik camping, tanyakan langsung saat menghubungi kami sebelum berangkat." },
  { question: "Motor bisa masuk sampai lokasi?", answer: "Kondisi akses dapat berubah mengikuti cuaca. Hubungi kami untuk mendapat informasi rute terbaru sebelum berkunjung." },
  { question: "Bawa hewan peliharaan boleh?", answer: "Silakan konfirmasi terlebih dahulu melalui WhatsApp agar kami bisa membantu menyesuaikan rencana kunjunganmu." },
  { question: "Ada sinyal atau WiFi?", answer: "Kualitas sinyal bergantung pada operator dan titik lokasi. Tanyakan kepada kami jika kamu perlu tetap terhubung selama camping." },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Gampeng Hills Campground | Camping di Paninggaran, Pekalongan" },
    { name: "description", content: "Temukan suasana camping di Gampeng Hills, Paninggaran, Pekalongan. Lihat pengalaman, fasilitas, galeri, dan hubungi kami untuk rencana perjalananmu." },
    { property: "og:title", content: "Gampeng Hills Campground | Camping di Paninggaran" },
    { property: "og:description", content: "Datang untuk camping. Pulang membawa cerita. Jelajahi Gampeng Hills di Paninggaran, Pekalongan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[660px] h-[88svh] max-h-[980px] text-on-image" id="top">
        <img src={hero} alt="Pemandangan perbukitan berkabut dengan tenda camping saat matahari terbit" className="absolute inset-0 h-full w-full object-cover" width={1600} height={1104} fetchPriority="high" />
        <div className="image-shade absolute inset-0" />
        <header className="relative z-20 mx-auto flex max-w-[1280px] items-center justify-between px-6 py-7 md:px-12 md:py-9">
          <a href="#top" aria-label="Gampeng Hills, kembali ke atas" className="flex flex-col text-on-image leading-none">
            <span className="text-xl font-extrabold tracking-[.06em] md:text-2xl">GAMPENG<span className="font-normal"> HILLS</span></span>
            <span className="mt-1 text-[9px] font-semibold tracking-[.34em]">CAMPGROUND</span>
          </a>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => <a className="text-[13px] font-medium transition-opacity hover:opacity-65" href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
          <div className="hidden lg:block"><Button variant="light" asChild><a href={whatsapp} target="_blank" rel="noopener noreferrer">Booking sekarang <ArrowUpRight className="arrow-move" /></a></Button></div>
          <Button variant="transparent" size="icon" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
        </header>
        {menuOpen && <nav aria-label="Navigasi mobile" className="absolute inset-x-4 top-22 z-30 rounded-md bg-background p-5 text-foreground shadow-xl lg:hidden">
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block border-b border-border py-3 text-lg font-medium">{item.label}</a>)}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">Booking sekarang <ArrowUpRight size={18} /></a>
        </nav>}
        <div className="absolute inset-x-0 bottom-20 z-10 mx-auto max-w-[1280px] px-6 md:bottom-24 md:px-12">
          <p className="reveal-up mb-5 text-xs font-semibold uppercase tracking-[.26em] md:text-sm">Paninggaran, Pekalongan · Jawa Tengah</p>
          <h1 className="editorial-title reveal-up reveal-delay-1 max-w-[950px] text-[clamp(3.5rem,8vw,8.3rem)] uppercase">Lebih dekat<br />dengan alam.</h1>
          <div className="reveal-up reveal-delay-2 mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-sm text-base leading-relaxed md:text-lg">Lepaskan sejenak rutinitas. Temukan lagi rasa tenang di antara bukit, kabut, dan cerita yang belum selesai.</p>
            <a href="#experience" className="flex items-center gap-3 self-start border-b border-on-image pb-2 text-sm font-semibold uppercase tracking-[.12em] md:self-auto">Jelajahi Gampeng Hills <ArrowDown size={17} /></a>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 z-10 text-[10px] font-medium uppercase tracking-[.18em] opacity-80 md:left-12">01 / A place to pause</div>
      </section>

      <section id="experience" className="mx-auto grid max-w-[1280px] gap-10 px-6 py-24 md:grid-cols-12 md:items-center md:gap-8 md:px-12 md:py-36">
        <div className="md:col-span-5 md:pr-8">
          <p className="mb-7 text-xs font-bold uppercase tracking-[.22em] text-olive">01 / The experience</p>
          <h2 className="editorial-title max-w-lg text-[clamp(2.8rem,4.8vw,5rem)]">Kadang, yang kita butuhkan cuma berhenti sebentar.</h2>
          <p className="mt-8 max-w-md text-base leading-[1.85] text-muted-foreground">Di Gampeng Hills, pagi dimulai dengan udara segar dan pemandangan yang membuatmu ingin tinggal lebih lama. Duduk, tarik napas, dan nikmati waktu tanpa terburu-buru.</p>
          <a href="#galeri" className="mt-9 inline-flex items-center gap-3 border-b border-primary pb-2 text-sm font-semibold text-primary">Lihat suasananya <ArrowUpRight size={17} className="arrow-move" /></a>
        </div>
        <div className="relative md:col-span-7 md:pl-12">
          <div className="aspect-[4/5] max-h-[720px] overflow-hidden md:aspect-[5/6]"><img src={story} alt="Suasana tenda di antara perbukitan hijau pada pagi hari" loading="lazy" width={1104} height={1408} className="story-image h-full w-full object-cover" /></div>
          <span className="absolute -bottom-6 left-0 hidden bg-background px-6 py-5 text-sm font-medium md:block">Pagi yang terasa lebih pelan. ↗</span>
        </div>
      </section>

      <section className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <div className="grid gap-8 md:grid-cols-12 md:items-end"><p className="text-xs font-bold uppercase tracking-[.22em] text-olive md:col-span-3">02 / A different rhythm</p><h2 className="editorial-title max-w-4xl text-[clamp(2.8rem,5vw,5.3rem)] md:col-span-9">Bangun dengan pemandangan. Pulang dengan cerita.</h2></div>
          <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:items-end">
            <div className="aspect-[4/3] overflow-hidden md:col-span-8 md:aspect-[3/2]"><img src={experience} alt="Kursi camping dan secangkir minuman menghadap perbukitan" loading="lazy" width={1360} height={1008} className="story-image h-full w-full object-cover" /></div>
            <div className="md:col-span-4 md:pl-10 md:pb-5"><span className="text-5xl font-light text-olive">↗</span><p className="mt-6 text-lg leading-[1.7]">Ada ruang untuk ngobrol lebih lama, menikmati kopi lebih pelan, atau sekadar diam menatap horizon.</p></div>
          </div>
        </div>
      </section>

      <section id="fasilitas" className="mx-auto max-w-[1280px] px-6 py-24 md:px-12 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8"><div className="md:col-span-4"><p className="mb-6 text-xs font-bold uppercase tracking-[.22em] text-olive">03 / Fasilitas</p><h2 className="editorial-title text-[clamp(2.8rem,4.6vw,4.8rem)]">Yang penting, tetap nyaman.</h2></div><div className="md:col-start-7 md:col-span-6"><p className="mb-9 max-w-lg text-lg leading-[1.75] text-muted-foreground">Rencanakan waktu di alam sesuai caramu. Sebelum datang, cek kebutuhan camping dan detail fasilitas yang tersedia langsung bersama tim kami.</p><div className="border-t border-border"><div className="flex items-center justify-between border-b border-border py-5 text-xl font-medium"><span>Area camping</span><ArrowUpRight size={20} className="text-olive" /></div><div className="flex items-center justify-between border-b border-border py-5 text-xl font-medium"><span>Pemandangan perbukitan</span><ArrowUpRight size={20} className="text-olive" /></div><div className="flex items-center justify-between border-b border-border py-5 text-xl font-medium"><span>Udara pegunungan</span><ArrowUpRight size={20} className="text-olive" /></div></div><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-8">Tanya detail fasilitas <ArrowUpRight size={17} /></a></div></div>
      </section>

      <section id="paket" className="bg-primary py-22 text-primary-foreground md:py-30">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 md:grid-cols-12 md:items-end md:px-12">
          <div className="md:col-span-8"><p className="mb-7 text-xs font-bold uppercase tracking-[.22em] opacity-70">04 / Rencanakan perjalananmu</p><h2 className="editorial-title max-w-3xl text-[clamp(3rem,5.3vw,5.8rem)]">Pilih cara camping yang paling kamu suka.</h2></div>
          <div className="md:col-span-4 md:pb-2"><p className="mb-8 text-base leading-[1.8] opacity-85">Datang sendiri, bersama teman, atau satu keluarga. Hubungi kami untuk pilihan paket, harga, dan ketersediaan terbaru.</p><Button variant="light" asChild><a href={whatsapp} target="_blank" rel="noopener noreferrer">Tanya paket camping <ArrowUpRight className="arrow-move" /></a></Button></div>
        </div>
      </section>

      <section id="galeri" className="mx-auto max-w-[1280px] px-6 py-24 md:px-12 md:py-32">
        <div className="mb-12 flex flex-col justify-between gap-5 md:mb-16 md:flex-row md:items-end"><div><p className="mb-6 text-xs font-bold uppercase tracking-[.22em] text-olive">05 / Galeri</p><h2 className="editorial-title text-[clamp(3rem,5vw,5.3rem)]">Sedikit gambaran.<br />Banyak alasan datang.</h2></div><span className="text-sm text-muted-foreground">Momen-momen di Gampeng Hills ↗</span></div>
        <div className="grid gap-4 md:grid-cols-12 md:gap-6"><div className="aspect-[4/5] overflow-hidden md:col-span-5"><img src={story} alt="Tenda dengan latar lanskap perbukitan" loading="lazy" width={1104} height={1408} className="story-image h-full w-full object-cover" /></div><div className="grid gap-4 md:col-span-7 md:gap-6"><div className="aspect-[4/3] overflow-hidden md:aspect-[16/9]"><img src={hero} alt="Kabut pagi menyelimuti perbukitan dekat area camping" loading="lazy" width={1600} height={1104} className="story-image h-full w-full object-cover" /></div><div className="aspect-[4/3] overflow-hidden md:aspect-[16/9]"><img src={experience} alt="Pemandangan gunung dari tempat duduk camping" loading="lazy" width={1360} height={1008} className="story-image h-full w-full object-cover" /></div></div></div>
      </section>

      <section id="faq" className="border-t border-border py-24 md:py-30"><div className="mx-auto grid max-w-[1280px] gap-10 px-6 md:grid-cols-12 md:gap-8 md:px-12"><div className="md:col-span-4"><p className="mb-6 text-xs font-bold uppercase tracking-[.22em] text-olive">06 / FAQ</p><h2 className="editorial-title text-[clamp(2.8rem,4.5vw,4.8rem)]">Sebelum berangkat.</h2><p className="mt-7 max-w-xs leading-relaxed text-muted-foreground">Ada yang masih ingin ditanyakan? Kami siap membantu rencana camping-mu.</p></div><div className="md:col-start-6 md:col-span-7"><div className="border-t border-border">{questions.map((item, index) => <div className="border-b border-border" key={item.question}><Button variant="faq" className="w-full" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{item.question}</span>{openFaq === index ? <Minus size={20} /> : <Plus size={20} />}</Button><div className={`grid transition-all duration-300 ease-out ${openFaq === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><p className="max-w-xl pb-7 pr-10 text-sm leading-[1.8] text-muted-foreground">{item.answer}</p></div></div></div>)}</div></div></div></section>

      <section className="relative min-h-[550px] text-on-image md:min-h-[650px]"><img src={evening} alt="Suasana camping di perbukitan saat senja dengan tenda yang menyala" loading="lazy" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" /><div className="image-shade-evening absolute inset-0" /><div className="relative mx-auto flex min-h-[550px] max-w-[1280px] flex-col items-start justify-center px-6 py-20 md:min-h-[650px] md:px-12"><p className="mb-6 text-xs font-semibold uppercase tracking-[.22em]">Your next story starts here</p><h2 className="editorial-title max-w-3xl text-[clamp(3.6rem,7vw,7.5rem)] uppercase">Weekend ini,<br />gaskeun?</h2><p className="mt-7 text-lg">Datang untuk camping. Pulang membawa cerita.</p><Button variant="light" asChild className="mt-10"><a href={whatsapp} target="_blank" rel="noopener noreferrer">Booking via WhatsApp <ArrowUpRight className="arrow-move" /></a></Button></div></section>

      <footer className="bg-background"><div className="mx-auto max-w-[1280px] px-6 pb-8 pt-16 md:px-12 md:pt-20"><div className="flex flex-col justify-between gap-12 border-b border-border pb-16 md:flex-row"><div><a href="#top" className="text-3xl font-extrabold tracking-[.04em]">GAMPENG <span className="font-normal">HILLS</span></a><p className="mt-3 text-sm text-muted-foreground">Paninggaran · Pekalongan</p></div><div className="grid grid-cols-2 gap-x-14 gap-y-3 text-sm md:grid-cols-3 md:gap-x-20">{navigation.map((item) => <a href={item.href} key={item.href} className="transition-colors hover:text-olive">{item.label}</a>)}<a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-olive">WhatsApp <ArrowUpRight size={14} /></a></div></div><div className="flex flex-col justify-between gap-3 pt-7 text-xs text-muted-foreground md:flex-row"><span>© 2026 Gampeng Hills Campground</span><a href="#top" className="inline-flex items-center gap-2 hover:text-primary">Kembali ke atas <ArrowRight className="-rotate-45" size={14} /></a></div></div></footer>
    </main>
  );
}