import { Container } from "react-bootstrap";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserHomeScreen from "./screens/UserHomeScreen";
import TransactionsListScreen from "./screens/TransactionListScreen";
import TransactionScreen from "./screens/TransactionScreen";
import TransactionUpdateScreen from "./screens/TransactionUpdateScreen";
import TransactionCreateScreen from "./screens/TransactionCreateScreen";
import TransactionCategoryListScreen from "./screens/TransactionCategoryListScreen";
import BudgetCreateScreen from "./screens/BudgetCreateScreen";
import BudgetListScreen from "./screens/BudgetListScreen";
import BudgetUpdateScreen from "./screens/BudgetUpdateScreen";
import ProfileScreen from "./screens/ProfileScreen";
import GraphTransactionsPerCategory from "./screens/GraphTransactionsPerCategory";
import GraphBudgetPerMonth from "./screens/GraphBudgetPerMonth";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-5">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/user-home" element={<UserHomeScreen />} />
            <Route path="/transactions" element={<TransactionsListScreen />} />
            <Route path="/transactions/:id" element={<TransactionScreen />} />
            <Route path="/transactions/:id/update" element={<TransactionUpdateScreen />} />
            <Route path="/transactions/create" element={<TransactionCreateScreen />} />
            <Route path="/transactions/categories" element={<TransactionCategoryListScreen />} />
            <Route path="/budgets/create" element={<BudgetCreateScreen />} />
            <Route path="/budgets" element={<BudgetListScreen />} />
            <Route path="/budgets/:id/update" element={<BudgetUpdateScreen />} />
            <Route path="/graphs/transactions-per-category" element={<GraphTransactionsPerCategory />} />
            <Route path="/graphs/budget-per-month" element={<GraphBudgetPerMonth />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;