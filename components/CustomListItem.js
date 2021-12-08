import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar, Icon, Button } from 'react-native-elements';
import { db, auth } from '../firebase';

//list item for HomeScreen
const CustomListItem = ({ id, chatName, imageURL, secNum, enterChat, setRemoveUser }) => {
  const [chatMessages, setChatMessages] = useState('');
  const [usersArr, setUsersArr] = useState(['']);
  
  //Grab all messages from a chat
  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data()))
      );

    return unsubscribe;
  }, []);

  //remove user from a chat
  function removeUserFromChat() {
    console.log('hi');
    db.collection('chats')
      .doc(id)
      .get()
      .then((doc) => {
        setUsersArr(doc.data().users);
      });
  }

  useEffect(() => {
    if (usersArr[0] !== '') {
      let newArr = usersArr.filter((a) => a !== auth.currentUser.uid);
      console.log(newArr );
      db.collection('chats')
        .doc(id)
        .update({
          users: newArr,
        })
        .then(() => {
          console.log('uo')
          setRemoveUser(prev => !prev);
        })
        .catch((error) => alert(error));
    }
  }, [usersArr]);

  return (
    <ListItem.Swipeable
      style={{ marginTop: 0 }}
      key={id}
      onPress={() => enterChat(id, chatName, imageURL)}
      key={id}
      bottomDivider
      rightContent={
        <Button
          title="Leave"
          icon={{ name: 'remove', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
          onPress={removeUserFromChat}
        />
      }
    >
      <Avatar
        size="medium"
        source={{
          uri:
            imageURL ||
            'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
        }}
      />

      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800', color: '#3cb3ab' }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle style={{ fontWeight: '800', color: '#3cb3ab' }}>
          sec: {secNum}
        </ListItem.Subtitle>
        <ListItem.Subtitle
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: '#3cb3ab' }}
        >
          {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem.Swipeable>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
