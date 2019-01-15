import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';

export default class Spender extends React.Component {

  constructor(props){
    super(props);
    this.speed = 500;
    this.state={
      dimensions:undefined,
    }
  }

  increaseAmount = () => {
    var increment = this.props.budget/this.speed;
    if(this.speed > 200) this.speed -= 20;
    this.props.increaseAmount(increment);
    this.timer = setTimeout(this.increaseAmount, 1);
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.speed = 400;
  }

  render(){
    if (this.state.dimensions) {
      var { width, height } = this.state.dimensions;
    }else{
      var width= 200;
    }

    var diameter = Math.min(width*.9, height*.9);
    
    buttonStyle = {
      width:diameter,
      height:diameter,
      borderRadius:diameter/2,
      backgroundColor: 'green',
    };

    return(
      <View style = {styles.middle} onLayout = {this.onLayout}>
        <TouchableWithoutFeedback delayPressIn={40} onPressIn = {this.increaseAmount} onPressOut = {this.stopTimer}>
          <View style = {buttonStyle}/>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  onLayout = event => {
    if (this.state.dimensions) return;
    let {width, height} = event.nativeEvent.layout;
    this.setState({dimensions: {width, height}});
  }
}

const styles = StyleSheet.create({
  middle:{
    flex:4, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
});
