import React from 'react';

const ARCHITECTURE_LAYERS = [
    {
        id: "edge",
        name: "Global Edge & Presentation",
        description: "High-performance interfaces, global content delivery, and client-side architecture.",
        icon: "🌐",
        techs: ["React 18", "Next.js App Router", "TypeScript", "Tailwind CSS", "WebAssembly", "Framer Motion"],
        accent: "bg-white",
        gradient: "from-white/5 to-transparent",
        border: "group-hover:border-white/20",
    },
    {
        id: "core",
        name: "Distributed Core & Services",
        description: "Scalable microservices, high-throughput APIs, and business logic processing.",
        icon: "⚙️",
        techs: ["Node.js", "Go", "Python", "gRPC", "GraphQL", "Apache Kafka"],
        accent: "bg-white",
        gradient: "from-white/5 to-transparent",
        border: "group-hover:border-white/20",
    },
    {
        id: "data",
        name: "Data & Intelligence",
        description: "Persistent storage, distributed caching, and machine learning pipelines.",
        icon: "🧠",
        techs: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "PyTorch", "TensorFlow"],
        accent: "bg-white",
        gradient: "from-white/5 to-transparent",
        border: "group-hover:border-white/20",
    },
    {
        id: "infra",
        name: "Cloud Infrastructure & DevOps",
        description: "Container orchestration, infrastructure as code, and continuous deployment.",
        icon: "☁️",
        techs: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux"],
        accent: "bg-white",
        gradient: "from-white/5 to-transparent",
        border: "group-hover:border-white/20",
    },
    {
        id: "observe",
        name: "Observability & Security",
        description: "System telemetry, application monitoring, and access control.",
        icon: "🛡️",
        techs: ["Prometheus", "Grafana", "Datadog", "OAuth 2.0", "JWT", "Sentry"],
        accent: "bg-white",
        gradient: "from-white/5 to-transparent",
        border: "group-hover:border-white/20",
    }
];

export const TechArsenalGrid: React.FC = () => {
    return (
        <div className="w-full relative py-12">
            {/* Professional Header */}
            <div className="mb-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] w-12 bg-white/40" />
                    <span className="text-white/50 text-xs font-mono uppercase tracking-[0.3em]">System Architecture</span>
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
                    Engineering<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">Ecosystem</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl font-light leading-relaxed">
                    Designed for scale, resilience, and performance. My technology stack is structured across isolated architectural layers, ensuring modularity and high availability from the edge to the database.
                </p>
            </div>

            {/* Architecture Layers (Vertical Stack like a server rack) */}
            <div className="relative w-full mx-auto flex flex-col gap-6">
                
                {/* Visual connecting line behind the nodes */}
                <div className="absolute left-6 md:left-12 top-10 bottom-10 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/20 hidden md:block" />

                {ARCHITECTURE_LAYERS.map((layer, index) => (
                    <div key={layer.id} className={`group relative w-full bg-[#050505] border border-white/5 rounded-2xl md:rounded-[32px] overflow-hidden transition-all duration-500 ${layer.border} hover:bg-[#080808]`}>
                        
                        {/* Background subtle gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${layer.gradient}`} />
                        
                        <div className="relative p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center z-10">
                            
                            {/* Left Section: Node Indicator & Title */}
                            <div className="flex items-start gap-6 md:w-1/3 shrink-0">
                                {/* Hardware-like Node Indicator */}
                                <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/5 border border-white/10 shrink-0 shadow-inner group-hover:border-white/20 transition-colors">
                                    <span className="text-xl md:text-2xl grayscale group-hover:grayscale-0 transition-all duration-500">{layer.icon}</span>
                                    {/* Status dot */}
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#050505] shadow-[0_0_10px_currentColor] opacity-50 group-hover:opacity-100 transition-opacity ${layer.accent}`} />
                                </div>
                                
                                <div>
                                    <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1.5 opacity-60">Tier 0{index + 1}</div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-white transition-colors">{layer.name}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{layer.description}</p>
                                </div>
                            </div>

                            {/* Right Section: Tech Tags */}
                            <div className="flex-1 flex flex-wrap gap-3">
                                {layer.techs.map(tech => (
                                    <div 
                                        key={tech} 
                                        className="flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors duration-300 backdrop-blur-md cursor-default"
                                    >
                                        {tech}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            
            {/* Decorative bottom element */}
            <div className="mt-16 border-t border-white/10 pt-8 flex items-center justify-between opacity-50">
                <div className="font-mono text-[10px] text-white tracking-[0.2em] uppercase">Status: Operational</div>
                <div className="flex gap-1">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-1.5 h-4 bg-white/20 rounded-sm animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                    ))}
                </div>
            </div>
        </div>
    );
};
