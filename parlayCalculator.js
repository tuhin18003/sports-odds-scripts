const boc = require('./bettingOddsCalculator')

var pCal = {
    pParlayAmericanOdds : function(){
        var finalValues = pCal.getDynamicOdds();
        boc.showFialRoundResult( finalValues );
    },
    cParlayAmericanOdds : function(){
        var fValues = boc.getFieldValues();
        var getAmericanOdds = boc.checkAmericanOdds( fValues[ boc.fP_odds ] );  
        if( getAmericanOdds == 'e1' || getAmericanOdds == 'e2' ){
            boc.showErrorMsg( getAmericanOdds, boc.errorResponsePlaceholder );
            return false;
        }

        boc.removeErrorMsg();
        return fValues;
    },
    getDynamicOdds : function(){
        var fValues = boc.getFieldValues();
        var mdo = 1;
        $(".item").each(function(){
            var ao = $(this).children('.oa').text();
            fValues[ boc.fAmerican_odds ] = ao;
            var convertedValues = boc.oddsConverter( boc.fAmerican_odds, fValues );
            
            mdo = mdo * convertedValues.decimal_odds;
        });

        var po = boc.roundNumber( (parseFloat(mdo) - 1 ) * parseFloat(fValues[ boc.fBet_amount ] ), 2 )
        // console.log( po );
        var paylayResult = [];
        paylayResult[ boc.pay ] = po;
        paylayResult[ boc.payout ] = boc.roundNumber( parseFloat( po ) + parseFloat(fValues[ boc.fBet_amount ] ), 2);

        return paylayResult;
    }
};

module.exports = pCal;