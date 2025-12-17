import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';




function calculateBearingForGoogleMapsWeb(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const toDegrees = (radians) => radians * (180 / Math.PI);

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  
  // ✅ For Google Maps Web with CSS transform rotate()
  // No -90° adjustment needed if your truck icon points UP
  // If your icon points RIGHT, then use: bearing = (bearing - 90 + 360) % 360;
  
  // Test with your icon:
  // - If icon points UP (north): return bearing
  // - If icon points RIGHT (east): return (bearing - 90 + 360) % 360
  
  return Math.round(bearing);
}

function calculateBearingForReactNativeMaps(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const toDegrees = (radians) => radians * (180 / Math.PI);

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  
  // ADJUSTMENT NEEDED for RIGHT-facing icon!
  // Subtract 90° so 0° bearing (North) becomes -90° rotation
  const iconBearing = (bearing - 90 + 360) % 360;
  
  return Math.round(iconBearing);
}

export const get_truck_rotation = asyncHandler(async (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.query;

    if (
      lat1 == null || lon1 == null ||
      lat2 == null || lon2 == null
    ) {
      return res.status(400).json({
        error: 'lat1, lon1, lat2, and lon2 are required'
      });
    }

    const bearing = calculateBearingForGoogleMapsWeb(
      Number(lat1),
      Number(lon1),
      Number(lat2),
      Number(lon2)
    );

    const bearing2 = calculateBearingForReactNativeMaps(
      Number(lat1),
      Number(lon1),
      Number(lat2),
      Number(lon2)
    );



    return res.status(200).json({
      data: { bearing, bearing2 },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Failed to calculate truck rotation'
    });
  }
});
