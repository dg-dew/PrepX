<?php
header('Content-Type: application/json');
require_once 'db.php';

$sql = "SELECT id, question_text, option_a, option_b, option_c, option_d, category FROM aptitude_questions ORDER BY RAND() LIMIT 10";
$result = $conn->query($sql);

$questions = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    echo json_encode(["status" => "success", "questions" => $questions]);
} else {
    echo json_encode(["status" => "error", "message" => "No questions found in database."]);
}

$conn->close();
?>