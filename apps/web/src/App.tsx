import { useState, useEffect } from "react";
import { Github } from "lucide-react";
import logo from "./assets/restruct.svg";

function App() {
    const [isScrolled, setIsScrolled] = useState(false);

    const sdkComponents = [
        {
            title: "VSCode Extension",
            description:
                "A specialized previewer for Structurizr DSL diagrams written in TypeScript. Visualize your architecture as you code with real-time feedback.",
        },
        {
            title: "re:struct CLI",
            description:
                "A powerful toolchain to create projects from templates, build static standalone documentation, or serve live dev previews while you work.",
        },
        {
            title: "Core Libraries",
            description:
                "The @restruct/structurizr-dsl and @restruct/structurizr-react packages provide primitives for TypeScript diagrams and React components for custom apps.",
        },
        {
            title: "Community Hub",
            description:
                "A GitHub-backed repository for public architectures and a web app for online previews, allowing you to find and test templates without local cloning.",
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        {
            name: "GitHub",
            href: "https://github.com/JustMeGaaRa/restruct",
            icon: <Github className="w-4 h-4" />,
        },
    ];

    return (
        <div className="min-h-screen bg-vibrant-black text-white selection:bg-primary/30 selection:text-primary font-sans overflow-x-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-20 transition-opacity duration-1000">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? "glass-nav py-3" : "py-6"}`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <img
                            src={logo}
                            alt="re:struct logo"
                            className="w-6 h-6"
                        />
                        <span className="text-xl font-display font-bold tracking-tight">
                            re:struct
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-primary transition-colors"
                            >
                                {link.icon}
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative pt-32 pb-40 flex flex-col items-center min-h-screen w-full px-6 overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] opacity-10 blur-[150px] animate-pulse-scale"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, #E3FB51 0%, #00F5FF 30%, #A855F7 60%, transparent 100%)",
                        }}
                    />
                </div>

                <div className="container mx-auto relative z-10 flex flex-col items-center mb-32">
                    <div
                        className="mb-8 animate-fade-in"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary font-bold">
                                Alpha Access — Coming Soon
                            </span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center py-4 animate-blur-in">
                        <h1 className="aurora-text text-[clamp(4.5rem,14vw,18rem)] font-display font-extrabold leading-[0.8] tracking-tighter select-none text-center whitespace-nowrap">
                            re:struct
                        </h1>
                    </div>

                    <p
                        className="mt-12 text-center text-white/50 max-w-2xl text-lg md:text-xl leading-relaxed animate-fade-in-up"
                        style={{ animationDelay: "0.3s" }}
                    >
                        The Architecture-as-Code SDK for modern systems. Define,
                        visualize, and scale your technical design with
                        TypeScript primitives and a developer-first toolchain.
                    </p>
                </div>

                {/* Component Grid Overview */}
                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sdkComponents.map((comp, idx) => (
                            <div
                                key={idx}
                                className="glass-card p-8 flex flex-col items-start gap-4 group animate-fade-in-up"
                                style={{
                                    animationDelay: `${0.4 + idx * 0.1}s`,
                                }}
                            >
                                <div className="text-4xl font-display font-bold text-[#E3FB51]/20 group-hover:text-[#E3FB51] transition-colors duration-700">
                                    0{idx + 1}
                                </div>
                                <h3 className="text-xl font-display font-bold text-white group-hover:text-[#E3FB51] transition-colors duration-500">
                                    {comp.title}
                                </h3>
                                <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                                    {comp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-white/50 hidden md:block animate-float-vertical">
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity duration-1000">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">
                        © {new Date().getFullYear()} re:struct. Built for the
                        future.
                    </p>
                    <p className="text-xs text-white/50">
                        Released under the MIT License. This site does not
                        collect any data or use cookies.
                    </p>
                </div>
                <div className="flex gap-8">
                    <a
                        href="https://github.com/JustMeGaaRa/restruct"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                    >
                        GitHub Project
                    </a>
                    <a
                        href="https://github.com/JustMeGaaRa/restruct/blob/main/LICENSE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                    >
                        MIT License
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;
