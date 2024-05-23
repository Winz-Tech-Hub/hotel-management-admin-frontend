import { $ } from '../../assets/vendor/libs/jquery/jquery'

let player
let retryPreview = 0

function folderClick() {
  $('.click').on('click', (e) => {
    e.preventDefault()
    const path = e.currentTarget
    $.get('../dashboard?path=' + path.innerText, (data) => {
      $('.main').html(data)
      folderClick()
    })
  })
}

function formSubmit() {
  $('.form').submit(() => {
    const submit = this.event.target
    submit.disabled = true
    submit.innerHTML = ''
    submit.className += ' spinner-border spinner-border-sm'
  })
}

function nonRequestDialog(data, ele, size, timeout = 5000, callback = () => {}) {
  $('#' + ele + ' .modal-dialog').removeClass('modal-sm')
  $('#' + ele + ' .modal-dialog').removeClass('modal-md')
  $('#' + ele + ' .modal-dialog').removeClass('modal-lg')
  if (size) {
    switch (size) {
      case 'sm':
        $('#' + ele + ' .modal-dialog').addClass('modal-sm')
        break
      case 'md':
        $('#' + ele + ' .modal-dialog').addClass('modal-md')
        break

      case 'lg':
        $('#' + ele + ' .modal-dialog').addClass('modal-lg')
        break
    }
  }
  loader()
  $('#' + ele + ' .modal-dialog .modal-content').html(data)
  loader()
  _(ele).modal('show')
  callback()
  setTimeout(() => _(ele).modal('hide'), timeout)
}

function redirect(url) {
  setTimeout(() => (window.location = url), 1000)
}

function filter_books(e) {
  this.event.preventDefault()
  window.location = base_url + `list_books/${e[0].value}/${e[1].value}/${e[2].value}`
}

function filter_courses(e) {
  this.event.preventDefault()
  window.location = base_url + `list_courses/${e[0].value}/${e[1].value}`
}

function save() {
  const markup = $('.summernote').summernote('code')
  $.post({
    url: '../books/book_id/chapter_id',
    type: 'post',
    dataType: 'text/html',
    data: markup,
    success: (e) => {
      alert('saved')
    },
    failure: (e) => {
      alert("Can't save right now")
    },
  })
  $('.summernote').summernote('destroy')
}

function edit() {
  $('.summernote').summernote({ focus: true })
}

function pay4course(e) {
  const username = $.trim($('input[name="username"]').val())
  const amount = $.trim($('input[name="amount"]').val())
  const action = e.target.action
  const pay = $('.pay')
  pay.attr('disabled', true)
  const password = $.trim($('#pass').val())
  const dat = new FormData()
  dat.append('username', username + '')
  dat.append('amount', amount + '')
  dat.append('password', password)
  const option = {
    url: action,
    type: 'POST',
    cache: false,
    contentType: false,
    processData: false,
    data: dat,
    complete: (xhr, statusText) => {
      pay.attr('disabled', false)
      const result = xhr.responseJSON
      if (result && result.status === true) {
        nonRequestDialog(
          boxDialog('javascript:', 'Message', result.info, "$('#gen-modal').modal('close')"),
          'gen-modal',
          'md',
        )
        redirect(result.redirect)
      } else {
        if (result) {
          $('#error').html(result.info)
        } else {
          $('#error').html(xhr.responseText)
        }
      }
    },
  }
  $.ajax(option)
}

function boxDialog(okHref, title, body, okOnClick = '() => {}') {
  const dialog =
    '<div class="col-xs-12">' +
    '    <div class="box box-border"> ' +
    '        <div class="box-header with-border"> ' +
    '            <p class="text-center">' +
    title +
    ' </p>' +
    '        </div> ' +
    '        <div class="box-body text-center"> ' +
    '               <div class="btn-block btn-danger text-center text-bold text-white">' +
    '                   <span id="error"></span>' +
    '               </div>' +
    '            ' +
    body +
    '        </div> <div class="btn-block btn-default text-center text-bold "><span id="result"></span></div>' +
    '        <div class="box-footer text-center"> ' +
    '             <a href="' +
    okHref +
    '" class="btn btn-default btn-md center text-center no-border ok" onclick="' +
    okOnClick +
    '" >Ok</a> ' +
    '        </div> ' +
    '    </div> ' +
    '</div>'
  return dialog
}

