"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// কাস্টম মার্কার আইকন
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 🛣️ রিয়েল-টাইম রুট লাইন এবং ট্র্যাকিং লজিক সাব-কম্পোনেন্ট
function RoutingEngine({
  startCoords,
  endCoords,
  onDistanceCalculate,
}: {
  startCoords: [number, number];
  endCoords: [number, number] | null;
  onDistanceCalculate: (dist: number) => void;
}) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    // আগের কোনো রুট লাইন আঁকা থাকলে সেটা রিমুভ করা
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // ম্যাপের ভিউ স্টার্ট লোকেশনে সেট করা
    map.setView(startCoords, 13);

    // ইউজার ডেস্টিনেশন দিলে লাইভ রুট ট্র্যাকিং শুরু হবে
    if (endCoords) {
      routingControlRef.current = (L as any).Routing.control({
        waypoints: [
          L.latLng(startCoords[0], startCoords[1]),
          L.latLng(endCoords[0], endCoords[1]),
        ],
        lineOptions: {
          styles: [{ color: "#06b6d4", weight: 5, opacity: 0.8 }], // প্রিমিয়াম সায়ান কালার রুট লাইন
        },
        createMarker: (i: number, waypoint: any, n: number) => {
          return L.marker(waypoint.latLng, { icon: customIcon }).bindPopup(
            i === 0 ? "Start Location" : "Destination",
          );
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false, // ডিফল্ট টেক্সট ডিরেকশন বক্স হাইড রাখা হয়েছে UI সুন্দর রাখার জন্য
      }).addTo(map);

      // রুট ক্যালকুলেট হওয়ার পর আসল রোড ডিসট্যান্স (KM) বের করা
      routingControlRef.current.on("routesfound", function (e: any) {
        const routes = e.routes;
        const summary = routes[0].summary;
        const totalDistanceKm = summary.totalDistance / 1000; // মিটারে থাকে, কিমিতে কনভার্ট করা হলো
        onDistanceCalculate(Number(totalDistanceKm.toFixed(2)));
      });
    } else {
      // যদি শুধু স্টার্ট লোকেশন থাকে, তবে একটা নরমাল মার্কার বসবে
      const standaloneMarker = L.marker(startCoords, {
        icon: customIcon,
      }).addTo(map);
      return () => {
        map.removeLayer(standaloneMarker);
      };
    }
  }, [startCoords, endCoords, map]);

  return null;
}

interface EcoMapProps {
  startCoords: [number, number];
  endCoords: [number, number] | null;
  onDistanceCalculate: (dist: number) => void;
}

export default function EcoMap({
  startCoords,
  endCoords,
  onDistanceCalculate,
}: EcoMapProps) {
  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-10">
      <MapContainer
        center={startCoords}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CartoDB"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* রুট ইঞ্জিন লোড */}
        <RoutingEngine
          startCoords={startCoords}
          endCoords={endCoords}
          onDistanceCalculate={onDistanceCalculate}
        />
      </MapContainer>
    </div>
  );
}
