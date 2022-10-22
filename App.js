import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Text, FlatList} from 'react-native';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';
import { Header, Input, Button   } from'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  //  https://mobo2022-teht12-default-rtdb.firebaseio.com/

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA2gTFm-DFO_xn1MiO-7-XKCLmBs59q3Tk",
    authDomain: "mobo2022-teht12.firebaseapp.com",
    projectId: "mobo2022-teht12",
    storageBucket: "mobo2022-teht12.appspot.com",
    messagingSenderId: "810096012613",
    appId: "1:810096012613:web:a4ec2d46cf97460e10222c"
  };
  const app = initializeApp(firebaseConfig); // Initialize Firebase
  const database = getDatabase(app);

  const [product, setProduct ] = useState("");
  const [amount, setAmount ] = useState("");
  const [shoppingList, setShoppingList] = useState([]);


  //DATABASE STUFF



  //delete item
  const deleteItem = (item) => {
    console.log("trying to delete", item)
    remove(ref(database, "/products/"+item.key))
  }

  //add item
  const addItemToShoppingList = () => {
    let newItem = product;
    let newAmount = amount;
    push(ref(database, 'products/'),{ 'product': newItem, 'amount': newAmount });
    setProduct("")
    setAmount("")
  }

  //update view
  useEffect(() => {
    const productsRef = ref(database, 'products/');  
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const products = data ? Object.keys(data).map(key=> ({key, ...data[key]})) : [];
      // setShoppingList(Object.values(data));
      console.log("products",products)
      console.log(shoppingList)
      setShoppingList(products);
    })
  }, []);


  console.log(shoppingList)

  return (
    <SafeAreaProvider>
      <Header
        // statusBarProps={{ barStyle: 'dark-content' }}
        // leftComponent={{ icon: 'menu', color: "white"}}  
        centerComponent={{ text: 'SHOPPING LIST BEAUTIFIED (TEHT 15)', style: {color: 'white', fontWeight: "bold", fontSize:12}}}  
        // rightComponent={{ icon: 'home', color: "white"}}
        containerStyle={{
          backgroundColor: '#1a1a1a',
          justifyContent: 'space-around',
          border: "none",
        }}
      />
      <View style={styles.container}>
        <Input 
          style={styles.input} onChangeText={setProduct} value={product}
          placeholder='Add a product to shopping list ...' label='PRODUCT'
          labelStyle={{color: "white"}}
          inputContainerStyle={{}}
        />
        <Input 
          style={styles.input} onChangeText={setAmount} value={amount}
          placeholder='Enter amount of the above product to be purchased ...' label='AMOUNT'
          labelStyle={{color: "white"}}
        />
        <View style={{display: 'flex', flexDirection: 'row', margin: 10}}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            <Button 
              title="Add" raisedicon={{name: 'save'}}
              titleStyle={{color: "white"}}
              buttonStyle={{backgroundColor: "#32cd32", border:"none", padding: "15px"}}
              raised="true"
              onPress={() => addItemToShoppingList()} 
            />
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
      <View style={styles.container2}>
        <Text style={{color:"white", fontSize:26, fontWeight: "bold"}}>SHOPPING LIST</Text>
        <FlatList 
          style={styles.list}
          data={shoppingList}
          // keyExtractor={item => item.id.toString()} 
          renderItem={({ item }) =>
            <View style={styles.shoppingList}>
              <Text style={{color:"white", marginHorizontal: 20}}>{item.product} {item.amount}</Text>
              <Button color="brown" title="Bought" 
                onPress={() => deleteItem(item)}
                buttonStyle={{backgroundColor: "#ac7339", border:"none", padding: "15px"}}
              ></Button>
            </View>}  
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#141f1f',
  },
  containerHeader: {
    flex: 1,
    backgroundColor: '#141f1f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 2,
    backgroundColor: '#141f1f',
    alignItems: 'center',
    paddingTop: "5px"
  },
  container2: {
    flex: 3,
    backgroundColor: '#141f1f',
    alignItems: 'center',
  },
  shoppingList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#141f1f',
    alignItems: 'center',
    margin: 10
  },
  input : {
    // width:"80%", 
    // borderColor: 'gray', 
    // borderWidth: 1,
    // margin: 5,
    color:"white",
  },
  assignmentHeaderText: {
    fontSize: 40,
    color:"#6495ED",
  }
});
 
