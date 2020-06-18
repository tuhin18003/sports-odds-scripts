import '@babel/polyfill'
import $ from 'jquery'
import { pBetAmount, pAmericanOdds, pDecimalOdds, pFractionalOdds, pImpliedOdds, resetCal } from './bettingOddsCalculator'
import { addBet, removeBet } from './domStaticElements'
import { pParlayAmericanOdds, cParlayAmericanOdds } from './parlayCalculator'
import { pOVCAmericanOdds, pOVCWager, pOVCWinProbab } from './oddsValueConverter'
import { pBhcBetAmount, pBhcAmericanOdds, pBhcHeadgeOdds } from './bettingHedgingCalculator'
import { pHcalSide1Odds, pHcalSide2Odds } from './holdCalculator'

$(document).ready(function(){
    
    $(".bet_type").on('change', function(){
        var bt = $(this).val();
        if( bt == 's' ){
            $(".section-parlayOdds").hide('slow');
            $(".single-bet").show('slow');
        }
        else if( bt == 'p' ){
            $(".section-parlayOdds").show('slow');
            $(".single-bet").hide('slow');
        }
        resetCal();
    });

    
    //betting odds calculator

    $(".bet_amount").on('keyup', function(){
        var bet_type = $(".bet_type").val();
        if( bet_type == 's' ){
            pBetAmount();
        }
        else if( bet_type == 'p' ){
            pParlayAmericanOdds();
        }
    });
    $(".american_odds").on('keyup', function(){
        pAmericanOdds();
    });
    $(".decimal_odds").on('keyup', function(){
        pDecimalOdds(); 
    });
    $(".frac_odds").on('keyup', function(){
        pFractionalOdds(); 
    });
    $(".impld_odds").on('keyup', function(){
        pImpliedOdds(); 
    });

    $(".impld_odds").on('keyup', function(){
        pImpliedOdds(); 
    });

    //parley calculator 
    $(".add-more-bet").on("click", function(){
        addBet();
    });

    $(".p_odds").on('keyup', function(){
        cParlayAmericanOdds(); 
    });
    
    $("body").on( 'click', '.itemXid', function(){
        var itemID = $(this).data('itemxid');
        removeBet( itemID );
    });


     //odds converter calculator   

    $(".am_odds").on('keyup', function(){
        pOVCAmericanOdds(); 
    });
    $(".wager").on('keyup', function(){
        pOVCWager(); 
    });
    $(".win_prob").on('keyup', function(){
        pOVCWinProbab(); 
    });

    
    $("body").on( 'click', '.bet-btn-reset', function(){
        $(".final-result-tp, .final-result-payout").text('US$ 0.00');
        $(".final-result-hp, .final-result-amount, .amount").text('$ 0.00');
    });
    

    // betting headge calculator
    $(".bet-amount-headging").on('keyup', function(){
        pBhcBetAmount();
    });
    $(".bhc_american_odds").on('keyup', function(){
        pBhcAmericanOdds();
    });
    $(".headge_odds").on('keyup', function(){
        pBhcHeadgeOdds();
    });

    //hold calculator
    $(".hc_side_1_odds").on('keyup', function(){
        pHcalSide1Odds();
    });
    $(".hc_side_2_odds").on('keyup', function(){
        pHcalSide2Odds();
    });


});
