(function (window, $) {

    var path = $('body').data('href');

    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

    var photoCapture = function () {

        // http://www.purplesquirrels.com.au/2013/08/webcam-to-canvas-or-data-uri-with-html5-and-javascript/

        var video = document.querySelector("#videoElement");

        if (navigator.getUserMedia) {

            // get webcam feed if available
            navigator.getUserMedia({video: true}, handleVideo, videoError);
        }

        function handleVideo (stream) {

            // if found attach feed to video element
            video.src = window.URL.createObjectURL(stream);
        }

        function videoError () {

            //TODO test this
            alert('No webcam found. Try the file uploader or try a new computer!');
            window.location.href = '/';
        }

        var videoElement = $('#videoElement').get(0);
        var canvas = $('canvas').get(0);
        var context = canvas.getContext('2d');
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var imgtag = $('#imgtag'); // get reference to img tag
        var sel = $('#fileselect'); // get reference to file select input element

        function draw (videoElement, context, width, height) {

            if(videoElement.paused || videoElement.ended) {
                // if no video, exit here
                return false;
            }

            context.drawImage(videoElement, 0, 0, width, height); // draw video feed to canvas

            var uri = canvas.toDataURL("image/png");
            imgtag.attr('src', uri);
        }

        $('#freeze').on('click',function() {

            draw(videoElement, context, canvasWidth, canvasHeight); // when save button is clicked, draw video feed to canvas
        });

        $('#save').on('click', function () {

            var form = new FormData();
            form.append('image', imgtag.attr('src'));

            $.ajax({
                url: '/upload',
                type: 'POST',
                data: form,
                processData: false,
                contentType: false
            });
        });

        // for iOS

        // create file reader
        var fr;

        sel.on('change',function(e){

            // get selected file (camera capture)
            var f = sel.files[0];

            fr = new FileReader();
            fr.onload = function () {

                imgtag.src = fs.result;
            };

            fr.readAsDataURL(f); // get captured image as data URI
        });



            /*$.ajax({
             type: 'POST',
             url: '/upload',
             //data: requestData.payload,
             //contentType: 'multipart/form-data; boundary=' + requestData.boundary,
             data: {
             user: (new Date()).getTime(),
             image: canvas[0].toDataURL('image/jpeg')
             },
             contentType: false,
             processData: false,
             cache: false//,
             //success,
             //failure
             }); */
    };

    $(document).ready(function() {

        if (path === '/photo') {
            photoCapture();
        }
    });

}(window, jQuery));
