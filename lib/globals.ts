export const formatMobileNumber = (mobile: string): string => {
  if (!mobile) return '';

  const cleaned = mobile.replace(/[\s\+]/g, '');

  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  if (mobile.startsWith('+') && mobile.length < 12) {
    return `+91${mobile.slice(1)}`;
  }

  return mobile.startsWith('+') ? mobile : `+${mobile}`;
};
