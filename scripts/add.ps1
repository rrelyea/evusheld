param(
    [Parameter()]
    [String]$file
)
$sites = @('evusheld','paxlovid','bebtelovimab','sotrovimab','lagevrio')
foreach ( $site in $sites )
{
    cd ..\$site\
    "$site : git add $file"
    git add $file
}
cd ..\evusheld