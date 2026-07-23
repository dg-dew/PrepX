<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "careerprepx";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}
?>