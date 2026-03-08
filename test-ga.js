const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
    },
});

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

async function runReport() {
    try {
        console.log(`Testing property: ${propertyId}...`);
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
        });
        console.log('Report result:', JSON.stringify(response, null, 2));
    } catch (e) {
        console.error('Error running report:');
        console.error(e.message);
    }
}

runReport();
