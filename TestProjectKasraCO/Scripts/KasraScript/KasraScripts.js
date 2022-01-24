$(function () { 
    
    //#region PersianDatePicker
    $('.calender-btn').on('click', function () {
        $(this).parent().find('.persian-calendar').focus();
    }); 
    $("#traffic-page").find(".persian-calendar").persianDatepicker({
        altField: '#normalAlt',
        altFormat: 'LLLL',
        initialValue: true,
        initialValueType: 'persian',
        observer: true,
        format: 'YYYY/MM/DD HH:mm',
        timePicker: {enabled: false},
        onSelect: function (event) {
            $(this.model.inputElement).val(toEnNumber(this.model.PersianDate.date(event).format(this.model.options.format)).replace(/,/g, ''));
            this.model.options.toolbox.todayButton.onToday(this.model);
        }
    });
    $("#traffic-insert-edit").find(".persian-calendar").persianDatepicker({
        altField: '#normalAlt',
        altFormat: 'LLLL',
        initialValue: true,
        initialValueType: 'persian',
        observer: true,
        format: 'YYYY/MM/DD HH:mm',
        timePicker: {
            enabled: true,
            meridiem: {
                enabled: true
            }
        },
        onSelect: function (event) {
            $(this.model.inputElement).val(toEnNumber(this.model.PersianDate.date(event).format(this.model.options.format)).replace(/,/g, ''));
            this.model.options.toolbox.todayButton.onToday(this.model);
        }
    });
    $(".persian-calendar").val("");
    $("#traffic-page").find('input.date-mask').inputmask("datetime", {
        mask: "9999/99/99",
        placeholder: "----/--/--"
    });
    $("#traffic-insert-edit").find('input.date-mask').inputmask("datetime", {
        mask: "9999/99/99 99:99",
        placeholder: "----/--/-- --:--"
    });
    //#endregion       
    $('#traffic-insert-edit').on('shown.bs.modal', function (e) {
        $(this).data('Id', $(e.relatedTarget).attr("data-id"));
        if ($(e.relatedTarget).attr("data-id") != undefined) {
            $(this).find(".modal-title").text("ویرایش تردد");
            TrafficDetail($(e.relatedTarget).attr("data-id"));
        }
    });
    $('#traffic-insert-edit').on('hide.bs.modal', function (e) { $(this).find("input").val(""); $(this).find("select").val(""); });
    $('#traffic-search-btn').click(function () { TrafficSearch($('#traffic-user-select').val(), $('#traffic-out-date').val(), $('#traffic-in-date').val()); })
    $('#traffic-user-select').on('change', function () { TrafficSearch($('#traffic-user-select').val(), $('#traffic-out-date').val(), $('#traffic-in-date').val()); });
})

//#region General
function callApi(api, formData, doneCallback, failCallback) {
    $('.loader-container').removeClass('d-none');
    $.ajax({
        type: 'POST',
        url: '/API/' + api,
        data: formData,
        contentType: false,
        processData: false
    })
        .done(function (data) {
            $('.loader-container').addClass('d-none');
            doneCallback(data);
        })
        .fail(function (data) {
            $('.loader-container').addClass('d-none');
            failCallback();
        });
}
function toEnNumber(inputNumber) {
    if (inputNumber == undefined) return '';
    var str = inputNumber.toString().trim();
    if (str == "") return "";
    str = str.replace(/۰/img, '0');
    str = str.replace(/۱/img, '1');
    str = str.replace(/۲/img, '2');
    str = str.replace(/۳/img, '3');
    str = str.replace(/۴/img, '4');
    str = str.replace(/۵/img, '5');
    str = str.replace(/۶/img, '6');
    str = str.replace(/۷/img, '7');
    str = str.replace(/۸/img, '8');
    str = str.replace(/۹/img, '9');
    return str;
}
function showMsg(textMsg) {
    $("#snackbar").addClass("show");
    $("#snackbar").text(textMsg);
    setTimeout(function () { $("#snackbar").removeClass("show"); }, 3000);
}
//#endregion

function TrafficInsertEdit() {
    if (!checkTrafficInsertEditRequired()) return;
    var formData = new FormData();
    formData.append("Id", ($('#traffic-insert-edit').data('Id') != undefined ? $('#traffic-insert-edit').data('Id') : ""));
    formData.append("IsEdit", ($('#traffic-insert-edit').data('Id') != undefined ? "true" : "false"));
    formData.append("UserId", $('#user-select').val());
    formData.append("UserName", $('#user-select').find("option[value=" + $('#user-select').val() +"]").text());
    formData.append("OutDate", $('#out-date').val());
    formData.append("InDate", $('#enter-date').val());
    callApi('TrafficInsertEdit', formData, function (data) {        
        if (data == -1) showMsg("خطا در انجام عملیات!");
        else if (data == -2) showMsg("امکان درج بیش از 4 تردد برای این کاربر وجود ندارد!");
        else if (data == -3) showMsg("زمان تردد انتخاب شده تکراری است!");
        else if (data == 1) {
            $('#traffic-insert-edit').find('.btn-close').click();
            TrafficSearch("", "", "");
        }
    }, function (errorData) {
            showMsg("خطا در انجام عملیات!");
            console.log("errorData: "+errorData);
    })
}

