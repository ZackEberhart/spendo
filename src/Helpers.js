/**************Helper export Functions**********/

export function sum(total, num){
  return total+num;
}

export function remaining(budget, spending){
  return spending > budget ? 0 : budget - spending;
}

export function dateToString(date){
  return date.toISOString().substr(0, 10);
}

export function today(){
  return dateToString(new Date());
}

export function firstDayOfMonth(){
  var date = new Date();
  return dateToString(new Date(date.getFullYear(), date.getMonth() + 1, 1));
}

export function daysLeftInMonth(targetDate){
  var startDate = new Date();
  var endDate = new Date(targetDate);
  var timeDiff = endDate.getTime() - startDate.getTime();
  var daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}

export function weeksLeftInMonth(targetDate){
  var daysDiff = daysLeftInMonth(targetDate);
  return Math.ceil(daysDiff / 7);
}

export function daysLeftInWeek(targetDate){
  var daysDiff = daysLeftInMonth(targetDate);
  return daysDiff - ((weeksLeftInMonth(targetDate) - 1) * 7 );
}

export function calculateBudgetMonth(state){
  return {budgetMonth: state.income - state.bills};
}

export function calculateBudgetWeek(state){
  return {budgetWeek: (state.budgetMonth - state.spendingMonth + state.spendingWeek) / weeksLeftInMonth(state.targetDate)};
}

export function calculateBudgetDay(state){
  return {budgetDay: (state.budgetWeek - state.spendingWeek + state.spendingDay) / daysLeftInWeek(state.targetDate)};
}