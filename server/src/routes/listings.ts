import { Request, Response } from "express";
import * as express from "express";
export const listingRoutes = express.Router();
import {getAllListings} from "../data"
import * as distance from "geo-distance"


/**Getting listing and sorting from closest to furthest 
 * Send request to /search/location?lat=xxxx&lon=xxx
*/
listingRoutes.get('/search/location', async (req: Request, res: Response) => {
    console.log("GET /listings/search/location");
    const location = { lat : parseFloat(req.query.lat.toString()), lon : req.query.lon.toString()}
    console.log(location.lon);
    
    const listings = await getAllListings();
    console.log(listings);
    
    // const sortedListings = listings.sort((a,b) => {
    //     const aDistance = distance.between(location, {lat: a[address][geolocation][0], lon: a.address.geolocation.get[1]}).human_readable().distance;
    //     const bDistance = distance.between(location, {lat: b.address.geolocation[0], lon: b.address.geolocation[1]}).human_readable().distance;
    //     return aDistance - bDistance;
    // });
    res.json(listings);
    }
);
