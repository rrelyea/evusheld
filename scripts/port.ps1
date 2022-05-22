param(
    [Parameter()]
    [String]$file
)
$sites = @('evusheld','paxlovid','bebtelovimab','sotrovimab','lagevrio')
foreach ( $site in $sites )
{
    if ($site -ne 'evusheld' -and (-not $file.StartsWith("package") -and -not $file.EndsWith((".json"))))
    {
        "$site : Port $file to ..\$site\$file"
        Copy-Item $file ..\$site\$file
    }
    cd ..\$site\
    "$site : git add $file"
    git add $file
}
cd ..\evusheld