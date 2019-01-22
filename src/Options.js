import React from 'react';
import { TextInput, Keyboard, TouchableHighlight, AsyncStorage,
          KeyboardAvoidingView, StyleSheet, Text, View, ScrollView, Button
       } from 'react-native';
import Isao from '../assets/Isao.js'
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

export default class Options extends React.Component {

  constructor(props){
    super(props);
    this.changed = false;
    this.state={
      income: "",
      bills:"",
    }
  }

  componentWillReceiveProps(nextProps) {
    for(let prop in nextProps){
      if (nextProps[prop] !== this.state[prop] && nextProps[prop] !== 0) {
        this.setState({ [prop]: nextProps[prop] });
      }
    }
  }

  numChange = (name, value) => {
    let newText = '';
    let numbers = '0123456789+-';

    for (var i=0; i < value.length; i++) {
        if(numbers.indexOf(value[i]) > -1 ) {
            newText = newText + value[i];
        }
    } 
    // this.setState({[name]: ((newText=="") ? 0 : Number(newText))});
    this.setState({[name]:newText});
  }

  numInput = (field) => {
    return(
      <Isao 
         keyboardType='phone-pad'
         label={field.charAt(0).toUpperCase() + field.slice(1)}
         labelStyle={{fontFamily:"System", color:"#"}}
         activeColor={'#E7ECEF'}
         passiveColor={'#191308'}
         placeholder="0"
         onChangeText={text => this.numChange(field, text)}
         value={String(this.state[field])}
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
    this.props.setOptions()
    // this.props.resetSpending()
  }

  render(){
    return(
      <View style={styles.options}>
        <View style={styles.column}>
          {this.numInput('income')}
          {this.numInput('bills')}
          <Text style={{color:'#191308', fontSize:25, fontWeight:"bold"}}>Monthly Budget:{' '} 
            <Text style={{color:'#E7ECEF'}}>
              ${addbits(this.props.income)-addbits(this.props.bills)}
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
          <TouchableHighlight onPress={()=>AsyncStorage.clear()} style={[styles.buttonStyle, {backgroundColor: '#883B3B'}]}>
            <Text style={styles.btext} >DELETE STORAGE</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

function addbits(s) {
  return Number((String(s).replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || [0])
      .reduce(function(sum, value) {
      return parseFloat(sum) + parseFloat(value);
  }));
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
    color:'#E7ECEF',
    fontWeight:'bold',
  },

  row:{
    alignItems:'stretch',
    flexDirection:'row',
  },
  
});
