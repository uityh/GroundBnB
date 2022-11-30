import * as firestore from "firebase/firestore";
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
const collection = firestore.collection(db, "listings");
const doc = firestore.doc;
const Timestamp = firestore.Timestamp;
const GeoPoint = firestore.GeoPoint;

export const getListing = async (listingId: string) => {
  const listing = await firestore.getDoc(doc(db, "listings", listingId));
  if (!listing.exists()) {
    return null;
  }
  return listing.data();
};

export const createListing = async (title: String, description: String, price: Number, street: String, city: String, state: String, zip: String, lat: number, lon: number, ownerId: String, imageArray: Array<String>) => {
  const docRef = await firestore.addDoc(collection, {
    title: title,
    description: description,
    price: price,
    ownerId: ownerId,
    address: {
      street: street,
      city: city,
      state: state,
      zip: zip,
      geolocation: new GeoPoint(lat, lon)
    },
    averageRating: 0,
    numOfBookings: 0,
    // imageUrls: [], // need to get urls from cloud storage
    reviews: []
  });

  let imageUrls = [];

  for (let i = 0; i < imageArray.length; i++) {
    ref(storage, `${ownerId}/${docRef.id}-${i}`);
    getDownloadURL(ref(storage, `${ownerId}/${docRef.id}-${i}`))
      .then((url) => imageUrls.push(url));
  }

  // update listing with the image urls

};

export const addReview = async (listingId, userId, rating, text, date) => {
  await firestore.updateDoc(doc(db, "listings", listingId), {
    reviews: firestore.arrayUnion({
      userId: userId,
      rating: rating,
      text: text,
      date: Timestamp.fromDate(new Date(date)),
    }),
  });
  const listing = await getListing(listingId);
  const reviews = listing.reviews;
  let totalRating = 0;
  reviews.forEach((review) => {
    totalRating += review.rating;
  });
  const avgRating = totalRating / reviews.length;
  await firestore.updateDoc(doc(db, "listings", listingId), {
    averageRating: avgRating,
  });
};

//functon that checks if a user has already reviewed a listing
export const hasUserReviewed = async (listingId, userId) => {
  const listing = await firestore.getDoc(doc(db, "listings", listingId));
  if (!listing.exists()) {
    return false;
  }
  const reviews = listing.data().reviews;
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].userId === userId) {
      return true;
    }
  }
  return false;
};
