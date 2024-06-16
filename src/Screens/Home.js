import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import {moderateScale} from '../Common/Constant';
import images from '../assets/images';
import {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CButton from '../Common/CButton';

let id = '';
export default function Home({navigation}) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const email = await AsyncStorage.getItem('EMAIL');
    id = await AsyncStorage.getItem('USERID');

    let usersData = [];
    firebase
      .firestore()
      .collection('Users')
      .where('email', '!=', email)
      .get()
      .then(result => {
        if (result.docs != []) {
          result.docs.map(item => {
            usersData.push(item.data());
          });
        }
        setUsers(usersData);
      });
  };

  const onPressUser = item => {
    navigation.navigate('Chat', {data: item, id: id});
  };

  const RenderUsers = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.mainStyle}
        onPress={() => onPressUser(item)}>
        <Text style={styles.textStyle}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView extraStyle={styles.containerStyle}>
      <FlatList
        data={users}
        renderItem={RenderUsers}
        key={item => item.userId}
        keyExtractor={item => item.userId}
      />

      <CButton title={'Settings'} />
    </CSafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomTab: {
    position: 'absolute',
    bottom: moderateScale(0),
    height: moderateScale(50),
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#24786D',
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: moderateScale(20),
    width: moderateScale(20),
    tintColor: '#fff',
  },
  mainStyle: {
    margin: moderateScale(20),
    backgroundColor: '#24786D',
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(10),
  },
  textStyle: {
    color: '#fff',
    fontSize: moderateScale(24),
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
});
