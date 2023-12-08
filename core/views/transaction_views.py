from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, DestroyAPIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.pagination import PageNumberPagination

from core.serializers import IncomeCategorySerializer, ExpenseCategorySerializer, TransactionSerializer, AccountStatementSerializer
from core.models import IncomeCategory, ExpenseCategory, Transaction, AccountStatement

from django.db.models import Q


class IncomeCategoryCreate(CreateAPIView):
    serializer_class = IncomeCategorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        category_name = serializer.validated_data.get('category_name')
        user = self.request.user

        if IncomeCategory.objects.filter(category_name=category_name, user=user).exists():
            raise serializers.ValidationError({'error': 'Podana kategoria już istnieje.'})

        serializer.save(user=user)
    

class IncomeCategoryDelete(DestroyAPIView):
    queryset = IncomeCategory.objects.all()
    serializer_class = IncomeCategorySerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Income Category deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class IncomeCategoryUserList(ListAPIView):
    serializer_class = IncomeCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = IncomeCategory.objects.filter(Q(user=self.request.user) | Q(is_predefined=True)).order_by('-is_predefined', 'category_name')
        return queryset


class ExpenseCategoryCreate(CreateAPIView):
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        category_name = serializer.validated_data.get('category_name')
        user = self.request.user

        if ExpenseCategory.objects.filter(category_name=category_name, user=user).exists():
            raise serializers.ValidationError({'error': 'Podana kategoria już istnieje.'})

        serializer.save(user=user)
    

class ExpenseCategoryDelete(DestroyAPIView):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Expense Category deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class ExpenseCategoryUserList(ListAPIView):
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ExpenseCategory.objects.filter(Q(user=self.request.user) | Q(is_predefined=True)).order_by('-is_predefined', 'category_name')
        return queryset

class TransactionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 20

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'num_pages': self.page.paginator.num_pages,
            'page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class TrasactionList(ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TransactionPagination

    def perform_create(self, serializer):
        expense_category_id = self.request.data.get('expense_category')
        income_category_id = self.request.data.get('income_category')
        expense_category = None
        income_category = None
        
        if expense_category_id:
            expense_category = ExpenseCategory.objects.get(_id=expense_category_id)
        elif income_category_id:
            income_category = IncomeCategory.objects.get(_id=income_category_id)

        saved_transaction = serializer.save(user=self.request.user, expense_category=expense_category, income_category=income_category)

        #zapisanie AccountStatement
        statements = AccountStatement.objects.filter(user=self.request.user)
        if statements:
            last_statement = statements.last()
            current_statement = last_statement.account_balance + saved_transaction.money_amount
        else:
            current_statement = saved_transaction.money_amount
        
        AccountStatement.objects.create(user=self.request.user, transaction=saved_transaction, account_balance=current_statement)


    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user).order_by('-transaction_date')
        return queryset


class TrasactionDetail(RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        #zaktualizowanie AccountStatement
        statements = AccountStatement.objects.filter(user=self.request.user)
        last_statement = statements.last()
        current_statement = last_statement.account_balance - instance.money_amount
        AccountStatement.objects.create(user=self.request.user, transaction=None, account_balance=current_statement)

        self.perform_destroy(instance)
        return Response({"detail": "Transaction deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        #zaktualizowanie AccountStatement
        statements = AccountStatement.objects.filter(user=self.request.user)
        last_statement = statements.last()
        current_statement = float(last_statement.account_balance) - float(instance.money_amount) + float(request.data.get('money_amount'))
        AccountStatement.objects.create(user=self.request.user, transaction=None, account_balance=current_statement)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class AccountStatements(ListAPIView):
    serializer_class = AccountStatementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print('a')
        queryset = AccountStatement.objects.filter(user=self.request.user)
        print('b')
        return queryset
    

class AccountStatementsLast(RetrieveAPIView):
    serializer_class = AccountStatementSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = AccountStatement.objects.filter(user=self.request.user).last()
        return obj
