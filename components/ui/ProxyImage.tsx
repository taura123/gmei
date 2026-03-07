"use client";

import Image from "next/image";

interface ProxyImageProps {
    src: string;
    alt: string;
    fallbackSrc: string;
    className?: string;
    fill?: boolean;
}

export default function ProxyImage({ src, alt, fallbackSrc, className, fill }: ProxyImageProps) {
    const isExternal = src.startsWith('http');
    const proxyUrl = isExternal ? `/api/proxy-image?url=${encodeURIComponent(src)}` : src;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        target.onerror = null;
        target.src = fallbackSrc;
    };

    if (fill) {
        return (
            <img
                src={proxyUrl}
                alt={alt}
                className={className}
                onError={handleError}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
        );
    }

    return (
        <img
            src={proxyUrl}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
}
