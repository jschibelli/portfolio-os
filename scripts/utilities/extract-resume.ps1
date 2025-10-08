$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = Join-Path (Get-Location) "apps\site\data\John-Schibelli-Resume-2025.docx"
$doc = $word.Documents.Open($docPath)
$text = $doc.Content.Text
$doc.Close()
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Output $text

