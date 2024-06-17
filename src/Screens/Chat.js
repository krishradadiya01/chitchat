import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import CSafeAreaView from '../Common/CSafeAreaView';
import {firebase} from '@react-native-firebase/firestore';

export default function Chat({route}) {
  let {id, data} = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('Chats')
      .doc(id + data.userId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const AllMessages = querySnapshot.docs.map(item => {
          return {
            ...item._data,
            createdAt: item._data.createdAt,
          };
        });
        setMessages(AllMessages);
      });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: id,
      sendTo: data.userId,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));

    firebase
      .firestore()
      .collection('Chats')
      .doc('' + data.userId + id)
      .collection('Messages')
      .add(myMsg);
  }, []);

  return (
    <CSafeAreaView>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: id,
        }}
      />
    </CSafeAreaView>
  );
}

const styles = StyleSheet.create({});
