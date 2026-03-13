import { Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-bottom border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
      <Link to="/" className="hover:opacity-70 transition-opacity">
        <h1 className="text-xl font-display font-bold">{title}</h1>
      </Link>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};
