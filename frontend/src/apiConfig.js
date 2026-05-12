const getApiUrl = () => {
  const base = import.meta.env.VITE_API_URL || '';
  return base.startsWith('http') ? base : `https://${base}`;
};

export const API_BASE_URL = getApiUrl();
