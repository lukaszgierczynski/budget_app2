from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, ListAPIView, RetrieveDestroyAPIView, DestroyAPIView
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from core.serializers import UserSerializerWithToken, UserSerializer, UpdateUserProfileSerializer, UpdateUserSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import TokenError, RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
import jwt
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Podana nazwa użytkownika lub hasło są niepoprawne.'
    }

    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CheckTokenValidity(APIView):
    def get(self, request, *args, **kwargs):
        # Odczytaj token z nagłówka autoryzacyjnego
        authorization_header = request.headers.get('Authorization')

        if not authorization_header:
            return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Token powinien być przekazywany w nagłówku w formie "Bearer <token>"
            _, token = authorization_header.split()

            # Sprawdź ważność tokena
            access_token = AccessToken(token)
            access_token.verify()

            # Jeśli nie wystąpił wyjątek, to token jest ważny
            return Response({'valid': True}, status=status.HTTP_200_OK)

        except Exception as e:
            # Token jest nieprawidłowy lub wygasł
            return Response({'valid': False, 'reason': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
            

class RegisterUser(CreateAPIView):
    serializer_class = UserSerializerWithToken

    def perform_create(self, serializer):
        password = self.request.data.get('password')
        hashed_password = make_password(password)
        serializer.save(password=hashed_password)

class GetUserProfile(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    
    def get_object(self):
        return self.request.user
    
class UpdateUserProfile(UpdateAPIView):
    serializer_class = UpdateUserProfileSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(instance=user, data=request.data)

        username = self.request.data.get('username')
        if username != user.username and User.objects.filter(username=username).exists():
            return Response({"detail": "Nazwa użytkownika jest już zajęta."}, status=status.HTTP_400_BAD_REQUEST)
        
        password = self.request.data.get('password')
        if password:
            hashed_password = make_password(password)
        else:
            return Response({"detail": "Hasło nie może być puste."}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['password']):
                return Response({'detail': 'Nieprawidłowe hasło.'}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(password=hashed_password)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUsers(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class GetUserById(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class UpdateUser(UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    

class DeleteUser(DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
