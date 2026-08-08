import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/apiClient';

const ConfigContext = createContext(null);

function hexToHSL(hex) {
  if (!hex || !hex.startsWith('#')) return null;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function applyConfigToDOM(data) {
  if (data?.site_title) {
    document.title = data.site_title;
  }
  if (data?.favicon_url) {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = data.favicon_url;
  }
  if (data?.cor_primaria) {
    const hsl = hexToHSL(data.cor_primaria);
    if (hsl) document.documentElement.style.setProperty('--primary', hsl);
  }
  if (data?.cor_primaria) {
    let themeColor = document.querySelector("meta[name='theme-color']");
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.appendChild(themeColor);
    }
    themeColor.content = data.cor_primaria;
  }
  if (data?.cor_fundo) {
    const hsl = hexToHSL(data.cor_fundo);
    if (hsl) {
      document.documentElement.style.setProperty('--background', hsl);
    }
  }
}

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    nome_clinica: 'Beleza & Bem-Estar',
    telefone: '',
    email_contato: '',
    endereco: '',
    horario_abertura: '08:00',
    horario_fechamento: '20:00',
    slot_duration_min: 60,
    desconto_pix: 5,
    logo_url: '',
    favicon_url: '',
    site_title: 'Beleza & Bem-Estar',
    cor_primaria: '#B67D35',
    cor_secundaria: '#5C4A3A',
    cor_fundo: '#FDFBF7',
    cor_texto: '#2b2622',
    hero_titulo: 'Cuidado que Transforma',
    hero_subtitulo: 'Estética e fisioterapia para realçar sua beleza e bem-estar.',
    hero_cta_texto: 'Agendar Seu Horário',
    hero_imagem_url: '',
    promo_titulo: 'Pacote Bem-Estar Completo',
    promo_preco: 'R$ 150,00',
    promo_preco_original: 'R$ 300,00',
    promo_descricao: 'Um presente de autocuidado, bem-estar e relaxamento.',
    footer_texto: 'Estética e fisioterapia para realçar sua beleza e bem-estar.',
    social_instagram: '',
    social_facebook: '',
    social_whatsapp: '',
  });

  useEffect(() => {
    api.Config.get()
      .then((data) => {
        setConfig((prev) => ({ ...prev, ...data }));
        applyConfigToDOM(data);
      })
      .catch(() => {});
  }, []);

  const refreshConfig = async () => {
    try {
      const data = await api.Config.get();
      setConfig((prev) => ({ ...prev, ...data }));
      applyConfigToDOM(data);
      return data;
    } catch {
      return config;
    }
  };

  return (
    <ConfigContext.Provider value={{ config, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
