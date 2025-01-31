const nodemailer = require("nodemailer");
const config = require("../config/config");

/**
 * Create a reusable transporter object using SMTP transport
 */
const transporter = nodemailer.createTransport({
    host: config.EMAIL_SERVICE_HOST,
    port: config.EMAIL_SERVICE_PORT,
    secure: false, // Use `true` for port 465, `false` for port 587
    auth: {
        user: config.EMAIL_SERVICE_USER,
        pass: config.EMAIL_SERVICE_PASS,
    },
    pool: true, // Enable connection pooling
    maxConnections: 3, // Limit concurrent connections
    maxMessages: 50, // Limit messages per connection
});

/**
 * Delay helper to introduce wait time between emails
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Function to send an email with retries
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @param {number} retries - Number of retry attempts (default: 3)
 * @returns {Promise<void>}
 */
const sendEmailWithRetry = async (to, subject, body, retries = 3) => {
    let attempt = 0;

    while (attempt < retries) {
        try {
            const mailOptions = {
                from: `"IntelliCourse Support" <${config.EMAIL_SERVICE_USER}>`,
                to,
                subject,
                text: body,
                html: `<p>${body}</p>`,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${to}: ${info.messageId}`);
            return info; // Exit the function after a successful attempt
        } catch (error) {
            attempt++;
            console.error(`❌ Attempt ${attempt} failed for ${to}:`, error.message);

            // Retry if attempts are remaining
            if (attempt < retries) {
                console.log(`⏳ Retrying email to ${to} (attempt ${attempt + 1})...`);
                await delay(2000); // Wait 2 seconds before retrying
            } else {
                console.error(`❌ Failed to send email to ${to} after ${retries} attempts`);
                throw new Error(`Failed to send email to ${to}`);
            }
        }
    }
};

/**
 * Queue for managing email sending tasks
 */
class EmailQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    /**
     * Add an email task to the queue
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} body - Email body
     */
    addToQueue(to, subject, body) {
        this.queue.push({ to, subject, body });
        this.processQueue(); // Start processing the queue
    }

    /**
     * Process the email queue
     */
    async processQueue() {
        if (this.isProcessing) return; // Prevent multiple simultaneous queue processors
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const { to, subject, body } = this.queue.shift(); // Get the next email task
            try {
                await sendEmailWithRetry(to, subject, body);
                await delay(1000); // Add a delay of 1 second between emails to avoid server limits
            } catch (error) {
                console.error(`❌ Could not send email to ${to}:`, error.message);
            }
        }

        this.isProcessing = false; // Mark the queue as no longer processing
    }
}

// Create a global email queue instance
const emailQueue = new EmailQueue();

module.exports = { sendEmailWithRetry, emailQueue };
