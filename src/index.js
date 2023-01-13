import "./styles.scss";
import "leaflet/dist/leaflet.css";
// import * as L from "leaflet";
import { setBasemap, setTileLayer } from "./basemap.service";

class AnewMap {
  constructor() {
    this.domId = "map";
  }

  initMap() {
    this.map = setBasemap(this.domId);
    this.tileLayer = setTileLayer();
    this.tileLayer.addTo(this.map);
  }
}

const anewMap = new AnewMap();
anewMap.initMap();
