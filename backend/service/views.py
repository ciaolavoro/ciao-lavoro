from .models import Service, Job, Review
from .serializers import ServiceSerializer, JobSerializer, ReviewSerializer
from datetime import date, timedelta
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from user.models import User
import stripe

class ServiceList(generics.ListAPIView):
    serializer_class = ServiceSerializer
    def get_queryset(self):
        services = Service.objects.all()
        search_profession = self.request.query_params.get('search_profession')
        search_city = self.request.query_params.get('search_city')
        search_username = self.request.query_params.get('search_username')
        if search_profession:
            services = services.filter(profession=search_profession)
        if search_city:
            services = services.filter(city__icontains=search_city)
        if search_username:
            users = User.objects.filter(username__icontains=search_username)
            services = services.filter(user__in = users)
        return services

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.serializer_class(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProfessionList(APIView):
    @authentication_classes([TokenAuthentication])
    def get(self, request):
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        all_professions = Service.PROFESSIONS
        professions = []
        for p in all_professions:
            service = Service.objects.filter(user=user, profession=p[0])
            if not service:
                professions.append({"id":p[0],"name":p[1]})
        return Response({"professions": professions})

class AllProfessionList(APIView):
    def get(self, request):
        professions = Service.PROFESSIONS
        professions_json = []
        for p in professions:
            professions_json.append({"id":p[0],"name":p[1]})
        return Response({"professions": professions_json})

class UserServiceList(APIView):
    def get(self, request, user_id):
        services = Service.objects.filter(user_id=user_id)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class JobView(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        job_data = request.data
        service = Service.objects.filter(pk=service_id).first()
        if not service:
            return Response("Service does not exists", status=status.HTTP_404_NOT_FOUND)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No eres el propietario de este servicio')
        if job_data['name'] and job_data['name'].strip() != '':
            name = job_data['name'].strip()
        else:
            return Response('El nombre no puede estar vacío', status=status.HTTP_400_BAD_REQUEST)
        
        if len(name) > 100:
            return Response('La cantidad de caracteres del nombre no puede ser superior a 100', status=status.HTTP_400_BAD_REQUEST)
        estimated_price = job_data['estimated_price']
        if estimated_price == '':
            estimated_price = 10
        if isinstance(estimated_price, int):
            estimated_price = estimated_price + 0.001
        if not isinstance(estimated_price, float):
            return Response('El precio estimado debe ser un número', status=status.HTTP_400_BAD_REQUEST)
        job = Job.objects.create(service=service, name=name, estimated_price=estimated_price)
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)

    @authentication_classes([TokenAuthentication])
    def put(self, request, job_id):
        job_data = request.data
        job = Job.objects.filter(pk=job_id).first()
        if not job:
            return Response("Job does not exists", status=status.HTTP_404_NOT_FOUND)
        service = job.service
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No puedes editar un trabajo de un servicio que no te pertenece')
        if job_data['name'] and job_data['name'].strip() != '':
            new_name = job_data['name'].strip()
        else:
            return Response('El nombre no puede estar vacío', status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_name) > 100:
            return Response('La cantidad de caracteres del nombre no puede ser superior a 100', status=status.HTTP_400_BAD_REQUEST)
        new_estimated_price = job_data['estimated_price']
        if new_estimated_price == '':
            new_estimated_price = 10
        if isinstance(new_estimated_price, int):
            new_estimated_price = new_estimated_price + 0.001
        if not isinstance(new_estimated_price, float):
            return Response('El precio estimado debe ser un número', status=status.HTTP_400_BAD_REQUEST)
        job.name = new_name
        job.estimated_price = new_estimated_price
        job.save()
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)
    
    @authentication_classes([TokenAuthentication])
    def delete(self, request, job_id):
        job = Job.objects.filter(pk=job_id).first()
        if not job:
            return Response("Job does not exists", status=status.HTTP_404_NOT_FOUND)
        service = job.service
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No puedes eliminar un trabajo de un servicio que no te pertenece')
        Job.delete(job)
        serializer = JobSerializer(job, many=False)
        return Response(serializer.data)

