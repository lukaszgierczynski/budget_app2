from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ExpenseCategory(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    is_predefined = models.BooleanField(default=False, null=False)
    category_name = models.CharField(max_length=200, null=False)

    def __str__(self):
        return self.category_name


class IncomeCategory(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    is_predefined = models.BooleanField(default=False, null=False)
    category_name = models.CharField(max_length=200, null=False)

    def __str__(self):
        return self.category_name

def get_expenses_no_category():
    return ExpenseCategory.objects.get_or_create(category_name="brak kategorii")[0]


def get_incomes_no_category():
    return IncomeCategory.objects.get_or_create(category_name="brak kategorii")[0]

class Transaction(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    expense_category = models.ForeignKey(ExpenseCategory, on_delete=models.SET(get_expenses_no_category), null=True)
    is_income = models.BooleanField(default=False, null=False)
    income_category = models.ForeignKey(IncomeCategory, on_delete=models.SET(get_incomes_no_category), null=True)
    money_amount = models.DecimalField(max_digits=12, decimal_places=2, null=False)
    transaction_name = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True)
    transaction_date = models.DateField(null=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    modified_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.transaction_name

class Budget(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)

    def __str__(self):
        return str(self.user.username) + "-" + str(self.start_date) + "-" + str(self.end_date)


class BudgetCategory(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET(get_expenses_no_category), null=False)
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, null=False)
    money_amount = models.DecimalField(max_digits=12, decimal_places=2, null=False)
    
    def __str__(self):
        return str(self.category) + "-" + str(self.budget)


class AccountStatement(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, null=True)
    account_balance = models.DecimalField(max_digits=12, decimal_places=2, null=False)

    def __str__(self):
        return str(self.user.username) + "-" + str(self.transaction)
