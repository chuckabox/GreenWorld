import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-bottom border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
      <Link to="/" className="hover:opacity-70 transition-opacity">
        <h1 className="text-xl font-display font-bold">{title}</h1>
      </Link>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};
