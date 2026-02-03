import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AgentMapScreen = ({ agents, API_URL, currentUser }) => {
  const [agentLocations, setAgentLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FUNCȚIE DE FETCH
  const fetchAgentLocations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agents-locations`);
      if (response.ok) {
        const locations = await response.json();

        // ✅ GRUPEAZA PE AGENT ID - ia doar cea mai recenta
        const latestLocations = {};
        locations.forEach((loc) => {
          if (
            !latestLocations[loc.agentId] ||
            new Date(loc.timestamp) >
              new Date(latestLocations[loc.agentId].timestamp)
          ) {
            latestLocations[loc.agentId] = loc;
          }
        });

        // Convert to array
        const uniqueLocations = Object.values(latestLocations);

        setAgentLocations(uniqueLocations);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLoading(false);
    }
  };
  // ✅ EFFECT 1: Fetch inițial
  useEffect(() => {
    console.log("🚀 Component mounted - fetching initial data");
    fetchAgentLocations();
  }, [API_URL]);

  // ✅ EFFECT 2: Polling la fiecare 30 secunde
  useEffect(() => {
    console.log("⏰ Setting up 30s interval");

    const interval = setInterval(() => {
      console.log("⏰ Interval tick - fetching updates");
      fetchAgentLocations();
    }, 30000);

    return () => {
      console.log("🛑 Cleaning up interval");
      clearInterval(interval);
    };
  }, [API_URL]);

  if (loading) {
    return <div className="text-center py-8">Se încarcă harta...</div>;
  }

  const defaultCenter = [45.9432, 24.9668];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          📍 Locațiile Agenților ({agentLocations.length})
        </h2>
        <button
          onClick={() => {
            console.log("🔄 Manual refresh");
            fetchAgentLocations();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          🔄 Reîncarcă
        </button>
      </div>

      {/* HARTĂ */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <MapContainer
          center={defaultCenter}
          zoom={7}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {agentLocations.map((location) => {
            const agent = agents.find((a) => a.id === location.agentId);
            return (
              <Marker
                key={`marker-${location.id}-${location.timestamp}`}
                position={[location.latitude, location.longitude]}
              >
                <Popup>
                  {/* ✅ SCHIMBĂ ASTA - arată agentName din locație */}
                  <div className="font-semibold">
                    {location.agentName ||
                      agent?.name ||
                      agent?.code ||
                      location.agentId}
                  </div>
                  <div className="text-sm text-gray-600">
                    📍 {location.latitude.toFixed(4)},{" "}
                    {location.longitude.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500">
                    🕐{" "}
                    {new Date(location.timestamp).toLocaleString("ro-RO", {
                      timeZone: "Europe/Bucharest",
                    })}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Agenți Activi</h3>
        <div className="space-y-3">
          {agentLocations.length === 0 ? (
            <p className="text-gray-500">
              Niciun agent nu are locație activată.
            </p>
          ) : (
            agentLocations.map((location) => {
              const agent = agents.find((a) => a.id === location.agentId);
              const timeSince = Math.floor(
                (Date.now() - new Date(location.timestamp)) / 1000,
              );
              const timeAgo =
                timeSince < 60
                  ? "Acum"
                  : timeSince < 3600
                    ? `Acum ${Math.floor(timeSince / 60)} min`
                    : `Acum ${Math.floor(timeSince / 3600)} ore`;

              return (
                <div
                  key={`list-${location.id}-${location.timestamp}`}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        📍{" "}
                        {location.agentName ||
                          agent?.name ||
                          "Agent Necunoscut"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {location.latitude.toFixed(4)},{" "}
                        {location.longitude.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-500">{timeAgo}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block w-3 h-3 rounded-full ${
                          timeSince < 300 ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {location.accuracy
                          ? `±${Math.round(location.accuracy)}m`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentMapScreen;
