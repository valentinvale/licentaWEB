import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const VetClinicsPage = () => {
    const navigate = useNavigate();
    const [vetClinics, setVetClinics] = useState([]);
    const [selectedVetClinic, setSelectedVetClinic] = useState(null);
    const [directions, setDirections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState({ latitude: 44.6365696, longitude: 22.642688 });

    useEffect(() => {
        loadGoogleMapsScript();
    }, []);

    const loadGoogleMapsScript = () => {
        if (typeof window.google !== 'undefined') {
            console.log("Google Maps script already loaded.");
            initMap(userLocation.latitude, userLocation.longitude);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log("Google Maps script loaded.");
            initMap(userLocation.latitude, userLocation.longitude);
        };
        script.onerror = (error) => {
            console.error("Error loading Google Maps script:", error);
            setError("Failed to load Google Maps script.");
            setLoading(false);
        };
        document.head.appendChild(script);
    };

    const initMap = (latitude, longitude) => {
        if (!latitude || !longitude) {
            console.error("Invalid latitude or longitude values");
            setError("Failed to get valid location coordinates.");
            setLoading(false);
            return;
        }

        try {
            const userLocation = { lat: latitude, lng: longitude };
            console.log("Initializing map with location:", userLocation);

            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: userLocation,
                zoom: 15,
            });

            console.log("Map initialized:", map);

            const service = new window.google.maps.places.PlacesService(map);

            const request = {
                location: userLocation,
                radius: '4000',
                type: ['veterinary_care'],
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    console.log("Vet clinics found:", results);
                    setVetClinics(results);
                    setLoading(false);
                } else {
                    console.error("Error fetching vet clinics:", status);
                    setError("Failed to fetch vet clinics.");
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error("Error initializing map:", error);
            setError("Failed to initialize map.");
            setLoading(false);
        }
    };

    const handleClinicSelect = (clinic) => {
        setSelectedVetClinic(clinic);
        fetchDirections(userLocation, {
            latitude: clinic.geometry.location.lat(),
            longitude: clinic.geometry.location.lng(),
        });
    };

    const fetchDirections = async (origin, destination) => {
        try {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();

            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: origin,
                zoom: 15,
            });
            directionsRenderer.setMap(map);

            const request = {
                origin: new window.google.maps.LatLng(origin.latitude, origin.longitude),
                destination: new window.google.maps.LatLng(destination.latitude, destination.longitude),
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                    setDirections(result.routes[0].overview_path.map(point => ({
                        lat: point.lat(),
                        lng: point.lng(),
                    })));
                } else {
                    alert("Failed to fetch directions", "Could not fetch directions to the selected clinic");
                    console.error("Error fetching directions:", status);
                }
            });
        } catch (error) {
            console.error("Error fetching directions:", error);
            setError("Failed to fetch directions.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Nearby Vet Clinics</h1>
            {vetClinics.length === 0 ? (
                <p>No vet clinics found.</p>
            ) : (
                <ul>
                    {vetClinics.map((clinic) => (
                        <li key={clinic.place_id} onClick={() => handleClinicSelect(clinic)}>
                            {clinic.name} - {clinic.vicinity}
                        </li>
                    ))}
                </ul>
            )}
            <div id="map" style={{ height: "400px", width: "100%" }}></div>
            <Button onClick={() => navigate('/')}>Back Home</Button>
        </div>
    );
};

export default VetClinicsPage;
