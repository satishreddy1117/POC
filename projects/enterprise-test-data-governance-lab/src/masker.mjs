function maskMiddle(value, visibleStart = 1, visibleEnd = 1, mask = '*') {
  const text = String(value ?? '');
  if (text.length <= visibleStart + visibleEnd) return mask.repeat(Math.max(3, text.length));
  const suffix = visibleEnd ? text.slice(-visibleEnd) : '';
  return `${text.slice(0, visibleStart)}${mask.repeat(text.length - visibleStart - visibleEnd)}${suffix}`;
}

export function maskValue(field, value) {
  if (value === null || value === undefined) return value;
  const normalized = field.toLowerCase();
  if (normalized.includes('email')) {
    const [local, domain] = String(value).split('@');
    return `${maskMiddle(local, 1, 0)}@${domain ?? 'masked.test'}`;
  }
  if (normalized.includes('phone')) return maskMiddle(value, 0, 4);
  if (normalized.includes('name')) return String(value).split(/\s+/).map(part => `${part[0] ?? '*'}***`).join(' ');
  if (normalized.includes('account') || normalized.includes('identifier')) return maskMiddle(value, 2, 2);
  return value;
}

export function maskRecord(record = {}, fields = ['fullName', 'email', 'phone', 'accountNumber']) {
  const output = structuredClone(record);
  for (const field of fields) {
    if (Object.hasOwn(output, field)) output[field] = maskValue(field, output[field]);
  }
  return output;
}
