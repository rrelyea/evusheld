$sites = @('bebtelovimab','paxlovid','sotrovimab')
foreach ( $site in $sites )
{
    cd ..\$site\
    npm run deploy
}

cd ..\evusheld