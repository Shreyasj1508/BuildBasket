require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('Testing JWT token creation...');
console.log('SECRET available:', !!process.env.SECRET);
console.log('SECRET value:', process.env.SECRET);

try {
    const token = jwt.sign(
        { id: 'test', role: 'admin' },
        process.env.SECRET,
        { expiresIn: '7d' }
    );
    console.log('✅ JWT token created successfully!');
    console.log('Token:', token.substring(0, 50) + '...');
} catch (error) {
    console.log('❌ Error creating JWT token:', error.message);
}
