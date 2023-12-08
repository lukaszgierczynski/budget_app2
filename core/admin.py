from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Transaction)
admin.site.register(IncomeCategory)
admin.site.register(ExpenseCategory)
admin.site.register(Budget)
admin.site.register(BudgetCategory)
admin.site.register(AccountStatement)
