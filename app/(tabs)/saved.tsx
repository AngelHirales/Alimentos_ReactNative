import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Alimentos } from '@/interfaces/alimentos.supabase';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useWishlist } from '@/lib/usewishlist';

export default function Saved() {
  const [allAlimentos, setAllAlimentos] = useState<Alimentos[]>([]);
  const { wishlist, toggleWishlist } = useWishlist();
  const [dataError, setDataError] = useState('');
  const navigation = useNavigation();
  const [isAlimentosLoading, setIsAlimentosLoading] = useState(true);

  const loadAllAlimentos = useCallback(async () => {
    setIsAlimentosLoading(true);
    try {
      const { data, error } = await supabase.from('tabla_alimentos').select('*');
      if (error) {
        setDataError(error.message);
        console.log('Supabase error:', error.details);
      } else {
        setAllAlimentos(data ?? []);
      }
    } catch (error) {
      console.log('Network or unexpected error:', error);
    } finally {
      setIsAlimentosLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllAlimentos();
    }, [loadAllAlimentos])
  );

  const removeFromWishlist = useCallback((alimentoId: string) => {
    Alert.alert(
      'Eliminar',
      '¿Deseas eliminar este alimento de tu lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            toggleWishlist(alimentoId);
          },
          style: 'destructive',
        },
      ]
    );
  }, [toggleWishlist]);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión.');
            } else {
              await AsyncStorage.setItem('userLoggedOut', 'true');
              navigation.reset({
                index: 0,
                routes: [{ name: 'index' }],
              });              
            }
          },
          style: 'destructive',
        },
      ]
    );
  }, [navigation]);
  

  const alimentosGuardados = useMemo(() => {
    return allAlimentos.filter((alimento) => wishlist.includes(alimento.id));
  }, [allAlimentos, wishlist]);

  if (isAlimentosLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Cargando alimentos guardados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Alimentos Guardados:</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color="black" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {alimentosGuardados.length > 0 ? (
        <FlatList
          data={alimentosGuardados}
          keyExtractor={(item) => item.id}
          renderItem={({ item: alimento }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.foodInfo}
                onPress={() =>
                  navigation.navigate('details-alimento', { alimentoId: alimento.id })
                }
              >
                <Text style={styles.foodName}>{'🍔 ' + alimento.alimento}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeFromWishlist(alimento.id)}
              >
                <Ionicons name="trash" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No has guardado ningún alimento aún.</Text>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  logoutButtonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
});