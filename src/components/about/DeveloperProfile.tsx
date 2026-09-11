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
      className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6">
        {/* Developer Photo Avatar */}
        <div className="relative shrink-0">
          <div className="relative group">
            <img
              src={developerPhoto}
              alt="Developer Profile Photo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-200 shadow-sm ring-4 ring-slate-100 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'block';
              }}
            />
            <div
              className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white shadow-xs"
              title="Project Architect & Lead Developer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 text-center md:text-left space-y-3">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>Project Architect</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-600" />
                <span>Hackathon Submission</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {developerName}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-blue-700 flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Role: AI & Full-Stack Developer</span>
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Designed and built <strong className="text-slate-900 font-semibold">FloodGuard AI</strong> to provide early flood intelligence and actionable evacuation guidance for vulnerable river basins across India. Engineered an explainable 4-pillar MCDA risk model fusing live Open-Meteo weather feeds, CWC river gauge benchmarks, Copernicus/SRTM 30m digital elevation topography, and documented disaster records to bridge the gap between predictive modeling and community safety.
          </p>

          {/* Technologies Used */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center justify-center md:justify-start gap-1.5">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>Core Technologies & Stacks</span>
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              {technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Social Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub Repository"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Github className="w-4 h-4 text-slate-200" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn Profile"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Linkedin className="w-4 h-4 text-white" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
            </a>

            <div className="text-[11px] text-slate-500 hidden sm:inline-flex items-center gap-1 ml-1 font-medium">
              <span>• Engineered for Hydrological Disaster Resilience & Public Safety</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
