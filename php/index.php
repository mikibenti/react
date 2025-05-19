<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/controllers/AlunniController.php';

$app = AppFactory::create();

$app->get('/alunni', "AlunniController:index");
$app->post('/alunni', "AlunniController:create");
$app->delete('/alunni/{id}', "AlunniController:delete");
$app->run();
