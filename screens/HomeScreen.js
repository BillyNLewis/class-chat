import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import CustomListItem from '../components/CustomListItem';

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [removeUser, setRemoveUser] = useState(false);

  //Sign out user
  const signOutUer = () => {
    auth.signOut().then(() => {
      navigation.replace('Login');
    });
  };
  //listen for changes in authenication state and get user info
  auth.onAuthStateChanged((user) => {
      if(user){
          setDisplayName(user.displayName);
      }
  })

  //retrieve chats that current user has interacted with
  useEffect(() => {
    console.log('ue');
    const unsubscribe = db
      .collection('chats')
      .where('users', 'array-contains', auth.currentUser.uid)
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            // //note:doc.data() is the obj inside of an doc
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [removeUser]);

  //create header for home screen
  useEffect(() => {
    navigation.setOptions({
      title: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: 'white',
              marginRight: 10,
              fontWeight: '700',
              fontSize: 17,
            }}
          >
            Hello, {displayName}
          </Text>
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser
                ? auth.currentUser.photoURL
                : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            }}
          />
        </View>
      ),
      headerStyle: { backgroundColor: '#3cb3ab' },
      headerTitleStyle: { color: 'white' },
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={{ marginLeft: 15, flexDirection: 'row' }}>
          <TouchableOpacity onPress={signOutUer} activeOpacity={0.5}>
            <SimpleLineIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: 70,
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('JoinChat')}
            activeOpacity={0.5}
          >
            <Ionicons name="add-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [displayName]);
  //Direct user to chat
  const enterChat = (id, chatName, imageURL) => {
    navigation.navigate('Chat', {
      id: id,
      chatName: chatName,
      imageURL: imageURL
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName, imageURL, secNum } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            imageURL = {imageURL} 
            secNum = {secNum}
            enterChat={enterChat}
            setRemoveUser = {setRemoveUser}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
