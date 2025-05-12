<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AlunniController
{
  public function index(Request $request, Response $response, $args){
    $mysqli_connection = new MySQLi('my_mariadb', 'root', 'ciccio', 'scuola');
    $result = $mysqli_connection->query("SELECT * FROM alunni");
    $results = $result->fetch_all(MYSQLI_ASSOC);
    $response->getBody()->write(json_encode($results));
    return $response->withHeader("Content-type", "application/json")->withStatus(200);
  }

  public function create(Request $request, Response $response, $args) {
    $mysqli_connection = new MySQLi('my_mariadb', 'root', 'ciccio', 'scuola');
    $body = json_decode($request->getBody(), true);
    $nome = $mysqli_connection->real_escape_string($body['Nome']);
    $cognome = $mysqli_connection->real_escape_string($body['Cognome']);
    $result = $mysqli_connection->query("INSERT INTO alunni (nome, cognome) VALUES ('$nome', '$cognome')");
    if ($result) {
        $response->getBody()->write(json_encode(["message" => "Alunno creato correttamente"]));
        return $response->withHeader("Content-type", "application/json")->withStatus(201);
    } else {
        $response->getBody()->write(json_encode(["error" => "Errore nella creazione dell'alunno"]));
        return $response->withHeader("Content-type", "application/json")->withStatus(500);
    }
  }
}
