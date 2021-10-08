/** @constant */
export const GEOM = {
  ORIGIN: {x: 0, y: 0, z: 0},
  COUNTERCLOCKWISE: 1,
  COLLINEAR: 0,
  CLOCKWISE: -1,
  UP: 1,
  COPLANER: 0,
  DOWN: -1,
  LEFT: 1,
  RIGHT: -1,
  XY: 1,
  YZ: 2,
  XZ: 3,
  PROJECTED: 4,
  QUADRANT: { SW: 1, SE: 2, NE: 3, NW: 4 }
}

/**
 * Simple set of colors for drawing and debugging
 * @constant 
 */
export const COLORS = {
  // primary
  red: 0xFF0000,
  lightred: 0xFF7F7F,
  darkred: 0x8B0000,
  
  yellow: 0xFFFF00,
  lightyellow: 0xFFFFED,
  darkyellow: 0x8B8000,

  blue: 0x0000FF,
  lightblue: 0xADD8E6,
  darkblue: 0x00008B,
  
  // secondary
  orange: 0xFFA500,
  lightorange: 0xFFD580,
  darkorange: 0xFF8C00,
  
  green: 0x00FF00, 
  lightgreen: 0x90EE90,
  darkgreen: 0x006400,
  
  violet: 0x8F00FF,
  lightviolet: 0xCF9FFF,
  darkviolet: 0x9400D3,
  
  // achromatic
  gray: 0x808080,
  lightgray: 0xD3D3D3,
  darkgray: 0xA9A9A9,
  
  black: 0x000000,
  white: 0xFFFFFF
}
