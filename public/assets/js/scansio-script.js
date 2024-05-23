var player;
var retryPreview = 0;

function folderClick() {
    $('.click').on('click', (e) => {
        e.preventDefault();
        let path = e.currentTarget
        $.get('../dashboard?path=' + path.innerText, (data) => {
            $('.main').html(data);
            folderClick();
        });
    });
}

function formSubmit() {
    $('.form').submit(() => {
        var submit = this.event.target;
        submit.disabled = true;
        submit.innerHTML = '';
        submit.className += " spinner-border spinner-border-sm";
    });
}

function nonRequestDialog(data, ele, size, timeout = 5000, callback = () => { }) {
    $("#" + ele + " .modal-dialog").removeClass("modal-sm");
    $("#" + ele + " .modal-dialog").removeClass("modal-md");
    $("#" + ele + " .modal-dialog").removeClass("modal-lg");
    if (size) {
        switch (size) {
            case "sm":
                $("#" + ele + " .modal-dialog").addClass("modal-sm");
                break;
            case "md":
                $("#" + ele + " .modal-dialog").addClass("modal-md");
                break;

            case "lg":
                $("#" + ele + " .modal-dialog").addClass("modal-lg");
                break;
        }
    }
    loader()
    $("#" + ele + " .modal-dialog .modal-content").html(data);
    loader();
    _(ele).modal('show');
    callback();
    setTimeout(() => _(ele).modal('hide'), timeout);
}

function redirect(url) {
    setTimeout(() => window.location = url, 1000);
}

function filter_books(e) {
    this.event.preventDefault();
    window.location = base_url + `list_books/${e[0].value}/${e[1].value}/${e[2].value}`;
}

function filter_courses(e) {
    this.event.preventDefault();
    window.location = base_url + `list_courses/${e[0].value}/${e[1].value}`;
}

function save() {
    var markup = $('.summernote').summernote('code');
    $.post({
        url: '../books/book_id/chapter_id', type: 'post', dataType: 'text/html', data: markup, success: (e) => {
            alert('saved');
        }, failure: (e) => {
            alert('Can\'t save right now');
        }
    });
    $('.summernote').summernote('destroy');
}

function edit() {
    $('.summernote').summernote({ focus: true });
}

function pay4course(e) {
    let username = $.trim($('input[name="username"]').val());
    let amount = $.trim($('input[name="amount"]').val());
    let action = e.target.action;
    let pay = $('.pay');
    pay.attr('disabled', true);
    let password = $.trim($('#pass').val());
    let dat = new FormData();
    dat.append('username', username + '');
    dat.append('amount', amount + '');
    dat.append('password', password);
    let option = {
        url: action,
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: dat,
        complete: (xhr, statusText) => {
            pay.attr('disabled', false);
            let result = xhr.responseJSON;
            if (result && result['status'] === true) {
                nonRequestDialog(boxDialog("javascript:", 'Message', result['info'], "$('#gen-modal').modal('close')"), 'gen-modal', 'md');
                redirect(result['redirect'])
            } else {
                if (result) {
                    nonRequestDialog(boxDialog("javascript:", 'Message', result['info'], "$('#gen-modal').modal('close')"), 'gen-modal', 'md');
                } else {
                    nonRequestDialog(boxDialog("javascript:", 'Message', xhr.responseText, "$('#gen-modal').modal('close')"), 'gen-modal', 'md');
                }
            }
        }
    };
    $.ajax(option);

}

function boxDialog(okHref, title, body, okOnClick = '() => {}') {
    let dialog = '<div class="col-xs-12">'
        + '    <div class="box box-border"> '
        + '        <div class="box-header with-border"> '
        + '            <p class="text-center">' + title + ' </p>'
        + '        </div> '
        + '        <div class="box-body text-center"> ' +
        '               <div class="btn-block btn-danger text-center text-bold text-white">' +
        '                   <span id="error"></span>' +
        '               </div>'
        + '            ' + body
        + '        </div> <div class="btn-block btn-default text-center text-bold "><span id="result"></span></div>'
        + '        <div class="box-footer text-center"> '
        + '             <a href="' + okHref + '" class="btn btn-default btn-md center text-center no-border ok" onclick="' + okOnClick + '" >Ok</a> '
        + '        </div> '
        + '    </div> '
        + '</div>';
    return dialog;
}

