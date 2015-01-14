function onCancelClick( event ) {
    clearForm();
}

function clearForm() {
    $("#email").val( "" );
    sigCapture.clear();
    $("#feedback").html( "" );
}


// JavaScript Document
var sigCapture = null;

$(document).ready(function(){
    $('#content-feedback-grid').pep({
        useCSSTranslation: false,
        constrainTo: 'parent',
        drag: function(a, b, c){
            setTimeout(function(){
                 var $dragable_el = $("#content-feedback-grid");

                var value_max = 205; //the grid max
                var value_min = 0;

                //Calculate the presentation percent:
                var presentation_percent = ( parseInt( $dragable_el.css("top") ) / value_max ) * 100;
                presentation_percent = parseInt(100 - presentation_percent);

                if ( presentation_percent <= 30 ){
                    $("#percent-presentation").addClass("bad bold").text(presentation_percent + "%");
                } else if (presentation_percent >= 75) {
                    $("#percent-presentation").addClass("good bold").text(presentation_percent + "%");
                } else {
                    $("#percent-presentation").removeClass("bad good bold").text(presentation_percent + "%");
                }

                //Calculate the content percent:
                var content_percent = ( parseInt( $dragable_el.css("left") ) / value_max ) * 100;
                content_percent = parseInt(content_percent);

                if ( content_percent <= 30 ){
                    $("#percent-content").addClass("bad bold").text(content_percent + "%");
                } else if( content_percent >= 75 ){
                    $("#percent-content").addClass("good bold").text(content_percent + "%");
                } else {
                    $("#percent-content").removeClass("bad good bold").text(content_percent + "%");
                }
            }, 100);
        }
    });

    sigCapture = new SignatureCapture( "draw_box" );
    $("#clear").click( onCancelClick );

    $("#send").on("click", function(){
        $("#feedback_content, .header").fadeOut(function(){
            $("#thank_you").fadeIn();
        });
    });
});