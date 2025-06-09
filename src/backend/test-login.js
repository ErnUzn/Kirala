const fetch = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Login başarılı!');
      console.log('Token:', data.token);
    } else {
      console.log('❌ Login başarısız!');
      console.log('Hata:', data.message);
    }
  } catch (error) {
    console.error('Test hatası:', error.message);
  }
}

testLogin(); 