const boc = require('./bettingOddsCalculator')


var BHC = {

    pBhcBetAmount : function(){
        var betAmount = BHC.getBetAmount();
        if( boc.isString( betAmount ) || betAmount < 0 ){
            boc.showErrorMsg( 'e7', boc.errorResponsePlaceholder );
            return false;
        }
        boc.removeErrorMsg();
        BHC.runBhcCalculator();

    },
    pBhcAmericanOdds : function(){
        var myOdds = BHC.getMyOdds();
        var getAmericanOdds = boc.checkAmericanOdds( myOdds );  
        if( getAmericanOdds == 'e1' || getAmericanOdds == 'e2' ){
            boc.showErrorMsg( getAmericanOdds, boc.errorResponsePlaceholder );
            return false;
        }

        boc.removeErrorMsg();
        BHC.runBhcCalculator();
    },
    pBhcHeadgeOdds : function(){ 
        var headgeOdds = BHC.getHeadgeOdds();
        var getAmericanOdds = boc.checkAmericanOdds( headgeOdds );  
        if( getAmericanOdds == 'e1' || getAmericanOdds == 'e2' ){
            boc.showErrorMsg( getAmericanOdds, boc.errorResponsePlaceholder );
            return false;
        }

        boc.removeErrorMsg();
        BHC.runBhcCalculator();
    },
    runBhcCalculator : function(){
        var myOdds = BHC.getMyOdds();
        var betAmount = BHC.getBetAmount();
        var headgeOdds = BHC.getHeadgeOdds();

        var getDecimalOdds = boc.americanToDecimal( myOdds );
        var amountToWin = (betAmount * parseFloat( getDecimalOdds )) - betAmount;
        var totalPayout = boc.roundNumber( amountToWin + parseFloat( betAmount ), 2);

        var getHeadgeDecimalOdds = boc.americanToDecimal( headgeOdds );
        var headgeAmount = boc.roundNumber( (parseFloat( amountToWin ) + parseFloat( betAmount )) / getHeadgeDecimalOdds, 2 );

        var totalBet = boc.roundNumber( parseFloat( headgeAmount) + parseFloat( betAmount ), 2);

        var headgeProfit = boc.roundNumber( amountToWin - headgeAmount, 2 );

        var headgeProfit = boc.isNan( headgeProfit ) ? '0.00' : headgeProfit;
        var totalPayout = boc.isNan( totalPayout ) ? '0.00' : totalPayout;
        var totalBet = boc.isNan( totalBet ) ? '0.00' : totalBet;
        var headgeAmount = boc.isNan( headgeAmount ) ? '' : headgeAmount;

        // console.log( 'd : ' + getDecimalOdds +' fw : '+ amountToWin +' tpout: '+ totalPayout +' ha : '+ headgeAmount +' tb: '+ totalBet +' hp : '+ headgeProfit);

        $(".final-result-tp").text( 'US$ '+ totalPayout );
        $(".final-result-hp").text( '$ '+ headgeProfit );
        $(".tbm-amount").text( '$ '+ totalBet );
        $(".headge_amount").val( headgeAmount );


    },
    
    getMyOdds : function(){ 
        return $('.bhc_american_odds').val();
    },
    getBetAmount : function(){ 
        return $('.bet-amount-headging').val();
    },
    getHeadgeOdds : function(){ 
        return $('.headge_odds').val();
    }
    

};


module.exports = BHC;