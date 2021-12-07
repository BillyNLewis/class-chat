import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from '../firebase';
import { TextInput } from 'react-native-web';
import RNPickerSelect from 'react-native-picker-select';

const AddChatScreen = ({ navigation }) => {
  const [selectedSubject, setSlectedSubject] = useState(null);
  const [selectedClassNum, setSelectedClassNum] = useState(null);
  const [selectedSectionNum, setSelectedSectionNum] = useState(null);

  const [usersArr, setUsersArr] = useState(['']);

  let chatName = '';

  //Join user into a chat in the db
  const joinChat = async () => {
    chatName = selectedSubject + ' ' + selectedClassNum;
    chatName = chatName.toUpperCase();
    const chatRef = db.collection('chats').doc(chatName);
    const doc = await chatRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      await db
        .collection('chats')
        .doc(chatName)
        .set({
          chatName: chatName,
          secNum: selectedSectionNum,
          users: [auth.currentUser.uid],
          imageURL:
            'https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png',
        })
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => alert(error));
    } else {
      console.log('Document data:', doc.data());
      setUsersArr(doc.data().users);
    }
  };
  useEffect(() => {
    if (usersArr[0] !== '') {
      addUserToChat();
    }
  }, [usersArr]);
  //Add user to a chat
  const addUserToChat = () => {
    chatName = selectedSubject + ' ' + selectedClassNum;
    chatName = chatName.toUpperCase();
    usersArr.push(auth.currentUser.uid);
    db.collection('chats')
      .doc(chatName)
      .update({
        users: usersArr,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Join a Class Chat',
      headerBackTitle: 'Chats',
    });
  }, [navigation]);
  const checkInput = () => {
    if (
      selectedSubject === null ||
      selectedClassNum === null ||
      selectedSubject === null
    ) {
      alert('Please fill out all fields');
      return;
    } else {
      joinChat();
    }
  };

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        maxLength={4}
        placeholder="Subject: e.g. csc"
        value={selectedSubject}
        onChangeText={(value) => setSlectedSubject(value)}
      />
      <Input
        maxLength={4}
        placeholder="Course number: e.g. 1301"
        value={selectedClassNum}
        onChangeText={(value) => setSelectedClassNum(value)}
      />
      <Input
        maxLength={4}
        placeholder="Section number: e.g. 002"
        value={selectedSectionNum}
        onChangeText={(value) => setSelectedSectionNum(value)}
      />

      <Button
        buttonStyle={{ backgroundColor: '#3cb3ab' }}
        containerStyle={styles.button}
        onPress={checkInput}
        title="Join Chat"
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    padding: 30,
    height: '100%',
  },
  button: {
    marginTop: 40,
    width: 300,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20,
  },
});
