const { Webhook } = require("svix");
const { User } = require("../models/index");

// API Controller Function to Manage Clerk User with database
const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // We receive a raw Buffer from express.raw()
        const payloadString = req.body.toString();

        // Verifying Headers using the raw string
        await whook.verify(payloadString, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Parse JSON after verification
        const { data, type } = JSON.parse(payloadString);

        // Switch Cases for different Events
        switch (type) {
            case 'user.created': {
                const userData = {
                    id: data.id, // using Clerk's string ID
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    profileImage: data.image_url,
                    role: 'jobseeker' // Default role
                };
                
                // Mongoose used User.create. Sequelize also uses User.create
                const user = await User.create(userData);
                res.json({
                    success: true,
                    user: user
                });
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    profileImage: data.image_url,
                };
                
                // Sequelize equivalent of findByIdAndUpdate
                const [updatedRows] = await User.update(userData, {
                    where: { id: data.id }
                });
                res.json({
                    success: true,
                    updated: updatedRows > 0
                });
                break;
            }

            case 'user.deleted': {
                // Sequelize equivalent of findByIdAndDelete
                await User.destroy({
                    where: { id: data.id }
                });
                res.json({ success: true });
                break;
            }
            default:
                res.json({ success: false, message: 'Event type not handled' });
                break;
        }

    } catch (error) {
        console.error("Webhook Error:", error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { clerkWebhooks };