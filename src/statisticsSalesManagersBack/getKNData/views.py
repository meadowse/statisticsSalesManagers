from django.http import JsonResponse
import requests
import json


# Create your views here.
def getKN(request):
    url = 'https://rosreestr.ru.net/fir_rest/api/gkn_egrp/'
    res_url = url + request.GET.get('kn')
    params = {'token': request.GET.get('token')}
    response = requests.get(res_url, params=params, verify=False)
    answer = response.json()
    if answer.get('errorCode') is None:
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
