"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js/React-Leaflet
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Branch {
    city: string;
    address: string;
    phone: string;
    email: string;
    coords: [number, number];
}

interface BranchMapProps {
    branches: Branch[];
    activeCenter: [number, number];
    zoom?: number;
}

// Component to handle map center changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function BranchMap({ branches, activeCenter, zoom = 13 }: BranchMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
                <p className="text-slate-400 font-bold">Memuat Peta...</p>
            </div>
        );
    }

    return (
        <MapContainer
            center={activeCenter}
            zoom={zoom}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={activeCenter} zoom={zoom} />
            {branches.map((branch) => (
                <Marker key={branch.city} position={branch.coords}>
                    <Popup className="custom-popup">
                        <div className="p-1">
                            <h3 className="font-black text-blue-600 mb-1 uppercase tracking-tight">{branch.city}</h3>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{branch.address}</p>
                            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase">
                                {branch.phone}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
