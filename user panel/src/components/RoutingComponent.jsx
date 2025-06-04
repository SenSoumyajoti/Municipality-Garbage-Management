import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet'

const RoutingComponent = ({checkPoints, weight = 6}) => {
    const map = useMap();

    useEffect(() => {
        if(!map || checkPoints.length == 0) return;

        const routingControl = L.routing.control({
            waypoints: checkPoints.map(({lat, lng}) => L.latLng(lat, lng)),
            routeWhileDragging: true,
            createMarker: () => null,
            show: false,
            lineOptions: {
                styles: [
                    {
                        color: "#0062ff",
                        weight: weight
                    }
                ]
            }
        }).addTo(map);

        const routingContainer = document.querySelector(".leaflet-routing-container");
        if(routingContainer){
            routingContainer.style.display = "none"
        }

        return () => {
            if(map && routingControl) {
                map.removeControl(routingControl);
            }
        }
    },[map, checkPoints]);

    return null

}

export default RoutingComponent;