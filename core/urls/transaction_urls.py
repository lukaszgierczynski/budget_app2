from django.urls import path
from core.views import transaction_views as views

urlpatterns = [
    path('income_category/create/', views.IncomeCategoryCreate.as_view(), name='income_category_create'),
    path('income_category/delete/<str:pk>/', views.IncomeCategoryDelete.as_view(), name='income_category_delete'),
    path('income_category/user_list/', views.IncomeCategoryUserList.as_view(), name='income_category_user_list'),

    path('expense_category/create/', views.ExpenseCategoryCreate.as_view(), name='expense_category_create'),
    path('expense_category/delete/<str:pk>/', views.ExpenseCategoryDelete.as_view(), name='expense_category_delete'),
    path('expense_category/user_list/', views.ExpenseCategoryUserList.as_view(), name='expense_category_user_list'),

    path('expense_category/user_list/', views.ExpenseCategoryUserList.as_view(), name='expense_category_user_list'),

    path('', views.TrasactionList.as_view(), name='transaction_list_create'),
    path('<str:pk>/', views.TrasactionDetail.as_view(), name='transaction_list_create'),

    path('account_statements/list/', views.AccountStatements.as_view(), name='acount_statements_list'),
    path('account_statements/last/', views.AccountStatementsLast.as_view(), name='acount_statements_last'),
]