$(() => {
  const summernote = $('.summernote')
  if (summernote.length > 0) {
    summernote.summernote({
      height: 200,
    })
  }

  const video = $('.show-local-video')
  if (video.length > 0) {
    video.change((e) => {
      const reader = new FileReader()
      reader.onloadend = (evt) => {
        const video = document.createElement('video')
        video.setAttribute('src', evt.target.result)
        video.autoplay = true
        video.controls = true
        video.height = 200
        video.addEventListener('loadedmetadata', (e) => {
          const slvd = $('.show-local-video-duration')
          if (slvd) {
            slvd.val(e.target.duration)
          }
        })
        const formElementContainer = document.getElementsByClassName('form-element-container')[0]
        formElementContainer.appendChild(video)
      }
      reader.readAsDataURL(e.target.files[0])
    })
  }

  const thumbnail = $('input[name="thumbnail"]')
  if (thumbnail.length > 0) {
    thumbnail.change((e) => {
      const reader = new FileReader()
      reader.onloadend = (evt) => {
        const displayThumbnail = $('#display-thumbnail')
        if (displayThumbnail.length > 0) {
          displayThumbnail.attr('src', evt.target.result)
        } else {
          const img = document.createElement('img')
          img.src = evt.target.result
          img.height = 200
          const labelForImg = $('#label-for-img')
          labelForImg.append(img)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    })
  }

  const deleteWarning = $('.delete-permanent')
  if (deleteWarning.length > 0) {
    deleteWarning.click((e) => {
      e.preventDefault()
      const dialogBody =
        '<p>This Topic will be permanently delete.</p>  ' +
        '            <p class="label-danger"> ' +
        '                Are you sure? ' +
        '            </p> '

      nonRequestDialog(boxDialog(e.target.href, 'Warning', dialogBody), 'gen-modal', 'md', 7000)
      const deleteBtn = $('.ok')
      if (deleteBtn.length > 0) {
        deleteBtn.click((e) => {
          e.preventDefault()
          const thisDeleteBtn = $(e.target)
          thisDeleteBtn.hide()
          $(thisDeleteBtn[0].parentElement).prepend(
            "<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Deleting...</span>",
          )
          const option = {
            url: e.target.href,
            type: 'GET',
            complete: (xhr, statusText) => {
              $('#preview-loader').remove()
              thisDeleteBtn.show()
              const result = xhr.responseJSON
              if (result) {
                if (result.status) {
                  nonRequestDialog(result.info, 'gen-modal', 'md')
                  redirect(result.redirect)
                }
              }
            },
          }
          $.ajax(option)
        })
      }
    })
  }

  const pay4course_form = $('#pay4course-form')
  if (pay4course_form.length > 0) {
    pay4course_form.submit((e) => {
      e.preventDefault()
      pay4course(e)
    })
  }

  const ytpc = $('#ytp-container')
  if (ytpc.length > 0) initYoutubePlayerIframe('ytp-container')

  const ytp_url_input = $('.ytp-url-input')
  if (ytp_url_input.length > 0) {
    ytp_url_input.change((evt) => {
      validateAndPlayYoutubeVideo($(evt.target).val())
    })
  }

  const booK_editing_form = $('#book-editing-form')
  if (booK_editing_form.length > 0) ajaxForm(booK_editing_form, callbackBefore, formSubmitCallback)

  const booK_creating_form = $('#book-creating-form')
  if (booK_creating_form.length > 0) ajaxForm(booK_creating_form, callbackBefore, formSubmitCallback)

  const course_editing_form = $('#course-editing-form')
  if (course_editing_form.length > 0) ajaxForm(course_editing_form, callbackBefore, formSubmitCallback)

  const course_creating_form = $('#course-creating-form')
  if (course_creating_form.length > 0) ajaxForm(course_creating_form, callbackBefore, formSubmitCallback)

  const topic_editing_form = $('#topic-editing-form')
  if (topic_editing_form.length > 0) ajaxForm(topic_editing_form, callbackBefore, formSubmitCallback)

  const topic_creating_form = $('#topic-creating-form')
  if (topic_creating_form.length > 0) ajaxForm(topic_creating_form, callbackBefore, formSubmitCallback)

  const script_editing_form = $('#script-editing-form')
  if (script_editing_form.length > 0) ajaxForm(script_editing_form, callbackBefore, formSubmitCallback)

  const script_creating_form = $('#script-creating-form')
  if (script_creating_form.length > 0) ajaxForm(script_creating_form, callbackBefore, formSubmitCallback)

  const opportunity_editing_form = $('#opportunity-editing-form')
  if (opportunity_editing_form.length > 0) ajaxForm(opportunity_editing_form, callbackBefore, formSubmitCallback)

  const opportunity_creating_form = $('#opportunity-creating-form')
  if (opportunity_creating_form.length > 0) ajaxForm(opportunity_creating_form, callbackBefore, formSubmitCallback)
})

function callbackBefore() {
  $('button[type="submit"]').attr('disabled', true)
}

function ajaxForm(element, callbackBefore = () => {}, callbackAfter = (xhr, statusText) => {}) {
  element.submit((e) => {
    e.preventDefault()
    callbackBefore()
    const dat = new FormData(e.target)
    const option = {
      url: e.target.action,
      type: 'POST',
      cache: false,
      contentType: false,
      processData: false,
      data: dat,
      complete: callbackAfter,
    }
    $.ajax(option)
  })
}

function validateAndPlayYoutubeVideo(src) {
  loadYoutubePreview(src)
}

function writeDuration(player) {
  const duration = player.getDuration()
  $('input[name="topic_time"]').val(duration)
}

function formSubmitCallback(xhr, statusText) {
  const preview_loader = $('#preview-loader')
  if (preview_loader.length > 0) preview_loader.remove()
  const result = xhr.responseJSON
  if (result && result.status === true) {
    nonRequestDialog(boxDialog('javascript:', 'Message', result.info), 'gen-modal', 'md')
    redirect(result.redirect)
  } else {
    if (result) {
      nonRequestDialog(boxDialog('javascript:', 'Message', result.info), 'gen-modal', 'md')
    } else {
      nonRequestDialog(boxDialog('javascript:', 'Message', xhr.responseText), 'gen-modal', 'md')
    }
  }
  $('button[type="submit"]').attr('disabled', false)
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytp-player', {
    events: {
      /* 'onReady': onPlayerReady, */
      onStateChange: onPlayerStateChange,
    },
  })
}

