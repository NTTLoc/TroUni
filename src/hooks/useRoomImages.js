import { useState, useEffect, useCallback } from "react";
import { getRoomImagesApi } from "../services/roomApi";

/**
 * Hook để fetch images cho một room
 */
export const useRoomImages = (roomId) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("📸 Fetching images for room:", id);
      const response = await getRoomImagesApi(id);
      console.log("📸 Images response:", response.data);
      
      setImages(response.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch room images:", err);
      setError(err?.message || "Failed to fetch images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(roomId);
  }, [roomId, fetchImages]);

  return {
    images,
    loading,
    error,
    refetch: () => fetchImages(roomId)
  };
};

/**
 * Hook để fetch images cho nhiều rooms
 */
export const useMultipleRoomImages = (rooms) => {
  const [roomsWithImages, setRoomsWithImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllImages = async () => {
      if (!rooms || rooms.length === 0) {
        setRoomsWithImages([]);
        return;
      }

      setLoading(true);
      console.log("📸 Fetching images for", rooms.length, "rooms");

      try {
        const roomsWithImagesData = await Promise.all(
          rooms.map(async (room) => {
            try {
              console.log("📸 Fetching images for room:", room.id);
              const response = await getRoomImagesApi(room.id);
              const images = response.data || [];
              
              console.log("📸 Got images for room", room.id, ":", images.length);
              
              return {
                ...room,
                images: images,
                // Legacy support - set first image as primary
                image: images.length > 0 ? images[0].imageUrl : null
              };
            } catch (error) {
              console.error("❌ Failed to fetch images for room", room.id, ":", error);
              return {
                ...room,
                images: [],
                image: null
              };
            }
          })
        );

        console.log("📸 All rooms with images:", roomsWithImagesData);
        setRoomsWithImages(roomsWithImagesData);
      } catch (err) {
        console.error("❌ Failed to fetch images for rooms:", err);
        setRoomsWithImages(rooms.map(room => ({ ...room, images: [], image: null })));
      } finally {
        setLoading(false);
      }
    };

    fetchAllImages();
  }, [rooms]);

  return {
    roomsWithImages,
    loading,
    refetch: () => {
      if (rooms && rooms.length > 0) {
        fetchAllImages();
      }
    }
  };
};
