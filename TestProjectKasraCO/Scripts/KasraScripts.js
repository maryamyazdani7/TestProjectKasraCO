$(function () {   
    //#region PersianDatePicker
    $('.calender-btn').on('click', function () {
        $(this).parent().find('.persian-calendar').focus();
    }); 
    $(".persian-calendar").persianDatepicker({
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
    $('input.date-mask').inputmask("datetime", {
        mask: "9999/99/99 99:99",
        placeholder: "----/--/-- --:--"
    });
    //#endregion       
    $('#traffic-insert-edit').on('shown.bs.modal', function (e) {
        $(this).data('Id', $(e.relatedTarget).attr("data-id"));
        if ($(e.relatedTarget).attr("data-id") != undefined) $(this).find(".modal-title").text("ویرایش تردد")
    });
    $('#traffic-insert-edit').on('hide.bs.modal', function (e) { $(this).find("input").val(""); $(this).find("select").val(""); });
    $('#traffic-search-btn').click(function () { TrafficSearch($('#traffic-user-select').val(), $('#traffic-out-date').val(), $('#traffic-in-date').val()); })
    $('#traffic-user-select').on('change', function () { TrafficSearch($('#traffic-user-select').val(), $('#traffic-out-date').val(), $('#traffic-in-date').val()); });
})
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
        $('#traffic-insert-edit').find('.btn-close').click();
        if (data == -1) showMsg("خطا در انجام عملیات!");
        else if (data == -2) showMsg("امکان درج بیش از 4 تردد برای این کاربر وجود ندارد!");
        else if (data == -3) showMsg("زمان تردد انتخاب شده تکراری است!");
        else if (data == 1) TrafficSearch("", "", "");
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

    if ($('#enter-date').val() != "" && $('#enter-date').val().length < 16) {
        showMsg("فرمت زمان ورود نادرست است!");
        return false;

    }

    if ($('#out-date').val() != "" && $('#out-date').val().length < 16) {
        showMsg("فرمت زمان خروج نادرست است!");
        return false;

    }
    return true;
}

function TrafficDelete(Id) {
    var formData = new FormData();
    formData.append("Id", Id);
    callApi('TrafficDelete', formData, function (data) {
        TrafficSearch("", "", "");
        showMsg("عملیات با موفقیت انجام شد.");
    }, function (errorData) {
        showMsg("خطا در انجام عملیات!");
        console.log("errorData: " + errorData);
    })
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
                    '</p></td><td><p class="m-0">' + (traffic.OutDate != null ? traffic.OutDate : "-") + '</p></td><td><p class="m-0">' + (traffic.InDate != null ? traffic.InDate : "-") + '</p></td></tr>';
                row = operation + colData;
                $('#traffic-List').find('tbody').append(row);
            });
        }
        
    }, function (errorData) {
        showMsg("خطا در انجام عملیات!");
        console.log("errorData: " + errorData);
    })
}