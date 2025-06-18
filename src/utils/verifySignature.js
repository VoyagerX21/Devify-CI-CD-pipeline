const crypto = require('crypto');

const verifySignature = (req, secret) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) return false;
    const hmac = crypto
        .createHmac('sha256', secret)
        .update(req.body)
        .digest('hex');
    const expectedSignature = `sha256=${hmac}`;
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

module.exports = { verifySignature };