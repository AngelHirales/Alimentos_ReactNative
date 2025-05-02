import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alimentos, Categoria } from "@/interfaces/alimentos.supabase";
import { supabase } from "@/lib/supabase";
import React from "react";

export default function Inicio() {
  const [alimentos, setAlimentos] = useState<Alimentos[]>([]);
  const categorias = Object.values(Categoria);
  const [dataError, setDataError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    loadAlimentos();
  }, []);

  const loadAlimentos = async () => {
    try {
      const { data, error } = await supabase.from("tabla_alimentos").select("*");
      if (error) {
        setDataError(error.message);
        console.log("Supabase error:", error.details);
      } else {
        setAlimentos(data ?? []);
      }
    } catch (error) {
      console.log("Network or unexpected error:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, margin: 5 }}>
      {categorias.length !== 0 ? (
        <FlatList
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 20, textTransform: "uppercase", textAlign: "center" }}>
                🍔 Lista de alimentos 🍟 (categorias):
              </Text>
              <Text style={{ fontSize: 15, margin: 8, marginTop: 20 }}>Selecciona una categoria:</Text>
            </View>
          }
          keyExtractor={(item) => item}
          data={categorias}
          renderItem={({ item: categoria }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("details", { categoria })
              }
            >
              <View
                style={{
                  backgroundColor: "#f0f0f0",
                  alignItems: "center",
                  padding: 10,
                  marginHorizontal: 10,
                  marginBottom: 12,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
                  {'🥪' + categoria}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <>
          <Text>Error</Text>
          <Text>{dataError}</Text>
        </>
      )}
    </View>
  );
}
