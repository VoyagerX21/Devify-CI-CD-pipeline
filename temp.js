const crypto = require('crypto');

const secret = 'supersecretstring'; // Your WEBHOOK_SECRET
const payload = {
  repository: {
    full_name: "gaurav/devify-test"
  },
  pusher: {
    name: "Gaurav"
  },
  head_commit: {
    message: "Test-secretKey commit from Postman"
  }
};

const hmac = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');

console.log(`sha256=${hmac}`);
