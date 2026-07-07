/**
 * Formatea un número como moneda CLF (peso chileno)
 * @param value Valor a formatear
 * @returns Valor formateado con símbolo $ y separadores de miles
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Valida si un email tiene formato válido
 * @param email Email a validar
 * @returns true si es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un teléfono tiene al menos 9 dígitos
 * @param phone Teléfono a validar
 * @returns true si es válido
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{9,}$/;
  const phoneDigits = phone.replace(/\D/g, '');
  return phoneRegex.test(phoneDigits);
};
