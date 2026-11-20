function start_loader() {
    $('body').append('<div id="preloader"><div class="loader-holder"><div></div><div></div><div></div><div></div>')
}

function end_loader() {
    $('#preloader').fadeOut('fast', function() {
        $('#preloader').remove();
    })
}
// function 
window.alert_toast = function($msg = 'TEST', $bg = 'success', $pos = '') {
    var Toast = Swal.mixin({
        toast: true,
        position: $pos || 'top',
        showConfirmButton: false,
        timer: 3500
    });
    Toast.fire({
        icon: $bg,
        title: $msg
    })
}

$(document).ready(function() {
    // Login
    $('#login-frm').off('submit').on('submit', function(e) {
        e.preventDefault()
        start_loader()
        if ($('.err_msg').length > 0)
            $('.err_msg').remove()

        var loginUrl = (typeof _base_url_ !== 'undefined' && _base_url_) 
            ? _base_url_ + 'classes/Login.php?f=login' 
            : '../classes/Login.php?f=login';

        // Auto-fix protocol to prevent Mixed Content blocking on HTTPS
        if (window.location.protocol === 'https:' && loginUrl.startsWith('http://')) {
            loginUrl = loginUrl.replace(/^http:\/\//i, 'https://');
        }

        $.ajax({
            url: loginUrl,
            method: 'POST',
            data: $(this).serialize(),
            error: function(xhr, status, error) {
                console.warn("AJAX login error:", status, error, xhr.responseText);
                // Fallback: If AJAX failed (e.g. network/protocol/500), submit standard POST directly to admin/login.php
                var form = document.getElementById('login-frm');
                if (form) {
                    $('#login-frm').off('submit');
                    form.submit();
                    return;
                }
                var _frm = $('#login-frm')
                var _msg = "<div class='alert alert-danger text-white err_msg'><i class='fa fa-exclamation-triangle'></i> Connection error. Please check server status.</div>"
                _frm.prepend(_msg)
                end_loader()
            },
            success: function(resp) {
                var data = null;
                try {
                    data = typeof resp === 'object' ? resp : JSON.parse(resp)
                } catch(e) {
                    console.error("Invalid JSON response:", resp)
                }
                if (data) {
                    if (data.status == 'success') {
                        var target = (typeof _base_url_ !== 'undefined' && _base_url_) ? _base_url_ + 'admin/index.php' : 'index.php';
                        if (window.location.protocol === 'https:' && target.startsWith('http://')) {
                            target = target.replace(/^http:\/\//i, 'https://');
                        }
                        location.replace(target);
                    } else if (data.status == 'incorrect') {
                        var _frm = $('#login-frm')
                        var _msg = "<div class='alert alert-danger text-white err_msg'><i class='fa fa-exclamation-triangle'></i> Incorrect username or password</div>"
                        _frm.prepend(_msg)
                        _frm.find('input').addClass('is-invalid')
                        $('[name="username"]').focus()
                    } else if (data.status == 'notverified') {
                        var _frm = $('#login-frm')
                        var _msg = "<div class='alert alert-danger text-white err_msg'><i class='fa fa-exclamation-triangle'></i> Your Account is not yet verified.</div>"
                        _frm.prepend(_msg)
                        _frm.find('input').addClass('is-invalid')
                        $('[name="username"]').focus()
                    } else {
                        var _frm = $('#login-frm')
                        var _errMsg = data.error || data.msg || "Login failed. Please verify database connection.";
                        var _msg = "<div class='alert alert-danger text-white err_msg'><i class='fa fa-exclamation-triangle'></i> " + _errMsg + "</div>"
                        _frm.prepend(_msg)
                        _frm.find('input').addClass('is-invalid')
                    }
                } else {
                    // Fallback to direct form submit if JSON parse fails
                    var form = document.getElementById('login-frm');
                    if (form) {
                        $('#login-frm').off('submit');
                        form.submit();
                        return;
                    }
                    var _frm = $('#login-frm')
                    var _msg = "<div class='alert alert-danger text-white err_msg'><i class='fa fa-exclamation-triangle'></i> Server returned invalid response. Check database setup.</div>"
                    _frm.prepend(_msg)
                }
                end_loader()
            }
        })
    })
    $('#clogin-frm').submit(function(e) {
        e.preventDefault()
        start_loader()
        if ($('.err_msg').length > 0)
            $('.err_msg').remove()
        $.ajax({
            url: _base_url_ + 'classes/Login.php?f=clogin',
            method: 'POST',
            data: $(this).serialize(),
            error: err => {
                console.log(err)
                alert_toast("An error occured", 'danger')
                end_loader()
            },
            success: function(resp) {
                if (resp) {
                    resp = JSON.parse(resp)
                    if (resp.status == 'success') {
                        location.replace(_base_url_);
                    } else if (resp.status == 'incorrect') {
                        var _frm = $('#clogin-frm')
                        var _msg = "<div class='alert alert-danger text-white err_msg'><i class='fa fa-exclamation-triangle'></i> Incorrect code or password</div>"
                        _frm.prepend(_msg)
                        _frm.find('input').addClass('is-invalid')
                        $('[name="username"]').focus()
                    }
                }
                end_loader()
            }
        })
    })

    //user login
    $('#slogin-frm').submit(function(e) {
            e.preventDefault()
            start_loader()
            if ($('.err_msg').length > 0)
                $('.err_msg').remove()
            $.ajax({
                url: _base_url_ + 'classes/Login.php?f=slogin',
                method: 'POST',
                data: $(this).serialize(),
                error: err => {
                    console.log(err)

                },
                success: function(resp) {
                    if (resp) {
                        resp = JSON.parse(resp)
                        if (resp.status == 'success') {
                            location.replace(_base_url_ + 'student');
                        } else if (resp.status == 'incorrect') {
                            var _frm = $('#slogin-frm')
                            var _msg = "<div class='alert alert-danger text-white err_msg'><i class='fa fa-exclamation-triangle'></i> Incorrect username or password</div>"
                            _frm.prepend(_msg)
                            _frm.find('input').addClass('is-invalid')
                            $('[name="username"]').focus()
                        }
                        end_loader()
                    }
                }
            })
        })
        // System Info
    $('#system-frm').submit(function(e) {
        e.preventDefault()
            // start_loader()
        if ($('.err_msg').length > 0)
            $('.err_msg').remove()
        $.ajax({
            url: _base_url_ + 'classes/SystemSettings.php?f=update_settings',
            data: new FormData($(this)[0]),
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST',
            success: function(resp) {
                if (resp == 1) {
                    // alert_toast("Data successfully saved",'success')
                    location.reload()
                } else {
                    $('#msg').html('<div class="alert alert-danger err_msg">An Error occured</div>')
                    end_load()
                }
            }
        })
    })
})