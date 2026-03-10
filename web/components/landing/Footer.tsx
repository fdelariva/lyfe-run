import React from "react";

const productLinks = ["Funcionalidades", "Preços", "Wearables", "Para Treinadores"];
const companyLinks = ["Sobre", "Blog", "Carreiras", "Contato"];
const legalLinks = ["Política de Privacidade", "Termos de Uso", "LGPD"];

export function Footer() {
  return (
    <footer className="bg-[#264653] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-extrabold text-[#e76f51] mb-3">
              Lyfe Run
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              A plataforma de coaching feita para corredores.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            &copy; 2025 Lyfe Run. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            {["Instagram", "LinkedIn", "Strava"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-white/30 text-sm hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
