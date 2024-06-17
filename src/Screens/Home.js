import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import {moderateScale} from '../Common/Constant';
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
    try {
      const email = await AsyncStorage.getItem('EMAIL');
      console.log('email', email);
      id = await AsyncStorage.getItem('USERID');

      if (email) {
        let usersData = [];
        firebase
          .firestore()
          .collection('Users')
          .where('email', '!=', email)
          .get()
          .then(result => {
            if (result.docs.length > 0) {
              result.docs.forEach(item => {
                usersData.push(item.data());
              });
            }
            setUsers(usersData);
          })
          .catch(error => {
            console.error('Error getting users:', error);
          });
      } else {
        console.log('No email found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving email:', error);
    }
  };

  const onPressUser = item => {
    navigation.navigate('Chat', {data: item, id: id});
  };

  const onPressLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
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

      <CButton title={'Log out'} onPress={onPressLogout} />
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
