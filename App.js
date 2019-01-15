import React from 'react';
import { Dimensions, TextInput, Alert, StyleSheet, Button, Text, View, TouchableWithoutFeedback} from 'react-native';
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
      weeksLeft: h.weeksLeftInMonth(h.firstDayOfMonth()),
      previousDate: h.today(),
      targetDate: h.firstDayOfMonth(),
    };
  }

  componentDidMount(){
  //   this.monitorDay();
  //   this.timerID = setInterval(() => this.monitorDay(), 10000);
  //   this.hydrateStateWithLocalStorage();
  //   window.addEventListener(
  //     "beforeunload",
  //     this.saveStateToLocalStorage.bind(this)
  //   );    
  } 

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

  resetSpending = () => {
    this.setState((state) => ({
        spendingMonth: 0,
        spendingWeek: 0,
        spendingDay: 0,
      }));
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

  changeUnit = (e, state, context) => {
    switch(state.index){
      case 0:
        this.setState({unit:"day"});
        break;
      case 1: 
        this.setState({unit:"week"});
        break;
      case 2:
        this.setState({unit:"month"});
        break;
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

  cancel = () => {
    this.setState({amount:0});
  }

  increaseAmount = (increment) => {
    this.setState((state) => ({
      amount:this.state.amount + increment
    }));
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

  spender = ({unit, budget, spending}) => {
      <Spender unit={unit} budget={budget} spending={spending} targetDate={this.state.targetDate} increaseAmount={this.increaseAmount}/>
  };

  render() {
    return (
      <Swiper>
        <View style={styles.container}>
          <Options setOptions={this.setOptions} resetSpending={this.resetSpending}/>
        </View>
        <View style={styles.container}>
          <View style={styles.edge}>
            <Text>The unit is {this.state.unit}</Text>
            <Text> You have ${Math.round(h.remaining(this.getBudget(), this.getSpending()))} left</Text>
          </View>
          <View  style = {styles.middle}>
            <Swiper onMomentumScrollEnd ={this.changeUnit} containerStyle={styles.containerStyle} showsPagination={false}>
              <Spender unit="Day" budget={this.state.budgetDay} spending={this.state.spendingDay} targetDate={this.state.targetDate} increaseAmount={this.increaseAmount}/>
              <Spender unit="Week" budget={this.state.budgetWeek} spending={this.state.spendingWeek} targetDate={this.state.targetDate} increaseAmount={this.increaseAmount}/>
              <Spender unit="Month" budget={this.state.budgetMonth} spending={this.state.spendingMonth} targetDate={this.state.targetDate} increaseAmount={this.increaseAmount}/>
            </Swiper>
          </View>
          <View style={styles.edge}>
            <Text> Amount is ${Math.round(this.state.amount)} </Text>
            <Button title="Spend" onPress={this.spend}/>
            <Button title="Cancel" onPress={this.cancel}/>
          </View>
        </View>
      </Swiper>
    );
  }
}

 // {spender("day", this.state.budgetDay, this.state.spendingDay)}
 //              {spender("week", this.state.budgetWeek, this.state.spendingWeek)}
 //              {spender("month", this.state.budgetMonth, this.state.spendingMonth)}

const styles = StyleSheet.create({
  edge:{
    flex:2, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'powderblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle:{
    flex:4, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  containerStyle:{ 
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
