import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#222] text-white py-4 mt-auto shadow-inner">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 gap-2 text-center">
        {/* Logo e navegação */}
        <div className="flex flex-col items-center gap-1">
          <Link to="/" className="text-white font-bold text-lg hover:underline">
            WBM Technology
          </Link>
          <a
            href="https://www.wbmtechnology.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white text-sm"
          >
            www.wbmtechnology.com.br
          </a>
        </div>
        {/* Contato */}
        <div className="flex flex-col md:flex-row items-center gap-1 text-sm mt-1">
          <span>&copy; 2025</span>
          <span className="hidden md:inline-block mx-2">|</span>
          <span>Tel: (31) 3497 3226 / 99566 0752</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
