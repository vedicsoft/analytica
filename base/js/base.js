$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    if (thrownError == 'Unauthorized') {
        window.location.href = loginPageUrl
    }
});

$(document).ajaxSend(function (event, request, settings) {
    request.setRequestHeader("Authorization", "Bearer " + Cookies.get("jwt"));
});

if (!Cookies.get("jwt")) {
    window.location.href = loginPageUrl;
}