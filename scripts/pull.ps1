$sites = @('evusheld','paxlovid','bebtelovimab','sotrovimab')
foreach ( $site in $sites )
{
    "$site : git pull"
    cd ..\$site\
    git pull -q
}
cd ..\evusheld