class ReviewView(APIView):
    def get(self, request, service_id):
        service = get_object_or_404(Service, pk=service_id)
        reviews = Review.objects.filter(service=service)
        serializer = ReviewSerializer(reviews, many=True)
        response_data = {
            "rating": service.rating(),
            "total_reviews": len(reviews),
            "reviews": serializer.data
        }
        return Response(response_data)
    
    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        review_data = request.data
        service = Service.objects.filter(pk=service_id).first()
        if not service:
            return Response("Service does not exists", status=status.HTTP_404_NOT_FOUND)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user

        existing_review = Review.objects.filter(user=user, service = service)
        if existing_review.exists():
            return Response("Ya has dejado una reseña para este servicio", status=status.HTTP_400_BAD_REQUEST)
        

        if review_data['description'] and review_data['description'].strip() != '':
            description = review_data['description'].strip()
        else:
            return Response("Una valoración debe contener una descripción", status=status.HTTP_400_BAD_REQUEST)
        if review_data['rating'] and review_data['rating'] != '':
            rating = review_data['rating']
        else:
            return Response("Una valoración esta incompleta sin la puntuación", status=status.HTTP_400_BAD_REQUEST)
        
        date = timezone.now()
        if int(rating) > 5 or int(rating) < 0 :
            return Response('La valoración debe de estar entre 0 y 5', status=status.HTTP_400_BAD_REQUEST)
        if len(description) > 500:
            return Response('La descripción no puede contener más de 500 caracteres', status=status.HTTP_400_BAD_REQUEST)
        review = Review.objects.create(user=user, service=service, description=description, rating=rating, date=date)
        serializer = ReviewSerializer(review, many=False)
        return Response(serializer.data)

