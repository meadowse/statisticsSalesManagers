from django.http import JsonResponse
import firebirdsql
from datetime import date, datetime
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

def serialize_value(value):
    """Преобразует значения в формат, подходящий для JSON."""
    if isinstance(value, (date, datetime)):
        return value.isoformat()  # Преобразуем в строку формата YYYY-MM-DD или YYYY-MM-DDTHH:MM:SS
    return value

def projectManagers(request):
    with firebirdsql.connect(
        host=host,
        database=database,
        user=user,
        password=password,
        charset=charset
    ) as con:
        cur = con.cursor()
        sql = """
        SELECT T212.ID AS Contract_ID, 
        T212.F4538 AS Contract_Num, 
        T212.F4544 AS Stadia, 
        T212.F4946 AS Adress, 
        T237.F4890 AS Direction, 
        T212.F4566 AS Date_of_ending, 
        T205.F4332 AS Customer, 
        T3.F4886 AS PrM,
        T3_2.F4886 AS Employee_FIO,  -- Добавляем ФИО сотрудника 
        T212.F4541 AS Price,  -- Цена
        T212.F4543 AS Rest  -- Остаток
        FROM T212 
        LEFT JOIN T237 ON T212.F4948 = T237.ID -- Направление работ
        LEFT JOIN T205 ON T212.F4540 = T205.ID -- Контрагент
        LEFT JOIN T3 ON T212.F4950 = T3.ID -- ПрМ
        LEFT JOIN T3 AS T3_2 ON T212.F4546 = T3_2.ID -- Рук отдела
        -- LEFT JOIN T233 ON T212.ID = T233.F4963  -- Соединяем T212 с T233 по ID договора
        -- LEFT JOIN T206 ON T233.F4870 = T206.ID  -- Соединяем T233 с T206 по ID контакта
        WHERE T212.F4544 <> 'Аннулировано' AND T212.F4544 <> 'Успех' AND T212.F4544 <> 'Отменена'
        """  # F4648 - путь, F4538 - номер договора, F4544 - стадия, F4946 - адрес, F4948 - направление, F4566 - дата окончания
        cur.execute(sql)
        result = cur.fetchall()

        # Преобразование результата в список словарей
        columns = [column[0] for column in cur.description]  # Получаем названия столбцов
        json_result = [
            {col: serialize_value(value) for col, value in zip(columns, row)}
            for row in result
        ]  # Создаем список словарей с сериализацией значений

        return JsonResponse(json_result, safe=False, json_dumps_params={'ensure_ascii': False, 'indent': 4})