import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View , FlatList, TouchableOpacity , TextInput , Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const HOST = "http://192.168.1.101:8000"

function HomeScreen(props) {
  const [animals, setAnimals] = React.useState([])

  React.useEffect(function(){
    fetch(HOST + '/api/animals')
    .then(function(response) {
      if(response.ok){
        return response.json()
      }
    })
    .then(function(data) {
     // console.log(data)
      setAnimals(data)
    })
  }, []);

  return (
    <View style={styles.container}>
      <FlatList data={animals} styles={{ width : "100%", }}
      renderItem={((data) => {
        return (
          <TouchableOpacity style={{ borderWidth: 1 , padding : 10 , alignItems: "center", backgroundColor : "#fff",}}
          onPress={() =>{
             props.navigation.navigate('Edit',data.item)
             
          }} >
        <Text key={"id"+data.item.id}>{data.item.nom}</Text>
        </TouchableOpacity>
        )
      })}
      keyExtractor={(item) => "id"+item.id} />

      
    </View>
  );
}

function EditScreen(props){
  const [animal, setAnimal] = React.useState({... props.route.params})
  //const animal = props.route.params
  //const [nom, setNom] = React.useState(animal.nom)

  function save(){
    fetch(HOST + "/api/animals/"+animal.id,{
      method : 'PATCH',
      body: JSON.stringify(animal),
      headers : {'Content-Type': 'application/json'}
    })
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      console.log(data)
    })
  }
  
  return (
    <View style={styles.container}>
      <TextInput style={{borderWidth : 1 , padding : 10}} 
      value={animal.nom} onChangeText={(nom) => setAnimal({...animal,nom})} />
      
      <TextInput style={{borderWidth : 1 , padding : 10}} 
      value={animal.sexe} onChangeText={(sexe) => setAnimal({...animal,sexe})} />
      
      <TextInput style={{borderWidth : 1 , padding : 10}} 
      value={animal.date_naissance} onChangeText={(date_naissance) => setAnimal({...animal,date_naissance})} />

      <TextInput style={{borderWidth : 1 , padding : 10}} 
      value={animal.commentaires} onChangeText={(commentaires) => setAnimal({...animal,commentaires})} />
    
    <Button title="Save !"  style={{}} onPress={save()}/>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffb6c1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
