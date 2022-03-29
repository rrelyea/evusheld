param(
    [Parameter()]
    [String]$file
)
$sites = @('evusheld','paxlovid','bebtelovimab','sotrovimab')
foreach ( $site in $sites )
{
    if ($site -ne 'evusheld')
    {
        "$site : Port $file to ..\$site\$file"
        Copy-Item $file ..\$site\$file
    }
    cd ..\$site\
    "$site : git add $file"
    git add $file
}
cd ..\evusheld