$files = Get-ChildItem -Path "src/routes/admin" -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace "import \{ supabase \} from '../../App'", "import supabase from '../../lib/supabase'"
    Set-Content $file.FullName $newContent
} 