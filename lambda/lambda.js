exports.handler = function( event, context ) {

    if ( event.request.intent ) {

        question = event.request.intent.slots.Question.value;
        getXML( question, context );

    } else output( 'The Ian will hear you now', context );

};

function getXML( input, context ) {

    //input = input.replace("abraham lincoln", "jfk");

    var http = require( 'http' );

    var url = 'http://api.wolframalpha.com/v2/query?input=' + input;
    url += '&format=plaintext&podindex=1,2,3';
    url += '&appid=EAL55P-UYQLAH8HJ7';

    var request = http.get( url, function( response ) {

        var xml = '';

        response.on( 'data', function( x ) { xml += x; } );

        response.on( 'end', function() {

            xml = xml.replace( /\n/g, ' ' );

            var pattern = /plaintext>(.*?)<\/plaintext/g;
            var answers = [];

            while ( ( match = pattern.exec( xml )) !== null ) {

                answers.push( match[1] );

            }

            var funnies_before = ["Obviously the answer is ", "Anyone with common sense knows that the logical answer is ","The most likely answer is "];
            var funny_before = funnies_before[Math.floor(Math.random()*funnies_before.length)];
            var funnies_after = [". The Ian would also like his circuits tweaked"," but, The Ian is pretty sure most people were aware of that already.", ". The Ian can't believe you did not know that!"];
            var funny_after = funnies_after[Math.floor(Math.random()*funnies_after.length)];

            if ( answers[1] === '' ) output( answers[2], context );
            else output( "The Ian says " + funny_before + answers[1] + funny_after, context );

        } );

    } );

    request.setTimeout( 4000, function() {

        output( 'Your request has timed out. Please try again.', context );

    } );

}

function output( text, context ) {

    var response = {
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        card: {
            type: "Simple",
            title: "The Ian",
            content: text
        },
        shouldEndSession: false
    };

    context.succeed( { response: response } );

}