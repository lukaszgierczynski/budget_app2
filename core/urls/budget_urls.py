from django.urls import path
from core.views import budget_views as views

urlpatterns = [
    path('', views.BudgetList.as_view(), name='budget_list'),
    path('<str:pk>/', views.BudgetDetail.as_view(), name='budget_detail'),
]
