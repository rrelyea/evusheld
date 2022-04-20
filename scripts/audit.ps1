$sites = @('evusheld','paxlovid','bebtelovimab','sotrovimab','lagevrio')
foreach ( $site in $sites )
{
    "$site : npm audit $Args[0]"
    cd ..\$site\
    npm audit $Args[0]
}
cd ..\evusheld