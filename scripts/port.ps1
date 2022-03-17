param(
    [Parameter()]
    [String]$file
)
$sites = @('paxlovid','bebtelovimab','sotrovimab')
foreach ( $site in $sites )
{
    "Port $file to ..\$site\$file"
    Copy-Item $file ..\$site\$file
    cd ..\$site\
    git add $file
}
cd ..\evusheld