class ServiceView(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request):
        service_data = request.data
        token_id = request.headers['Authorization']
        token = get_object_or_404(Token, key=token_id.split()[-1])
        user = token.user
        if service_data['city'] and service_data['city'].strip() != '':
            city = service_data['city'].strip()
        else:
            return Response("Debe indicar la ciudad", status=status.HTTP_400_BAD_REQUEST)
        if service_data['profession'] and service_data['profession'] != '':
            profession = service_data['profession']
        else:
            return Response("Se debe introducir una profesión", status=status.HTTP_400_BAD_REQUEST)
        profesions = Service.PROFESSIONS
        profession_exists = False
        for profession_id, _ in profesions:
            if profession_id == int(profession):
                profession_exists = True
        if not profession_exists:
            return Response('La profesión no es valida', status=status.HTTP_400_BAD_REQUEST)
        user_services = list(Service.objects.filter(user=user))
        for s in user_services:
            if s.profession == int(profession):
                return Response('No se pueden crear dos servicios de la misma profesión', status=status.HTTP_400_BAD_REQUEST)
        experience = service_data['experience']
        if experience == '':
            experience = 0
        if (len(city) > 200):
            return Response("La ciudad no puede contener más de 200 caracteres", status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(experience, int):
            return Response('La experiencia debe ser un número entero', status=status.HTTP_400_BAD_REQUEST)
        birth_date = user.birth_date
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if int(experience)+16 > age:
            return Response('La experiencia es demasiado alta', status=status.HTTP_400_BAD_REQUEST)
        service = Service.objects.create(user=user, profession=profession, city=city, experience=experience)
        serializer = ServiceSerializer(service, many=False)
        return Response(serializer.data)
    
    @authentication_classes([TokenAuthentication])
    def put(self, request, service_id):
        service_data = request.data
        service = Service.objects.filter(pk=service_id).first()
        if not service:
            return Response("Service does not exists", status=status.HTTP_404_NOT_FOUND)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            raise PermissionDenied('No eres el propietario de este servicio')
        if  service_data['city'] and service_data['city'].strip() != '':
            city = service_data['city'].strip()
            service.city = city
        else:
            return Response("Debe indicar la ciudad", status=status.HTTP_400_BAD_REQUEST)
        if service_data['profession'] and service_data['profession'] != '':
            profession = service_data['profession']
        else: 
            return Response("Se debe introducir una profesión", status=status.HTTP_400_BAD_REQUEST)
        profesions = Service.PROFESSIONS
        profession_exists = False
        for profession_id, profession_name in profesions:
            if profession_name == profession:
                profession_exists = True
                profession = profession_id
        if not profession_exists:
            return Response('La profesión no es valida', status=status.HTTP_400_BAD_REQUEST)
        user_services = list(Service.objects.filter(user=user))
        for s in user_services:  
            if s.profession == profession and service.id != s.id:
                return Response('No se pueden crear dos servicios de la misma profesión', status=status.HTTP_400_BAD_REQUEST)
        service.profession = profession
        experience = service_data['experience']
        if  experience == '':
            experience = 0  
        if not isinstance(experience, int):
            return Response('La experiencia debe ser un número entero', status=status.HTTP_400_BAD_REQUEST)
        is_active = service_data['is_active']
        if not is_active == '':
            service.is_active = is_active
        if (len(city)>200):
            return Response("La ciudad no puede contener más de 200 caracteres", status=status.HTTP_400_BAD_REQUEST)
        birth_date = user.birth_date
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if int(experience)+16 > age:
            return Response('La experiencia es demasiado alta', status=status.HTTP_400_BAD_REQUEST)
        service.experience = experience
        service.save()
        serializer = ServiceSerializer(service, many=False)
        return Response(serializer.data)
    
class UserHasService(APIView):
    @authentication_classes([TokenAuthentication])
    def get(self, request, service_id):
        service = Service.objects.filter(pk=service_id).first()
        if not service:
            return Response("Service does not exists", status=status.HTTP_404_NOT_FOUND)
        token_id = request.headers["Authorization"]
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if user != service.user:
            state = True
        else :
            state = False
        data = {'user_state': state}
        return Response(data)
    
class PromotionPayment(APIView):
    @authentication_classes([TokenAuthentication])
    def post(self, request, service_id):
        service = get_object_or_404(Service, pk = service_id)
        token_id = self.request.headers['Authorization']
        returnURL = request.data.get('returnURL')
        if not returnURL:
            return Response('Se debe introducir una url de retorno', status=status.HTTP_400_BAD_REQUEST)
        points = request.data.get('points')
        token = get_object_or_404(Token, key = token_id.split()[-1])
        user = token.user
        if not points:
            points = 0
        else:
            points = int(points)
        if user.points < points:
            return Response('No se pueden gastar más puntos de los disponibles', status=status.HTTP_400_BAD_REQUEST)
        user.points = user.points - points
        user.save()
        if user != service.user:
            raise PermissionDenied("No puedes promocionar un servicio que no es tuyo")
        if 4.99 < points/100:
            return Response('El precio de la promoción es menor al valor de los puntos utilizados', status=status.HTTP_400_BAD_REQUEST)
        if 4.99 == points/100:
            return Response('El contrato se ha pagado sin necesidad de proceder al pago')
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            promotionReceipt = stripe.Product.create(
                name = 'Promoción de su servicio',
            )
            price = stripe.Price.create(
                unit_amount = int(4.99 * 100)-int(points),
                currency = 'eur',
                product = promotionReceipt.id,
            )

            session = stripe.checkout.Session.create(
                payment_method_types = ['card'],
                line_items = [{
                    'price': price.id,
                    'quantity': 1,
                    }],
                mode = 'payment',
                customer_email = user.email,
                success_url = returnURL + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url = returnURL,
            )
            return Response({'sessionUrl': session.url, 'price': price.unit_amount})
        except stripe.error.StripeError as e:
            error_msg = str(e)
            return Response({error_msg}, status=status.HTTP_400_BAD_REQUEST)
        
class PromoteService(APIView):
    def put(self, request, service_id):
        service = get_object_or_404(Service, pk = service_id)
        session_id = request.data.get('session_id', None)
        if not session_id:
            return Response('session_id is required for completing the payment', status=status.HTTP_400_BAD_REQUEST)
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            session = stripe.checkout.Session.retrieve(session_id)
        except stripe.error.StripeError as e:
            error_msg = str(e)
            return Response({error_msg}, status=status.HTTP_400_BAD_REQUEST)
        if session.payment_status != 'paid':
            return Response('Payment for the session is not completed', status=status.HTTP_400_BAD_REQUEST)
        service.is_promoted=date.today()
        service.save()
        serializer = ServiceSerializer(service, many=False,context ={'request': request})
        return Response(serializer.data)
        
class AllServiceInPromotion(APIView):
    serializer_class = ServiceSerializer
    def get(self, request):
        month = date.today() - timedelta(days=30)
        promotedService = Service.objects.filter(is_promoted__gte=month)
        promotedService = sorted(promotedService, key = Service.rating, reverse=True)
        serializer = self.serializer_class(promotedService, many=True, context ={'request': request})
        response_data = {"promotedServices": serializer.data}
        return Response(response_data, status=status.HTTP_200_OK)
    
class MostRatedServices(APIView):
    serializer_class = ServiceSerializer
    def get(self, request):
        allService = Service.objects.all()
        ratedService = sorted(allService, key = Service.rating, reverse=True)
        serializer = self.serializer_class(ratedService, many=True, context ={'request': request})
        response_data = {"ratedServices": serializer.data}
        return Response(response_data, status=status.HTTP_200_OK)