from django.urls import path
from core.views import graph_views as views

urlpatterns = [
    path('transactions/', views.TrasactionList.as_view(), name='transactions_for_graphs'),
    path('budgets/', views.BudgetList.as_view(), name='budgets_for_graphs'),
    path('budgets-all/', views.BudgetsAll.as_view(), name='budgets_all'),
]
