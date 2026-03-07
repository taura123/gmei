"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBadge({ className = "" }: { className?: string }) {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await axios.get("/api/dashboard/stats");
            setUnreadCount(response.data.stats.absolute.unreadContacts || 0);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();

        // Polling every 60 seconds as backup
        const interval = setInterval(fetchUnreadCount, 60000);

        // Listen for internal update events for instant sync
        const handleUpdate = () => fetchUnreadCount();
        window.addEventListener("unread-updated", handleUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener("unread-updated", handleUpdate);
        };
    }, [fetchUnreadCount]);

    if (unreadCount === 0) return null;

    return (
        <AnimatePresence>
            <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-lg shadow-red-500/20 ${className}`}
            >
                {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
        </AnimatePresence>
    );
}
