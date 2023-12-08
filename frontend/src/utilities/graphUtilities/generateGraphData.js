export const getInitialDates = () => {
  const today = new Date();
  const currentDay = today.getDate();

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthDay = lastMonth.getDate();

  const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`;

  const lastMonthString = `${lastMonth.getFullYear()}-${(
    lastMonth.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${lastMonthDay.toString().padStart(2, "0")}`;

  return { today: todayString, lastMonth: lastMonthString };
};

function convertDateToMonth(date) {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function createDateFromFormat(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateToFormat(dateObject) {
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObject.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const countDaysBetweenDates = (startDate, endDate) => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const miliseconds = Math.abs(startDateObj - endDateObj);

  const days = Math.ceil(miliseconds / (1000 * 60 * 60 * 24));

  return days;
};

export const transactionsAggrPerDay = (
  transactions,
  startDateFormat,
  endDateFormat
) => {
  const days = [];
  let currentDate = createDateFromFormat(startDateFormat);
  const endDate = createDateFromFormat(endDateFormat);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate.getTime()));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const expensesAggregated = {};
  const incomesAggregated = {};

  const options = {
    // year: 'numeric',
    month: "long",
    day: "numeric",
  };

  for (const day of days) {
    const dayFormat = formatDateToFormat(day);
    const dayPolishFormat = day.toLocaleDateString("pl-PL", options);
    expensesAggregated[dayPolishFormat] = 0;
    incomesAggregated[dayPolishFormat] = 0;

    for (const transaction of transactions) {
      //const transactionDay = createDateFromFormat(transaction.transaction_date);

      if (dayFormat === transaction.transaction_date) {
        if (!transaction.is_income) {
          expensesAggregated[dayPolishFormat] -= Number(
            transaction.money_amount
          );
        } else if (transaction.is_income) {
          incomesAggregated[dayPolishFormat] += Number(
            transaction.money_amount
          );
        }
      }
    }
  }

  const expenses = {
    x: Object.keys(expensesAggregated),
    y: Object.values(expensesAggregated),
    marker: { color: "red" },
    name: "wydatki",
  };
  const incomes = {
    x: Object.keys(incomesAggregated),
    y: Object.values(incomesAggregated),
    marker: { color: "green" },
    name: "dochody",
  };

  return [expenses, incomes];
};

export const transactionsAggrPerCategory = (
  transactions,
  startDateFormat,
  endDateFormat
) => {
  let months = [];
  let currentDate = createDateFromFormat(startDateFormat);
  const endDate = createDateFromFormat(endDateFormat);
  const endMonthIndicator = endDate.getFullYear() * 12 + endDate.getMonth();

  while (
    currentDate.getFullYear() * 12 + currentDate.getMonth() <=
    endMonthIndicator
  ) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    months.push(`${year}-${month < 10 ? "0" : ""}${month}`);

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const expensesPerCategory = {};
  const incomesPerCategory = {};

  const initialMonths = {};
  for (const month of months) {
    initialMonths[month] = 0;
  }

  for (const transaction of transactions) {
    const transactionMonth = convertDateToMonth(transaction.transaction_date);
    if (transaction.is_income === false) {
      if (
        transaction.expense_category_details.category_name in
        expensesPerCategory
      ) {
        expensesPerCategory[transaction.expense_category_details.category_name][
          transactionMonth
        ] -= Number(transaction.money_amount);
      } else {
        expensesPerCategory[
          transaction.expense_category_details.category_name
        ] = {
          ...initialMonths,
        };
        expensesPerCategory[transaction.expense_category_details.category_name][
          transactionMonth
        ] = -Number(transaction.money_amount);
      }
    }
    if (transaction.is_income === true) {
      if (
        transaction.income_category_details.category_name in incomesPerCategory
      ) {
        incomesPerCategory[transaction.income_category_details.category_name][
          transactionMonth
        ] += Number(transaction.money_amount);
      } else {
        incomesPerCategory[transaction.income_category_details.category_name] =
          { ...initialMonths };
        incomesPerCategory[transaction.income_category_details.category_name][
          transactionMonth
        ] = Number(transaction.money_amount);
      }
    }
  }

  const expensesGraphData = [];
  const incomesGraphData = [];

  for (const category in expensesPerCategory) {
    expensesGraphData.push({
      x: Object.keys(expensesPerCategory[category]),
      y: Object.values(expensesPerCategory[category]),
      name: category,
      type: "bar",
    });
  }

  for (const category in incomesPerCategory) {
    incomesGraphData.push({
      x: Object.keys(incomesPerCategory[category]),
      y: Object.values(incomesPerCategory[category]),
      name: category,
      type: "bar",
    });
  }

  const result = { expensesGraphData, incomesGraphData };
  return result;
};

export const getBudgetAndExpensesPerMonth = (budget, transactions) => {
  const expenses = [];
  for (const transaction of transactions) {
    if (transaction.is_income === false) {
      expenses.push(transaction);
    }
  }

  const expensesPerCategory = {};

  for (const expense of expenses) {
    if (
      expense.expense_category_details.category_name in
      expensesPerCategory
    ) {
      expensesPerCategory[expense.expense_category_details.category_name] -=
        Number(expense.money_amount);
    } else {
      expensesPerCategory[expense.expense_category_details.category_name] =
        -Number(expense.money_amount);
    }
  }

  const expensesGraphData = {
    x: Object.keys(expensesPerCategory),
    y: Object.values(expensesPerCategory),
    name: "suma wydatków",
    type: "bar",
  };

  const budgetPerCategory = {};

  for (const category of budget.budget_categories) {
    budgetPerCategory[category.expense_category_details.category_name] = Number(
      category.money_amount
    );
  }

  const budgetGraphData = {
    x: Object.keys(budgetPerCategory),
    y: Object.values(budgetPerCategory),
    name: "budżet",
    type: "bar",
  };

  const graphData = [expensesGraphData, budgetGraphData];
  return graphData;
};
