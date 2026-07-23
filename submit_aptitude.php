<?php
header('Content-Type: application/json');
require_once 'db.php';

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid payload received"]);
    exit;
}

$userAnswers = $data['answers'] ?? [];
$timeTaken = $data['time_taken'] ?? 0;
$warnings = $data['warnings'] ?? 0;
$completionStatus = $data['status'] ?? 'Completed';

// Fetch correct answers from DB
$sql = "SELECT id, correct_option FROM aptitude_questions";
$result = $conn->query($sql);

$correctAnswers = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $correctAnswers[$row['id']] = strtoupper($row['correct_option']);
    }
}

$score = 0;
$total = count($userAnswers);

foreach ($userAnswers as $qId => $ans) {
    if (isset($correctAnswers[$qId]) && $correctAnswers[$qId] === strtoupper($ans)) {
        $score++;
    }
}

$percentage = $total > 0 ? round(($score / $total) * 100, 2) : 0;

// Store attempt in database
$stmt = $conn->prepare("INSERT INTO test_results (score_percentage, correct_count, total_questions, time_taken, warnings_count, status) VALUES (?, ?, ?, ?, ?, ?)");
if ($stmt) {
    $stmt->bind_param("diiiis", $percentage, $score, $total, $timeTaken, $warnings, $completionStatus);
    $stmt->execute();
    $stmt->close();
}

echo json_encode([
    "status" => "success",
    "score_percentage" => $percentage,
    "correct_answers" => $score,
    "total_questions" => $total,
    "completion_status" => $completionStatus,
    "time_taken" => $timeTaken,
    "warnings" => $warnings
]);

$conn->close();
?>