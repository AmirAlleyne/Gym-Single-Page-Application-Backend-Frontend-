from rest_framework.pagination import  PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'count'
    max_page_size = 2
    page_query_param = 'p'
