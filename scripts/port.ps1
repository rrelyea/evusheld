param(
    [Parameter()]
    [String]$file
)
$sites = @('evusheld','paxlovid','bebtelovimab','sotrovimab')
foreach ( $site in $sites )
{
    if ($site -ne 'evusheld')
    {
        "Port $file to ..\$site\$file"
        Copy-Item $file ..\$site\$file
    }
    cd ..\$site\
    git add $file
}
cd ..\evusheld