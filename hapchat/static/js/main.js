(function (window, $) {

    var debounce = window.debounce = function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    var path = $('body').data('href');

    var setActive = function (currentpath) {

        $('.navbar a').parent().removeClass('active');
        $('.navbar a[href="' + currentpath + '"]').parent().addClass('active');
    };


    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

    var photoCapture = function () {

        var video = $('#videoElement').get(0);
        var $fileSelect = $('#fileselect');
        var $previewImage = $('#preview');
        var $success = $('.alert-success');
        var $failure = $('.alert-danger');
        var $save = $('#save');

        var printMessage = function (container, message) {

            container.find('i').html('&nbsp' + message);
            container.fadeIn(500, function () {

                setTimeout(function () {

                    container.fadeOut();
                }, 3000);
            });
        };

        var handleVideo = function (stream) {

            // If found attach feed to video element
            video.src = window.URL.createObjectURL(stream);
        };

        var videoError = function videoError () {

            printMessage($failure, 'Unable to access WebCam! Use the file uploader or use a different computer.');
        };

        // http://www.purplesquirrels.com.au/2013/08/webcam-to-canvas-or-data-uri-with-html5-and-javascript/
        if (navigator.getUserMedia) {

            // Get webcam feed if available
            navigator.getUserMedia({ video: true }, handleVideo, videoError);
        }

        var capture = function () {

            if (video.paused || video.ended) {
                // If no video, exit here
                return false;
            }

            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            $('#preview').attr('src', canvas.toDataURL());
        };

        $('#freeze').on('click',function () {

            $save.removeClass('disabled');
            capture();
        });

        $save.on('click', function () {

            var form = new FormData();
            form.append('image', $previewImage.attr('src'));

            $.ajax({
                url: '/upload',
                type: 'POST',
                data: form,
                processData: false,
                contentType: false
            }).done(function () {

                printMessage($success, 'Image was successfully uploaded.');
            }).fail(function () {

                printMessage($failure, 'There was a problem uploading your image.');
            }).always(function () {

                $save.addClass('disabled');
                $previewImage.attr('src','');
            });
        });

        // For iOS
        $fileSelect.on('change', function () {

            var fileReader = new FileReader();
            // Get selected file (camera capture)
            var files = $fileSelect.get(0).files;
            var file = files[0];

            fileReader = new FileReader();
            fileReader.onload = function () {

                $previewImage.attr('src', fileReader.result);
            };

            // Get captured image as data URI
            fileReader.readAsDataURL(file);
        });
    };

    var createSocket = function () {

        var socketPath = window.location.origin.replace('http', 'ws');
        var socket = new WebSocket(socketPath);
        var imagesPath = window.location.origin + '/static/photos/';
        var photosPage = window.location.origin + '/photos/';
        var feed = $('#feed');

        var processPhoto = function (msg) {

            var imagePath = imagesPath + msg.data + '.png';
            var photoPage = photosPage + msg.data;
            var container = $('<div></div>').addClass('photo-container col-md-6 col-sm-12');
            var anchor = $('<a></a>').attr('href', photoPage);
            var image = $('<img />').attr('src', imagePath).attr('alt','').addClass('hapchat-photo');

            feed.prepend(anchor.append(container.append(image)));
        };

        socket.onmessage = processPhoto;
    };

    $(document).ready(function () {

        setActive(path);

        if (path === '/upload') {
            photoCapture();
        }
        if (path === '/photos') {
            createSocket();
        }
    });
}(window, jQuery));
