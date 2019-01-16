import React from 'react';
import {Font} from 'expo';
import { Dimensions, TextInput, Animated, Alert, TouchableNativeFeedback, Keyboard, StyleSheet, Button, Text, ScrollView, View, TouchableWithoutFeedback} from 'react-native';
import Swiper from 'react-native-swiper';
import Spender from './src/Spender.js';
import Options from './src/Options.js'
import * as h from './src/Helpers.js';


//TODO
//Options
//Monitor Day
//Save values
//Change circle size
//Animations etc.

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      fontLoaded:false,
      income:0,
      bills:0,
      amount:0,
      spendingMonth: 0,
      spendingWeek: 0,
      spendingDay: 0,
      budgetMonth: 0,
      budgetWeek: 0,
      budgetDay: 0,
      unit: "day",
      backgroundColor: new Animated.Value(0),
      weeksLeft: h.weeksLeftInMonth(h.firstDayOfMonth()),
      previousDate: h.today(),
      targetDate: h.firstDayOfMonth(),
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      'Arial': require('./assets/Arial.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  // componentDidMount(){
  //   this.monitorDay();
  //   this.timerID = setInterval(() => this.monitorDay(), 10000);
  //   this.hydrateStateWithLocalStorage();
  //   window.addEventListener(
  //     "beforeunload",
  //     this.saveStateToLocalStorage.bind(this)
  //   );    
  // } 

  // componentWillUnmount(){
  //   clearInterval(this.timerID);
  //   window.removeEventListener(
  //     "beforeunload",
  //     this.saveStateToLocalStorage.bind(this)
  //   );
  //   this.saveStateToLocalStorage();
  // } 

  // hydrateStateWithLocalStorage(){
  //   for (let key in this.state) {
  //     if (localStorage.hasOwnProperty(key)) {
  //       let value = localStorage.getItem(key);
  //       try {
  //         value = JSON.parse(value);
  //         this.setState({ [key]: value });
  //       } catch (e) {
  //         this.setState({ [key]: value });
  //       }
  //     }
  //   }
  // }

  // saveStateToLocalStorage() {
  //   for (let key in this.state) {
  //     localStorage.setItem(key, JSON.stringify(this.state[key]));
  //   }
  // }

  // monitorDay(){
  //   if(this.state.previousDate !== h.today()){
  //     this.newDay();
  //   }
  // }

  /********Callbacks*********/ 

  setOptions = (optionsState) =>{
    this.setState(optionsState);
    this.setState(h.calculateBudgetMonth);
    this.setState(h.calculateBudgetWeek);
    this.setState(h.calculateBudgetDay);
    // this.saveStateToLocalStorage();
    this.setState({spendingWeek: 0,spendingDay: 0});
  }

  newDay(){
    if(h.daysLeftInMonth(this.state.targetDate) <= 0){
      this.setState((state) => ({
        savings: state.savings + h.remaining(state.budgetMonth, state.spendingMonth),
        spendingMonth: 0,
        spendingWeek: 0,
        spendingDay: 0,
        targetDate: h.firstDayOfMonth(),
        weeksLeft: h.weeksLeftInMonth(h.firstDayOfMonth())
      }));
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay);
    }else if(h.weeksLeftInMonth(this.state.targetDate) < this.state.weeksLeft){
      this.setState({
        spendingDay: 0, 
        spendingWeek: 0,
        weeksLeft: h.weeksLeftInMonth(this.state.targetDate)
      });
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay);
    }else{
      this.setState({
        spendingDay: 0
      });
      this.setState(h.calculateBudgetDay);
    }
    this.setState({previousDate: h.today()});
  }

  updateBG = (curr, next) =>{
    this.setState({ backgroundColor: new Animated.Value(curr)}, () => {
       Animated.timing(this.state.backgroundColor, {
        toValue: next,
        duration: 200,
      }).start();
    });
  }

  changeUnit = (e, state, context) => {
    var curr = this.state.backgroundColor._value;
    switch(state.index){
      case 0:
        ((this.state.unit==="week")?this.updateBG(curr,0):this.updateBG(curr,100));
        this.setState({unit:"day"});
        break;
      case 1: 
        ((this.state.unit==="day")?this.updateBG(0, 33):this.updateBG(curr, 33));
        this.setState({unit:"week"});
        break;
      case 2:
        ((this.state.unit==="day")?this.updateBG(100,66):this.updateBG(curr,66));
        this.setState({unit:"month"});
        break;
    }
  }

  resetSpending = () => {
    this.setState((state) => ({
        spendingMonth: 0,
        spendingWeek: 0,
        spendingDay: 0,
      }));
  }

  spend = () => {
    var amount = this.state.amount;
    var unit = this.state.unit;
    var amountRemaining;
    if(unit === "day"){
      amountRemaining = h.remaining(this.state.budgetDay, this.state.spendingDay);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState((state) => ({spendingWeek: state.spendingWeek + amount}));
      this.setState((state) => ({spendingDay: state.spendingDay + amount}));
    }else if (unit === "week") {
      amountRemaining = h.remaining(this.state.budgetWeek,this.state.spendingWeek);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState((state) => ({spendingWeek: state.spendingWeek + amount}));
      this.setState(h.calculateBudgetDay);
    }else if (unit === "month"){
      amountRemaining = h.remaining(this.state.budgetMonth, this.state.spendingMonth);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay);
    }
    this.setState({amount:0});
  }

  increaseAmount = (increment) => {
    this.setState((state) => ({
      amount:this.state.amount + increment
    }));
  }

  cancel = () => {
    this.setState({amount:0});
  }

  getBudget = () => {
    switch(this.state.unit){
      case "day":
        return this.state.budgetDay;
        break;
      case "week":
        return this.state.budgetWeek;
        break;
      case "month":
        return this.state.budgetMonth;
        break;
    }
  }

  getSpending = () => {
    switch(this.state.unit){
      case "day":
        return this.state.spendingDay;
        break;
      case "week":
        return this.state.spendingWeek;
        break;
      case "month":
        return this.state.spendingMonth;
        break;
    }
  }

  spender = (unit, budget, spending) => {
      return(
        <Spender unit={unit} budget={budget} spending={spending} targetDate={this.state.targetDate} increaseAmount={this.increaseAmount}/>
      )
  };

  render() {
    if (!this.state.fontLoaded) return null;

    var color = this.state.backgroundColor.interpolate({
      inputRange: [0, 33, 66, 100],
      outputRange: ["#B7E2C1", "#EFDABF", "#EAF2B5", "#B7E2C1"]
    });

    return (
      <Swiper loop={false} showsPagination={false} onMomentumScrollEnd={()=>Keyboard.dismiss()}>
        <Animated.View style={[styles.container,{backgroundColor:color}]}>
          <View style={{flex:2}}/>
          <View style={styles.edge}>
            <Text style={styles.text}>The unit is {this.state.unit}</Text>
            <Text style={styles.text}> You have ${Math.round(h.remaining(this.getBudget(), this.getSpending()))} left</Text>
          </View>
          <View  style = {styles.middle}>
            <Swiper onMomentumScrollEnd ={this.changeUnit} containerStyle={styles.containerStyle} showsPagination={false}>
              {this.spender("day", this.state.budgetDay, this.state.spendingDay)}
              {this.spender("week", this.state.budgetWeek, this.state.spendingWeek)}
              {this.spender("month", this.state.budgetMonth, this.state.spendingMonth)}
            </Swiper>
          </View>
          <View style={styles.edge}>
            <TouchableNativeFeedback onPress={this.spend}onLongPress={this.cancel}background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={styles.button}>
                <Text style={[styles.text, styles.buttonText]}>Spend ${Math.round(this.state.amount)}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{flex:1}}/>
        </Animated.View>
        <View style={styles.container}>      
          <Options setOptions={this.setOptions} resetSpending={this.resetSpending} income={this.state.income} bills={this.state.bills}/>
        </View>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({

  edge:{
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor:'#8EB1C7'
  },
  middle:{
    flex:12, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  containerStyle:{ 
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  button:{
    width:'90%',
    height:'90%',
    borderRadius:4,
    // borderWidth: 3,
    // borderColor: '#',
    backgroundColor: '#11B27F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize:30,
    color:'#11B27F',
    fontWeight:'bold',
  },
  buttonText:{
    color:'white',
    fontSize:20,
  }
});
