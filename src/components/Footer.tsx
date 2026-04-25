import { MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-10" style={{ background: "#09090b" }}>
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #6366f1, #818cf8, transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-semibold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #818cf8)" }}
              >
                Whispr
              </span>
            </div>
            <span className="text-xs" style={{ color: "#52525b" }}>
              Where conversations matter
            </span>
          </div>

          {/* Made with heart + copyright */}
          <p className="text-sm flex items-center gap-1" style={{ color: "#52525b" }}>
            Made with{" "}
            <Heart className="w-3.5 h-3.5 fill-current" style={{ color: "#f43f5e" }} />{" "}
            &copy; {new Date().getFullYear()} Whispr
          </p>

          {/* Links */}
          <div className="flex gap-6 text-sm" style={{ color: "#52525b" }}>
            <a href="#" className="transition-colors duration-200 hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors duration-200 hover:text-white">
              Terms
            </a>
            <a href="#" className="transition-colors duration-200 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
