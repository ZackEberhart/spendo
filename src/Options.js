import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';

export default class Options extends React.Component {

  constructor(props){
    super(props);
    this.speed = 500;
    this.state={
      income:0,
      bills:0,
    }
  }

  onChanged = (text) =>{
    let newText = '';
    let numbers = '0123456789';

    for (var i=0; i < text.length; i++) {
        if(numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i];
        }
    }
    this.setState({ income: Number(newText) });
  }

  numChange = (event) => {
    const { target: { name, value } } = event
    let newText = '';
    let numbers = '0123456789';

    for (var i=0; i < value.length; i++) {
        if(numbers.indexOf(value[i]) > -1 ) {
            newText = newText + value[i];
        }
    }
    this.setState({ [name]: Number(newText) })
  }

  const numInput = ({name, value}) => {
    return(
      <TextInput 
         style={styles.textInput}
         keyboardType='numeric'
         name={name}
         onChangeText={this.numChange}
         value={String(value)}
         maxLength={13}  //setting limit of input
      />
    );
  }

  render(){
    return(
      <View>
        {numInput({"income", this.state.income})}
        {numInput({"bills", this.state.bills})}
        <Button title="Submit" onPress={()=>this.props.setOptions(this.state)}/>
        <Button title="Reset Spending" onPress={this.props.resetSpending}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  middle:{
    flex:4, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
});
