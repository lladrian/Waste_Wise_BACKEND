import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Barangay from '../models/barangay.js';
import axios from "axios";


function storeCurrentDate(expirationAmount, expirationUnit) {
    // Get the current date and time in Asia/Manila timezone
    const currentDateTime = moment.tz("Asia/Manila");
    // Calculate the expiration date and time
    const expirationDateTime = currentDateTime.clone().add(expirationAmount, expirationUnit);

    // Format the current date and expiration date
    const formattedExpirationDateTime = expirationDateTime.format('YYYY-MM-DD HH:mm:ss');

    // Return both current and expiration date-time
    return formattedExpirationDateTime;
}



export const get_barangay_with_coordinates = asyncHandler(async (req, res) => {
  try {
    // 1. Get all barangays from PSGC
    const psgcResponse = await axios.get(
      'https://psgc.gitlab.io/api/cities/083738000/barangays'
    );
    
    // 2. Find "Barangay 1 (Pob.)"
    const barangay1 = psgcResponse.data.find(b => 
      b.code === '083738021' || b.name === 'Barangay 1 (Pob.)'
    );
    
    if (!barangay1) {
      throw new Error('Barangay 1 not found');
    }
    
    // 3. Get coordinates from Nominatim
    const nomResponse = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: 'Barangay 1, Ormoc City, Philippines',
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'YourApp/1.0 adrianmanatad5182@gmail.com' // Required by Nominatim
        }
      }
    );
    
    // 4. Combine data
    const result = {
      barangay: {
        code: barangay1.code,
        name: barangay1.name,
        oldName: barangay1.oldName || null
      },
      coordinates: nomResponse.data.length > 0 ? {
        latitude: parseFloat(nomResponse.data[0].lat),
        longitude: parseFloat(nomResponse.data[0].lon),
        displayName: nomResponse.data[0].display_name
      } : null,
      city: 'Ormoc City',
      province: 'Leyte',
      region: 'Eastern Visayas'
    };
    
    console.log(result);
    return result;
    
  } catch (error) {
    console.error('Error:', error.message);
  }
});

export const get_simple_barangay_list = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(
      'https://psgc.gitlab.io/api/cities/083738000/barangays'
    );
    
    const barangayNames = response.data.map(barangay => barangay.name);
    
    // res.json({
    //   success: true,
    //   count: barangayNames.length,
    //   barangays: barangayNames,
    //   city: 'Ormoc City'
    // });
    return res.status(200).json({ data: barangayNames });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch barangay list'
    });
  }
});

export const create_barangay = asyncHandler(async (req, res) => {
    const { barangay_name, latitude, longitude } = req.body;

    try {
        if (!barangay_name || !latitude || !longitude) {
            return res.status(400).json({ message: "Please provide all fields (latitude, position, longitude)." });
        }
        
        if (await Barangay.findOne({ barangay_name })) return res.status(400).json({ message: 'Barangay already exists' });

        const barangayData = {
            barangay_name: barangay_name,
            position: {
                lat: latitude,
                lng: longitude
            },
            created_at: storeCurrentDate(0, "hours")
        };

        const newBarangayData = new Barangay(barangayData);
        await newBarangayData.save();

        return res.status(200).json({ data: 'New barangay successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create barangay.' });
    }
});

export const get_all_barangay = asyncHandler(async (req, res) => {
    try {
        const barangays = await Barangay.find();


        return res.status(200).json({ data: barangays });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all barangay.' });
    }
});

export const get_specific_barangay = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const barangay = await Barangay.findById(id);

        res.status(200).json({ data: barangay });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific barangay.' });
    }
});



export const update_barangay = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { barangay_name, latitude, longitude } = req.body;

    try {
        if (!barangay_name || !latitude || !longitude) {
            return res.status(400).json({ message: "Please provide all fields (barangay_name, latitude, longitude)." });
        }

        const updatedBarangay = await Barangay.findById(id);

        if (await Barangay.findOne({ barangay_name: barangay_name, _id: { $ne: id } })) {
            return res.status(400).json({ message: 'Barangay already exists' });
        }

        if (!updatedBarangay) {
            return res.status(404).json({ message: "Barangay not found" });
        }

        updatedBarangay.barangay_name = barangay_name ? barangay_name : updatedBarangay.barangay_name;
        updatedBarangay.position.lat = latitude ? latitude : updatedBarangay.position.lat;
        updatedBarangay.position.lng = longitude ? longitude : updatedBarangay.position.lng;

        await updatedBarangay.save();

        return res.status(200).json({ data: 'Barangay successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update barangay.' });
    }
});


export const delete_barangay = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedBarangay = await Barangay.findByIdAndDelete(id);

        if (!deletedBarangay) return res.status(404).json({ message: 'Barangay not found' });

        return res.status(200).json({ data: 'Barangay successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete barangay.' });
    }
});