const boc = require('./bettingOddsCalculator')

var hCal = {

    pHcalSide1Odds : function(){ 
        hCal.runHoldCalculator();
    },
    pHcalSide2Odds : function(){ 
        hCal.runHoldCalculator();
    },
    runHoldCalculator : function(){
        var odd1 = hCal.getSide1Odds();
        var odd2 = hCal.getSide2Odds();
        var oddType = hCal.getOddType();

        if( oddType == 'a' ){
            var dcmlOdd1 = boc.americanToImplied( odd1 );
            var dcmlOdd2 = boc.americanToImplied( odd2 );
        }
        else if( oddType == 'd' ){
            var dcmlOdd1 = boc.americanToImplied( boc.decimalToAmerican( odd1 ) );
            var dcmlOdd2 = boc.americanToImplied( boc.decimalToAmerican( odd2 ) );
        }
        else if( oddType == 'f' ){
            var dcmlOdd1 = boc.americanToImplied( boc.fractionalToAmerican( odd1 ) );
            var dcmlOdd2 = boc.americanToImplied( boc.fractionalToAmerican( odd2 ) );
        }

        var x = boc.roundNumber( (dcmlOdd1 + dcmlOdd2), 2 ) - 100;
        // var x = ( (1 / dcmlOdd1) + (1/dcmlOdd2) + ( 1 / y) ) - 100;
        
        // var x = boc.roundNumber( ( (1/ dcmlOdd1 )*100 + (1/dcmlOdd2)*100 ), 2 );
        // var x = boc.roundNumber( ((1/1.909)*100 + (1/2.3)*100) - 100, 2 );

        console.log( 'type : ' + oddType + ' o1 : ' + dcmlOdd1 +' o2 : '+ dcmlOdd2 +' x : '+ x);

    },
    getSide1Odds : function(){ 
        return $(".hc_side_1_odds").val();
    },
    getSide2Odds : function(){ 
        return $(".hc_side_2_odds").val();
    },
    getOddType : function(){ 
        return $(".hc_odd_type").val();
    }

};

module.exports = hCal;