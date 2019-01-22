import React from 'react';
import {Font} from 'expo';
import { 
          Dimensions, TextInput, Animated, Alert, TouchableNativeFeedback, 
          Keyboard, StyleSheet, Button, Text, ScrollView, View, 
          TouchableWithoutFeedback, AsyncStorage, AppState, Vibration, Easing
       } from 'react-native';
import Swiper from 'react-native-swiper';
import Spender from './src/Spender.js';
import Options from './src/Options.js'
import * as h from './src/Helpers.js';


//TODO
//Make circle anim smooth
//Make circle big/small anim
//Real Options

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loaded:false,
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
      textColor: new Animated.Value(0),
      weeksLeft: h.weeksLeftInMonth(h.firstDayOfMonth()),
      previousDate: h.today(),
      targetDate: h.firstDayOfMonth(),
    };
  }

  async componentDidMount(){
    this.hydrateStateWithLocalStorage();
    this.monitorDay();
    AppState.addEventListener('change', this.monitorDay);
  } 

  hydrateStateWithLocalStorage = async() =>{
    let newState={'loaded':true}
    AsyncStorage.getAllKeys((err, keys)=>{
      intersection = store.filter(value => -1 !== keys.indexOf(value));
      AsyncStorage.multiGet(intersection, (err, stores) => {
        stores.map((result, i, item) => {
          let key = item[i][0];
          let value = JSON.parse(item[i][1]);
          newState[key]=value
        });
        this.setState(newState)
      })
    })
  }

  setStateAndSave = async(dict) =>{
    this.setState(dict)
    AsyncStorage.multiSet(Object.keys(dict).map((key)=>{
       return [key, JSON.stringify(dict[key])]
    }))
  }

  saveStore = async =>{
    AsyncStorage.multiSet(store.map((item)=>{
      return [item, JSON.stringify(this.state[item])]
    }))
    // console.log(store.map((item)=>{
    //   return [item, JSON.stringify(this.state[item])]
    // }))
  }

  monitorDay = () =>{
    if(this.state.previousDate !== h.today()){
      this.newDay();
    }
  }

  /********Callbacks*********/ 

  newDay(){
    this.setState({previousDate: h.today()});
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
      this.setState(h.calculateBudgetDay, this.saveStore);
    }else if(h.weeksLeftInMonth(this.state.targetDate) < this.state.weeksLeft){
      this.setState((state) => ({
        spendingDay: 0, 
        spendingWeek: 0,
        weeksLeft: h.weeksLeftInMonth(this.state.targetDate)
      }));
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay, this.saveStore);
    }else{
      this.setState((state) => ({
        spendingDay: 0
      }));
      this.setState(h.calculateBudgetDay, this.saveStore);
    }
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
      this.setState((state) => ({spendingDay: state.spendingDay + amount}), this.saveStore);
    }else if (unit === "week") {
      amountRemaining = h.remaining(this.state.budgetWeek,this.state.spendingWeek);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState((state) => ({spendingWeek: state.spendingWeek + amount}));
      this.setState(h.calculateBudgetDay, this.saveStore);
    }else if (unit === "month"){
      amountRemaining = h.remaining(this.state.budgetMonth, this.state.spendingMonth);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay, this.saveStore);
    }
    this.setState((state)=>({amount:0}));
    this.updateText(this.state.textColor._value, 0, 0)
  }

  setOptions = (optionsState) =>{
    this.setState(optionsState);
    this.resetSpending();
    this.setState(h.calculateBudgetMonth);
    this.setState(h.calculateBudgetWeek);
    this.setState(h.calculateBudgetDay, this.saveStore);
  }

  resetSpending = () => {
    this.setState({
        spendingMonth: 0,
        spendingWeek: 0,
        spendingDay: 0,
      }, this.saveStore);
  }

  increaseAmount = (increment) => {
    if( this.state.amount===0 && h.remaining(this.getBudget(),this.getSpending())>0){
      this.updateText(this.state.textColor._value, 100, 200)
    }
    this.setState({
      amount:this.state.amount + increment
    });
  }

  cancel = () => {
    Vibration.vibrate(50)
    this.setState({amount:0});
    this.updateText(this.state.textColor._value, 0, 0)
  }

  changeUnit = async(e, state, context) => {
    var curr = this.state.backgroundColor._value;
    switch(state.index){
      case 0:
        ((this.state.unit==="week")?this.updateBG(curr,0):this.updateBG(curr,100));
        await this.setState({unit:"day"});
        break;
      case 1: 
        ((this.state.unit==="day")?this.updateBG(0, 33):this.updateBG(curr, 33));
        await this.setState({unit:"week"});
        break;
      case 2:
        ((this.state.unit==="day")?this.updateBG(100,66):this.updateBG(curr,66));
        await this.setState({unit:"month"});
        break;
    }
    if( this.state.amount>0 && h.remaining(this.getBudget(),this.getSpending())>0){
      this.updateText(this.state.textColor._value, 100, 0)
    }else{
      this.updateText(this.state.textColor._value, 0, 0)
    }
  }

  updateBG = (curr, next) =>{
    this.setState({ backgroundColor: new Animated.Value(curr)}, () => {
       Animated.timing(this.state.backgroundColor, {
        toValue: next,
        duration: 200,
        useNativeDrive: true,

      }).start();
    });
  }

  updateText = (curr, next, speed) =>{
    this.setState({ textColor: new Animated.Value(curr)}, () => {
       Animated.timing(this.state.textColor, {
        toValue: next,
        duration: speed,
        useNativeDrive: true
      }).start();
    });
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

  spender = (unit, budget, spending, color) => {
      return(
        <Spender unit={unit} budget={budget} spending={spending} color={color} amount={this.state.amount} targetDate={this.state.targetDate} increaseAmount={this.increaseAmount}/>
      )
  };

  render() {
    if(!this.state.loaded){
      return null
    }
    var bgcolor = this.state.backgroundColor.interpolate({
      inputRange: [0, 33, 66, 100],
      outputRange: ["#11B27F", "#118AB2", "#7C77B9", "#11B27F"]
    });

    var buttoncolor = this.state.backgroundColor.interpolate({
      inputRange: [0, 33, 66, 100],
      outputRange: ["#196E51", "#0F5F87", "#555384", "#196E51"]
    });

    var textcolor = this.state.textColor.interpolate({
      inputRange: [0, 100],
      outputRange: ["rgba(0, 0, 0, .3)", "#E7ECEF"]
    });

    return (
      <Swiper loop={false} showsPagination={false} onMomentumScrollEnd={()=>Keyboard.dismiss()}>
        <Animated.View style={[styles.container,{backgroundColor:bgcolor}]}>
          <View style={{flex:3}}/>
          <View style={styles.edge}>
            <Text style={[styles.text, {fontSize:60}]}>${Math.round(h.remaining(this.getBudget(), this.getSpending()))}</Text>
            {this.state.unit==='day'?(
              <Text style={styles.text}> for the rest of the day</Text>
            ):(
              <Text style={styles.text}> for the next {this.state.unit==='week' ? h.daysLeftInWeek(this.state.targetDate) : h.daysLeftInMonth(this.state.targetDate)} days</Text>
            )}
          </View>
          <View  style = {styles.middle}>
            <Swiper onMomentumScrollEnd ={this.changeUnit} containerStyle={styles.containerStyle} showsPagination={false}>
              {this.spender("day", this.state.budgetDay, this.state.spendingDay, "#11B27F")}
              {this.spender("week", this.state.budgetWeek, this.state.spendingWeek, "#118AB2")}
              {this.spender("month", this.state.budgetMonth, this.state.spendingMonth, "#7C77B9")}
            </Swiper>
          </View>
          <View style={styles.edge}>
            <TouchableNativeFeedback onPress={this.spend}onLongPress={this.cancel}background={TouchableNativeFeedback.SelectableBackground()}>
              <Animated.View style={[styles.button, {backgroundColor:buttoncolor}]}>
                <Animated.Text style={[styles.text, {fontSize: 40, color:textcolor}]}>${Math.round(Math.min(this.state.amount, h.remaining(this.getBudget(), this.getSpending())))}</Animated.Text>
              </Animated.View>
            </TouchableNativeFeedback>
          </View>
          <View style={{flex:2}}/>
        </Animated.View>
        <Animated.View style={[styles.container,{backgroundColor:bgcolor}]}>
          <Options setOptions={this.setOptions} resetSpending={this.resetSpending} income={this.state.income} bills={this.state.bills}/>
        </Animated.View>
      </Swiper>
    );
  }
}

const store = ['income', 'bills', 'spendingDay', 'spendingWeek', 'spendingMonth', 'budgetDay', 'budgetWeek', 'budgetMonth', 'previousDate', 'targetDate']

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
    backgroundColor:'#3993DD'
  },
  middle:{
    flex:14, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  containerStyle:{ 
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  button:{
    width:'60%',
    height:'100%',
    borderRadius:5,
    backgroundColor: '#10694E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation:3,
  },
  text:{
    fontSize:20,
    color:'#E7ECEF',
    fontWeight:'bold',
  },
});







