@echo off
setlocal enabledelayedexpansion

REM Muda para o diretório do repositório
cd "C:\Users\Joao\Documents\APP VIR TELECOM\APP-VIRTELECOM"

REM Pergunta se o usuário deseja modificar a URL do repositório
set /p change_url="Deseja modificar a URL do repositório remoto? (S/N): "
if /I "%change_url%"=="S" (
    set /p new_url="Digite a nova URL do repositório remoto: "
    git remote set-url origin %new_url%
    echo URL do repositório alterada para %new_url%.
)

REM Verifica se há alterações não comitadas
git diff --quiet && git diff --cached --quiet
if %ERRORLEVEL% == 0 (
    echo Nenhuma alteração para enviar.
    pause
    exit /b
)

REM Solicita a mensagem de commit ao usuário
set /p commit_message="Digite a mensagem do commit: "

REM Adiciona todas as alterações
git add .

REM Comita com a mensagem fornecida
git commit -m "%commit_message%"

REM Faz o push para a branch principal (master)
git push

echo Alterações enviadas com sucesso!

REM Navega até o diretório src
cd "C:\Users\Joao\Documents\APP VIR TELECOM\APP-VIRTELECOM\src"

REM Executa o comando npm run deploy
npm run deploy

echo Deploy executado com sucesso!
pause
