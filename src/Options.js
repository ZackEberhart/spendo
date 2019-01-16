import React from 'react';
import { TextInput, Keyboard, TouchableHighlight, KeyboardAvoidingView, StyleSheet, Text, View, ScrollView, Button} from 'react-native';
import Isao from '../assets/Isao.js'
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

export default class Options extends React.Component {

  constructor(props){
    super(props);
    this.speed = 500;
    this.state={
      income:"",
      bills:"",
      budget:""
    }
  }

  numChange = (name, value) => {
    let newText = '';
    let numbers = '0123456789';

    for (var i=0; i < value.length; i++) {
        if(numbers.indexOf(value[i]) > -1 ) {
            newText = newText + value[i];
        }
    }
    this.setState({[name]: ((newText=="") ? newText : Number(newText))});
  }

  numInput = (field) => {
    return(
      <Isao 
         keyboardType='phone-pad'
         label={field.charAt(0).toUpperCase() + field.slice(1)}
         labelStyle={{fontFamily:"System", color:"white"}}
         activeColor={'#3b5988'}
         passiveColor={'#ffffff'}
         onChangeText={text => this.numChange(field, text)}
         value={String(this.state[field])}
         maxLength={13}  //setting limit of input
         style={{marginBottom:20}}
      />
    );
  }

  submit = () => {
    Keyboard.dismiss();
    this.props.setOptions(this.state)
  }

  resetSpending = () => {
    Keyboard.dismiss()
    this.props.resetSpending()
  }

  render(){
    return(
      <View style={styles.options}>
        <View style={styles.column}>
          {this.numInput('income')}
          {this.numInput('bills')}
          <Text style={{color:'#3b5988', fontSize:25, fontWeight:"bold"}}>Monthly Budget:{' '} 
            <Text style={{color:'white'}}>
              ${this.props.income-this.props.bills}
            </Text>
          </Text>
        </View>
        <View />
        <View style={styles.column}>
          
          <TouchableHighlight onPress={this.submit} style={styles.buttonStyle}>
            <Text style={styles.btext}>SUBMIT</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.resetSpending} style={styles.buttonStyle}>
            <Text style={styles.btext} >RESET SPENDING</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  options: {
    marginHorizontal:20,
    alignItems:'stretch',
  },

  column:{
    alignItems:'stretch',
    marginVertical:30,
  },

  buttonStyle:{
    marginVertical:10,
    height:40,
    borderRadius:4,
    width:'50%',
    backgroundColor: '#3B5988',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btext:{
    color:'white',
    fontWeight:'bold',
  },

  row:{
    alignItems:'stretch',
    flexDirection:'row',
  },
  
});
