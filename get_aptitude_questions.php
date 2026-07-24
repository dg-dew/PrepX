<?php
header('Content-Type: application/json');

// Mock backend endpoint providing structured questions
$questions = [
    [
        "id" => 1,
        "category" => "Quantitative Aptitude",
        "question" => "A train 180m long running at 72 km/h crosses a pole in how many seconds?",
        "options" => ["8 seconds", "9 seconds", "10 seconds", "12 seconds"],
        "answer" => 1
    ],
    [
        "id" => 2,
        "category" => "Logical Reasoning",
        "question" => "If 'A' denotes addition, 'B' denotes multiplication, and 'C' denotes subtraction, what is 5 B 4 A 10 C 6?",
        "options" => ["20", "24", "28", "18"],
        "answer" => 1
    ],
    [
        "id" => 3,
        "category" => "SQL & DBMS",
        "question" => "Which SQL clause is used to filter records that have aggregate functions applied?",
        "options" => ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
        "answer" => 2
    ]
];

echo json_encode(["status" => "success", "data" => $questions]);
?>