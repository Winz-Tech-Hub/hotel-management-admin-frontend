<?php
$command = 'cd ../ && git pull';
$output = shell_exec($command);
if ($output) {
    echo $output;
} else {
    echo "Error";
}
/* 
<?php
// Get the current request URL
$currentUrl = $_SERVER['REQUEST_URI'];

// Split the URL based on "sync/"
$parts = explode("sync/", $currentUrl);

// Check if the split produced at least two parts
if (count($parts) >= 2 && !empty($parts[1])) {
    // The desired string is in the second part
    $repo = $parts[1];

    $command = './git.sh ' . escapeshellarg($repo);
    $output = shell_exec($command);
    send(200, $output);
} else {
    send(400, "Invalid URL format not found.");
}


function send($statusCode = 200, $message = "Success")
{
    echo $message;
    header("HTTP/1.1 $statusCode $message");
}
?>
*/
?>