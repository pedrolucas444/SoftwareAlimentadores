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

### Instalação
``` 
npm install
```

### Abertura de servidor
``` 
node app.js
```

## WebSocket endpoints

### Válvula de ar
```
ws://localhost:3000/ws/ar
```
```
{
    "time": "16:19:17",
    "ar": {
        "Posicao": 51,
        "Erro": 36,
        "Temperatura": 2,
        "Ciclos": 50
    }
}
```

### Válvula gaveta
```
ws://localhost:3000/ws/gaveta
```
```
{
    "time": "17:38:50",
    "gaveta": {
        "HoraLigada": 22,
        "HoraDesligada": 99,
        "TempoCiclo": 10,
        "TempoAberto": 98,
        "SetPoint": 85,
        "Modo": 20,
        "Ciclos": 36,
        "Erro": 1,
        "Posicao": 36
    }
}
```
### Válvula esfera
```
ws://localhost:3000/ws/esfera
```
```
{
    "time": "16:19:16",
    "esfera": {
        "HoraLigada": 88,
        "HoraDesligada": 3,
        "TempoCiclo": 51,
        "TempoAberto": 78,
        "SetPoint": 42,
        "Modo": 76,
        "Ciclos": 51,
        "Erro": 13,
        "Posicao": 69
    }
}
```
### Monitor de temperatura
```
ws://localhost:3000/ws/temperatura
```
```
{
    "time": "16:19:12",
    "temperatura": {
        "Temperatura_1": 62,
        "Temperatura_2": 12,
        "Temperatura_3": 50,
        "Temperatura_4": 40,
        "Erro": 77
    }
}
```



