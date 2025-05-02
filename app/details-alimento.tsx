import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Alimentos } from '@/interfaces/alimentos.supabase';
import { supabase } from '@/lib/supabase';

export default function DetailsAlimento() {
  const route = useRoute();
  const { alimentoId } = route.params as { alimentoId: string };
  const [alimentoDetalle, setAlimentoDetalle] = useState<Alimentos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlimentoDetalle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from<Alimentos>('tabla_alimentos')
          .select('alimento, categoria, kcal, proteina, carbohidratos')
          .eq('id', alimentoId)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setAlimentoDetalle(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlimentoDetalle();
  }, [alimentoId]);

  if (loading) {
    return <View style={styles.container}><Text>Cargando detalles del alimento...</Text></View>;
  }

  if (error) {
    return <View style={styles.container}><Text>Error al cargar los detalles: {error}</Text></View>;
  }

  if (!alimentoDetalle) {
    return <View style={styles.container}><Text>No se encontraron detalles para este alimento.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{alimentoDetalle.alimento}</Text>
      <Text style={styles.detailText}>Categoría: {alimentoDetalle.categoria}</Text>
      <Text style={styles.detailText}>Kcal: {alimentoDetalle.kcal}</Text>
      <Text style={styles.detailText}>Proteína: {alimentoDetalle.proteina}</Text>
      <Text style={styles.detailText}>Carbohidratos: {alimentoDetalle.carbohidratos}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
});