import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Alimentos } from '@/interfaces/alimentos.supabase';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useWishlist } from '@/lib/usewishlist';

export default function Search() {
  const [filteredAlimentos, setFilteredAlimentos] = useState<Alimentos[]>([]);
  const [alimentos, setAlimentos] = useState<Alimentos[]>([]);
  const [searchText, setSearchText] = useState('');
  const [dataError, setDataError] = useState('');
  const navigation = useNavigation();

  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    loadAlimentos();
  }, []);

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

  useFocusEffect(
    useCallback(() => {
    }, [wishlist])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = alimentos.filter((alimento) =>
      alimento.alimento.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAlimentos(filtered);
  };

  const loadAlimentos = async () => {
    try {
      const { data, error } = await supabase.from('tabla_alimentos').select('*');
      if (error) {
        setDataError(error.message);
        console.log('Supabase error:', error.details);
      } else {
        setAlimentos(data ?? []);
        setFilteredAlimentos(data ?? []);
      }
    } catch (error) {
      console.log('Network or unexpected error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🍔 búsqueda de alimentos 🍟:</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        onChangeText={handleSearch}
        value={searchText}
        placeholder="Busca un alimento"
      />

      <FlatList
        keyExtractor={(item) => item.id}
        data={filteredAlimentos}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    margin: 10,
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
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
