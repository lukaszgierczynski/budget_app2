from django.urls import path
from core.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.RegisterUser.as_view(), name='register_user'),
    path('profile/', views.GetUserProfile.as_view(), name='user_profile'),
    path('profile/update/', views.UpdateUserProfile.as_view(), name='user_profile_update'),
    path('', views.GetUsers.as_view(), name='users'),
    path('check-token/', views.CheckTokenValidity.as_view(), name='token_validity'),

    path('<str:pk>/', views.GetUserById.as_view(), name='user'),
    path('update/<str:pk>/', views.UpdateUser.as_view(), name='user_update'),
    path('delete/<str:pk>/', views.DeleteUser.as_view(), name='user_delete'),

]
