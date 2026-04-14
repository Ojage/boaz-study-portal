import { PATHS } from "../../router/paths";
import design404 from "../../assets/images/404_design.png";

export function NotFoundPage() {
  return (
    <main className="min-h-[100svh] bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[900px] bg-[color:var(--card)] rounded-[2.5rem] shadow-sm border border-[color:var(--card-border)] flex flex-col items-center justify-center py-16 px-4 md:py-20 relative overflow-hidden">
        <img 
          src={design404} 
          alt="404" 
          className="w-full max-w-xl object-contain z-10" 
        />

        <div className="flex flex-col items-center mt-2 md:mt-6 z-10 relative">
          <h1 className="text-center text-[#5f6c7b] text-base md:text-lg font-bold tracking-[0.25em] uppercase leading-loose mb-6">
            Oups! Page<br/>Indisponible
          </h1>

          <button 
            type="button"
            onClick={() => location.assign(PATHS.app.root)}
            className="bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold text-xs tracking-widest uppercase py-3 md:py-3.5 px-10 md:px-12 rounded-full shadow-[0_8px_20px_-6px_rgba(255,160,0,0.6)] transition-all hover:shadow-[0_12px_24px_-6px_rgba(255,160,0,0.7)] hover:-translate-y-0.5 cursor-pointer"
          >
            Actualiser
          </button>
        </div>
      </div>
    </main>
  );
}