function onPlayerReady(event) {}

function onPlayerStateChange(event) {
  writeDuration(event.target)
}

function loadYoutubePreview(src) {
  const video_id = youtube_parser(src)
  if (video_id === false) {
    return
  }
  setTimeout(() => {
    try {
      const loading_signal = $('#loading-signal')
      if (loading_signal.length > 0) {
        if ($('#preview-loader').length < 1) {
          loading_signal.append(
            "<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Loading video...</span>",
          )
        }
      }
      player.loadVideoById(video_id, 0, 'large')
      const eie = $('#ytp-player')
      if (eie.length > 0) eie.removeClass('no-display')
      const pl = $('#preview-loader')
      if (pl.length > 0) pl.remove()
    } catch (e) {
      setTimeout(() => {
        if (retryPreview++ < 10) {
          loadYoutubePreview(src)
        } else {
          const pl = $('#preview-loader')
          if (pl.length > 0)
            pl.html(
              "<i class='fa fa-remove'></i> Error while loading the video. <br> Check your internet connection and try again.",
            )
        }
      }, 2000)
    }
  }, 1000)
}

function youtube_parser(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
  const match = url.match(regExp)
  if (match && match[7].length == 11) {
    const b = match[7]
    return b
  } else {
    nonRequestDialog(
      boxDialog(
        'javascript:',
        'Invalid Video URL',
        "<p class='text-center'>Video URL not supported. <br>Only Youtube video links are currently supported</p>",
        "$('#gen-modal').modal('close')",
      ),
      'gen-modal',
      'sm',
      5000,
    )
    return false
  }
}

