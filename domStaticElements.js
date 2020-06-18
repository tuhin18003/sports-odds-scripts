const boc = require('./bettingOddsCalculator')
const pCal = require('./parlayCalculator')

var domElem =  {

    addBet : function(){
        var domid = Math.abs(  $(this).data('lastid') );
        var betAmount = $(".p_odds").val();
        
        var getAmericanOdds = boc.checkAmericanOdds( betAmount );  
        if( getAmericanOdds == 'e1' || getAmericanOdds == 'e2' ){
            boc.showErrorMsg( getAmericanOdds, boc.errorResponsePlaceholder );
            return false;
        }

        betAmount = betAmount > 0 ? '+' + betAmount : betAmount;
        domid =  Number.isNaN( domid ) || domid == 0 ? 1 : parseInt( domid ) + 1; 
        $(this).data('lastid', domid );
        
        var dom = '<div id="item_'+domid+'" class="item" data-itemid="'+domid+'">'+
                    '<span class="oa">'+betAmount+'</span>'+
                    '<span>Bet '+domid+'</span>'+
                    '<span class="dashicons dashicons-dismiss itemXid" data-itemxid="'+domid+'">X</span>'+
                '</div>';
         
         $( dom ).appendTo('.more-bet-pholder');     
         
        //run calculator
        pCal.pParlayAmericanOdds();
    },
    removeBet : function( itemID ){
        $("#item_" + itemID ).hide().remove();
        //run calculator
        pCal.pParlayAmericanOdds();
    }

};

module.exports = domElem;