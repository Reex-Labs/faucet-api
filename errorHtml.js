export default (path) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET ${path}</pre>
</body>
</html>
`
}