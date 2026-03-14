import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Leaf,
  PlayCircle,
  Recycle,
  RefreshCcw,
  Sparkles,
  Target,
  Waves,
  Trees,
  Bird,
  Sprout,
  Droplets,
  Zap,
  Bus,
  Apple,
  Cpu,
  Globe,
  Users,
} from "lucide-react";

const categoryData: Record<string, any> = {
  "ocean-marine": {
    title: "Ocean & Marine Life",
    description: "Understand the vital importance of our oceans and the diverse life they support.",
    icon: Waves,
    color: "blue",
    points: [
      { title: "Coral Reefs", description: "The rainforests of the sea, supporting 25% of all marine life.", icon: Sparkles },
      { title: "Plastic Pollution", description: "Our oceans face a massive threat from plastic waste and microplastics.", icon: Target },
      { title: "Climate Regulation", description: "Oceans absorb 30% of CO2 and 90% of excess heat.", icon: Leaf },
    ]
  },
  "forests-biodiversity": {
    title: "Forests & Biodiversity",
    description: "Explore the complex networks of life in our woodlands and forests.",
    icon: Trees,
    color: "emerald",
    points: [
      { title: "Carbon Sinks", description: "Forests are essential for capturing and storing atmospheric carbon.", icon: Target },
      { title: "Habitat Loss", description: "Biodiversity is under threat as critical habitats are cleared.", icon: Bird },
      { title: "Ecosystem Services", description: "Forests provide clean water, air, and resources for humans.", icon: RefreshCcw },
    ]
  },
  "wildlife-ecosystems": {
    title: "Wildlife & Ecosystems",
    description: "Keeping the balance of nature through wildlife protection.",
    icon: Bird,
    color: "amber",
    points: [
      { title: "Key Species", description: "Understanding the role of keystone species in their habitats.", icon: Target },
      { title: "Conservation", description: "How we can protect endangered species from extinction.", icon: Leaf },
      { title: "Restoration", description: "Healing damaged ecosystems to bring back native wildlife.", icon: RefreshCcw },
    ]
  },
  "soil-agriculture": {
    title: "Soil & Agriculture",
    description: "Healthy soil is the foundation of a resilient food system.",
    icon: Sprout,
    color: "lime",
    points: [
      { title: "Regenerative Farming", description: "Techniques that restore soil health and sink carbon.", icon: Leaf },
      { title: "Organic Practices", description: "Reducing chemical inputs for cleaner food and ecosystems.", icon: Target },
      { title: "Soil Biology", description: "The microscopic life that makes our world function.", icon: RefreshCcw },
    ]
  },
  "water-resources": {
    title: "Water Resources",
    description: "Managing and protecting our most precious liquid asset.",
    icon: Droplets,
    color: "sky",
    points: [
      { title: "Water Scarcity", description: "Universal access to clean water is a growing global challenge.", icon: Target },
      { title: "Pollution Prevention", description: "Keeping our rivers and groundwater clean for all.", icon: Droplets },
      { title: "Efficient Use", description: "Techniques for reducing water waste in homes and industry.", icon: RefreshCcw },
    ]
  },
  "energy-climate": {
    title: "Energy & Climate",
    description: "Transitioning to clean energy to stable our planet's climate.",
    icon: Zap,
    color: "yellow",
    points: [
      { title: "Renewable Energy", description: "Harnessing wind, solar, and hydro for a fossil-free future.", icon: Leaf },
      { title: "Efficiency", description: "Doing more with less through smart tech and habits.", icon: Target },
      { title: "Emission Reduction", description: "The path to Net Zero through systemic energy changes.", icon: RefreshCcw },
    ]
  },
  "waste-circular": {
    title: "Waste & Circular Economy",
    description: "Learn how materials can stay in use instead of becoming pollution.",
    icon: Recycle,
    color: "emerald",
    points: [
      { title: "Waste Crisis", description: "Global waste is rising fast, overwhelming landfills and waterways.", icon: Target },
      { title: "Environmental Impact", description: "Discarded materials release emissions and harm habitats.", icon: Leaf },
      { title: "Circular Systems", description: "Reuse and redesign keep resources in play, reducing extraction.", icon: RefreshCcw },
    ]
  },
  "sustainable-cities": {
    title: "Sustainable Cities & Transport",
    description: "Creating livable, low-carbon urban environments.",
    icon: Bus,
    color: "blue",
    points: [
      { title: "Urban Planning", description: "Designing cities for people, not just cars.", icon: Target },
      { title: "Public Transit", description: "Efficient and accessible transport as a backbone of green cities.", icon: Bus },
      { title: "Green Buildings", description: "Sustainable architecture for energy-efficient living.", icon: Leaf },
    ]
  },
  "food-consumption": {
    title: "Food & Sustainable Consumption",
    description: "Making choices that support a healthier planet and plate.",
    icon: Apple,
    color: "rose",
    points: [
      { title: "Plant-Based", description: "The benefits of a plant-forward diet for the climate.", icon: Leaf },
      { title: "Local Sourcing", description: "Reducing food miles by supporting local growers.", icon: Target },
      { title: "Ethical Buying", description: "Choosing products that respect people and planet.", icon: RefreshCcw },
    ]
  },
  "green-innovation": {
    title: "Green Innovation & Technology",
    description: "Future-facing solutions for a sustainable world.",
    icon: Cpu,
    color: "violet",
    points: [
      { title: "Clean Tech", description: "Cutting-edge hardware for carbon capture and energy.", icon: Cpu },
      { title: "Nature-Based Solutions", description: "Using biology to solve engineering challenges.", icon: Sprout },
      { title: "Digital Ecology", description: "How software can help monitor and protect nature.", icon: Target },
    ]
  },
  "climate-policy": {
    title: "Climate Action & Policy",
    description: "The rules and systems that drive large-scale change.",
    icon: Globe,
    color: "slate",
    points: [
      { title: "Global Treaties", description: "The role of international agreements like the Paris Accord.", icon: Globe },
      { title: "Local Governance", description: "How cities and towns can drive immediate climate action.", icon: Target },
      { title: "Civic Action", description: "The power of the people to influence policy decisions.", icon: Users },
    ]
  },
  "community-sustainability": {
    title: "Community Sustainability",
    description: "Working together for a resilient and shared future.",
    icon: Users,
    color: "teal",
    points: [
      { title: "Local Resilience", description: "Building systems that support communities through change.", icon: Target },
      { title: "Shared Resources", description: "The power of libraries, tool shares, and co-ops.", icon: RefreshCcw },
      { title: "Education", description: "Sharing knowledge to empower everyone in the community.", icon: Leaf },
    ]
  }
};

