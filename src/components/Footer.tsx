import { Github, Twitter, MessageCircle, BookOpen, Map, FileText, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <a href="#" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
                  <span className="text-lg font-bold text-primary-foreground">AI</span>
                </div>
                <span className="text-xl font-bold text-foreground">Fabric</span>
              </a>
              <p className="mt-4 text-sm text-muted-foreground">
                Making AI accessible to every developer
              </p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <BookOpen className="h-4 w-4" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Map className="h-4 w-4" />
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <FileText className="h-4 w-4" />
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <MessageCircle className="h-4 w-4" />
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Github className="h-4 w-4" />
                    Discussions
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    MIT License
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 AI Fabric Framework
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              Built with <Heart className="h-4 w-4 text-destructive" fill="currentColor" /> for the developer community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
