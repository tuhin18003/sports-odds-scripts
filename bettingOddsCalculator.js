// import $ from "jquery"

var boc = {
    errorResponsePlaceholder : '.error-response',
    errorDiv : '.error-response-section',
    fBet_amount : 'bet_amount',
    fAmerican_odds : 'american_odds',
    fDecimal_odds : 'decimal_odds',
    fFrac_odds : 'frac_odds',
    fImpld_odds : 'impld_odds',
    fP_odds : 'p_odds',
    pay : 'pay',
    payout : 'payout',
    getFieldValues : function(){
        var fValues = [];
        fValues[ boc.fBet_amount ] = boc.getBetAmount();  
        fValues[ boc.fAmerican_odds ] = boc.getAmericanOdds();  
        fValues[ boc.fDecimal_odds ] = boc.getDecimalOdds();
        fValues[ boc.fFrac_odds ] = boc.getFractionalOdds();
        fValues[ boc.fImpld_odds ] = boc.getImpliedOdds();
        fValues[ boc.fP_odds ] = boc.getParlayAmericanOdds();
        return fValues;
    },
    runCalculator : function( convertedValues = [], fValues = [] ){
        
        var fValues = fValues.length == 0 ? boc.getFieldValues() : fValues;
        // console.log( boc.isEmptyObject( convertedValues) );

        var convertedValues = boc.isEmptyObject( convertedValues) === true ? fValues : convertedValues;
        // console.log( convertedValues );

        boc.showFinalValues( convertedValues );
    },
    showFinalValues : function( fValues ){
        boc.removeErrorMsg();
        for ( const [key,value] of Object.entries( fValues ) ) {
            // console.log( 'final k:' + key +' v : '+ value);
            if( value ){
                $("." + key ).val( value );
                if( key == boc.fFrac_odds ){
                    $('.' + boc.fFrac_odds + '_val_hold' ).text( value );
                    // console.log( value );
                }

                if( key == boc.fImpld_odds && value == 100 ){
                    $("." + boc.fAmerican_odds ).val('-Infinity');
                }
            }
        }

        //show payout calculation
        boc.showFialRoundResult(
            boc.getFinalResults( fValues )
        );

    },
    showFialRoundResult : function( finalValues ) { 
        $(".final-result-amount").text( '$ '+ parseFloat( finalValues[ boc.pay ] ) );
        $(".final-result-payout").text( 'US$ '+ finalValues[ boc.payout ] );
    },
    getFinalResults : function( fValues ){
        var result = [];
        result[ boc.pay ] = 0;
        result[ boc.payout ] = 0;
        var betAmount = Math.abs(fValues[ boc.fBet_amount ]);
        if( Number.isNaN( betAmount ) === false && betAmount > 0 ){
            
            var fractionOdds =  fValues[ boc.fFrac_odds ].split('/');
    
            var pay = boc.roundNumber( ( parseFloat( betAmount ) *  parseFloat( fractionOdds[0] ) ) / parseFloat( fractionOdds[ 1 ]), 2);
            var totalPayout = boc.roundNumber( (parseFloat(betAmount) + parseFloat(pay)) , 2);
            // console.log( 'pay : ' + pay +' payout : '+ totalPayout);

            result[ boc.pay ] = Number.isNaN( pay ) ? 0 : pay;
            result[ boc.payout ] = Number.isNaN( totalPayout ) ? betAmount : totalPayout;
        }

        // console.log( result );

        return result;
    },
    pBetAmount : function(){
        var fValues = boc.getFieldValues();
        var bVal = Math.abs( fValues[ boc.fBet_amount ] );
        if( !bVal || Number.isNaN(bVal) || bVal <= 0 ){
            return false;
        }
        
        boc.defaultValues( false, fValues );
        var fValues = boc.getFieldValues();
        var convertedValues = boc.oddsConverter( boc.fBet_amount, fValues );
        boc.runCalculator( convertedValues, fValues );
    },
    pAmericanOdds : function(){
        
        var fValues = boc.getFieldValues();
        var getAmericanOdds = boc.checkAmericanOdds( fValues['american_odds'] );  
        if( getAmericanOdds == 'e1' || getAmericanOdds == 'e2' ){
            boc.showErrorMsg( getAmericanOdds, boc.errorResponsePlaceholder );
            return false;
        }

        var convertedValues = boc.oddsConverter( boc.fAmerican_odds, fValues );
        boc.runCalculator( convertedValues, fValues );
    },
    checkAmericanOdds : function( oddNumb ){
        var dVal = Math.abs( oddNumb );
        if( typeof oddNumb === 'undefined' || !oddNumb || Number.isNaN( dVal )){
            return 'e2';
        }
        else if ( oddNumb < 100 && oddNumb >= -99 ){
            return 'e1';
        }

        return true;
    },
    pDecimalOdds : function (){
        var fValues = boc.getFieldValues();
        var dVal = Math.abs( fValues[ boc.fDecimal_odds ] );
        if( !fValues[ boc.fDecimal_odds ] || Number.isNaN( dVal ) ){
            boc.showErrorMsg( 'e2', boc.errorResponsePlaceholder );
            return false;
        }
        else if( parseFloat( fValues[ boc.fDecimal_odds ] ) <= 1 ){
            boc.showErrorMsg( 'e3', boc.errorResponsePlaceholder );
            return false;
        }

        var convertedValues = boc.oddsConverter( boc.fDecimal_odds, fValues );
        boc.runCalculator( convertedValues, fValues );
    },
    pFractionalOdds : function(){
        var fValues = boc.getFieldValues();
        fValues[ boc.fFrac_odds ] = boc.getFractionalOddsVal();

        var matchString = RegExp('[a-zA-Z]','g');
        var matchFormat = RegExp('^[0-9]{1,8}\/[0-9]{1,8}$','g');
        if( true === matchString.test( fValues[ boc.fFrac_odds ] ) ){
            boc.showErrorMsg( 'e2', boc.errorResponsePlaceholder );
            return false;
        }
        else if( false === matchFormat.test( fValues[ boc.fFrac_odds ] ) ){
            boc.showErrorMsg( 'e4', boc.errorResponsePlaceholder );
            return false;
        }
        
        var convertedValues = boc.oddsConverter( boc.fFrac_odds, fValues );
        boc.runCalculator( convertedValues, fValues );
    },
    pImpliedOdds : function(){ 
        var fValues = boc.getFieldValues();
        var iVal = Math.abs( fValues[ boc.fImpld_odds ] );
        if( fValues[ boc.fImpld_odds ] <= 0 || Number.isNaN(iVal) ){
            boc.showErrorMsg( 'e5', boc.errorResponsePlaceholder );
            return false;
        }
        
        var convertedValues = boc.oddsConverter( boc.fImpld_odds, fValues );
        boc.runCalculator( convertedValues, fValues );
    },
    getBetAmount: function(){
        return $('.bet_amount').val();
    },
    getAmericanOdds : function(){
        return $('.american_odds').val();
    },
    getDecimalOdds : function(){
        return $('.decimal_odds').val();
    },
    getFractionalOdds : function(){
        return $('.' + boc.fFrac_odds + '_val_hold' ).text();
    },
    getFractionalOddsVal : function(){
        return $('.' + boc.fFrac_odds ).val();
    },
    getImpliedOdds : function(){
        return $('.impld_odds').val();
    },
    getParlayAmericanOdds : function(){
        return $( '.' + boc.fP_odds ).val();
    },
    defaultValues : function( all = false, args = [] ){
        // console.log(  'dv : '+ args[ boc.fAmerican_odds ]);
        if( ! args[ boc.fAmerican_odds ]  || true === all ){
            $('.' + boc.fAmerican_odds).val(100);
        }

        if( !args[ boc.fDecimal_odds] || true === all ){
            $('.' + boc.fDecimal_odds).val(2);
        }

        if( !args[ boc.fFrac_odds ] || true === all ){
            $('.' + boc.fFrac_odds).val('1/1');
            $('.' + boc.fFrac_odds + '_val_hold' ).text('1/1');
        }

        if( !args[ boc.fImpld_odds ] || true === all ){
            $('.' + boc.fImpld_odds).val('50.00');
        }
    },
    oddsConverter : function( convertFrom, fValues = [] ){
        // console.log( fValues );
        if( convertFrom == boc.fAmerican_odds ){
            return boc.convertAmericanOddsToOther( fValues );
        }
        else if( convertFrom == boc.fDecimal_odds ){
            return boc.convertDecimalOddsToOther( fValues );
        }
        else if( convertFrom == boc.fFrac_odds ){
            return boc.convertFractionalOddsToOther( fValues );
        }
        else if( convertFrom == boc.fImpld_odds ){
            return boc.convertImpliedOddsToOther( fValues );
        }
        else if( convertFrom == boc.fBet_amount ){
            return fValues;
        }

    },
    convertAmericanOddsToOther : function( fValues = [] ){
        fValues[ boc.fDecimal_odds ] = boc.americanToDecimal( fValues[ boc.fAmerican_odds ] );
        fValues[ boc.fFrac_odds ] = boc.americanToFractional( fValues[ boc.fAmerican_odds ] );
        fValues[ boc.fImpld_odds ] = boc.americanToImplied( fValues[ boc.fAmerican_odds ] );

        return fValues;
    },
    americanToDecimal : function( americanOdds ){
        americanOdds = parseFloat( americanOdds );
        if( americanOdds > 0 ){ //positive odds
            return boc.roundNumber( (Math.abs( americanOdds ) / 100 ) + 1, 2 );
        }else{ //negative odds
            return  boc.roundNumber( (( 100 / Math.abs( americanOdds ) ) + 1), 3 );
        }
    },
    americanToFractional : function( americanOdds ){
        americanOdds = parseFloat( americanOdds );
        if( americanOdds > 0 ){ //positive odds
            return boc.reduceFractionalNumber( americanOdds, 100);
        }else{ //negative odds
            return boc.reduceFractionalNumber( 100, americanOdds);
        }
    },
    americanToImplied : function( americanOdds ){
        americanOdds = parseFloat( americanOdds );
        if( americanOdds > 0 ){ //positive odds
            return boc.roundNumber( (100 / ( americanOdds + 100)) * 100 , 2 );
        }else{ //negative odds
            return boc.roundNumber( ( Math.abs( americanOdds ) /( Math.abs( americanOdds ) +100)) * 100 , 2 );
        }
    },
    convertDecimalOddsToOther : function( fValues ){ 
        fValues[ boc.fAmerican_odds ] = boc.decimalToAmerican( fValues[ boc.fDecimal_odds ] );
        fValues[ boc.fFrac_odds ] = boc.americanToFractional( fValues[ boc.fAmerican_odds ] );
        fValues[ boc.fImpld_odds ] = boc.americanToImplied( fValues[ boc.fAmerican_odds ] );
        return fValues;
    }, 
    decimalToAmerican : function( decimalOdds ){
        decimalOdds = parseFloat( decimalOdds );
        if( decimalOdds >= 2 ){
            return boc.roundNumber( ( decimalOdds - 1 ) * 100, 0 );
        }else{
            return boc.roundNumber(  -100 / ( decimalOdds - 1) , 0 );
        }
    },
    convertFractionalOddsToOther : function( fValues ){ 
        fValues[ boc.fAmerican_odds ] = boc.fractionalToAmerican( fValues[ boc.fFrac_odds ] );
        fValues[ boc.fDecimal_odds ] = boc.americanToDecimal( fValues[ boc.fAmerican_odds ] );
        fValues[ boc.fImpld_odds ] = boc.americanToImplied( fValues[ boc.fAmerican_odds ] );
        return fValues;
    },
    fractionalToAmerican : function( fractionalOdds ){
        var fro = fractionalOdds.split('/');
        return boc.roundNumber( ( parseFloat(fro[0]) / parseFloat( fro[1] ) ) * 100, 0);
    },
    convertImpliedOddsToOther : function( fValues ){
        fValues[ boc.fAmerican_odds ] = boc.impliedToAmerican( fValues[ boc.fImpld_odds ] );
        fValues[ boc.fDecimal_odds ] = boc.americanToDecimal( fValues[ boc.fAmerican_odds ] );
        fValues[ boc.fFrac_odds ] = boc.americanToFractional( fValues[ boc.fAmerican_odds ] );
        console.log( fValues );
        return fValues;
    },
    impliedToAmerican : function( impliedOdds ){
        if( impliedOdds <= 50 ){
            return boc.roundNumber( (100 / ( parseFloat( impliedOdds ) / 100)) - 100, 0 );
        }else{
           return boc.roundNumber( (parseFloat( impliedOdds ) / (1 - (parseFloat( impliedOdds )/100))) * -1, 0 );
        }
    },
    roundNumber: function (num, places) { 
        return Number(Math.round(num+'e'+places)+'e-'+places);
    },
    roundToFixed : function( num, dp){ 
        return parseFloat(num).toFixed( dp );
    },
    reduceFractionalNumber  : function(numerator,denominator){
        var gcd = function gcd(a,b){
            return b ? gcd(b, a%b) : a;
        };
        gcd = gcd(numerator,denominator);
        return Math.abs( numerator/gcd ) +'/'+ Math.abs( denominator/gcd );
    },
    resetCal : function(){
        boc.removeErrorMsg();
        var fValues = boc.getFieldValues();
        for ( const [key,value] of Object.entries( fValues ) ) {
            // console.log( 'final k:' + key +' v : '+ value);
            if( value ){
                $("." + key ).val('');
                if( key == boc.fFrac_odds ){
                    $('.' + boc.fFrac_odds + '_val_hold' ).text('');
                }
            }
        }

        // reset final pay
        $(".final-result-amount").text( '$ 0.00' );
        $(".final-result-payout").text( 'US$ 0.00' );

    },
    isEmptyObject : function (obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    isFloat: function(n) {
        return n === +n && n !== (n|0);
    },
    isInt : function (n) {
        return n === +n && n === (n|0);
    },
    isString: function( testVal ){
        var matchString = RegExp('[a-zA-Z]','g');
        if( true === matchString.test( testVal ) ){
            return true;
        }
        return false;
    },
    isNan : function( number ){
        return Number.isNaN( Math.abs( number ) );
    },
    getErrorMsg : function( msgID ){
        var msgs = [];
        msgs['e1'] = 'American odds must be greater than 100 or less than -100';
        msgs['e2'] = 'Not valid odds';
        msgs['e3'] = 'Decimal odds must be greater than 1';
        msgs['e4'] = 'Fractional odds must be at least two digits seperated by a "/" ';
        msgs['e5'] = 'Win probability must be a number between 1 and 100';
        msgs['e6'] = 'Wager must be a valid number';
        msgs['e7'] = 'Invalid Stake';
        if( typeof msgs[ msgID ] !== 'undefined' ){
            return msgs[ msgID ];
        }
    },
    showErrorMsg : function( msgID, msgDom ){
        $( boc.errorDiv ).show();
        $( msgDom ).html( boc.getErrorMsg( msgID) ).show('slow');
    },
    removeErrorMsg : function(){
        $( boc.errorDiv ).hide();
        $( boc.errorResponsePlaceholder ).html('').hide('slow');
    }

};

module.exports = boc;