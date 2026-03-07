// Simple in-memory rate limiter for various API actions (Login, Contact Form, etc.)
// In production with multiple instances, this should use Redis/Upstash.

interface RateLimitTracker {
    count: number;
    resetTime: number;
}

const rateLimitBuckets = new Map<string, RateLimitTracker>();

interface RateLimitConfig {
    maxAttempts: number;
    windowMinutes: number;
}

/**
 * Checks if a specific action from an IP is allowed.
 * @param key Unique key for the action + IP (e.g. "contact:127.0.0.1")
 * @param config Max attempts and window duration
 * @returns { success: boolean, message?: string }
 */
export function checkRateLimit(key: string, config: RateLimitConfig): { success: boolean; message?: string } {
    const now = Date.now();
    const record = rateLimitBuckets.get(key);

    if (record) {
        // If the window has passed, reset the counter
        if (now > record.resetTime) {
            rateLimitBuckets.delete(key);
            return { success: true };
        }

        // If currently exceeding limit
        if (record.count >= config.maxAttempts) {
            const secondsLeft = Math.ceil((record.resetTime - now) / 1000);
            const minutesLeft = Math.ceil(secondsLeft / 60);

            return {
                success: false,
                message: minutesLeft > 1
                    ? `Terlalu banyak permintaan. Silakan coba lagi dalam ${minutesLeft} menit.`
                    : `Terlalu banyak permintaan. Silakan coba lagi dalam ${secondsLeft} detik.`,
            };
        }
    }

    return { success: true };
}

/**
 * Records a hit for a specific action + IP.
 * @param key Unique key
 * @param config Config to set the reset time if it's a new record
 */
export function recordRateLimitHit(key: string, config: RateLimitConfig) {
    const now = Date.now();
    const record = rateLimitBuckets.get(key);

    if (record && now <= record.resetTime) {
        record.count += 1;
        // If they just hit the max, ensure the reset time is respected
        if (record.count >= config.maxAttempts) {
            console.warn(`[RATE LIMIT] ${key} has reached the limit (${config.maxAttempts} hits).`);
        }
    } else {
        rateLimitBuckets.set(key, {
            count: 1,
            resetTime: now + (config.windowMinutes * 60 * 1000),
        });
    }
}

/**
 * Clears rate limit for a specific key (e.g. after successful login)
 */
export function clearRateLimit(key: string) {
    rateLimitBuckets.delete(key);
}
