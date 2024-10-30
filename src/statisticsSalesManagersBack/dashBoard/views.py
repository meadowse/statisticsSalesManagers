from django.http import JsonResponse
from django.shortcuts import render
import firebirdsql
# параметры подключения к базе:
database = 'MPK'
host = '10.199.1.11'
user = 'sysdba'
password = 'F409mZu5'
charset = 'UTF8'
# Create your views here.
def successManagers(request):
    month = request.GET.get('month')
    year = request.GET.get('year')
    with firebirdsql.connect(host=host, database=database, user=user, password=password, charset=charset) as con:
        cur = con.cursor()
        sql = f""" 
        SELECT T3.F4886 AS manager_name, COALESCE(SUM(T245.F4951), 0) AS total_payments
        FROM T3
        LEFT JOIN T212 ON T3.ID = T212.F4844
        LEFT JOIN T213 ON T212.ID = T213.F4573
        LEFT JOIN T245 ON T213.ID = T245.F4956 AND EXTRACT(MONTH FROM T245.F4952) = {month} AND EXTRACT(YEAR FROM T245.F4952) = {year}
        WHERE T3.F27 = 3
        GROUP BY T3.F4886, T3.F5383
        HAVING NOT (T3.F5383 = 0 AND COALESCE(SUM(T245.F4951), 0) = 0)
        """
        cur.execute(sql)
        result = cur.fetchall()

        # Преобразование результата в список словарей
        result_list = [{'manager_name': row[0], 'total_payments': row[1]} for row in result]

        return JsonResponse(result_list, safe=False, json_dumps_params={'ensure_ascii': False, 'indent': 4})

def successOther(request):
    month = request.GET.get('month')
    year = request.GET.get('year')
    with firebirdsql.connect(host=host, database=database, user=user, password=password, charset=charset) as con:
        cur = con.cursor()
        sql = f""" 
        SELECT T3.F4886 AS manager_name, SUM(T245.F4951) AS total_payments
        FROM T245
        JOIN T213 ON T245.F4956 = T213.ID
        JOIN T212 ON T213.F4573 = T212.ID
        JOIN T3 ON T212.F4844 = T3.ID
        WHERE EXTRACT(MONTH FROM T245.F4952) = {month} AND EXTRACT(YEAR FROM T245.F4952) = {year} AND T3.F27 <> 3
        GROUP BY T3.F4886
        """
        cur.execute(sql)
        result = cur.fetchall()

        # Преобразование результата в список словарей
        result_list = [{'manager_name': row[0], 'total_payments': row[1]} for row in result]

        return JsonResponse(result_list, safe=False, json_dumps_params={'ensure_ascii': False, 'indent': 4})