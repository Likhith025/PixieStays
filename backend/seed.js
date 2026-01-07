const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Content = require('./models/Content');

dotenv.config();

mongoose.connect(process.env.Mongo_URL)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

const seed = async () => {
    try {
        // Seed Admin
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await Admin.create({ username: 'admin', password: hashedPassword });
            console.log('Admin created: admin / admin123');
        } else {
            console.log('Admin already exists');
        }

        // Seed Default Content
        const defaultContent = [
            { key: 'home_hero_title', value: 'Experience Luxury Like Never Before', section: 'home', label: 'Hero Title', type: 'text' },
            { key: 'home_hero_subtitle', value: 'Handpicked villas and apartments for your perfect stay.', section: 'home', label: 'Hero Subtitle', type: 'text' },
            { key: 'contact_email', value: 'hello@pixiestays.com', section: 'contact', label: 'Contact Email', type: 'text' },
            { key: 'contact_phone', value: '+91 98765 43210', section: 'contact', label: 'Contact Phone', type: 'text' },
        ];

        for (const item of defaultContent) {
            await Content.findOneAndUpdate(
                { key: item.key },
                item,
                { upsert: true, new: true }
            );
        }
        console.log('Default content seeded');

        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
