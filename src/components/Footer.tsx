import { BookOpen, CalendarCheck, CalendarDays, ExternalLink, FileText, Github, Heart, Linkedin, Map, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { webinarContactLinks } from "@/data/webinars";

const FRAMEWORK_REPO_URL = "https://github.com/Loom-AI-Labs/ai-fabric-framework";
const MAINTAINER_GITHUB_URL = "https://github.com/mahmoudashraf";
const MAINTAINER_LINKEDIN_URL = "https://www.linkedin.com/in/engmahmoudalgammal/";
const MAINTAINER_MEDIUM_URL = "https://medium.com/@mahmoudashraf";
const MAINTAINER_WHATSAPP_URL = "https://wa.me/message/O3RF2KNXTHQDF1";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <BrandLogo />
              </Link>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Open-source Java/Spring Boot framework for production-oriented AI workflows.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <BookOpen className="h-4 w-4" />
                    Documentation
                  </Link>
                </li>
                <li>
                  <a href={FRAMEWORK_REPO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Github className="h-4 w-4" />
                    Framework GitHub
                  </a>
                </li>
                <li>
                  <Link to="/docs/roadmap" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Map className="h-4 w-4" />
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link to="/demos" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <FileText className="h-4 w-4" />
                    Live demos
                  </Link>
                </li>
                <li>
                  <Link to="/webinars" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Webinars
                  </Link>
                </li>
                <li>
                  <a href={webinarContactLinks.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <MessageCircle className="h-4 w-4" />
                    Discord community
                  </a>
                </li>
                <li>
                  <Link to="/consultation" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <CalendarCheck className="h-4 w-4" />
                    Book a discussion
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Maintainer</h4>
              <p className="mb-3 text-sm leading-6 text-muted-foreground">
                AI Fabric is created and maintained by Mahmoud Elgammal, with source code published under Loom AI Labs.
              </p>
              <ul className="space-y-2">
                <li>
                  <a href={MAINTAINER_GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Github className="h-4 w-4" />
                    Mahmoud on GitHub
                  </a>
                </li>
                <li>
                  <a href={MAINTAINER_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Linkedin className="h-4 w-4" />
                    Mahmoud on LinkedIn
                  </a>
                </li>
                <li>
                  <a href={MAINTAINER_MEDIUM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <ExternalLink className="h-4 w-4" />
                    Mahmoud on Medium
                  </a>
                </li>
                <li>
                  <a href={MAINTAINER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href={`${FRAMEWORK_REPO_URL}/blob/main/LICENSE`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Apache License 2.0
                  </a>
                </li>
                <li>
                  <a
                    href={`${FRAMEWORK_REPO_URL}/security/policy`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Security policy
                  </a>
                </li>
                <li>
                  <Link to="/docs/contributing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Contributing
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 AI Fabric Framework
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              Built with <Heart className="h-4 w-4 text-destructive" fill="currentColor" /> for Java developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
