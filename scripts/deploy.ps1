$sites = @('evusheld', 'paxlovid','bebtelovimab','sotrovimab','lagevrio')
foreach ( $site in $sites )
{
    cd ..\$site\
    npm run deploy
}

cd ..\evusheld