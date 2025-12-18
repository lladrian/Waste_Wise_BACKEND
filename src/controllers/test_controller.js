import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';




function calculateBearingForGoogleMapsWeb(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  // Initial bearing (0–360, where 0 = North)
  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  // Icon faces RIGHT (East) → -90°
  // Add one more 90° → total -180°
  const adjustedBearing = (bearing - 0 + 360) % 360;

  return adjustedBearing;
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
    // const { lat1, lon1, lat2, lon2 } = req.query;

    // if (
    //   lat1 == null || lon1 == null ||
    //   lat2 == null || lon2 == null
    // ) {
    //   return res.status(400).json({
    //     error: 'lat1, lon1, lat2, and lon2 are required'
    //   });
    // }

    const lat1 = 11.0991346;
    const lat2 = 11.0991346;
    const lon1 = 124.5546779;
    const lon2 = 124.5546779;


    const bearing = calculateBearingForGoogleMapsWeb(
      lat1,
      lon1,
      lat2,
      lon2
    );

    const bearing2 = calculateBearingForReactNativeMaps(
      lat1,
      lon1,
      lat2,
      lon2
    );

    return res.status(200).json({ data: { bearing: bearing, bearing2: bearing2 } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Failed to calculate truck rotation'
    });
  }
});
