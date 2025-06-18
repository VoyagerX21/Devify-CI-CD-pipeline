const { verifySignature } = require('../src/utils/verifySignature');
const crypto = require('crypto');

describe('verifySignature(req, secret)', () => {
  const secret = 'mytestsecret';
  const payloadObj = { name: 'test', value: 123 };
  const payloadBuffer = Buffer.from(JSON.stringify(payloadObj));

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payloadBuffer)
    .digest('hex');

  const correctSignature = `sha256=${hmac}`;

  const mockReq = {
    headers: {
      'x-hub-signature-256': correctSignature
    },
    body: payloadBuffer
  };

  test('returns true for valid signature', () => {
    const result = verifySignature(mockReq, secret);
    expect(result).toBe(true);
  });

  test('returns false for invalid signature', () => {
    const req = {
      ...mockReq,
      headers: {
        'x-hub-signature-256': 'sha256=invalid'
      }
    };
    const result = verifySignature(req, secret);
    expect(result).toBe(false);
  });

  test('returns false when signature header is missing', () => {
    const req = {
      ...mockReq,
      headers: {}
    };
    const result = verifySignature(req, secret);
    expect(result).toBe(false);
  });
});
