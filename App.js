import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import Swiper from 'react-native-swiper';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      income:0,
      bills:0,
      dimensions:undefined,
    };
  }

  increaseIncome = () => {
    this.setState({income: this.state.income+1});
    this.timer = setTimeout(this.increaseIncome, 1);
  }

  stopTimer = () => {
    clearTimeout(this.timer);
  }

  render() {
    if (this.state.dimensions) {
      var { width, height } = this.state.dimensions
    };

    const buttonStyle = {
      width:width,
      height:width,
      borderRadius:width/2,
      backgroundColor: 'green',
    };

    return (
      <View style={styles.container} onLayout = {this.onLayout}>
        <Swiper>
          <View style = {{flex:1}}>
            <View style={{
              flex:2, 
              alignItems: 'center', 
              justifyContent: 'center',
            }}>
              <Text>{this.state.income-this.state.bills}</Text>
            </View>
            <View style={{
              flex:4, 
              alignItems: 'center', 
              justifyContent: 'center', 
            }}>
              <TouchableWithoutFeedback onPressIn = {this.increaseIncome} onPressOut = {this.stopTimer}>
                <View style = {buttonStyle}/>
              </TouchableWithoutFeedback>
            </View>
            <View style={{flex:2,}}/>
          </View>
          <View style={styles.container}/>
        </Swiper>
      </View>
    );
  }

  onLayout = event => {
    if (this.state.dimensions) return; // layout was already called
    let {width, height} = event.nativeEvent.layout;
    this.setState({dimensions: {width, height}});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'powderblue',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttonStyle:{
    width:100,
    height:100,
    borderRadius:100/2,
    backgroundColor: 'green',
  }
});
