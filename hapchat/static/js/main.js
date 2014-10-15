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

    var setActive = function (currentpath) {

        $('.navbar a').parent().removeClass('active');
        $('.navbar a[href="' + path + '"]').parent().addClass('active');

    };

    var path = $('body').data('href');

    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

    var photoCapture = function () {

        var video = $('#videoElement').get(0);
        var $fileSelect = $('#fileselect');
        var $previewImage = $('#preview');

        var handleVideo = function (stream) {

            // if found attach feed to video element
            video.src = window.URL.createObjectURL(stream);
        };

        var videoError = function videoError () {

            alert('Unable to access WebCam! Use the file uploader or use a different computer');

        };

        // http://www.purplesquirrels.com.au/2013/08/webcam-to-canvas-or-data-uri-with-html5-and-javascript/
        if (navigator.getUserMedia) {

            // get webcam feed if available
            navigator.getUserMedia({ video: true }, handleVideo, videoError);
        }

        var capture = function () {

            if (video.paused || video.ended) {
                // if no video, exit here
                return false;
            }

            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            $('#preview').attr('src', canvas.toDataURL());
        };

        $('#freeze').on('click',function () {

            capture();
        });

        $('#save').on('click', function () {

            var form = new FormData();
            form.append('image', $previewImage.attr('src'));

            $.ajax({
                url: '/upload',
                type: 'POST',
                data: form,
                processData: false,
                contentType: false
            }).done(function () {

                alert('Image was successfully uploaded');
            }).fail(function () {

                alert('There was a problem uploading your image')
            }).always(function () {

                $previewImage.attr('src','');
            });
        });

        // for iOS
        $fileSelect.on('change', function () {

            var fileReader = new FileReader();
            // get selected file (camera capture)
            var files = $fileSelect.get(0).files;
            var file = files[0];

            fileReader = new FileReader();
            fileReader.onload = function () {

                $previewImage.attr('src', fileReader.result);
            };

            // get captured image as data URI
            fileReader.readAsDataURL(file);
        });
    };

    $(document).ready(function () {

        setActive(path);

        if (path === '/upload') {
            photoCapture();
        }
    });

}(window, jQuery));
