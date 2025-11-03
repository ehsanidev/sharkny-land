import { Client, Databases, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const PROJECT_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint(PROJECT_ENDPOINT)
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        // 1. Aynı searchTerm ile belge ara (tam eşleşme)
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('searchTerm', searchTerm),
                Query.limit(1)
            ]
        );

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            // 2. Sayacı 1 artır
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1
                }
            );
        } else {
            // 3. Yeni belge oluştur
            await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : null
                }
            );
        }
    } catch (error) {
        console.error("Appwrite search count update error:", error);
    }
};

// En çok aranmış 5 filmi getir (count'a göre azalan)
export const getTrendingMovies = async (limit = 5) => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.orderDesc('count'),  // count'a göre büyükten küçüğe
                Query.limit(limit)         // kaç tane dönsün
            ]
        );

        return result.documents;
    } catch (error) {
        console.error("Appwrite: Failed to fetch trending movies:", error);
        return []; // Hata olursa boş array dön, UI çökmesin
    }
};