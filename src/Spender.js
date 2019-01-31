import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableWithoutFeedback, Animated} from 'react-native';


export default class Spender extends React.Component {

  constructor(props){
    super(props);
    this.speed = 300;
    this.state={
      dimensions:undefined,
      remainingRadius:new Animated.Value(0),
    }
  }

  // componentDidUpdate(nextProps) {
  //   let displayedBudget = nextProps.budget;
  //   let displayedSpending = nextProps.spending;
  //   if(displayedSpending > displayedBudget) displayedSpending = displayedBudget;
  //   Animated.timing(this.state.remainingRadius, {
  //     toValue: ((displayedBudget-displayedSpending)/displayedBudget)||1,
  //     duration: 1000,
  //     useNativeDrive: true
  //   }).start();
  //   // this.setState({remainingRadius: Math.sqrt(area*(displayedBudget-displayedSpending)/displayedBudget/3.14)})
  // }

  increaseAmount = () => {
    if(this.props.spending<this.props.budget){
      var increment = this.props.budget/this.speed;
      if(this.speed > 80) this.speed -= 20;
      this.props.increaseAmount(increment);
      this.timer = setTimeout(this.increaseAmount, 1);
    }
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.speed = 300;
  }

  onLayout = event => {
    if (this.state.dimensions) return;
    let {width, height} = event.nativeEvent.layout;
    this.setState({dimensions: {width, height}});
  }

  render(){
    if (this.state.dimensions) {
      var { width, height } = this.state.dimensions;
    }else{
      var width= 200;
    }

    var diameter = Math.min(width*.9, height*.9);
    var area = 3.14*((diameter/2)**2);

    let factor = ((this.props.unit === "day") ? .7 : ((this.props.unit === "week") ? .85 : 1))
    let displayedBudget = this.props.budget;
    let displayedSpending = this.props.spending;
    if(displayedSpending > displayedBudget) displayedSpending = displayedBudget;
    
    let totalRadius = factor*Math.sqrt(area/3.14);
    let temporaryRadius = factor*Math.sqrt(area*(displayedBudget-displayedSpending-this.props.amount)/displayedBudget/3.14);
    let remainingRadius = factor*Math.sqrt(area*(displayedBudget-displayedSpending)/displayedBudget/3.14);
    // let remainingRadius = factor*this.state.remainingRadius._value;
    // let remainingRadius = this.state.remainingRadius.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [0, Math.sqrt(area/3.14)]
    // });
    // console.log(String(remainingRadius))
    // rr = factor*Math.sqrt(area*remainingRadius/3.14)

    if(totalRadius < 0 || isNaN(totalRadius)) totalRadius = 0;
    if(temporaryRadius < 0 || isNaN(temporaryRadius)) temporaryRadius = 0;
    if(remainingRadius < 0 || isNaN(remainingRadius)) remainingRadius = 0;


    return(
      <View style = {styles.middle} onLayout = {this.onLayout}>
        <TouchableWithoutFeedback delayPressIn={100} onPressIn = {this.increaseAmount} onPressOut = {this.stopTimer}>
          <View style={touchable(diameter)}>
            <View style = {[buttonStyle(totalRadius*2+16, 'rgba(0, 0, 0, .3)'), {borderWidth:4, borderColor:"#E7ECEF",}]}/>
            <View style = {[buttonStyle(remainingRadius*2, 'rgba(255, 255, 255, .7)'), {}]}/>
            <View style = {[buttonStyle(temporaryRadius*2, this.props.color), {elevation:6,}]}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const buttonStyle = (diameter, color)=>{
  return({
    width:diameter,
    height:diameter,
    borderRadius:diameter/2,
    backgroundColor: color,
    position:'absolute' 
  })
}

const touchable = (diameter)=>{
  return({
    width:diameter,
    height:diameter,
    alignItems: 'center', 
    justifyContent: 'center',
  })
}

const styles = StyleSheet.create({
  middle:{
    flex:4, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginVertical:20
  },
});






