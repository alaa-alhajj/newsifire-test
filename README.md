# Newsifire test project

This system has an authentication system. The clients can log in and
log out and sign up. Once they are logged in, they are able
to create a new article, the article has only a title and content.

For the content, we used editor js, a block-based open source editor, for the MVP
the client can only add text and gif images to the editor. You can add text using editor js out of the box, and we created a plugin that enables our clients to add GIFs using API search or they can copy the URL from the GIF provider and paste it to the editor, it should show the
GIF image instead of the URL.


## Installation

Clone the repository

```bash
git clone git@github.com:alaa-alhajj/newsifire-test.git
```

## Switch to the repo folder

```bash
cd newsifire-test
```

## Install all the dependencies using composer
```bash
composer install
```

## Copy the example env file and make the required configuration changes in the .env file
```bash
cp .env.example .env
```

## You have to change these values in .env file in order to send email for resetting password
```bash
MAIL_DRIVER=smtp
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=example@hotmail.com
MAIL_PASSWORD=123456789
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=example@hotmail.com
```

## Generate a new application key
```bash
php artisan key:generate
```

## Run the database migrations (Set the database connection in .env before migrating)
```bash
php artisan migrate
```

## To Solve Vite manifest not found at Error run below command.
```bash
npm install && npm run dev
```

## Note: Use two terminal to avoid vite manifest error.
## Start the local development server
```bash
php artisan serve
```

You can now access the server at http://localhost:8000
