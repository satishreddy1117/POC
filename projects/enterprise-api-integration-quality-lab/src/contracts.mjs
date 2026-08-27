const requiredEnvelopeFields = ['eventId', 'idempotencyKey', 'eventType', 'emittedAt', 'payload'];

export function validateEnvelope(message) {
  const errors = [];
  if (!message || typeof message !== 'object') return { valid: false, errors: ['Message must be an object.'] };
  for (const field of requiredEnvelopeFields) {
    if (message[field] === undefined || message[field] === null || message[field] === '') {
      errors.push(`Missing required field: ${field}.`);
    }
  }
  if (message.eventId && typeof message.eventId !== 'string') errors.push('eventId must be a string.');
  if (message.idempotencyKey && typeof message.idempotencyKey !== 'string') errors.push('idempotencyKey must be a string.');
  if (message.emittedAt && Number.isNaN(Date.parse(message.emittedAt))) errors.push('emittedAt must be an ISO date.');
  if (message.payload !== undefined && (!message.payload || typeof message.payload !== 'object' || Array.isArray(message.payload))) {
    errors.push('payload must be an object.');
  }
  return { valid: errors.length === 0, errors };
}

export function validatePayload(message) {
  const errors = [];
  const payload = message?.payload ?? {};
  if (message?.eventType === 'profile.updated') {
    if (typeof payload.entityId !== 'string' || !payload.entityId) errors.push('profile.updated requires payload.entityId.');
    if (typeof payload.email !== 'string' || !payload.email.includes('@')) errors.push('profile.updated requires a valid payload.email.');
  }
  if (message?.eventType === 'order.created') {
    if (typeof payload.orderId !== 'string' || !payload.orderId) errors.push('order.created requires payload.orderId.');
    if (!Number.isFinite(payload.total) || payload.total < 0) errors.push('order.created requires a non-negative payload.total.');
  }
  return { valid: errors.length === 0, errors };
}

export function validateMessage(message) {
  const envelope = validateEnvelope(message);
  const payload = validatePayload(message);
  return { valid: envelope.valid && payload.valid, errors: [...envelope.errors, ...payload.errors] };
}
