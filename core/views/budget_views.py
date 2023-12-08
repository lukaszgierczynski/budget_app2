from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from core.serializers import BudgetSerializer
from core.models import Budget, BudgetCategory, ExpenseCategory


class BudgetPagination(PageNumberPagination):
    page_size = 10
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

class BudgetList(ListCreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BudgetPagination

    def perform_create(self, serializer):
        saved_budget = serializer.save(user=self.request.user)

        #utworzenie poszczegolnych BudgetCategory
        budget_categories = self.request.data['budget_categories']
        for budget_category in budget_categories:
            category = ExpenseCategory.objects.get(_id=budget_category['expense_id'])
            BudgetCategory.objects.create(category=category, budget=saved_budget, money_amount=float(budget_category['money_amount']))

    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user).order_by('-start_date')
        return queryset


class BudgetDetail(RetrieveUpdateDestroyAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        #usunięcie starych BudgetCategory związanych Budget
        instance.budgetcategory_set.all().delete()
        #dodanie nowych BudgetCategory związanych Budget
        budget_categories = self.request.data['budget_categories']
        for budget_category in budget_categories:
            category = ExpenseCategory.objects.get(_id=budget_category['expense_id'])
            BudgetCategory.objects.create(category=category, budget=instance, money_amount=float(budget_category['money_amount']))

        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Budget deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
