const AdressIp = window.location.hostname;
export const environment = {
  
    production: true, 
    API_AUTH: 'http://'+AdressIp+':5051/api/auth/',
    API_Parametrage: 'http://'+AdressIp+':5051/api/parametrage/', 
    API_DASHBORD: 'http://'+AdressIp+':5051/api/dashbord/',
    API_RECEPTION: 'http://'+AdressIp+':5051/api/reception/', 
    API_SOC: 'http://'+AdressIp+':5051/api/soc',
   
};
