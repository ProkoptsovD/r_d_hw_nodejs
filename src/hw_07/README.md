# NestJS Zip Image Processor

Цей проєкт реалізує REST-ендпоінт `POST /zip`, який приймає `.zip` архів із зображеннями (10–50 штук), розпаковує їх і виконує подальшу обробку (наприклад, зміну розміру, збереження тощо).

🛠️ Технології
- NestJS — фреймворк для створення серверних додатків
- Multer — для обробки multipart/form-data
- Sharp — для обробки зображень
- AdmZip — для роботи з .zip архівами

---

## 📦 Почтаок

1. Переконайтесь, що ви знаходитесь у директорії з кодом. Якщо ви у руті репозиторію, то скористайтесь командою

```bash
cd src/hw_07
```

2. Встановіть залежності:

```bash
pnpm i
```

3. Запустить проєкт:
```bash
pnpm start
```


## Робота з сервером

Надішліть .zip архів із зображеннями через curl:

```bash
curl -F "zip=@imgs.zip;type=application/zip" http://localhost:3000/zip
```

Для симуляції декальох одночасних запитів скористайтеся цією командою. Скопіюйте і ставте в термінал
```bash
( curl -s -F "zip=@imgs.zip;type=application/zip" http://localhost:3000/zip && echo -e "\n" ) &
( curl -s -F "zip=@imgs.zip;type=application/zip" http://localhost:3000/zip && echo -e "\n" ) &
( curl -s -F "zip=@imgs.zip;type=application/zip" http://localhost:3000/zip && echo -e "\n" ) &
wait
```