const useCountUp = (target: number, duration = 1400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number | null = null;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return value;
};

export const GreenHubCategory = () => {
  const { slug } = useParams();
  const data = categoryData[slug || "waste-circular"] || categoryData["waste-circular"];
  
  const reduced = useCountUp(2400);
  const participants = useCountUp(3200);

  const Icon = data.icon;
  const colorClass = data.color === "emerald" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    data.color === "blue" ? "bg-blue-50 text-blue-600 border-blue-200" :
                    data.color === "amber" ? "bg-amber-50 text-amber-600 border-amber-200" :
                    data.color === "lime" ? "bg-lime-50 text-lime-600 border-lime-200" :
                    data.color === "sky" ? "bg-sky-50 text-sky-600 border-sky-200" :
                    data.color === "yellow" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                    data.color === "rose" ? "bg-rose-50 text-rose-600 border-rose-200" :
                    data.color === "violet" ? "bg-violet-50 text-violet-600 border-violet-200" :
                    data.color === "slate" ? "bg-slate-50 text-slate-600 border-slate-200" :
                    data.color === "teal" ? "bg-teal-50 text-teal-600 border-teal-200" :
                    "bg-primary-light/30 text-primary border-primary-light";

  const bannerColor = data.color === "emerald" ? "bg-emerald-500/10" :
                     data.color === "blue" ? "bg-blue-500/10" :
                     data.color === "amber" ? "bg-amber-500/10" :
                     data.color === "lime" ? "bg-lime-500/10" :
                     data.color === "sky" ? "bg-sky-500/10" :
                     data.color === "yellow" ? "bg-yellow-500/10" :
                     data.color === "rose" ? "bg-rose-500/10" :
                     data.color === "violet" ? "bg-violet-500/10" :
                     data.color === "slate" ? "bg-slate-500/10" :
                     data.color === "teal" ? "bg-teal-500/10" :
                     "bg-primary-light/30";

  return (
    <div className="p-6 space-y-10">
      <section className="card overflow-hidden relative">
        <div className={`absolute inset-0 ${bannerColor}`} />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl lg:text-5xl">{data.title}</h1>
            <p className="text-lg text-slate-600 max-w-xl">
              {data.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary inline-flex items-center gap-2">
                Start Learning
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-white border border-slate-100 shadow-lg p-6 flex items-center justify-center">
              <div className="w-full h-full rounded-3xl bg-slate-50 flex items-center justify-center relative overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${bannerColor.replace('/10', '/30')} rounded-full`} />
                <div className={`absolute -bottom-12 -left-10 w-36 h-36 ${bannerColor.replace('/10', '/20')} rounded-full`} />
                <div className="relative w-36 h-36 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Icon size={64} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-2xl">Why It Matters</h2>
            <p className="text-slate-500">Deep dive into key aspects of {data.title.toLowerCase()}.</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Topic breakdown</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data.points.map((item: any) => {
            const PointIcon = item.icon;
            return (
              <div key={item.title} className="card">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} mb-4`}>
                  <PointIcon size={22} />
                </div>
                <h3 className="text-lg">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
