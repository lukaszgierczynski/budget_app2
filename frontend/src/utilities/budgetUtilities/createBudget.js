import { formatDateToFormat } from "../graphUtilities/generateGraphData";

export function getFirstAndLastDayOfMonth(month, year) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
  
    const firstDayFormat = formatDateToFormat(firstDay);
    const lastDayFormat = formatDateToFormat(lastDay);
     
    return {firstDayFormat, lastDayFormat};
  }

  export function getBudgetYears() {
    const currentYear = new Date().getFullYear();
    const numberOfYears = 10;
    const years = [];
  
    for (let i = currentYear - numberOfYears; i <= currentYear + numberOfYears; i++) {
      years.push(i);
    }
  
    return years.reverse();
  }

  export const getMonthsAlreadyWithBudget = (budgets) => {
    const monthsAlreadyWithBudget = [];
    for (const budget of budgets) {
        monthsAlreadyWithBudget.push(budget.start_date.substring(0, 7));
    }

    return monthsAlreadyWithBudget;
  }
  