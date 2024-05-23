import { $ } from '../../assets/vendor/libs/jquery/jquery'
// JavaScript Document
var base_url = window.location.protocol + '//' + window.location.hostname + '/'
base_url += 'senaffiliatev2/' //IF IT'S ON LOCALHOST

// function to go back to the previous page
function goBack() {
  window.history.back()
}

// ----------------------------------------------------------------------------------------

// Function to show msg
function msg(msg, type, dis, ele) {
  //msg = The message; type = The type of msg to show (danger,warning etc); dis = Weather it will have dismiss button; ele = The element it will show on
  dis = !dis ? 0 : dis
  var view
  if (dis == 1) {
    view =
      "<div class='row'><div class='col-lg-12'><div class='alert " +
      type +
      " alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
      msg +
      '</div></div></div>'
  } else {
    view = "<div class='row'><div class='col-lg-12'><div class='alert " + type + "'>" + msg + '</div></div></div>'
  }
  setTimeout(function () {
    ele.html('')
  }, 3000)
  ele.html(view)
  scrollUp()
}

// ------------------------------------------------------------------------------------------------------

// function to reload page
function reloadPage(delay) {
  setTimeout(function () {
    location.reload(true)
  }, delay)
}

// -------------------------------------------------------------------------------------------------------------------

// Loading functions
function loader() {
  _('loader').modal('toggle')
}

// -------------------------------------------------------------------------------------------
function scrollUp() {
  $('html, body').stop().animate({ scrollTop: 0 }, '1000', 'swing')
}

function autoSync(url, obj, ele, interval, load) {
  if (load) {
    processAjax(url, obj, ele)
  }
  setInterval(function () {
    processAjax(url, obj, ele)
  }, interval)
}

function scrollEndLoad(url, obj, ele, scroll, load) {
  var last = false
  if (!scroll) scroll = 0.7
  if (load) {
    ele.html(
      "<div class='col-sm-12 text-center' id='buffer-loading'><i class='fa fa-circle-o-notch fa-spin fa-3x'></i></div>",
    )
    $.ajax({
      type: 'post',
      url: url,
      data: '',
      dataType: 'json',
      success: function (data) {
        ele.html(data['return'])
        last = data['last']
      },
    })
  }
  $(window).scroll(function () {
    if ($(window).scrollTop() >= ($(document).height() - $(window).height()) * scroll) {
      if (!_('buffer-loading').is(':visible')) {
        if (!last) {
          ele.append(
            "<div class='col-sm-12 text-center' id='buffer-loading'><i class='fa fa-circle-o-notch fa-spin fa-3x'></i></div>",
          )
          $.ajax({
            type: 'post',
            url: url,
            data: '',
            dataType: 'json',
            success: function (data) {
              _('buffer-loading').remove()
              ele.append(data['return'])
              last = data['last']
            },
          })
        }
      }
    }
  })
}

function resetForm(ele) {
  ele[0].reset()
}

function _(el) {
  return $('#' + el)
}

function __(el) {
  return $('.' + el)
}

function ___(el, t) {
  //Use to get the value of an element and trim the value
  if (!t) t = 'i' //Where i=ID and c=Class
  if (t == 'i')
    return $('#' + el)
      .val()
      .trim()
  else if (t == 'c')
    return $('.' + el)
      .val()
      .trim()
}

function ____(el, t) {
  //Use to get the text of an element and trim the text
  if (!t) t = 'i' //Where i=ID and c=Class
  if (t == 'i')
    return $('#' + el)
      .text()
      .trim()
  else if (t == 'c')
    return $('.' + el)
      .text()
      .trim()
}

function isArray(myArray) {
  return myArray.constructor.toString().indexOf('Array') > -1
}

function clock(date) {
  // 2011-04-20 09:30:51.01 format
  if (!date) var d = new Date()
  else var d = new Date(data)

  _('clock').text(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds())
  setInterval(function () {
    if (!date) var d = new Date()
    else var d = new Date(data)
    _('clock').text(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds())
  }, 1000)
}

function post_comment(event, ele, id, type) {
  if (event.keyCode == 13) {
    event.preventDefault()
    var comment = ele.val().trim()
    if (comment.length > 0) {
      if (type == 1) {
        $.post(base_url + 'ajax/post-comment', 'comment=' + comment + '&id=' + id + '&type=' + type, function (data) {
          ///_("ques-comment-box-" + id).html(data);
          //processAjax(base_url + "ajax/react-view", "&id=" + id + "&type=Q", _("react-Q" + id));
          ele.val('')
        })
      } else {
        $.post(base_url + 'ajax/post-comment', 'comment=' + comment + '&id=' + id + '&type=' + type, function (data) {
          let comments_mobile = $('#comments-mobile')
          if (comments_mobile.length > 0) comments_mobile.html(data)
          let comments_normal = $('#comments-normal')
          if (comments_normal.length > 0) comments_normal.html(data)
          //processAjax(base_url + "ajax/react-view", "&id=" + id + "&type=A", _("react-A" + id));
          ele.val('')
        })
      }
    }
  }
}

