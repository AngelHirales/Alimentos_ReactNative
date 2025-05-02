import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alimentos } from '@/interfaces/alimentos.supabase';
import { supabase } from '@/lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useWishlist } from '@/lib/usewishlist';

export default function Details() {
  const route = useRoute();
  const { categoria } = route.params as { categoria: string };
  const [alimentosPorCategoria, setAlimentosPorCategoria] = useState<Alimentos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchAlimentosPorCategoria = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from<Alimentos>('tabla_alimentos')
          .select('*')
          .eq('categoria', categoria);
        if (error) {
          setError(error.message);
        } else {
          setAlimentosPorCategoria(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlimentosPorCategoria();
  }, [categoria]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (!session) {
        navigation.getParent()?.navigate('index');
      }
    };
  
    checkSession();
  }, []);  

  if (loading) {
    return <View><Text>Cargando alimentos...</Text></View>;
  }

  if (error) {
    return <View><Text>Error, no se pudo cargar los alimentos: {error}</Text></View>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>
        Alimentos de: {categoria}
      </Text>

      {alimentosPorCategoria.length > 0 ? (
        <FlatList
          keyExtractor={(item) => item.id}
          data={alimentosPorCategoria}
          renderItem={({ item: alimento }) => (
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.foodInfo}
                onPress={() =>
                  navigation.navigate('details-alimento', { alimentoId: alimento.id })
                }
              >
                <Text style={styles.foodName}>{'🍔 ' + alimento.alimento}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.wishlistButton}
                onPress={() => toggleWishlist(alimento.id)}
              >
                <Ionicons
                  name={isInWishlist(alimento.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isInWishlist(alimento.id) ? 'blue' : 'black'}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No hay alimentos en esta categoría.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 15,
    margin: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  wishlistButton: {
    padding: 8,
  },
});