function checkTrafficInsertEditRequired() {
    var inputIds = "";
   
    if ($('#user-select').val() == "" && $('#enter-date').val() == "" && $('#out-date').val() == "") inputIds = '#user-select , #enter-date , #out-date';
    else if ($('#user-select').val() == "") inputIds = '#user-select';
    else if ($('#enter-date').val() == "" && $('#out-date').val() == "") inputIds = '#enter-date , #out-date';
    
    $(inputIds).addClass('required-alert')
        .keypress(function () { $(this).removeClass('required-alert') })
        .focusin(function () { $(this).removeClass('required-alert') });

    if (inputIds != "") {
        showMsg("لطفا قسمت های قرمز رنگ را پر کنید.");
        return false;
    }

    if ($('#enter-date').val() != "") {
        var validationEnterDate = DateTimeValidation($('#enter-date').val().split(' ')[0], $('#enter-date').val().split(' ')[1])
 
        if (!validationEnterDate[0] && !validationEnterDate[1]) {
            showMsg("فرمت زمان ورود نادرست است!");
            return false;
        }
        else if (!validationEnterDate[0] ||
            $('#enter-date').val().split(' ')[0].replace(/[^\d]/g, "") < 13000000) {
            showMsg("فرمت تاریخ ورود نادرست است!");
            return false;
        }
        else if (!validationEnterDate[1]) {
            showMsg("فرمت ساعت ورود نادرست است!");
            return false;
        }

    }

    if ($('#out-date').val() != "") {
        var validationOutDate = DateTimeValidation($('#out-date').val().split(' ')[0], $('#out-date').val().split(' ')[1])

        if (!validationOutDate[0] && !validationOutDate[1]) {
            showMsg("فرمت زمان خروج نادرست است!");
            return false;
        }
        else if (!validationOutDate[0] ||
            $('#out-date').val().split(' ')[0].replace(/[^\d]/g, "") < 13000000) {
            showMsg("فرمت تاریخ خروج نادرست است!");
            return false;
        }
        else if (!validationOutDate[1]) {
            showMsg("فرمت ساعت خروج نادرست است!");
            return false;
        }

    }

    if ($('#enter-date').val() != "" && $('#out-date').val() != "" &&
        $.isNumeric($('#enter-date').val().replace(/[^\d]/g, "")) &&
        $.isNumeric($('#out-date').val().replace(/[^\d]/g, "")) &&
        $('#enter-date').val().replace(/[^\d]/g, "") >= $('#out-date').val().replace(/[^\d]/g, "")) {
        showMsg("زمان خروج نمیتواند زودتر از زمان ورود باشد!");
        return false;
    }
    return true;
}

function DateTimeValidation(date, time) {
    let datePattern = /^[1-4]\d{3}\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|([1-2][0-9])|(0[1-9]))))$/;
    let dateValidation = datePattern.test(date);

    let timePattern = /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i;
    let timeValidation = timePattern.test(time);
    return [dateValidation, timeValidation]

}

function TrafficDelete(Id) {
    $('#are-you-sure').find('modal-title').text('حذف تردد');
    $('#are-you-sure').modal('show');
    $('#are-you-sure').find('.yes-btn').click(function () {
        var formData = new FormData();
        formData.append("Id", Id);
        callApi('TrafficDelete', formData, function (data) {
            $('#are-you-sure').modal('hide');
            TrafficSearch("", "", "");
            showMsg("عملیات با موفقیت انجام شد.");
        }, function (errorData) {
            showMsg("خطا در انجام عملیات!");
            console.log("errorData: " + errorData);
        })
    });
    
}

function TrafficSearch(userId, outDate, enterDate) {
    var formData = new FormData();
    formData.append("UserId", userId);
    formData.append("OutDate", outDate);
    formData.append("InDate", enterDate);
    callApi('TrafficSearch', formData, function (data) {
        var row = "", operation = "", colData = "";
        $('#traffic-List').find('tbody').children().remove();
        if (data == null || data.length == 0) {
            row = '<tr><td colspan="6"><i class="fa fa-folder-o fa-3x"></i><p>موردی یافت نشد!</p></td></tr>';
            $('#traffic-List').find('tbody').append(row);
        } else {
            data.forEach(function (traffic) {
                operation = '<tr id="traffic-' + traffic.Id + '"><td><div class="dropdown"><a class="dropdown-toggle k-cog-btn" data-bs-toggle="dropdown"><i class="fa fa-cog"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-end text-end"><a class="dropdown-item" data-id="' + traffic.Id + '" data-bs-toggle="modal" data-bs-target="#traffic-insert-edit"><i class="fa fa-edit"></i> ویرایش</a>' +
                    '<a class="dropdown-item" onclick="TrafficDelete(' + traffic.Id + ')"><i class="fa fa-window-close-o"></i> حذف</a></div></div></td>';
                colData = '<td><p class="m-0">' + traffic.Id + '</p></td><td><p class="m-0">' + traffic.RegDate + '</p></td><td><p class="m-0">' + traffic.UserName +
                    '</p></td><td><p class="m-0" dir="ltr">' + (traffic.InDate != null ? traffic.InDate : "-") + '</p></td><td><p class="m-0" dir="ltr">' + (traffic.OutDate != null ? traffic.OutDate : "-") + '</p></td></tr>';
                row = operation + colData;
                $('#traffic-List').find('tbody').append(row);
            });
        }
        
    }, function (errorData) {
        showMsg("خطا در انجام عملیات!");
        console.log("errorData: " + errorData);
    })
}

function TrafficDetail(Id) {
    var $target = $('#traffic-insert-edit')
    var formData = new FormData;
    formData.append("Id", Id);
    callApi('TrafficDetail', formData, function (data) {
        $target.find('#user-select').val(data.UserId);
        $target.find('#enter-date').val(data.InDate);
        $target.find('#out-date').val(data.OutDate);
    }, function (errorData) {
        showMsg("خطا در انجام عملیات!");
            console.log("errorData: " + errorData);
        })
}
