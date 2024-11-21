import axios from 'axios';

const API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';

const API_KEY = '';

class MapsService {

    getNearbyVetClinics = async (latitude, longitude, radius) => {
        try{
            return await fetch(`${API_URL}${latitude},${longitude}&radius=${radius}&type=veterinary_care&key=${API_KEY}`);
        }
        catch (error) {
            console.log(error);
        }
        
    }

}

export default new MapsService();