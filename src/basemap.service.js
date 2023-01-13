import * as L from "leaflet";

export const setBasemap = (domId) => {
  return L.map(domId, {
    center: [51.505, -0.09],
    zoom: 13
  });
};

export const setTileLayer = () => {
  return L.tileLayer(
    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png" +
      (L.Browser.retina ? "@2x.png" : ".png"),
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  );
};
