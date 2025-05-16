# Projeto de Comunição com Alimentadores(Leitura/Saída)

## Objetivo
- Este sistema BackEnd tem como objetivo ser um intermediário de comunicação entre qualquer sistema com os registradores de todos os alimentadores que o cliente possuir.
- O projeto foi desenvolvido com node.js e se comunica com o módulo mestre por meio de WebSockets para uma atualização mais rápida da transição de dados.
- A solução foi desenvolvida para o teste de conexão com o módulo mestre do Iotar para futuramente ser usado em suas necessidades com os alimentadores.

## Tecnologias
- NodeJS
- WebSockets

## Instrução de instalação

### Pré requisitos
- NodeJS

### Instalação de dependências
``` 
npm install
```

### Abertura de servidor
``` 
node app.js
```

## WebSocket endpoint

### Endpoint do Alimentador
```
ws://localhost:3000/ws/alimentador
```
```
{
    "sucess": "Sucesso!",
    "data": {
        "alimentador": {
            "Selecionado": 77,
            "HoraLiga": 50,
            "HoraDesliga": 64,
            "Setpoint": 93,
            "TempoCiclo": 35,
            "Temperatura": 42,
            "Erro": 23,
            "Posicao": 97,
            "Hora": 5,
            "Minuto": 16,
            "Ciclos": 62,
            "QuantReservatorio": 14
        },
        "erros": {
            "QtdErro1": 58,
            "QtdErro2": 6,
            "QtdErro3": 3,
            "QtdErro4": 97,
            "QtdErro5": 2,
            "QtdErro6": 37,
            "QtdErro7": 68,
            "ComErro1": 63,
            "ComErro2": 88
        },
        "monitor": {}
    }
}
```



