const userService = require("../services/userService");
const { emailQueue } = require("../utils/emailService");

/**
 * Controller to handle sending emails to users.
 * Supports both `userIds` (fetching emails) and direct `emails` list.
 */
const sendEmailsToUsers = async (req, res) => {
    try {
        const { userIds, emails, subject, body } = req.body;

        // Validate input
        if ((!Array.isArray(userIds) || userIds.length === 0) && (!Array.isArray(emails) || emails.length === 0)) {
            return res.status(400).json({ error: "Either userIds or emails must be a non-empty array" });
        }
        if (!subject || !body) {
            return res.status(400).json({ error: "Subject and body are required" });
        }

        let recipientEmails = [];

        // If userIds are provided, fetch emails from User Management API
        if (Array.isArray(userIds) && userIds.length > 0) {
            console.log("Fetching user details for userIds:", userIds);
            try {
                const users = await userService.getUserDetails(userIds);
                if (users && users.length > 0) {
                    recipientEmails = users.map(user => user.email).filter(email => email); // Remove null emails
                }
            } catch (error) {
                console.error("❌ Error fetching user details:", error.message);
                return res.status(500).json({ error: "Failed to fetch user details" });
            }
        }

        // If emails are directly provided, add them
        if (Array.isArray(emails) && emails.length > 0) {
            recipientEmails = [...recipientEmails, ...emails];
        }

        // Remove duplicates
        recipientEmails = [...new Set(recipientEmails)];

        if (recipientEmails.length === 0) {
            return res.status(404).json({ error: "No valid emails found" });
        }

        console.log("📧 Adding emails to the queue:", recipientEmails);

        // Add emails to the queue for sequential processing
        for (const email of recipientEmails) {
            emailQueue.addToQueue(email, subject, body); // Queue each email
        }

        return res.status(200).json({
            message: `✅ Emails added to the queue for ${recipientEmails.length} recipients`,
        });

    } catch (error) {
        console.error("❌ Error in sendEmailsToUsers:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { sendEmailsToUsers };
