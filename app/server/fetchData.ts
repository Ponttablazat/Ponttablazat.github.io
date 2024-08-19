import { database } from '@/app/lib/firebase';
import { ref, get } from 'firebase/database';

export async function fetchDataFromFirebase(path: string) {
    const dataRef = ref(database, path);
    let data = null;

    try {
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
            data = snapshot.val();
        } else {
            console.log('No data available');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    return data;
}
