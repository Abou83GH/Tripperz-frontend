import { StyleSheet, Text, TextInput, View, Image, SafeAreaView, KeyboardAvoidingView, Platform,
  Dimensions, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { updateProfile, logout } from '../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../components/Footer';
import Constants from 'expo-constants';

const backend = Constants.expoConfig.hostUri.split(`:`)[0]

const genderData = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  
const mockData = [
  { label: 'Cultural tourism', value: '0' },
  { label: 'Guided Tours', value: '1' },
  { label: 'Outdoor Activities', value: '2' },
  { label: 'Water activities', value: '3' },
  { label: 'Culinary experiences', value: '4' },
  { label: 'Entertainment', value: '5' },
  { label: 'Sports Activities', value: '6' },
  { label: 'Relaxation and well-being', value: '7' },
  { label: 'Ecotourism', value: '8' },
  { label: 'Shopping', value: '9' },
];
  
  const foodData = [
    { label: 'Italian', value: '0' },
    { label: 'Cakes', value: '1' },
    { label: 'French', value: '2' },
    { label: 'Fast-Food', value: '3' },
    { label: 'Asian', value: '4' },
    { label: 'Vegan', value: '5' },
  ];

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { username, birthday, gender, country, favoriteDestinations, favoriteFoods, hobbies, token } = useSelector((state) => state.user.value)
  
  const [destinations, setDestinations] = useState('');
  const [newGender, setNewGender] = useState(gender);
  const [newCountry, setNewCountry] = useState(country);
  const [newFavoriteDestinations, setNewFavoriteDestinations] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showError, setShowError] = useState(false);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const str = favoriteDestinations.toString();
    const pattern = /,/g;
    const newStr = str.replace(pattern, ', ');
    setDestinations(newStr);
  }, [trigger]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const editDisplay = item => {
      return (
        <View>
          <Text>{item.label}</Text>
        </View>
      )
  }

  const handleLogout = () => {
      dispatch(logout());
      navigation.navigate('Login')
  }

  const handleSubmit = async () => {
    const month = date.getMonth() + 1;
    const str = `${date.getDate()}/${month}/${date.getFullYear()}`;
    const interests = selectedActivities.map(data => mockData[data].label);
    const favoriteFood = selectedFood.map(data => foodData[data].label);
    const profile = {
      birthday: str,
      gender: newGender,
      country: newCountry,
      favDest: newFavoriteDestinations.split(', '),
      favFood: favoriteFood,
      hobbies: interests,
      token: token
    };
    const response = await fetch(`http://${backend}:3000/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
    });
    const data = await response.json();
    if (data.result) {
      dispatch(updateProfile(data.user));
      setShowModal(!showModal);
      setShowError(false);
      setTrigger(!trigger);
    } else {
      setErrorMsg(data.error);
      setShowError(!showError);
    }
    
  }

  const cancelModif = () => {
    setShowModal(!showModal);
    setShowError(false);
  }

  const display = item => {
    return (
      <View>
        <Text>{item}</Text>
      </View>
    )
  }

  const form = (
    <Modal animationType='fade' transparent={false} visible={showModal}>
      <LinearGradient colors={['rgba(6, 113, 136, 1)', 'rgba(43, 127, 149, 0.8698)', 'rgba(77, 141, 162, 0.7502)']}
          start={{ x: 1, y: 0.5 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.view}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit your profile</Text>
          </View>
          <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Birthday</Text>
                <View style={styles.show}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={'date'}
                        maximumDate={new Date()}
                        is24Hour={true}
                        onChange={onChange}
                    />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.inputContainer}>
                    <Dropdown
                        style={styles.list} data={genderData} labelField='label' valueField='value' placeholder={gender} placeholderStyle={{color: '#A0ACAE'}}
                        value={newGender} onChange={(item) => {setNewGender(item.value)}} renderItem={editDisplay} maxHeight={100}
                    />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Country</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder={country} onChangeText={(value) => setNewCountry(value)} placeholderTextColor={'#A0ACAE'}
                    value={newCountry} style={styles.input}/>  
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Favorite Destinations</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder="Favorite Destinations" onChangeText={(value) => setNewFavoriteDestinations(value)} placeholderTextColor={'#A0ACAE'}
                    value={newFavoriteDestinations} style={styles.input}/>  
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Favorite types of food</Text>
                <View style={styles.inputContainer}>
                    <MultiSelect
                        style={styles.list} data={foodData} labelField='label' valueField='value' placeholder='Favorite food types'
                        placeholderStyle={{color: '#A0ACAE'}} value={selectedFood} onChange={(item) => {setSelectedFood(item)}} renderItem={editDisplay} maxHeight={100}
                        visibleSelectedItem={false} activeColor='lightblue'
                    />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Favorite types of activities</Text>
                <View style={styles.inputContainer}>
                    <MultiSelect
                        style={styles.list} data={mockData} labelField='label' valueField='value' placeholder='Favorites types of activities'
                        placeholderStyle={{color: '#A0ACAE'}} value={selectedActivities} onChange={(item) => {setSelectedActivities(item)}} renderItem={editDisplay}
                        maxHeight={100} visibleSelectedItem={false} activeColor='lightblue'
                    />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Favorite activities</Text>
                <View style={styles.inputContainer}>
                    <MultiSelect
                        style={styles.list} data={mockData} labelField='label' valueField='value' placeholder='Favorites activities'
                        placeholderStyle={{color: '#A0ACAE'}} value={selectedActivities} onChange={(item) => {setSelectedActivities(item)}} renderItem={editDisplay}
                        maxHeight={100} visibleSelectedItem={false} activeColor='lightblue'
                    />
                </View>
              </View>
          </View>
          <View style={styles.foot}>
            <View style={styles.buttons}>
              <View style={styles.submitSection}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => cancelModif()} style={styles.confirmBtn}>
                    <Text style={styles.confirm}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.submitSection}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleSubmit()} style={styles.confirmBtn}>
                    <Text style={styles.confirm}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
            { showError && <View style={styles.error}>
                  <Ionicons name={'warning'} size={25} color={'#FFFFFF'} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
            </View> }
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  )

  return (
    <>
      <LinearGradient colors={['rgba(6, 113, 136, 1)', 'rgba(43, 127, 149, 0.8698)', 'rgba(77, 141, 162, 0.7502)']}
          start={{ x: 1, y: 0.5 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Image source={require('../assets/logo.png')}/>
          </View>
          <View style={styles.body}>
            <View style={styles.top}>
              <ImageBackground source={require('../assets/background_2.png')} style={styles.background} imageStyle={{borderRadius: 10}}>
                <View style={styles.icon}>
                  <FontAwesome name={'user-circle'} size={70} color={'#000000'}/>
                </View>
                <View style={styles.messageContainer}>
                  <View style={styles.messageSection}>
                    <Text style={styles.message}>{username}</Text>
                  </View>
                  <View style={styles.edit}>
                    <FontAwesome name={'pencil'} size={15} color={'#000000'} onPress={() => setShowModal(!showModal)}/>
                  </View>
                </View>
                <View style={styles.desc}>
                  <Text style={styles.descText}>Description : </Text>
                  <Text style={styles.descText}>Globetrotter</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.main}>
              <View style={styles.section}>
                <Text>{birthday}</Text>
              </View>
              <View style={styles.section}>
                <Text>{gender}</Text>
              </View>
              <View style={styles.section}>
                <Text>{country}</Text>
              </View>
              <View style={styles.section}>
                <Text>{destinations}</Text>
              </View>
              <Dropdown
                  style={styles.dropdown} data={favoriteFoods} labelField='label' valueField='value' placeholder='Your favorites food type'
                  placeholderStyle={'#000000'} renderItem={display} maxHeight={100} value={'Your favorites food'} iconColor='#000000'
              />
              <Dropdown
                  style={styles.dropdown} data={hobbies} labelField='label' valueField='value' placeholder='Your favorites types of hobbies'
                  placeholderStyle={'#000000'} renderItem={display} maxHeight={100} value={'Your favorites hobbies'} iconColor='#000000'
              />
              <Dropdown
                  style={styles.dropdown} data={hobbies} labelField='label' valueField='value' placeholder='Your favorites hobbies'
                  placeholderStyle={'#000000'} renderItem={display} maxHeight={100} value={'Your favorites hobbies'} iconColor='#000000'
              />
            </View>
            <View style={styles.bottom}>
              <View style={styles.btnContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleLogout()} style={styles.button}>
                  <Text style={styles.textBtn}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <Footer navigation={navigation}/>
      { showModal && <View style={styles.modal}>
          {form}
        </View> }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      justifyContent: "center",
      alignItems: "center",
  },
  gradient: {
    flex: 9,
    width: '100%',
    filter: 'blur(2px)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  header: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 15,
  },
  body: {
    flex: 8,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#A9A9A9',
    borderWidth: 2,
    borderRadius: 10,
  },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  icon: {
    flex: 3,
    marginTop: 5,
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    flex: 2,
    width: '90%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    borderRadius: 10,
    marginBottom: 5,
  },
  descText: {
    fontSize: 14,
    paddingLeft: 8,
  },
  main: {
    flex: 5,
    width: '90%',
    backgroundColor: '#FDFDFF',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#A9A9A9',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 10,
  },
  section: {
    flex: 1,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#AFBBE8',
    borderBottomColor: 'silver',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
  },
  dropdown: {
    width: '80%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#AFBBE8',
    borderBottomColor: 'silver',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
  bottom: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    width: '70%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    width: '40%',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  textBtn: {
    color: 'white',
  },
  view: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 32,
  },
  messageSection: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    marginLeft: 25,
  },
  edit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  foot: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  submitSection: {
    width: '80%',
    alignItems: 'center',
  },
  confirmBtn: {
    width: '40%',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  confirm: {
    color: 'white',
  },
  form: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
},
  show: {
      flex: 2,
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
  },
  selector: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingRight: 5,
  },
  selectorText: {
      color: '#FFFFFF'
  },
  list: {
      width: '100%',
  },
  field: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 10,
    paddingBottom: 8,
  },
  inputContainer: {
      width: '90%',
      flex: 2,
      justifyContent: 'center',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      paddingLeft: 8,
  },
  input: {
      color: '#FFFFFF',
  },
  error: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 8,
    backgroundColor: 'red',
  },
  errorText: {
    color: '#FFFFFF'
  }
});