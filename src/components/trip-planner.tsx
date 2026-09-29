import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTripPlan } from "@/lib/trip-planner.functions";

export function TripPlanner() {
  const generate = useServerFn(createTripPlan);
  const [destination, setDestination] = useState("Gampeng Hills, Paninggaran");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preferences, setPreferences] = useState("");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPlan("");
    if (endDate < startDate) { setError("Tanggal pulang tidak boleh sebelum tanggal berangkat."); return; }
    if ((Date.parse(endDate) - Date.parse(startDate)) / 86400000 > 13) { setError("Rencanakan maksimal 14 hari dalam satu perjalanan."); return; }
    setLoading(true);
    try {
      setPlan(await generate({ data: { destination, startDate, endDate, preferences } }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Rencana belum berhasil dibuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="rencana" className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-olive"><Sparkles size={15} /> Rencana perjalanan</p>
            <h2 className="editorial-title max-w-lg text-[clamp(2.8rem,4.6vw,4.8rem)]">Perjalananmu, dengan caramu.</h2>
            <p className="mt-7 max-w-md text-base leading-[1.8] text-muted-foreground">Ceritakan tujuan dan hal-hal yang kamu suka. Kami bantu susun ide perjalanan yang terasa lebih personal.</p>
          </div>
          <div className="md:col-start-7 md:col-span-6">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div><label htmlFor="trip-destination" className="mb-3 flex items-center gap-2 text-sm font-semibold"><MapPin size={16} /> Destinasi</label><input id="trip-destination" required maxLength={100} value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Misalnya: Paninggaran, Pekalongan" className="h-12 w-full rounded-none border-0 border-b border-border bg-transparent px-0 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary" /></div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div><label htmlFor="trip-start" className="mb-3 flex items-center gap-2 text-sm font-semibold"><CalendarDays size={16} /> Berangkat</label><input id="trip-start" type="date" required min={today} value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-12 w-full rounded-none border-0 border-b border-border bg-transparent px-0 text-base outline-none focus:border-primary" /></div>
                <div><label htmlFor="trip-end" className="mb-3 flex items-center gap-2 text-sm font-semibold"><CalendarDays size={16} /> Pulang</label><input id="trip-end" type="date" required min={startDate || today} value={endDate} onChange={(event) => setEndDate(event.target.value)} className="h-12 w-full rounded-none border-0 border-b border-border bg-transparent px-0 text-base outline-none focus:border-primary" /></div>
              </div>
              <div><label htmlFor="trip-preferences" className="mb-3 block text-sm font-semibold">Apa yang ingin kamu nikmati?</label><textarea id="trip-preferences" required minLength={3} maxLength={500} rows={3} value={preferences} onChange={(event) => setPreferences(event.target.value)} placeholder="Misalnya: camping santai, fotografi pagi, cocok untuk keluarga, tidak terlalu padat" className="w-full resize-y rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary" /></div>
              <Button type="submit" disabled={loading} className="h-auto min-h-12 w-full px-6 py-3 font-semibold sm:w-auto">{loading ? "Menyusun rencana..." : "Buat rencana perjalanan"}{!loading && <ArrowRight size={16} />}</Button>
              <p className="text-xs leading-relaxed text-muted-foreground">Rencana ini adalah inspirasi. Pastikan informasi lokasi, akses, dan ketersediaan sebelum berangkat.</p>
            </form>
            {error && <p role="alert" className="mt-6 border-l-2 border-destructive pl-4 text-sm text-destructive">{error}</p>}
          </div>
        </div>
        {plan && <div aria-live="polite" className="mt-16 border-t border-border pt-10 md:mt-20"><div className="grid gap-8 md:grid-cols-12"><div className="md:col-span-4"><p className="text-xs font-bold uppercase tracking-[.22em] text-olive">Disusun untukmu</p><h3 className="editorial-title mt-5 text-3xl md:text-4xl">Rencana perjalanan.</h3></div><div className="whitespace-pre-wrap text-base leading-[1.9] text-foreground md:col-start-6 md:col-span-7">{plan}</div></div></div>}
      </div>
    </section>
  );
}