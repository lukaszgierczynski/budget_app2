from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from core.serializers import TransactionSerializer, BudgetSerializer
from core.models import Transaction, Budget

from django.db.models import Q


class TrasactionList(ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if start_date:
            queryset = queryset.filter(transaction_date__gte=start_date)

        if end_date:
            queryset = queryset.filter(transaction_date__lte=end_date)

        return queryset


class BudgetList(ListAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user)
        filter_start_date = self.request.query_params.get('start_date', None)
        filter_end_date = self.request.query_params.get('end_date', None)

        if filter_start_date:
            queryset = queryset.filter(Q(start_date__gte=filter_start_date) | (Q(start_date__lt=filter_start_date) & Q(end_date__gte=filter_start_date)))

        if filter_end_date:
            queryset = queryset.filter(Q(end_date__lte=filter_end_date) | (Q(start_date__lte=filter_end_date) & Q(end_date__gt=filter_end_date)))

        return queryset
    

class BudgetsAll(ListAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user).order_by('-start_date')
        return queryset
    