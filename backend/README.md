# Detalhes da API

## Adição do IP via Postman

1. Rode o Backend
```
node app.js
```
2. Faça o Post no Postman no endpoint:
```
http://localhost:3000/moduloMestre/ip
``` 
Passe o IP do módulo mestre no body raw seguindo esse exemplo de JSON
```
{
    "ip": "192.168.0.240"
}
```
3. A resposta da requisição deve ser:
```
{
    "sucess": true,
    "message": "IP atualizado com sucesso",
    "ip": "192.168.0.240"
}
```



## WebSocket endpoint

### Endpoint do Alimentador
```
ws://localhost:3000/ws/alimentador
```
```
{
    "time": "12:59:31",
    "data": {
        "Selecionado": 62,
        "HoraLiga": 21,
        "HoraDesliga": 63,
        "Setpoint": 18,
        "TempoCiclo": 74,
        "Temperatura": 60,
        "Erro": 49,
        "Posicao": 18,
        "Hora": 50,
        "Minuto": 22,
        "Ciclos": 90,
        "QuantReservatorio": 63
    }
}
```

### Endpoint de Erros
No JSON "QtdErroX" será possível visualizar quantos alimentadores estão com o erro x em questão.<br><br>

No "ComErroX" será possível visualizar o número de ID de qual ou quais alimentadores está/estão com o devido erro.<br><br>

Um alimentador nunca terá 2 erros.

```
ws://localhost:3000/ws/erros
```
```
{
    "time": "13:01:12",
    "data": {
        "QtdErro1": 2,
        "QtdErro2": 3,
        "QtdErro3": 2,
        "QtdErro4": 1,
        "QtdErro5": 0,
        "QtdErro6": 0,
        "QtdErro7": 0,
        "ComErro1": 3, 6, 7, 9,
        "ComErro2": 4,
        "ComErro3": 3, 5,
        "ComErro4": 2,
        "ComErro5": 5, 6,
        "ComErro6": 7,
        "ComErro7": 13
    }
}
```

### Endpoint de temperatura e umidade
```
ws://localhost:3000/ws/tempUmi
```
```
{
    "time": "13:08:41",
    "data": {
        "Umidade": 59,
        "Temperatura": 9
    }
}
```

### Enpoint de todos os dados
```
ws://localhost:3000/ws/todos
```
```
{
    "time": "20/05/2025",
    "data": {
        "alimentador": {
            "Selecionado": 6,
            "HoraLiga": 2,
            "HoraDesliga": 9,
            "Setpoint": 78,
            "TempoCiclo": 43,
            "Temperatura": 91,
            "Erro": 46,
            "Posicao": 75,
            "Hora": 75,
            "Minuto": 84,
            "Ciclos": 27,
            "QuantReservatorio": 34
        },
        "erros": {
            "QtdErro1": 65,
            "QtdErro2": 52,
            "QtdErro3": 54,
            "QtdErro4": 33,
            "QtdErro5": 23,
            "QtdErro6": 50,
            "QtdErro7": 22,
            "ComErro1": 96,
            "ComErro2": 3,
            "ComErro3": 87,
            "ComErro4": 77,
            "ComErro5": 80,
            "ComErro6": 18,
            "ComErro7": 99
        },
        "monitor": {
            "Umidade": 3,
            "Temperatura": 23
        }
    }
}
```