import { StyleSheet, Text, View, Image, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function LoginScreen({ navigation }) {
  
  const goToSignIn = () => {
    navigation.navigate('SignIn');
  }

  const handleSubmit = () => {
    navigation.navigate('Register')
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trippers</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.message}>Connection to your account</Text>
        </View>
        <View style={styles.main}>
          <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
            <Text style={styles.btnText}><FontAwesome name={'apple'} size={20} color={'#FFFFFF'}/> Continue with apple</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
            <Text style={styles.btnText}><FontAwesome name={'google'} size={20} color={'#FFFFFF'}/> Continue with google</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
            <Text style={styles.btnText}><FontAwesome name={'facebook-square'} size={20} color={'#FFFFFF'}/> Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => goToSignIn()}>
            <Text style={styles.btnText}><FontAwesome name={'at'} size={20} color={'#FFFFFF'}/> Continue with your email</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => handleSubmit()}>
            <Text style={styles.register}>Not registered yet ?</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#96D3E8',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 48,
    color: '#1AB4E7'
  },
  body: {
    flex: 3,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
  main: {
    flex: 1,
    width: '80%',
  },
  btn: {
    backgroundColor: 'black',
    padding: 8,
    margin: 5,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    textAlign: 'center'
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  register: {
    color: '#959FA3',
    fontSize: 16
  },
});
