import melipayamak from 'melipayamak';

const username = process.env.MELIPAYAMAK_USERNAME;
const password = process.env.MELIPAYAMAK_PASSWORD;
const from = process.env.MELIPAYAMAK_FROM || '';

let client = null;
if (username && password) {
  try {
    client = melipayamak({ username, password });
  } catch (err) {
    console.warn(
      'Failed to initialize melipayamak client:',
      err.message || err
    );
    client = null;
  }
} else {
  console.warn(
    'Melipayamak credentials not set (MELIPAYAMAK_USERNAME/PASSWORD)'
  );
}

export async function sendSms(to, text) {
  if (!client) {
    throw new Error('Melipayamak client not configured');
  }

  return new Promise((resolve, reject) => {
    try {
      // The melipayamak package exposes a callback-style API; use sms().send
      client.sms().send({ from, to, text }, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    } catch (err) {
      reject(err);
    }
  });
}
