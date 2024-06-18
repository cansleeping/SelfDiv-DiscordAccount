@echo off
cls

IF NOT EXIST "node_modules" (
    echo "Executando npm install..."
    npm install
    node .
) ELSE (
    echo "Pulando npm install."
)

echo "Iniciando a aplicação..."
node .
