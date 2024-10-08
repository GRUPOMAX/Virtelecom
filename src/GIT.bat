@echo off

REM Muda para o diretório do repositório
cd "C:\Users\Joao\Documents\APLICATIVO CELULAR\APP-MAX"

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
pause
