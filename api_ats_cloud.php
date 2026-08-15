<?php
header("Content-Type: application/json");
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jobDesc = $_POST['job_description'] ?? '';

    if (!isset($_FILES['resume_file']) || $_FILES['resume_file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'Please upload a valid resume file.']);
        exit;
    }

    $fileTmpPath = $_FILES['resume_file']['tmp_name'];
    $fileName = $_FILES['resume_file']['name'];
    
    // Read raw file contents
    $rawContent = file_get_contents($fileTmpPath);
    
    // Clean binary junk characters to extract readable text words
    $cleanText = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $rawContent);

    // Text processing and keyword evaluation matching
    $jdWords = array_unique(array_filter(explode(' ', strtolower(preg_replace('/[^\p{L}\p{N}\s]/u', '', $jobDesc)))));
    $resumeWords = array_unique(array_filter(explode(' ', strtolower($cleanText))));

    $stopWords = ['and', 'the', 'to', 'a', 'of', 'in', 'for', 'is', 'on', 'with', 'an', 'as', 'by', 'at', 'this', 'that', 'from', 'or', 'are', 'be', 'our', 'you', 'your'];
    $keyJdWords = array_diff($jdWords, $stopWords);

    if (empty($keyJdWords)) {
        echo json_encode(['success' => true, 'score' => 0, 'match_level' => 'POOR', 'matched_keywords' => [], 'missing_keywords' => []]);
        exit;
    }

    $matched = array_intersect($keyJdWords, $resumeWords);
    $missing = array_diff($keyJdWords, $resumeWords);
    
    // Calculate dynamic score with a baseline boost for testing visibility
    $baseCount = count($keyJdWords);
    $matchCount = count($matched);
    $score = $baseCount > 0 ? min(98, max(15, round(($matchCount / $baseCount) * 100) + 25)) : 20;
    
    $matchLevel = $score >= 75 ? 'EXCELLENT' : ($score >= 45 ? 'MODERATE' : 'POOR');
    
    $missingList = array_values(array_slice($missing, 0, 10));
    $matchedList = array_values(array_slice($matched, 0, 10));

    try {
        $stmt = $pdo->prepare("INSERT INTO ats_analysis_logs (user_id, ats_score, match_level, matched_keywords, missing_keywords) VALUES (?, ?, ?, ?, ?)");
        $userId = $_POST['user_id'] ?? 1;
        $stmt->execute([
            $userId, 
            $score, 
            $matchLevel, 
            json_encode(array_values($matched)), 
            json_encode(array_values($missing))
        ]);

        echo json_encode([
            'success' => true,
            'status' => 'success',
            'score' => $score,
            'ats_score' => $score,
            'match_level' => $matchLevel,
            'matched' => $matchedList,
            'missing' => $missingList,
            'matched_keywords' => array_values($matched),
            'missing_keywords' => array_values($missing),
            'log_id' => $pdo->lastInsertId()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>