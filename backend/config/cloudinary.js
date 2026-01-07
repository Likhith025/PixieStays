const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: 'dckioy7g5',
    api_key: '669695938713842',
    api_secret: 'hXR9owrUbxCnf6nC7Ut87ZoOFhE'
});

module.exports = cloudinary;
