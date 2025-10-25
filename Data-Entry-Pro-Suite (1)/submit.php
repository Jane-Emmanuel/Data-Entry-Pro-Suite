<?php
$to = "thetechthriller@gmail.com";
$subject = "New Data Entry Submission";

$message = "";
foreach($_POST as $key => $value){
    $message .= ucfirst($key).": ".$value."\n";
}

$headers = "From: no-reply@yourdomain.com";

if(mail($to, $subject, $message, $headers)){
    echo "success";
} else {
    echo "error";
}
?>
