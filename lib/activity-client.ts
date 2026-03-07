import axios from "axios";

/**
 * Helper to log administrative activities from client-side components.
 */
export async function logActivity(action: string, target: string, details: string) {
    try {
        await axios.post("/api/activity", {
            action,
            target,
            details
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
        // We don't throw here to avoid breaking the main UI flow if logging fails
    }
}
