import IconsConstants from './IconsConstants';

const circleIconFactory = (outerColor= IconsConstants.LIGHT_GREEN,
                           innerColor= IconsConstants.WHITE,
                           width= IconsConstants.WIDTH,
                           height= IconsConstants.HEIGHT,
                           anchorPoint = IconsConstants.ANCHOR_POINT
) => {
    return L.divIcon({
        html: `
        <svg width="${width}" height="${height}" viewBox="0 0 258 258" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M128.754 257.339C199.824 257.339 257.438 199.732 257.438 128.67C257.438 57.6073 199.824 0 128.754 0C57.6841 0 0.0703125 57.6073 0.0703125 128.67C0.0703125 199.732 57.6841 257.339 128.754 257.339Z" 
            fill="${outerColor}"
            />
          <path 
            d="M 128.258 172.902 C 152.808 172.902 172.711 153.002 172.711 128.453 C 172.711 103.905 152.808 84.005 128.258 84.005 C 103.707 84.005 83.804 103.905 83.804 128.453 C 83.804 153.002 103.707 172.902 128.258 172.902 Z" 
            fill="${innerColor}"
            />
        </svg>`,
        className: "svg-icon",
        iconSize: [width, height],
        iconAnchor: [anchorPoint, height],
    });
}

export default circleIconFactory;



