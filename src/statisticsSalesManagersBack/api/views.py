from django.http import JsonResponse
import requests
import json
import firebirdsql
from datetime import date, datetime
# параметры подключения к базе:
database = 'MPK'
host = '10.199.1.11'
user = 'sysdba'
password = 'F409mZu5'
charset = 'UTF8'
# Create your views here.
def getKN(request):
    url = 'https://rosreestr.ru.net/fir_rest/api/gkn_egrp/'
    res_url = url + request.GET.get('kn')
    params = {'token': request.GET.get('token')}
    response = requests.get(res_url, params=params, verify=False)
    answer = response.json()
    if answer.get('errorCode') is None:
        if type(answer.get('gkn')) != list:
            Type = answer.get('gkn').get('type')

            area = None
            if Type == 'building':
                area = str(answer.get('gkn').get('objectData').get('building').get('area'))
            elif Type == 'parcel':
                area = str(answer.get('gkn').get('objectData').get('parcelData').get('area').get('value'))
            if area is not None:
                area = area.replace('.', ',')
                answer.update({'area': area})

            answer.update({'errorCode': ''})

            address = ''
            objectAddress = answer.get('gkn').get('objectData').get('objectAddress')
            if objectAddress is None:
                objectAddress = ''
            addressNote = answer.get('gkn').get('objectData').get('address').get('note')
            if addressNote is None:
                addressNote = ''
            addressMergedAddress = answer.get('gkn').get('objectData').get('address').get('mergedAddress')
            if addressMergedAddress is None:
                addressMergedAddress = ''
            districtType = answer.get('gkn').get('objectData').get('address').get('districtType')
            if districtType is not None:
                address += districtType + '. '
            districtName = answer.get('gkn').get('objectData').get('address').get('districtName')
            if districtName is not None:
                address += districtName + ', '
            cityType = answer.get('gkn').get('objectData').get('address').get('cityType')
            if cityType is not None:
                address += cityType + '. '
            else:
                region = answer.get('gkn').get('objectData').get('address').get('region')
                if region is not None and region == '77':
                    address += 'г. Москва, '
            cityName = answer.get('gkn').get('objectData').get('address').get('cityName')
            if cityName is not None:
                address += cityName + ', '
            localityType = answer.get('gkn').get('objectData').get('address').get('localityType')
            if localityType is not None:
                address += localityType + '. '
            localityName = answer.get('gkn').get('objectData').get('address').get('localityName')
            if localityName is not None:
                address += localityName + ', '
            sovietVillageType = answer.get('gkn').get('objectData').get('address').get('sovietVillageType')
            if sovietVillageType is not None:
                address += sovietVillageType + '. '
            sovietVillageName = answer.get('gkn').get('objectData').get('address').get('sovietVillageName')
            if sovietVillageName is not None:
                address += sovietVillageName + ', '
            urbanDistrictType = answer.get('gkn').get('objectData').get('address').get('urbanDistrictType')
            if urbanDistrictType is not None:
                address += urbanDistrictType + '. '
            urbanDistrictName = answer.get('gkn').get('objectData').get('address').get('urbanDistrictName')
            if urbanDistrictName is not None:
                address += urbanDistrictName + ', '
            streetType = answer.get('gkn').get('objectData').get('address').get('streetType')
            if streetType is not None:
                address += streetType + '. '
            street = answer.get('gkn').get('objectData').get('address').get('street')
            if street is not None:
                address += street + ', '
            level1Type = answer.get('gkn').get('objectData').get('address').get('level1Type')
            if level1Type is not None:
                address += level1Type + '. '
            level1Value = answer.get('gkn').get('objectData').get('address').get('level1Value')
            if level1Value is not None:
                address += level1Value + ', '
            level2Type = answer.get('gkn').get('objectData').get('address').get('level2Type')
            if level2Type is not None:
                address += level2Type + '. '
            level2Value = answer.get('gkn').get('objectData').get('address').get('level2Value')
            if level2Value is not None:
                address += level2Value + ', '
            level3Type = answer.get('gkn').get('objectData').get('address').get('level3Type')
            if level3Type is not None:
                address += level3Type + '. '
            level3Value = answer.get('gkn').get('objectData').get('address').get('level3Value')
            if level3Value is not None:
                address += level3Value + ', '
            apartamentType = answer.get('gkn').get('objectData').get('address').get('apartamentType')
            if apartamentType is not None:
                address += apartamentType + '. '
            apartamentValue = answer.get('gkn').get('objectData').get('address').get('apartamentValue')
            if apartamentValue is not None:
                address += apartamentValue
            if address[-2:] == ', ':
                address = address[:-2]
            if (len(objectAddress) >= len(addressNote) and len(objectAddress) >= len(addressMergedAddress)
                    and len(objectAddress) >= len(address)):
                address = objectAddress
            elif (len(addressNote) >= len(addressMergedAddress) and len(addressNote) >= len(objectAddress)
                and len(addressNote) >= len(address)):
                address = addressNote
            elif (len(addressMergedAddress) >= len(addressNote) and len(addressMergedAddress) >= len(objectAddress)
                and len(addressMergedAddress) >= len(address)):
                address = addressMergedAddress
            answer.update({'address': address})
    print(json.dumps(answer, ensure_ascii=True, indent=4))
    return JsonResponse(answer, safe=False)

def successManagers(request):
    month = request.GET.get('month')
    year = request.GET.get('year')
    with firebirdsql.connect(host=host, database=database, user=user, password=password, charset=charset) as con:
        cur = con.cursor()
        sql = f""" 
        SELECT T3.F4886 AS manager_name, COALESCE(ROUND(SUM(T245.F5708), 0), 0) AS total_payments
        FROM T3
        LEFT JOIN T212 ON T3.ID = T212.F4844
        LEFT JOIN T213 ON T212.ID = T213.F4573
        LEFT JOIN T245 ON T213.ID = T245.F4956 AND EXTRACT(MONTH FROM T245.F4952) = {month} AND EXTRACT(YEAR FROM T245.F4952) = {year}
        WHERE T3.F27 = 3
        GROUP BY T3.F4886, T3.F5383
        HAVING NOT (T3.F5383 = 0 AND COALESCE(ROUND(SUM(T245.F5708), 0), 0) = 0)
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
        SELECT T3.F4886 AS manager_name, ROUND(SUM(T245.F5708),0) AS total_payments
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