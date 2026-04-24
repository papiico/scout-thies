<?php
/**
 * Traitement du formulaire d'inscription
 * Scouts de Thiès
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Vérifier la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Inclure la connexion
require_once 'db.php';

// Récupérer et nettoyer les données
$fullname = trim($_POST['fullname'] ?? '');
$birth    = trim($_POST['birth'] ?? '');
$fonction = trim($_POST['fonction'] ?? '');
$district = trim($_POST['district'] ?? '');
$groupe   = trim($_POST['groupe'] ?? '');
$medical  = trim($_POST['medical'] ?? '');

// Validation
$errors = [];
if (empty($fullname)) $errors[] = 'Le prénom et nom est obligatoire';
if (empty($birth))    $errors[] = 'La date et lieu de naissance est obligatoire';
if (empty($fonction)) $errors[] = 'La fonction est obligatoire';
if (empty($district)) $errors[] = 'Le district est obligatoire';
if (empty($groupe))   $errors[] = 'Le groupe est obligatoire';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO inscriptions (fullname, birth, fonction, district, groupe, medical)
        VALUES (:fullname, :birth, :fonction, :district, :groupe, :medical)
    ");

    $stmt->execute([
        ':fullname' => htmlspecialchars($fullname),
        ':birth'    => htmlspecialchars($birth),
        ':fonction' => htmlspecialchars($fonction),
        ':district' => htmlspecialchars($district),
        ':groupe'   => htmlspecialchars($groupe),
        ':medical'  => htmlspecialchars($medical),
    ]);

    // --- ENVOI DE L'EMAIL ---
    $to = "comscouthies@gmail.com"; // Adresse de réception des inscriptions
    $subject = "Nouvelle Inscription : $fullname";
    
    $email_content = "Une nouvelle inscription a été reçue via le site web :\n\n";
    $email_content .= "Nom complet : $fullname\n";
    $email_content .= "Date/Lieu naissance : $birth\n";
    $email_content .= "Fonction : $fonction\n";
    $email_content .= "District : $district\n";
    $email_content .= "Groupe : $groupe\n";
    $email_content .= "Antécédents médicaux : " . ($medical ? $medical : 'Aucun') . "\n";
    
    $headers = "From: no-reply@scoutsthies.org\r\n";
    $headers .= "Reply-To: no-reply@scoutsthies.org\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    @mail($to, $subject, $email_content, $headers);
    
    // --- MODE TEST : Sauvegarde locale du mail (car XAMPP n'envoie pas de vrais mails sans config) ---
    $test_log = "--- NOUVEL EMAIL (" . date('Y-m-d H:i:s') . ") ---\n";
    $test_log .= "À : $to\nSujet : $subject\n\n$email_content\n" . str_repeat("-", 30) . "\n\n";
    file_put_contents("test_emails.txt", $test_log, FILE_APPEND);
    // ------------------------

    echo json_encode([
        'success' => true,
        'message' => 'Inscription enregistrée ! (Mail simulé dans test_emails.txt) 🎉'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage()
    ]);
}
