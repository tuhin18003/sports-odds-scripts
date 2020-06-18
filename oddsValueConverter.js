const boc = require('./bettingOddsCalculator')


var OVC = {
    
    pOVCAmericanOdds : function(){
        var fValues = OVC.getOddsVal();
        var getAmericanOdds = boc.checkAmericanOdds( fValues );  
        if( getAmericanOdds == 'e1' || getAmericanOdds == 'e2' ){
            boc.showErrorMsg( getAmericanOdds, boc.errorResponsePlaceholder );
            return false;
        }

        boc.removeErrorMsg();
        
        OVC.calculateExpectedValue();
    },
    pOVCWager : function(){
        var wager = parseFloat( OVC.getWagerVal() );
        if( boc.isString( wager )){
            boc.showErrorMsg( 'e6', boc.errorResponsePlaceholder );
            return false;
        }
        boc.removeErrorMsg();
        OVC.calculateExpectedValue();
    },
    pOVCWinProbab: function(){ 
        var winProb = parseInt(  OVC.getWinProbVal() );
        if( boc.isString( winProb )){
            boc.showErrorMsg( 'e5', boc.errorResponsePlaceholder );
            return false;
        }
        else if( winProb > 100 ){
            boc.showErrorMsg( 'e5', boc.errorResponsePlaceholder );
            return false;
        }
        boc.removeErrorMsg();
        OVC.calculateExpectedValue();
    },
    calculateExpectedValue : function(){ 
        var probab = parseFloat(OVC.getWinProbVal());
        var wager = parseFloat( OVC.getWagerVal() );
        var amOdds = OVC.getOddsVal();

        var getDecimalOdds = boc.americanToDecimal( amOdds );
        var amountToWin = (wager * parseFloat( getDecimalOdds )) - wager;
        var probWining = probab;
        var probLoss = 100 - probWining;
        
        var expectedVal = boc.roundNumber((( amountToWin * probWining ) - ( probLoss * wager )) / 100, 2);

        if( Number.isNaN( Math.abs( expectedVal) )  ){
            return false;
        }

        $(".amount").text( '$ '+ expectedVal  );

    },
    getOddsVal : function(){
        return $(".am_odds").val();
    },
    getWagerVal : function(){
        return $(".wager").val();
    },
    getWinProbVal : function(){
        return $(".win_prob").val();
    }

};

module.exports = OVC;