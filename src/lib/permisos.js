import PocketBase from 'pocketbase'
export function isCoordinadora() {
    
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);

    return pb.authStore.model.coordinador
}