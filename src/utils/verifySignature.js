// Import the Node.js crypto module for cryptographic functions
const crypto = require('crypto');

// Verifies the HMAC SHA-256 signature of an incoming request
// @param {Object} req - The incoming HTTP request object
// @param {string} secret - The secret key used to compute the HMAC
// @returns {boolean} True if the signature is valid, false otherwise
const verifyGitHubSignature = (req, secret) => {
    // Extract the signature from the request headers
    const signature = req.headers['x-hub-signature-256'];
    // Return false if no signature is provided
    if (!signature) return false;

    // Compute the HMAC SHA-256 of the request body using the secret
    const hmac = crypto
        .createHmac('sha256', secret)
        .update(req.body)
        .digest('hex');
    // Format the computed HMAC with the 'sha256=' prefix
    const expectedSignature = `sha256=${hmac}`;
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
        return false;
    }

    // Compare the provided and expected signatures securely
    return crypto.timingSafeEqual(
        sigBuffer,
        expectedBuffer
    );
}

const verifyGitLabSignature = (req, secret) => {
  const token = req.headers['x-gitlab-token'];
  return token && token === secret;
};

// Export the verifySignature function for use in other modules
module.exports = { verifyGitHubSignature, verifyGitLabSignature };