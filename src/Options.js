import React from 'react';
import { TextInput, StyleSheet, Text, View, Button} from 'react-native';

export default class Options extends React.Component {

  constructor(props){
    super(props);
    this.speed = 500;
    this.state={
      income:0,
      bills:0,
      aahhh:'snake'
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
    // const { target: { name, value } } = event
    // let newText = '';
    // let numbers = '0123456789';

    // for (var i=0; i < value.length; i++) {
    //     if(numbers.indexOf(value[i]) > -1 ) {
    //         newText = newText + value[i];
    //     }
    // }
    this.setState({aahhh: event.target.value })
  }

  numInput = (e) => {
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
        <Text>{this.state.aahhh}</Text>
        <TextInput 
           style={styles.textInput}
           keyboardType='numeric'
           name='income'
           onChangeText={e => this.numChange(e)}
           value={String(this.state.income)}
           maxLength={13}  //setting limit of input
        />
        <TextInput 
           style={styles.textInput}
           keyboardType='numeric'
           name='bills'
           onChangeText={e => this.numChange(e)}
           value={String(this.state.bills)}
           maxLength={13}  //setting limit of input
        />
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
