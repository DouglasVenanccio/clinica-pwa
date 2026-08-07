import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/apiClient';

const ConfigContext = createContext(null);

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
  });

  useEffect(() => {
    api.Config.get()
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const refreshConfig = async () => {
    try {
      const data = await api.Config.get();
      setConfig((prev) => ({ ...prev, ...data }));
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
