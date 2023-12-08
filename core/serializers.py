from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.validators import UniqueValidator
from .models import Transaction, IncomeCategory, ExpenseCategory, AccountStatement, BudgetCategory, Budget

def validate_username(value):
    existing_user = User.objects.filter(username=value)
    if existing_user.exists():
        raise serializers.ValidationError("Ta nazwa użytkownika jest już zajęta. Proszę podać inną.")

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[validate_username,])
    password = serializers.CharField(write_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    id = serializers.IntegerField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'password', 'email', 'first_name', 'last_name', 'isAdmin']

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get__id(self, obj):
        return obj.id

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'password', 'email', 'first_name', 'last_name', 'isAdmin', 'token']
    
    def get_token(self, obj):
        refresh_token = RefreshToken.for_user(obj)
        return str(refresh_token.access_token)
    

class UpdateUserProfileSerializer(UserSerializerWithToken):
    username = serializers.CharField()


class UpdateUserSerializer(UserSerializer):
    is_staff = serializers.BooleanField()

    class Meta:
        fields_new = UserSerializer.Meta.fields.copy()
        fields_new.remove('password')
        fields_new.remove('username')
        fields_new.append('is_staff')
        model = UserSerializer.Meta.model
        fields = fields_new

class IncomeCategorySerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)

    class Meta:
            model = IncomeCategory
            fields = ['_id', 'user', 'is_predefined', 'category_name']

class ExpenseCategorySerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)

    class Meta:
            model = ExpenseCategory
            fields = ['_id', 'user', 'is_predefined', 'category_name']


class TransactionSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)
    expense_category_details = serializers.SerializerMethodField(read_only=True)
    income_category_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Transaction
        fields = ['_id', 'expense_category', 'expense_category_details', 'is_income', 'income_category',
                  'income_category_details', 'money_amount', 'description', 'transaction_date', 'transaction_name']

    def get_expense_category_details(self, obj):
        expense_category = obj.expense_category
        if expense_category:
            expense_category_details = ExpenseCategorySerializer(obj.expense_category, many=False).data
            return expense_category_details
        else:
            return None
    
    def get_income_category_details(self, obj):
        income_category = obj.income_category
        if income_category:
            income_category_details = IncomeCategorySerializer(obj.income_category, many=False).data
            return income_category_details
        else:
            return None


class AccountStatementSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)
    transaction_details = serializers.SerializerMethodField(read_only=True)
    account_balance = serializers.FloatField(read_only=True)

    class Meta:
        model = AccountStatement
        fields = ['_id', 'user', 'transaction', 'transaction_details', 'account_balance']

    def get_transaction_details(self, obj):
        if obj.transaction:
            transaction_details = TransactionSerializer(obj.transaction, many=False).data
            return transaction_details
        else:
            return None
        

class BudgetCategorySerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(read_only=True)
    expense_category_details = serializers.SerializerMethodField(read_only=True)
    budget_id = serializers.PrimaryKeyRelatedField(read_only=True)
    money_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = BudgetCategory
        fields = ['_id', 'category_id', 'expense_category_details', 'budget_id', 'money_amount']

    def get_expense_category_details(self, obj):
        expense_category_details = ExpenseCategorySerializer(obj.category, many=False).data
        return expense_category_details


class BudgetSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    budget_categories = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Budget
        fields = ['_id', 'user', 'start_date', 'end_date', 'budget_categories']

    def get_budget_categories(self, obj):
        categories = obj.budgetcategory_set.all()
        serializer = BudgetCategorySerializer(categories, many=True)
        return serializer.data