$(() => {
    const summernote = $('.summernote');
    if (summernote.length > 0) {
        summernote.summernote({
            height: 200,
        });
    }

    let video = $('.show-local-video');
    if (video.length > 0) {
        video.change((e) => {
            let video = document.createElement('video');
            video.setAttribute('src', URL.createObjectURL(e.target.files[0]));
            video.className += " video s-200h s-100w-p";
            video.autoplay = true
            video.controls = true
            video.height = 200;
            video.addEventListener('loadedmetadata', (e) => {
                let slvd = $('.show-local-video-duration');
                if (slvd)
                    slvd.val(e.target.duration);
            });
            let vcontainer = document.getElementById('v-container');
            try {
                $(vcontainer).find(".video").remove();
            } catch (e) { }
            vcontainer.appendChild(video);
        });
    }

    let vurl = $('#vurl');
    if (vurl.length > 0) {
        vurl.change((e) => {
            let video = document.createElement('video');
            let url = vurl.val();
            let temp;
            if ((temp = is_drive_link(url)) && temp !== -1) {
                url = base_url + "get-video/" + vurl.data('cid') + "/" + temp;
            }
            video.setAttribute('src', url);
            video.className += " video s-200h s-100w-p";
            video.autoplay = true
            video.controls = true
            video.height = 200;
            video.addEventListener('loadedmetadata', (e) => {
                let slvd = $('.show-local-video-duration');
                if (slvd)
                    slvd.val(e.target.duration);
            });
            let vcontainer = document.getElementById('v-container');
            try {
                $(vcontainer).find(".video").remove();
            } catch (e) { }
            vcontainer.appendChild(video);
        });
    }

    let vid = $('#vid');
    if (vid.length > 0) {
        vid.change((e) => {
            let video = document.createElement('video');
            let url = base_url + "get-video/" + vid.data('cid') + "/" + vid.val();
            video.setAttribute('src', url);
            video.className += " video s-200h s-100w-p";
            video.autoplay = true
            video.controls = true
            video.height = 200;
            video.addEventListener('loadedmetadata', (e) => {
                let slvd = $('.show-local-video-duration');
                if (slvd)
                    slvd.val(e.target.duration);
            });
            let vcontainer = document.getElementById('v-container');
            try {
                $(vcontainer).find(".video").remove();
            } catch (e) { }
            vcontainer.appendChild(video);
        });
    }

    let thumbnail = $('input[name="thumbnail"]');
    if (thumbnail.length > 0) {
        thumbnail.change((e) => {
            let reader = new FileReader();
            reader.onloadend = (evt) => {
                let displayThumbnail = $('#display-thumbnail');
                if (displayThumbnail.length > 0) {
                    displayThumbnail.attr('src', evt.target.result);
                } else {
                    let img = document.createElement("img");
                    img.src = evt.target.result;
                    img.height = 200;
                    let labelForImg = $('#label-for-img');
                    labelForImg.append(img);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        });
    }

    let deleteWarning = $('.delete-permanent');
    if (deleteWarning.length > 0)
        deleteWarning.click((e) => {
            e.preventDefault();
            let dialogBody = '<p>This Topic will be permanently delete.</p>  '
                + '            <p class="label-danger"> '
                + '                Are you sure? '
                + '            </p> ';

            nonRequestDialog(boxDialog(e.target.href, 'Warning', dialogBody), 'gen-modal', 'md', 7000);
            let deleteBtn = $('.ok');
            if (deleteBtn.length > 0) {
                deleteBtn.click((e) => {
                    e.preventDefault();
                    let thisDeleteBtn = $(e.target);
                    thisDeleteBtn.hide();
                    $(thisDeleteBtn[0].parentElement).prepend("<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Deleting...</span>");
                    let option = {
                        url: e.target.href,
                        type: 'GET',
                        complete: (xhr, statusText) => {
                            $('#preview-loader').remove();
                            thisDeleteBtn.show();
                            let result = xhr.responseJSON;
                            if (result) {
                                if (result['status']) {
                                    nonRequestDialog(result['info'], 'gen-modal', 'md');
                                    redirect(result['redirect'])
                                }
                            }
                        }
                    };
                    $.ajax(option);
                });
            }
        });

    let pay4course_form = $('#pay4course-form');
    if (pay4course_form.length > 0) pay4course_form.submit((e) => {
        e.preventDefault();
        pay4course(e);
    });

    /* let ytpc = $('#ytp-container');
    if (ytpc.length > 0) initYoutubePlayerIframe('v-container')
 */
    let ytp_url_input = $('.v-url-input');
    if (ytp_url_input.length > 0) ytp_url_input.change((evt) => {
        validateAndPlayVideo($(evt.target).val())
    });

    let booK_editing_form = $('#book-editing-form');
    if (booK_editing_form.length > 0) ajaxForm(booK_editing_form, callbackBefore, formSubmitCallback);

    let booK_creating_form = $('#book-creating-form');
    if (booK_creating_form.length > 0) ajaxForm(booK_creating_form, callbackBefore, formSubmitCallback);

    let course_editing_form = $('#course-editing-form');
    if (course_editing_form.length > 0) ajaxForm(course_editing_form, callbackBefore, formSubmitCallback);

    let course_creating_form = $('#course-creating-form');
    if (course_creating_form.length > 0) ajaxForm(course_creating_form, callbackBefore, formSubmitCallback);

    let topic_editing_form = $('#topic-editing-form');
    if (topic_editing_form.length > 0) ajaxForm(topic_editing_form, callbackBefore, formSubmitCallback);

    let topic_creating_form = $('#topic-creating-form');
    if (topic_creating_form.length > 0) ajaxForm(topic_creating_form, callbackBefore, formSubmitCallback);

    let material_editing_form = $('#material-editing-form');
    if (material_editing_form.length > 0) ajaxForm(material_editing_form, callbackBefore, formSubmitCallback);

    let material_creating_form = $('#material-creating-form');
    if (material_creating_form.length > 0) ajaxForm(material_creating_form, callbackBefore, formSubmitCallback);

    let benefit_editing_form = $('#benefit-editing-form');
    if (benefit_editing_form.length > 0) ajaxForm(benefit_editing_form, callbackBefore, formSubmitCallback);

    let benefit_creating_form = $('#benefit-creating-form');
    if (benefit_creating_form.length > 0) ajaxForm(benefit_creating_form, callbackBefore, formSubmitCallback);
});

function callbackBefore() {
    let description = $('input[name="description"]');
    let summernote = $('.summernote');
    if (description.length > 0 && summernote.length > 0) description.val(summernote.summernote('code'));
    $('button[type="submit"]').attr('disabled', true);
}

var ok;
function ajaxForm(element, callbackBefore = () => {
}, callbackAfter = (xhr, statusText) => {
}) {
    element.submit((e) => {
        e.preventDefault();
        callbackBefore();
        let dat = new FormData(e.target);
        let option = {
            url: e.target.action,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: dat,
            complete: callbackAfter
        };
        $.ajax(option);

    });
}

function validateAndPlayVideo(src) {
    let video_id = youtube_parser(src);
    if (!video_id) {
        return;
    }

    let video = document.createElement('video');
    video.setAttribute('src', src);
    video.autoplay = true
    video.controls = true
    video.height = 200;
    video.addEventListener('loadedmetadata', (e) => {
        let slvd = $('input[name="time"]');
        if (slvd)
            slvd.val(e.target.duration);
    });
    let v_container = $('#v-container');
    v_container.prepend(video);
}

function writeDuration(player) {
    let duration = player.getDuration();
    $('input[name="time"]').val(duration);
}

function formSubmitCallback(xhr, statusText) {
    let result = xhr.responseJSON;
    if (result && result['status'] === true) {
        nonRequestDialog(boxDialog('javascript:', 'Message', result['info']), 'gen-modal', 'md');
        redirect(result['redirect'])
    } else {
        if (result) {
            nonRequestDialog(boxDialog('javascript:', 'Message', result['info']), 'gen-modal', 'md');
        } else {
            nonRequestDialog(boxDialog('javascript:', 'Message', xhr.responseText), 'gen-modal', 'md');
        }
    }
    $('button[type="submit"]').attr('disabled', false);
}
function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytp-player', {
        events: {
            /* 'onReady': onPlayerReady, */
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
}

function onPlayerStateChange(event) {
    writeDuration(event.target);
}

function loadVideoPreview(src) {
    let video_id = !youtube_parser(src);
    if (video_id === false) {
        return;
    }
    setTimeout(() => {
        try {
            let loading_signal = $("#loading-signal");
            if (loading_signal.length > 0) {
                if ($('#preview-loader').length < 1)
                    loading_signal.append("<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Loading video...</span>");
            }
            player.loadVideoById(video_id, 0, 'large');
            let eie = $("#v-player");
            if (eie.length > 0) eie.removeClass("no-display");
            let pl = $("#preview-loader");
            if (pl.length > 0) pl.remove();
        } catch (e) {
            setTimeout(() => {
                if (retryPreview++ < 10) {
                    loadYoutubePreview(src);
                } else {
                    let pl = $("#preview-loader");
                    if (pl.length > 0) pl.html("<i class='fa fa-remove'></i> Error while loading the video. <br> Check your internet connection and try again.");
                }
            }, 2000);
        }
    }, 1000);
}

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (!match || match[7].length != 11) {
        var b = !match || match[7];
        return b;
    } else {
        nonRequestDialog(boxDialog('javascript:', "Invalid Video URL", "<p class='text-center'>Video URL not supported. <br>Youtube video links are not currently supported</p>", "$('#gen-modal').modal('close')"), 'gen-modal', 'sm', 5000);
        return false;
    }
}

function initYoutubePlayerIframe(iframeContainer, src = '') {
    let ytp_container = $('#' + iframeContainer);
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    let i = '<iframe id="ytp-player"' + 'src="' + (src !== '' ? `${src}?enablejsapi=1&fs=1` : 'https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1') + '"' + 'frameborder="0"' + 'style="border: 0"' + 'class="s-100w-p s-300h thumbnail ' + (src === '' ? 'no-display' : '') + '"' + '></iframe>';
    ytp_container.prepend(i);
}

function getFormattedVideoDuration(seconds) {
    let hour = Math.floor(seconds / 3600);
    let minute = Math.floor((seconds / 60) % 60);
    let second = Math.floor((seconds % 60));
    return (`${hour >= 1 ? hour + ':' : ''
        } ${minute} : ${second}`);
}

function popup_buy_other(item_code, amount, what) {
    let dialogBody = ''
        + '<div class="input-group"> '
        + '  <span class="input-group-addon"><i class="fa fa-user" ></i></span> '
        + '  <input type="text" name="username" id="username" class="form-control" placeholder="Username" aria-label="Username" >'
        + '</div>';

    nonRequestDialog(boxDialog('javascript:', "Buy For Other", dialogBody), 'gen-modal', 'md', 60000);

    let username = $('#username');
    if (username.length > 0) {
        username.change((e) => {
            let thisusername = $(e.target);
            thisusername.hide();
            $(thisusername[0].parentElement).prepend("<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Loading...</span>");
            let u = $.trim(thisusername.val());
            let url = base_url + `misc/user/${encodeURIComponent(encodeURI(u))}`;
            let option = {
                url: url,
                type: 'GET',
                complete: (xhr, statusText) => {
                    $('#preview-loader').remove();
                    thisusername.show();
                    let result = xhr.responseJSON;
                    if (result && result['status'] === true) {
                        $('#result').html(result['info']);
                    } else {
                        if (result) {
                            $('#error').html(result['info']);
                        } else {
                            $('#error').html(xhr.responseText);
                        }
                    }
                }
            };
            $.ajax(option);
        });
    }

    let ok = $('.ok');
    if (ok.length > 0) {
        ok.click((e) => {
            let u = username.val();
            window.location = base_url + `misc/validate_balance/${item_code}/${amount}/${what}/${encodeURIComponent(encodeURI(u))}`;
        });
    }
}

function passdialog4hotlist(item_code, action, what) {
    let passbody = '<div class="error text-center" >Confirm Deletion</div>';
    nonRequestDialog(boxDialog('javascript:', "Deletion", passbody), 'gen-modal', 'md', 60000);
    let ok = $('.ok');
    if (ok.length > 0) {
        ok.click((e) => {
            let thisOk = $(e.target);
            thisOk.hide();
            $(thisOk[0].parentElement).prepend("<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Deleting...</span>");
            let dat = new FormData();
            dat.append('id', item_code + '');
            dat.append('action', action + '');
            let option = {
                url: base_url + `${what}/hotlist`,
                type: 'POST',
                cache: false,
                contentType: false,
                processData: false,
                data: dat,
                complete: (xhr, statusText) => {
                    $('#preview-loader').remove();
                    thisOk.show();
                    let result = xhr.responseJSON;
                    if (result && result['status'] === true) {
                        nonRequestDialog(boxDialog('javascript:', 'Message', result['info']), 'gen-modal', 'md');
                        redirect(result['redirect'])
                    } else {
                        if (result) {
                            $('#error').html(result['info']);
                        } else {
                            $('#error').html(xhr.responseText);
                        }
                    }
                }
            };
            $.ajax(option);
        });
    }

}

function is_drive_link(url) {
    let $re = "([A-Za-z0-9-_]){33}|([A-Za-z0-9-_]){19}";
    let matched = url.match($re);
    return matched instanceof Array ? matched[0] : false;
}


