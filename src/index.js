import "./styles/index.scss";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import {setBasemap, setTileLayer} from "./basemap.service";
import IconsConstants from "./icons/IconsConstants";
import circleIconFactory from "./icons/circleIconFactory";
import SideBar from './L.Control.Sidebar';
import sidebarContentManager from "./sidebarContentManager";

import data from './data.json';

class AnewMap {
    constructor() {
        this.domId = "map";
    }

    initMap() {
        this.defaultMarkerFix();
        this.map = setBasemap(this.domId);
        this.tileLayer = setTileLayer();
        this.tileLayer.addTo(this.map);

        const markerGroup = L.featureGroup();

        data.map((item) => {
            let markerOuterColor = IconsConstants.LIGHT_GREEN;
            let markerInnerColor = IconsConstants.WHITE;

            if(item.ProjType.toLowerCase() === 'compliance'){
                markerOuterColor = IconsConstants.LIGHT_ORANGE;
            }

            const marker = L.marker([item['POINT_Y'], item['POINT_X']],
                { icon: circleIconFactory(markerOuterColor, markerInnerColor) });

            marker.info = item;

            marker.on("click",  (ev) => {
                this.scaleIconForMarker(marker, 2);
            });
            marker.addTo(markerGroup);
        });

        this.map.addLayer(markerGroup);
        this.map.fitBounds(markerGroup.getBounds());

        markerGroup.on("click", function (ev) {
            const clickedMarker = ev.layer;
            const event = new CustomEvent("ANEW_MAP_MARKER_CLICK_EVENT", {
                detail: {
                    marker: clickedMarker
                },
                bubbles: true,
                cancelable: true,
                composed: false,
            });
            window.dispatchEvent(event);
        });

        SideBar.initSideBar();
        const sidebar = L.control.sidebar('sidebar', {
            position: 'left'
        });
        this.map.addControl(sidebar);


        window.addEventListener(
            'ANEW_MAP_MARKER_CLICK_EVENT',
            (e) => {
                console.log('marker clicked', e.detail.marker.info);
                sidebarContentManager(e.detail.marker.info);
                sidebar.show();

            },
            false
        );
    }

    defaultMarkerFix() {
        L.Marker.prototype.options.icon = L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
        });
    }

    /// Returns a scaled copy of the marker's icon.
    scaleIconForMarker(marker, enlargeFactor) {
        const iconOptions = marker.options.icon.options;

        return L.icon({
            iconUrl: iconOptions.iconUrl,
            iconSize: this.multiplyPointBy(enlargeFactor, iconOptions.iconSize),
            iconAnchor: this.multiplyPointBy(enlargeFactor, iconOptions.iconAnchor),
        });
    }

    /// Helper function, for some reason,
    /// Leaflet's Point.multiplyBy(<Number> num) function is not working for me,
    /// so I had to create my own version, lol
    /// refer to https://leafletjs.com/reference.html#point-multiplyby
    multiplyPointBy(factor, originalPoint) {
        return L.point(
            originalPoint[0] * factor,
            originalPoint[1] * factor
        );
    }
}

const anewMap = new AnewMap();
anewMap.initMap();