function initYoutubePlayerIframe(iframeContainer, src = '') {
  const ytp_container = $('#' + iframeContainer)
  const tag = document.createElement('script')
  tag.id = 'iframe-demo'
  tag.src = 'https://www.youtube.com/iframe_api'
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  const i =
    '<iframe id="ytp-player"' +
    'src="' +
    (src !== '' ? `${src}?enablejsapi=1&fs=1` : 'https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1') +
    '"' +
    'frameborder="0"' +
    'style="border: 0"' +
    'class="s-100w-p s-300h thumbnail ' +
    (src === '' ? 'no-display' : '') +
    '"' +
    '></iframe>'
  ytp_container.prepend(i)
}

function getFormattedVideoDuration(seconds) {
  const hour = Math.floor(seconds / 3600)
  const minute = Math.floor((seconds / 60) % 60)
  const second = Math.floor(seconds % 60)
  return `${hour >= 1 ? hour + ':' : ''} ${minute} : ${second}`
}

function popup_buy_other(item_code, amount, what) {
  const dialogBody =
    '' +
    '<div class="input-group"> ' +
    '  <span class="input-group-addon"><i class="fa fa-user" ></i></span> ' +
    '  <input type="text" name="username" id="username" class="form-control" placeholder="Username" aria-label="Username" >' +
    '</div>'

  nonRequestDialog(boxDialog('javascript:', 'Buy For Other', dialogBody), 'gen-modal', 'md', 60000)

  const username = $('#username')
  if (username.length > 0) {
    username.change((e) => {
      const thisusername = $(e.target)
      thisusername.hide()
      $(thisusername[0].parentElement).prepend(
        "<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Loading...</span>",
      )
      const u = $.trim(thisusername.val())
      const url = base_url + `misc/user/${encodeURIComponent(encodeURI(u))}`
      const option = {
        url,
        type: 'GET',
        complete: (xhr, statusText) => {
          $('#preview-loader').remove()
          thisusername.show()
          const result = xhr.responseJSON
          if (result && result.status === true) {
            $('#result').html(result.info)
          } else {
            if (result) {
              $('#error').html(result.info)
            } else {
              $('#error').html(xhr.responseText)
            }
          }
        },
      }
      $.ajax(option)
    })
  }

  const ok = $('.ok')
  if (ok.length > 0) {
    ok.click((e) => {
      const u = username.val()
      window.location =
        base_url + `misc/validate_balance/${item_code}/${amount}/${what}/${encodeURIComponent(encodeURI(u))}`
    })
  }
}

function passdialog4hotlist(item_code, action, what) {
  const passbody =
    '<input type="password" name="password" id="password" class="form-control" placeholder="Password" aria-label="Password" >' +
    ''

  nonRequestDialog(boxDialog('javascript:', 'Password', passbody), 'gen-modal', 'md', 60000)
  const ok = $('.ok')
  if (ok.length > 0) {
    ok.click((e) => {
      const thisOk = $(e.target)
      thisOk.hide()
      $(thisOk[0].parentElement).prepend(
        "<span id='preview-loader'><i class='fa fa-spinner fa-spin'></i> Validating Password...</span>",
      )
      const password = $.trim($('input[name="password"]').val())
      const dat = new FormData()
      dat.append('id', item_code + '')
      dat.append('action', action + '')
      dat.append('password', password + '')
      const option = {
        url: base_url + `${what}/check_user`,
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: dat,
        complete: (xhr, statusText) => {
          $('#preview-loader').remove()
          thisOk.show()
          const result = xhr.responseJSON
          if (result && result.status === true) {
            nonRequestDialog(boxDialog('javascript:', 'Message', result.info), 'gen-modal', 'md')
            redirect(result.redirect)
          } else {
            if (result) {
              $('#error').html(result.info)
            } else {
              $('#error').html(xhr.responseText)
            }
          }
        },
      }
      $.ajax(option)
    })
  }
}

export function initSummernpte() {
  const summernote = $('.summernote')
  if (summernote.length > 0) {
    summernote.summernote({
      height: 200,
    })
  }
}
