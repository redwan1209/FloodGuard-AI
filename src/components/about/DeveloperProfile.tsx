import React from 'react';
import developerPhoto from '../../assets/developer-photo.png';
import {
  Github,
  Linkedin,
  Code2,
  Sparkles,
  ExternalLink,
  Cpu,
  Layers,
  Award,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface DeveloperProfileProps {
  developerName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export const DeveloperProfile: React.FC<DeveloperProfileProps> = ({
  developerName = 'AI & Full-Stack Developer',
  githubUrl = 'https://github.com/redwan1209/FloodGuard-AI',
  linkedinUrl = 'https://linkedin.com'
}) => {
  const technologies = [
    { name: 'React 18', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Open-Meteo APIs', category: 'Weather' },
    { name: 'Leaflet GIS', category: 'Spatial Maps' },
    { name: 'Recharts', category: 'Telemetry Viz' },
    { name: 'MCDA Engine', category: 'Decision AI' }
  ];

  return (
    <section
      aria-label="Developer Profile and Technical Architecture"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
    >
      {/* Subtle Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-7">
        {/* Developer Photo Avatar with glow frame */}
        <div className="relative shrink-0">
          <div className="relative group">
            <img
              src={developerPhoto}
              alt="Developer Profile Photo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 ring-4 ring-slate-800/90 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'block';
              }}
            />
            <div
              className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-900 shadow-md"
              title="Project Architect & Lead Developer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 text-center md:text-left space-y-3.5">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>Project Architect</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Hackathon Submission</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {developerName}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-cyan-400 flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Role: AI & Full-Stack Developer</span>
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Designed and built <strong className="text-white font-semibold">FloodGuard AI</strong> to provide early flood intelligence and actionable evacuation guidance for vulnerable river basins across India. Engineered an explainable 4-pillar MCDA risk model fusing live Open-Meteo weather feeds, CWC river gauge benchmarks, Copernicus/SRTM 30m digital elevation topography, and documented disaster records to bridge the gap between predictive modeling and community safety.
          </p>

          {/* Technologies Used */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center justify-center md:justify-start gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Core Technologies & Stacks</span>
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 hover:text-white transition-colors"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Social Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub Repository"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 hover:border-slate-600 transition-all shadow-sm group active:scale-95"
            >
              <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn Profile"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 text-xs font-bold border border-blue-500/30 hover:border-blue-500/50 transition-all shadow-sm group active:scale-95"
            >
              <Linkedin className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </a>

            <div className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1 ml-1 font-medium">
              <span>• Built with ❤️ for Disaster Resilience & Public Safety</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
