import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Initialize the client with credentials from environment variables
// Note: GOOGLE_PRIVATE_KEY needs to handle potential newline issues in env
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
});

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!propertyId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            return NextResponse.json({
                error: "Analytics credentials not configured",
                configured: false
            }, { status: 200 });
        }

        // Fetch metrics for the last 7 days
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            dimensions: [
                { name: "deviceCategory" },
                { name: "sessionSource" },
                { name: "city" }
            ],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" }
            ],
        });

        // We also need a simpler report for the total counts without dimension splitting
        const [totalResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" }
            ],
        });

        // Process the data into a format the dashboard expects
        const stats = {
            totals: {
                activeUsers: totalResponse.rows?.[0]?.metricValues?.[0]?.value || 0,
                pageViews: totalResponse.rows?.[0]?.metricValues?.[1]?.value || 0,
                sessions: totalResponse.rows?.[0]?.metricValues?.[2]?.value || 0,
            },
            devices: response.rows?.reduce((acc: any, row: any) => {
                const device = row.dimensionValues[0].value;
                const value = parseInt(row.metricValues[0].value);
                acc[device] = (acc[device] || 0) + value;
                return acc;
            }, {}),
            sources: response.rows?.reduce((acc: any, row: any) => {
                const source = row.dimensionValues[1].value;
                const value = parseInt(row.metricValues[0].value);
                acc[source] = (acc[source] || 0) + value;
                return acc;
            }, {}),
            cities: response.rows?.reduce((acc: any, row: any) => {
                const city = row.dimensionValues[2].value;
                const value = parseInt(row.metricValues[0].value);
                if (city !== "(not set)") {
                    acc[city] = (acc[city] || 0) + value;
                }
                return acc;
            }, {}),
            configured: true
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("GA4 API Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to fetch analytics",
            configured: true // It's configured but failed
        }, { status: 500 });
    }
}
