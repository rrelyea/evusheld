$sites = @('evusheld','paxlovid','bebtelovimab','sotrovimab')
foreach ( $site in $sites )
{
    cd ..\$site\
    git pull
}
cd ..\evusheld