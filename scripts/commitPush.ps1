param(
    [Parameter()]
    [String]$message
)
$sites = @('evusheld','bebtelovimab','paxlovid','sotrovimab','lagevrio')
foreach ( $site in $sites )
{
    "$site : git commit & git push"
    cd ..\$site\
    git commit -m "$message" -q
    git push -q
}
cd ..\evusheld
