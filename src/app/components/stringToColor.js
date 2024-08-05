import * as color from "pex-color";

// Hash function to convert any string to color
// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
// With some modifications to make it more chaotic but still deterministic
export const stringToColor = function (str, {maxLum, minLum, maxSat, minSat}={maxLum:70, minLum:50, maxSat:60, minSat:20}) {
  if (!str) { return "#ffffff"; }

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var seed = hash & 255;
  var rand = function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Seed should change every function call
  let h = rand();
  let s = rand();
  let l = rand();
  let hsl = [h, s, l];

  // Convert to OkHSL (we'll convert back later)
  const okhsl = color.toOkhsl(hsl)
  const clampedColor = clampHsl(okhsl, {maxLum, minLum, maxSat, minSat});
  const rgb = color.fromOkhsl(color.create(), ...clampedColor, 1);
  const strColor = color.toHex(rgb, false)

  // var strColor = "#";
  // for (let i = 0; i < 3; i++) {
  //   strColor += rgb[i].toString(16).substring(0, 2);
  // }

  return strColor;
};
// Function to clamp luminance and saturation between min and max
// color = [h, s, l]
const clampHsl = (color, {maxLum, minLum, maxSat, minSat}) => {
  const clampedSat = minSat / 100 + color[1] * (maxSat - minSat) / 100;
  const clampedLum = minLum / 100 + color[2] * (maxLum - minLum) / 100;
  return [color[0], clampedSat, clampedLum];
};


// unused in favor of okhsl
// https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/
const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};