function view_comments(id, type, count) {
  if (type == 1) {
    processAjax(
      base_url + 'ajax/view-comments',
      'id=' + id + '&type=' + type + '&count=' + count,
      _('ques-comment-box-' + id),
    )
  } else {
    processAjax(
      base_url + 'ajax/view-comments',
      'id=' + id + '&type=' + type + '&count=' + count,
      _('comment-box-' + id),
    )
  }
}

function mark_as_correct(id) {
  if (confirm('You cannot undo this command once done.\n Are you sure this answers your question?')) {
    $.post(base_url + 'ajax/mark-as-correct', 'id=' + id, function (data) {
      reloadPage(0)
    })
  }
}

function follow_unfollow(base_url, follower, following, type, obj, ele, pack) {
  //alert(follower+" | "+following+" | "+type+" | "+obj+" | "+ele);
  loader()
  if (!pack) {
    pack = 'user'
  }
  if (type == 'follow') {
    $.post(
      base_url + 'ajax/follow_unfollow',
      {
        follower: follower,
        following: following,
        type: 'follow',
        pack: pack,
      },
      function (data) {
        if (data === true) {
          if (obj == 'mini') {
            ele.text('Following')
            ele.attr('onclick', '')
          } else if (obj == 'list') {
            ele.remove()
          } else if (obj == 'base') {
            ele.remove()
          }
        }
        loader()
      },
    )
  } else {
    $.post(
      base_url + 'ajax/follow_unfollow',
      {
        follower: follower,
        following: following,
        type: 'unfollow',
        pack: pack,
      },
      function (data) {
        if (data == true) {
          if (obj == 'list') {
            //ele.removeAttr("class");
            ele.remove()
          } else if (obj == 'base') {
            ele.remove()
          }
        }
        loader()
      },
    )
  }
}

function block_unblock_follower(url, id, type, ele) {
  if (type == 'base') {
    if (ele.text() == 'Block') {
      $.post(url, 'id=' + id + '&status=0$type' + type, function (data) {
        if (data) {
          ele.removeClass('btn-warning')
          ele.addClass('btn-danger')
          ele.text('Unblock')
        }
      })
    } else {
      $.post(url, 'id=' + id + '&status=1$type' + type, function (data) {
        if (data) {
          ele.removeClass('btn-danger')
          ele.addClass('btn-warning')
          ele.text('Block')
        }
      })
    }
  }
}

function dialog(url, obj, ele, size, callback = () => {}) {
  $('#' + ele + ' .modal-dialog .modal-content').html('Fetching...')
  $('#' + ele + ' .modal-dialog').removeClass('modal-sm')
  $('#' + ele + ' .modal-dialog').removeClass('modal-lg')
  if (size) {
    switch (size) {
      case 'sm':
        $('#' + ele + ' .modal-dialog').addClass('modal-sm')
        break
      case 'lg':
        $('#' + ele + ' .modal-dialog').addClass('modal-lg')
        break
    }
  }
  __processAjax(url, obj, $('#' + ele + ' .modal-dialog .modal-content'), undefined, callback)
  _(ele).modal('show')
  scrollUp()
}

function blink(selector) {
  selector.fadeOut('slow', function () {
    $(this).fadeIn('slow', function () {
      blink(this)
    })
  })
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function get_percentage(total, per) {
  var percent = (total * per) / 100
  return percent
}

function copyToClipboard(btn, element) {
  var $temp = $('<input>')
  var btn_text = btn.html()
  $('body').append($temp)
  $temp.val($(element).html()).select()
  document.execCommand('copy')
  $temp.remove()
  btn.text('Copied!')
  setTimeout(function () {
    btn.html(btn_text)
  }, 1500)
}

function toggle_password(field, btn) {
  if (field.attr('type') == 'password') {
    field.attr('type', 'text')
    btn.html("<i class='fa fa-eye-slash'></i>")
  } else {
    field.attr('type', 'password')
    btn.html("<i class='fa fa-eye'></i>")
  }
}

$(function () {
  clock()
  blink(__('blink'))
  setTimeout(function () {
    _('msg').html('')
  }, 3000)
})
