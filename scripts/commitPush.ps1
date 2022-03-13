param(
    [Parameter()]
    [String]$message
)
$sites = @('bebtelovimab','paxlovid','sotrovimab')
foreach ( $site in $sites )
{
    cd ..\$site\
    git commit -m "$message"
    git push
}
cd ..\evusheld
