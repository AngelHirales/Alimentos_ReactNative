import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useUser } from '@supabase/auth-helpers-react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const user = { id: 'abad3436-23d1-4343-9933-68bd5d52e9c6' };

  useEffect(() => {
    if (user?.id) {
      loadWishlist(user.id);
    } else {
      setWishlist([]);
    }
  }, [user]);

  const loadWishlist = async (userId: string) => {
    const { data, error } = await supabase
      .from('wishlist')
      .select('alimento_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading wishlist:', error);
      return;
    }

    if (data) {
      const ids = data.map((item) => item.alimento_id);
      setWishlist(ids);
      console.log('Wishlist cargada:', ids);
    }
  };

  const toggleWishlist = async (alimentoId: string) => {
    if (!user?.id) {
      console.warn('Usuario no autenticado. No se puede actualizar la wishlist.');
      return;
    }

    const exists = wishlist.includes(alimentoId);

    if (exists) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('alimento_id', alimentoId);

      if (error) {
        console.error('Error al eliminar de wishlist:', error.message);
        return;
      }

      console.log(`Eliminado ${alimentoId} de la wishlist`);
    } else {
      const { error } = await supabase.from('wishlist').insert([
        { user_id: user.id, alimento_id: alimentoId },
      ]);

      if (error) {
        console.error('Error al agregar a wishlist:', error.message);
        return;
      }

      console.log(`Agregado ${alimentoId} a la wishlist`);
    }

    // Recargar después de insertar o eliminar
    loadWishlist(user.id);
  };

  const isInWishlist = (alimentoId: string) => wishlist.includes(alimentoId);

  return { wishlist, toggleWishlist, isInWishlist };
}
